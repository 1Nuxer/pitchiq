"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { VideoPlayer, type VideoStroke } from "@/components/video-player"
import { AnnotationsTimeline } from "@/components/annotations-timeline"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function ClipReviewPage() {
  const params = useParams()
  const clipId = params.id as string

  const [clipData, setClipData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeEvent, setActiveEvent] = useState<string | undefined>()
  const [noteText, setNoteText] = useState("")
  const [isSavingNote, setIsSavingNote] = useState(false)
  const [coachNotes, setCoachNotes] = useState<{time: number; text: string}[]>([])
  const [drawings, setDrawings] = useState<VideoStroke[]>([])
  const [extractStart, setExtractStart] = useState<number>(0)
  const [extractEnd, setExtractEnd] = useState<number>(10)
  const [isExtracting, setIsExtracting] = useState(false)
  const [isDrawMode, setIsDrawMode] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)

  const videoRef = useRef<HTMLVideoElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const fetchClip = async () => {
      try {
        const response = await fetch("/api/clips")
        const clips = await response.json()
        const clip = clips.find((c: any) => c.id === clipId)
        if (clip) {
          setClipData(clip)
          setCoachNotes(clip.coachNotes || [])
          setDrawings(clip.drawings || [])
        }
      } catch (error) {
        console.error("Error fetching clip:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchClip()
  }, [clipId])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const handleAnnotationClick = (eventId: string) => {
    const coachEvent = coachNotes.find((_, index) => `coach-${coachNotes[index].time}-${index}` === eventId)
    if (coachEvent && videoRef.current) {
      videoRef.current.currentTime = coachEvent.time
      setActiveEvent(eventId)
    }
  }

  const handleStrokeCreated = (stroke: VideoStroke) => {
    setDrawings(prev => [...prev, stroke])
    const time = Math.floor(stroke.time)
    const note = { time, text: `Drawing at ${formatTime(time)}s` }
    if (!coachNotes.some(n => n.time === time && n.text.includes('Drawing'))) {
      setCoachNotes(prev => [...prev, note])
    }
    toast.success('Drawing saved')
  }

  const clearDrawings = () => {
    setDrawings([])
    toast.success('Drawings cleared')
  }

  const handleSaveNotes = async () => {
    if (!clipData?.id) return
    setIsSavingNote(true)
    try {
      const response = await fetch(`/api/clips/${clipData.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coachNotes, drawings }),
      })
      if (response.ok) {
        const updated = await response.json()
        setClipData(updated)
        toast.success('Saved!')
      }
    } catch {
      toast.error('Save failed')
    } finally {
      setIsSavingNote(false)
    }
  }

  const addCoachNote = () => {
    if (!noteText.trim() || !videoRef.current) return
    const time = Math.floor(videoRef.current.currentTime)
    const note = { time, text: noteText.trim() }
    setCoachNotes(prev => [...prev, note])
    setNoteText('')
  }

  const handleExtractClip = async () => {
    if (!clipData?.id || extractEnd <= extractStart) return
    setIsExtracting(true)
    try {
      const response = await fetch('/api/clips/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clipId: clipData.id, start: extractStart, end: extractEnd }),
      })
      if (response.ok) {
        toast.success('Clip extracted!')
        window.location.reload()
      }
    } catch {
      toast.error('Extract failed')
    } finally {
      setIsExtracting(false)
    }
  }

  if (isLoading || !clipData) {
    return (
      <div className="flex min-h-screen bg-background">
        <AppSidebar />
        <main className="ml-60 flex-1 p-8 text-muted-foreground">Loading...</main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="ml-60 flex flex-1 flex-col">
        <div className="flex flex-1">
          {/* Content */}
          <div className="flex-1 p-6">
            <Link href="/clips" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <h1 className="text-2xl font-semibold mb-4">{clipData.matchLabel}</h1>
            
            <div className="mb-6 relative video-container" ref={videoContainerRef}>
              <div className="controls absolute left-3 top-3 z-50 flex gap-2 bg-black/80 backdrop-blur-sm p-2 rounded-lg shadow-xl border border-white/20 pointer-events-auto">
                <Button
                  size="sm"
                  variant={isDrawMode ? 'default' : 'outline'}
                  className="text-xs px-2 py-1"
                  onClick={() => setIsDrawMode(!isDrawMode)}
                >
                  {isDrawMode ? '✋ Stop' : '✏️ Draw'}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-xs px-2 py-1"
                  onClick={clearDrawings} 
                  disabled={!drawings.length}
                >
                  🗑️ Clear
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-xs px-2 py-1"
                  onClick={async () => {
                    const container = videoContainerRef.current
                    if (!container) return
                    
                    if (!document.fullscreenElement) {
                      container.requestFullscreen().catch(console.error)
                    } else {
                      document.exitFullscreen().catch(console.error)
                    }
                  }}
                >
                  📺 Full
                </Button>
                <select 
                  value={playbackRate}
                  onChange={(e) => setPlaybackRate(Number(e.target.value))}
                  className="bg-muted text-xs px-2 py-1 rounded border border-border h-8 w-20"
                >
                  <option value={0.25}>0.25x</option>
                  <option value={0.5}>0.5x</option>
                  <option value={0.75}>0.75x</option>
                  <option value={1}>1x</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2x</option>
                </select>
              </div>
              <VideoPlayer
                videoUrl={clipData.videoUrl}
                videoRef={videoRef}
                drawMode={isDrawMode}
                playbackRate={playbackRate}
                strokes={drawings}
                onStrokeCreated={handleStrokeCreated}
              />
            </div>


            <AnnotationsTimeline
              coachNotes={coachNotes}
              drawings={drawings}
              setCoachNotes={setCoachNotes}
              setDrawings={setDrawings}
              activeEventId={activeEvent}
              onEventClick={handleAnnotationClick}
            />
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l p-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Clip Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>{clipData.fileName}</p>
                <p className="text-sm text-muted-foreground">{clipData.date}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Extract Clip</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Start (s)</Label>
                  <input
                    type="number"
                    value={extractStart}
                    onChange={e => setExtractStart(Number(e.target.value))}
                    className="w-full p-2 border rounded-md mt-1"
                    min="0"
                  />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">End (s)</Label>
                  <input
                    type="number"
                    value={extractEnd}
                    onChange={e => setExtractEnd(Number(e.target.value))}
                    className="w-full p-2 border rounded-md mt-1"
                    min="1"
                  />
                </div>
                <Button onClick={handleExtractClip} disabled={isExtracting || extractEnd <= extractStart} className="w-full">
                  {isExtracting ? 'Extracting...' : 'Extract'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  placeholder="Add note..."
                  className="w-full h-24 p-2 border rounded-md resize-none"
                  rows={3}
                />
                <Button onClick={addCoachNote} disabled={!noteText.trim()} className="w-full mt-2">
                  Add Note
                </Button>
                <Button onClick={handleSaveNotes} disabled={isSavingNote} variant="outline" className="w-full mt-1">
                  {isSavingNote ? 'Saving...' : 'Save All'}
                </Button>
                <Button variant="destructive" className="w-full mt-1" onClick={() => {
                  setCoachNotes([])
                  setDrawings([])
                  toast.success('All notes cleared')
                }} disabled={coachNotes.length === 0}>
                  Clear All Notes
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

