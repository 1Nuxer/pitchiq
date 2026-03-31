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
import { toast } from "sonner"

interface EditPlayerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  player: {
    name: string
    position: string
    number: number
    team: string
  }
}

const positions = [
  "Goalkeeper",
  "Right Back",
  "Left Back",
  "Center Back",
  "Defensive Midfielder",
  "Central Midfielder",
  "Attacking Midfielder",
  "Right Winger",
  "Left Winger",
  "Striker",
]

export function EditPlayerDialog({ open, onOpenChange, player }: EditPlayerDialogProps) {
  const [name, setName] = useState(player.name)
  const [position, setPosition] = useState(player.position)
  const [number, setNumber] = useState(player.number.toString())
  const [team, setTeam] = useState(player.team)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!name || !position || !number) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSaving(true)
    
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    setIsSaving(false)
    toast.success("Player updated", {
      description: `${name}'s profile has been saved`,
    })
    
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit Player</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="player-name">Name</Label>
            <Input
              id="player-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Position */}
          <div className="space-y-2">
            <Label>Position</Label>
            <Select value={position} onValueChange={setPosition}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {positions.map((pos) => (
                  <SelectItem key={pos} value={pos}>
                    {pos}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Number */}
          <div className="space-y-2">
            <Label htmlFor="player-number">Jersey Number</Label>
            <Input
              id="player-number"
              type="number"
              min="1"
              max="99"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>

          {/* Team */}
          <div className="space-y-2">
            <Label htmlFor="player-team">Team</Label>
            <Input
              id="player-team"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
