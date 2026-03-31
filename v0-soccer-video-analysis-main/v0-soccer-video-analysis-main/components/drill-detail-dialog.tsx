"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Target } from "lucide-react"
import { toast } from "sonner"

interface DrillDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  drill: {
    title: string
    description: string
    duration: string
  } | null
}

const drillDetails = {
  "Shadow Press Drill": {
    fullDescription: "A structured pressing exercise where players work on coordinated trigger movements and cover shadow positioning. The drill focuses on recognizing pressing cues and executing as a unit.",
    setup: "Set up a 30x40 yard grid. 6 attackers vs 4 defenders with 2 neutral players.",
    keyPoints: [
      "Identify and communicate pressing triggers",
      "Maintain proper cover shadow angles",
      "Coordinate movement with teammates",
      "Quick transition when possession is won",
    ],
    intensity: "High",
    players: "12-14",
  },
  "4v2 Rondo with Transition": {
    fullDescription: "A possession-based exercise that emphasizes quick ball movement and immediate transition when the ball is won or lost.",
    setup: "15x15 yard grid with 4 attackers on the outside and 2 defenders in the middle.",
    keyPoints: [
      "Quick one-touch passing",
      "Movement off the ball",
      "Immediate counter-press on loss",
      "Explosive transition on ball win",
    ],
    intensity: "Medium-High",
    players: "6-8",
  },
  "Pressing Coordination Box": {
    fullDescription: "Focus on coordinated press triggers and cover shadows between midfield and forward line in a compact area.",
    setup: "25x30 yard grid. 6 attackers vs 4 defenders.",
    keyPoints: [
      "Communication between lines",
      "Trigger recognition",
      "Cover shadow positioning",
      "Recovery runs on ball loss",
    ],
    intensity: "High",
    players: "10-12",
  },
}

export function DrillDetailDialog({ open, onOpenChange, drill }: DrillDetailDialogProps) {
  if (!drill) return null

  const details = drillDetails[drill.title as keyof typeof drillDetails] || {
    fullDescription: drill.description,
    setup: "Standard training setup",
    keyPoints: ["Focus on technique", "Maintain intensity", "Communicate with teammates"],
    intensity: "Medium",
    players: "8-12",
  }

  const handleAddToPlan = () => {
    toast.success("Drill added to practice plan", {
      description: `${drill.title} has been added to your current plan`,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">{drill.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Quick info */}
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{drill.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{details.players} players</span>
            </div>
            <Badge variant="secondary">{details.intensity} Intensity</Badge>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Description</h4>
            <p className="text-sm text-muted-foreground">{details.fullDescription}</p>
          </div>

          {/* Setup */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Setup</h4>
            <p className="text-sm text-muted-foreground">{details.setup}</p>
          </div>

          {/* Key Points */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Key Coaching Points
            </h4>
            <ul className="space-y-1">
              {details.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleAddToPlan} className="flex-1">
            Add to Practice Plan
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
