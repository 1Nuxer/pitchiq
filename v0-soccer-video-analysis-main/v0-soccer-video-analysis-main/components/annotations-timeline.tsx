"use client"

import { AnnotationTag, type TagType } from "@/components/annotation-tag"
import { Edit, Image } from "lucide-react"

interface TimelineEvent {
  id: string
  timestamp: string
  type: TagType
  description: string
  drawingCount?: number
}

interface CoachNote {
  time: number
  text: string
}

interface VideoStroke {
  id: string
  time: number
  width: number
  color: string
  points: any[]
}

interface AnnotationsTimelineProps {
  aiEvents: TimelineEvent[]
  coachNotes: CoachNote[]
  drawings: VideoStroke[]
  activeEventId?: string
  onEventClick?: (id: string) => void
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

function getDrawingsForNote(time: number, drawings: VideoStroke[], window = 5): number {
  return drawings.filter(d => Math.abs(d.time - time) <= window).length
}

function createDrawingNotes(drawings: VideoStroke[]): TimelineEvent[] {
  const grouped = drawings.reduce((acc: Record<string, VideoStroke[]>, stroke) => {
    const timeKey = `${Math.floor(stroke.time)}`
    if (!acc[timeKey]) acc[timeKey] = []
    acc[timeKey].push(stroke)
    return acc
  }, {})

  return Object.entries(grouped).map(([timeStr, strokes], index) => {
    const time = parseInt(timeStr)
    return {
      id: `drawing-${time}-${index}`,
      timestamp: formatTime(time),
      type: "coach-note" as TagType,
      description: `Drawing annotation (${strokes.length} strokes)`,
      drawingCount: strokes.length
    }
  }).sort((a, b) => parseInt(a.timestamp.split(':')[0]) * 60 + parseInt(a.timestamp.split(':')[1]) - (parseInt(b.timestamp.split(':')[0]) * 60 + parseInt(b.timestamp.split(':')[1])))
}

function convertCoachNotesToEvents(notes: CoachNote[], drawings: VideoStroke[]): TimelineEvent[] {
  // Group notes and drawings by second
  const grouped: Record<string, {notes: CoachNote[], drawings: VideoStroke[]}> = {}
  
  notes.forEach(note => {
    const key = `${Math.floor(note.time)}`
    if (!grouped[key]) grouped[key] = {notes: [], drawings: []}
    grouped[key].notes.push(note)
  })
  
  drawings.forEach(d => {
    const key = `${Math.floor(d.time)}`
    if (!grouped[key]) grouped[key] = {notes: [], drawings: []}
    grouped[key].drawings.push(d)
  })
  
  return Object.entries(grouped).map(([timeStr, data], index) => {
    const time = parseInt(timeStr)
    const totalNotes = data.notes.length
    const totalDrawings = data.drawings.length
    
    let description = ''
    if (totalNotes > 0) description += data.notes.map(n => n.text).join('; ')
    if (totalDrawings > 0) {
      description += (description ? '; ' : '') + `Drawing annotation (${totalDrawings} strokes)`
    }
    
    return {
      id: `coach-group-${time}-${index}`,
      timestamp: formatTime(time),
      type: "coach-note" as TagType,
      description: description || 'Annotation',
      drawingCount: totalDrawings
    }
  }).sort((a, b) => {
    const timeA = parseInt(a.timestamp.split(':')[0]) * 60 + parseInt(a.timestamp.split(':')[1])
    const timeB = parseInt(b.timestamp.split(':')[0]) * 60 + parseInt(b.timestamp.split(':')[1])
    return timeA - timeB
  })
}


export function AnnotationsTimeline({ 
  coachNotes, 
  drawings, 
  setCoachNotes,
  setDrawings,
  activeEventId, 
  onEventClick 
}: {
  coachNotes: CoachNote[]
  drawings: VideoStroke[]
  setCoachNotes: React.Dispatch<React.SetStateAction<CoachNote[]>>  
  setDrawings: React.Dispatch<React.SetStateAction<VideoStroke[]>>  
  activeEventId?: string
  onEventClick?: (id: string) => void
}) {
  const coachEvents = convertCoachNotesToEvents(coachNotes, drawings)

  return (
    <div className="space-y-4">
      {/* Coach Annotations */}
      {coachEvents.length > 0 ? (
        <div>
          <h3 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <Edit className="h-3 w-3" />
            Coach Notes & Drawings ({coachEvents.length})
          </h3>
          <div className="space-y-2">

            {coachEvents.map((event) => {
              const handleDelete = () => {
                const time = parseInt(event.timestamp.split(':')[0]) * 60 + parseInt(event.timestamp.split(':')[1])
                setCoachNotes(prev => prev.filter(n => Math.floor(n.time) !== time))
                setDrawings(prev => prev.filter(d => Math.floor(d.time) !== time))
                console.log('Note & drawings deleted')
              }
              return (
                <div key={event.id} className="group relative">
                  <button
                    onClick={() => onEventClick?.(event.id)}
                    className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                      activeEventId === event.id
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:bg-secondary/50"
                    }`}
                  >
                    <span className="flex-shrink-0 font-mono text-xs text-muted-foreground">
                      {event.timestamp}
                    </span>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <AnnotationTag type={event.type} />
                        {event.drawingCount && event.drawingCount > 0 && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md">
                            <Image className="h-3 w-3" />
                            {event.drawingCount}
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-card-foreground">{event.description}</p>
                    </div>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="group-hover:opacity-100 opacity-0 absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 h-6 w-6 shadow-md hover:bg-destructive/90 transition-all z-10"
                    title="Delete note"
                  >
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m7-13a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1V6a1 1 0 0 1 1 1h12a1 1 0 0 1 1 1v1" />
                    </svg>
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="text-muted-foreground text-sm p-4 text-center border-dashed border-2 border-border rounded-lg">
          No coach notes or drawings yet. Add some above!
        </div>
      )}
    </div>
  )
}

