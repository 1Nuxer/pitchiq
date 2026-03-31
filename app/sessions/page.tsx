"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ClipCard } from "@/components/clip-card"
import { NewSessionDialog } from "@/components/new-session-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronDown, ChevronRight, Plus, Calendar, Film, Sparkles, Search } from "lucide-react"
import type { TagType } from "@/components/annotation-tag"

interface SessionClip {
  id: string
  matchLabel: string
  date: string
  sessionType: "Game" | "Practice"
  tags: TagType[]
}

interface Session {
  id: string
  name: string
  date: string
  type: "Game" | "Practice"
  opponent?: string
  clipCount: number
  aiSummary: string
  clips: SessionClip[]
}

// Mock data
const sessions: Session[] = [
  {
    id: "1",
    name: "vs Riverside FC",
    date: "March 28, 2026",
    type: "Game",
    opponent: "Riverside FC",
    clipCount: 8,
    aiSummary: "Strong defensive performance with pressing coordination issues in the second half",
    clips: [
      { id: "1-1", matchLabel: "Pressing sequence 23:47", date: "March 28, 2026", sessionType: "Game", tags: ["press-error", "shape"] },
      { id: "1-2", matchLabel: "Counter-attack 34:12", date: "March 28, 2026", sessionType: "Game", tags: ["transition", "key-pass"] },
      { id: "1-3", matchLabel: "Defensive recovery 41:55", date: "March 28, 2026", sessionType: "Game", tags: ["recovery"] },
    ],
  },
  {
    id: "2",
    name: "vs Metro United",
    date: "March 25, 2026",
    type: "Game",
    opponent: "Metro United",
    clipCount: 6,
    aiSummary: "Dominant possession but struggled to break down deep defensive block",
    clips: [
      { id: "2-1", matchLabel: "Build-up play 15:22", date: "March 25, 2026", sessionType: "Game", tags: ["shape", "transition"] },
      { id: "2-2", matchLabel: "Final third entry 28:45", date: "March 25, 2026", sessionType: "Game", tags: ["key-pass"] },
    ],
  },
  {
    id: "3",
    name: "Pressing Drill Session",
    date: "March 24, 2026",
    type: "Practice",
    clipCount: 12,
    aiSummary: "Focus on coordinated press triggers - improvement in cover shadow positioning",
    clips: [
      { id: "3-1", matchLabel: "6v4 Press drill", date: "March 24, 2026", sessionType: "Practice", tags: ["transition", "press-error"] },
      { id: "3-2", matchLabel: "Shadow positioning", date: "March 24, 2026", sessionType: "Practice", tags: ["shape"] },
    ],
  },
  {
    id: "4",
    name: "vs Coastal Athletic",
    date: "March 22, 2026",
    type: "Game",
    opponent: "Coastal Athletic",
    clipCount: 9,
    aiSummary: "Excellent transition play, defensive shape held well under sustained pressure",
    clips: [
      { id: "4-1", matchLabel: "Fast break 12:33", date: "March 22, 2026", sessionType: "Game", tags: ["transition", "key-pass"] },
      { id: "4-2", matchLabel: "Defensive block 67:21", date: "March 22, 2026", sessionType: "Game", tags: ["shape", "recovery"] },
    ],
  },
  {
    id: "5",
    name: "Shape Work Session",
    date: "March 20, 2026",
    type: "Practice",
    clipCount: 8,
    aiSummary: "Defensive shape compactness improved - lateral movement timing needs work",
    clips: [
      { id: "5-1", matchLabel: "11v0 shape drill", date: "March 20, 2026", sessionType: "Practice", tags: ["shape"] },
      { id: "5-2", matchLabel: "Ball-side shift", date: "March 20, 2026", sessionType: "Practice", tags: ["shape", "transition"] },
    ],
  },
  {
    id: "6",
    name: "vs Northern Rangers",
    date: "March 18, 2026",
    type: "Game",
    opponent: "Northern Rangers",
    clipCount: 7,
    aiSummary: "Clinical finishing but vulnerable on set pieces - need to address marking assignments",
    clips: [
      { id: "6-1", matchLabel: "Goal sequence 55:12", date: "March 18, 2026", sessionType: "Game", tags: ["key-pass", "transition"] },
      { id: "6-2", matchLabel: "Corner defense 72:30", date: "March 18, 2026", sessionType: "Game", tags: ["shape", "press-error"] },
    ],
  },
]

function SessionCard({ session }: { session: Session }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="bg-card border-border overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left"
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Calendar className="h-6 w-6 text-primary" />
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-card-foreground">{session.name}</h3>
                    <Badge
                      variant={session.type === "Game" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {session.type}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{session.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Film className="h-4 w-4" />
                    {session.clipCount} clips
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>

              <div className="mt-3 flex items-start gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <p className="text-sm text-muted-foreground">{session.aiSummary}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </button>

      {isExpanded && (
        <div className="border-t border-border bg-secondary/30 p-4">
          <h4 className="mb-3 text-sm font-medium text-foreground">Session Clips</h4>
          <div className="space-y-2">
            {session.clips.map((clip) => (
              <ClipCard key={clip.id} {...clip} />
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}

export default function SessionsPage() {
  const [newSessionDialogOpen, setNewSessionDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      !searchQuery ||
      session.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.aiSummary.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = typeFilter === "all" || session.type === typeFilter

    return matchesSearch && matchesType
  })

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="ml-60 flex-1 p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Sessions</h1>
            <p className="text-sm text-muted-foreground">
              {filteredSessions.length} of {sessions.length} sessions
            </p>
          </div>
          <Button onClick={() => setNewSessionDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Session
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search sessions..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Game">Games</SelectItem>
              <SelectItem value="Practice">Practice</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sessions list */}
        {filteredSessions.length > 0 ? (
          <div className="space-y-4">
            {filteredSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12">
            <p className="text-muted-foreground">No sessions match your search</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => {
                setSearchQuery("")
                setTypeFilter("all")
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </main>

      <NewSessionDialog
        open={newSessionDialogOpen}
        onOpenChange={setNewSessionDialogOpen}
      />
    </div>
  )
}
