"use client"

import { useState } from "react"
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
import { Upload, File, X } from "lucide-react"
import { toast } from "sonner"

interface UploadClipDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UploadClipDialog({ open, onOpenChange }: UploadClipDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [matchLabel, setMatchLabel] = useState("")
  const [sessionType, setSessionType] = useState<"Game" | "Practice">("Game")
const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [speed, setSpeed] = useState(0)
  const [eta, setEta] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      setFile(droppedFile)
    }
  }

  const handleUpload = async () => {
    if (!file || !matchLabel) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsUploading(true)
    setProgress(0)
    setSpeed(0)
    setEta('')
    
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("matchLabel", matchLabel)
      formData.append("sessionType", sessionType)

      // Upload with progress tracking using XMLHttpRequest
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        const startTime = Date.now()
        let lastLoaded = 0
        let speedTimer: NodeJS.Timeout

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const loaded = e.loaded
            setProgress(Math.round((loaded / e.total) * 100))

            // Calculate speed (KB/s)
            const now = Date.now()
            const elapsed = (now - startTime) / 1000
            const currentSpeed = (loaded - lastLoaded) / elapsed / 1000
            setSpeed(Math.round(currentSpeed * 10) / 10)

            // Removed ETA (inaccurate)


            lastLoaded = loaded
          }
        })

        xhr.onload = async () => {
          setProgress(100) // Close dialog on 100%
          if (xhr.status >= 200 && xhr.status < 300) {
            const uploadData = JSON.parse(xhr.responseText)

            // Save clip metadata
            const saveResponse = await fetch("/api/clips", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                matchLabel,
                sessionType,
                fileName: file.name,
                videoUrl: uploadData.videoUrl,
              }),
            })

            if (!saveResponse.ok) {
              reject(new Error("Failed to save clip metadata"))
              return
            }

            toast.success("Clip uploaded successfully!", {
              description: `${matchLabel} ready`,
            })

            resolve(null)
          } else {
            reject(new Error(`Upload failed: ${xhr.status}`))
          }
        }


        xhr.onerror = () => reject(new Error('Upload network error'))
        xhr.open('POST', '/api/upload')
        xhr.send(formData)
      })

      // Reset form & close dialog
      setFile(null)
      setMatchLabel("")
      setSessionType("Game")
      setProgress(0)
      setIsUploading(false)
      onOpenChange(false)
      setTimeout(() => window.location.reload(), 500) // Brief success view
    } catch (error) {
      setIsUploading(false)
      setProgress(0)
      toast.error("Upload failed", {
        description: error instanceof Error ? error.message : "Please try again",
      })
    }
  }



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Upload New Clip</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* File upload */}
          <div className="space-y-2">
            <Label>Video File ({file?.size ? (file.size / (1024*1024)).toFixed(1) + 'MB' : ''})</Label>
            {file ? (
              <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 p-3">
                <File className="h-5 w-5 text-primary" />
                <span className="flex-1 truncate text-sm text-foreground">{file.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div 
                className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border p-6 transition-colors hover:border-primary/50 hover:bg-secondary/50"
                onClick={() => document.getElementById("file-input")?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </span>
                <span className="text-xs text-muted-foreground">MP4, MOV up to 500MB</span>
                <input
                  id="file-input"
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Upload Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div 
                      className="h-2 rounded-full bg-primary transition-all duration-300" 
                      style={{width: `${progress}%`}}
                    />
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground space-y-0.5">
                <div className="flex justify-between">
                  <span>Speed:</span>
                  <span>{speed} KB/s</span>
                </div>
              </div>
            </div>
          )}



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
          <Button onClick={handleUpload} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload Clip"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
