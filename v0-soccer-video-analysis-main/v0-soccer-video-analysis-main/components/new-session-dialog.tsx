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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

interface NewSessionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewSessionDialog({ open, onOpenChange }: NewSessionDialogProps) {
  const [name, setName] = useState("")
  const [sessionType, setSessionType] = useState<"Game" | "Practice">("Game")
  const [opponent, setOpponent] = useState("")
  const [notes, setNotes] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const handleCreate = async () => {
    if (!name) {
      toast.error("Please enter a session name")
      return
    }

    setIsCreating(true)
    
    // Simulate creation
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    setIsCreating(false)
    toast.success("Session created", {
      description: `${name} has been added to your sessions`,
    })
    
    // Reset form
    setName("")
    setSessionType("Game")
    setOpponent("")
    setNotes("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">New Session</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Session name */}
          <div className="space-y-2">
            <Label htmlFor="session-name">Session Name</Label>
            <Input
              id="session-name"
              placeholder="e.g., vs Riverside FC or Pressing Drill"
              value={name}
              onChange={(e) => setName(e.target.value)}
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

          {/* Opponent (for games) */}
          {sessionType === "Game" && (
            <div className="space-y-2">
              <Label htmlFor="opponent">Opponent</Label>
              <Input
                id="opponent"
                placeholder="e.g., Riverside FC"
                value={opponent}
                onChange={(e) => setOpponent(e.target.value)}
              />
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this session..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={isCreating}>
            {isCreating ? "Creating..." : "Create Session"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
