"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Link, Youtube, Play } from "lucide-react"
import { toast } from "sonner"

interface UploadClipDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Platform = 'youtube' | 'vimeo' | null;

export function UploadClipDialog({ open, onOpenChange }: UploadClipDialogProps) {
  const [urlInput, setUrlInput] = useState("")
  const [thumbnail, setThumbnail] = useState("")
  const [platform, setPlatform] = useState<Platform>(null)
  const [matchLabel, setMatchLabel] = useState("")
  const [sessionType, setSessionType] = useState<"Game" | "Practice">("Game")
  const [isUploading, setIsUploading] = useState(false)

const fetchThumbnail = async (url: string): Promise<{thumbnail: string, platform: Platform} | null> => {
  try {
    let oembedUrl = ''
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    } else if (url.includes('vimeo.com')) {
      oembedUrl = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`
    } else {
      return null
    }

    const response = await fetch(oembedUrl)
    if (!response.ok) return null

    const data = await response.json()
    return {
      thumbnail: data.thumbnail_url || data.thumbnail_width ? data.thumbnail_url : '',
      platform: url.includes('youtube.com') || url.includes('youtu.be') ? 'youtube' : 'vimeo'
    }
  } catch {
    return null
  }
}

useEffect(() => {
  if (urlInput.trim()) {
    const timeoutId = setTimeout(async () => {
      const result = await fetchThumbnail(urlInput)
      if (result) {
        setThumbnail(result.thumbnail)
        setPlatform(result.platform)
      } else {
        setThumbnail('')
        setPlatform(null)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  } else {
    setThumbnail('')
    setPlatform(null)
  }
}, [urlInput])

  const handleUpload = async () => {
    if (!urlInput.trim() || !matchLabel) {
      toast.error("Please fill URL and label")
      return
    }

    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append("url", urlInput.trim())
      formData.append("matchLabel", matchLabel)
      formData.append("sessionType", sessionType)
      formData.append("title", platform === 'youtube' ? 'YouTube Clip' : 'Vimeo Clip')

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        const err = await uploadResponse.json()
        throw new Error(err.error || 'Upload failed')
      }

      const uploadData = await uploadResponse.json()

      const saveResponse = await fetch("/api/clips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchLabel,
          sessionType,
          title: uploadData.title || 'New Clip',
          videoUrl: uploadData.videoUrl,
        }),
      })

      if (!saveResponse.ok) {
        throw new Error("Failed to save metadata")
      }

      toast.success("Clip added successfully!")
      setUrlInput('')
      setThumbnail('')
      setPlatform(null)
      setMatchLabel("")
      setSessionType("Game")
      onOpenChange(false)
      setTimeout(() => window.location.reload(), 500)
    } catch (error) {
      toast.error("Add failed", {
        description: error instanceof Error ? error.message : "Try again"
      })
    } finally {
      setIsUploading(false)
    }
  }



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Upload New Clip</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* URL input + preview */}
          <div className="space-y-3">
            <Label htmlFor="url-input">Paste YouTube or Vimeo URL</Label>
            <Input
              id="url-input"
              placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full"
            />
            {thumbnail && (
              <div className="flex items-center gap-2 p-2 bg-secondary/50 rounded-lg">
                <img 
                  src={thumbnail} 
                  alt="Preview" 
                  className="w-16 h-9 object-cover rounded"
                />
                <div className="text-xs text-muted-foreground">
                  {platform === 'youtube' ? 'YouTube' : 'Vimeo'} • Ready to add
                </div>
              </div>
            )}
            {!thumbnail && urlInput.trim() && (
              <p className="text-xs text-destructive">Invalid URL or unsupported platform</p>
            )}
          </div>

          {/* Match label */}
          <div className="space-y-2">
            <Label htmlFor="match-label">Match/Session Label</Label>
            <Input
              id="match-label"
              placeholder="e.g., vs Riverside FC"
              value={matchLabel}
              onChange={(e) => setMatchLabel(e.target.value)}
            />
          </div>

          {/* Session type */}
          <div className="space-y-2">
            <Label>Session Type</Label>
            <Select value={sessionType} onValueChange={(v) => setSessionType(v as "Game" | "Practice")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Game">Game</SelectItem>
                <SelectItem value="Practice">Practice</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
  <Button onClick={handleUpload} disabled={isUploading || !urlInput.trim() || !matchLabel.trim()}>
            {isUploading ? "Adding..." : "Add Clip"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
