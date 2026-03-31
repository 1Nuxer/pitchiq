"use client"

import { useState, useMemo } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { PlayerCard } from "@/components/player-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, ArrowUpDown } from "lucide-react"

// Mock data
const players = [
  {
    id: "1",
    name: "Marcus Webb",
    position: "Central Midfielder",
    initials: "MW",
    clipsReviewed: 34,
    avgSprintCount: 12.4,
    pressSuccessRate: 72,
  },
  {
    id: "2",
    name: "Jordan Chen",
    position: "Right Back",
    initials: "JC",
    clipsReviewed: 28,
    avgSprintCount: 15.2,
    pressSuccessRate: 68,
  },
  {
    id: "3",
    name: "Elijah Santos",
    position: "Striker",
    initials: "ES",
    clipsReviewed: 41,
    avgSprintCount: 18.7,
    pressSuccessRate: 54,
  },
  {
    id: "4",
    name: "Ryan O'Neill",
    position: "Center Back",
    initials: "RO",
    clipsReviewed: 32,
    avgSprintCount: 8.3,
    pressSuccessRate: 81,
  },
  {
    id: "5",
    name: "David Okonkwo",
    position: "Left Winger",
    initials: "DO",
    clipsReviewed: 29,
    avgSprintCount: 16.9,
    pressSuccessRate: 63,
  },
  {
    id: "6",
    name: "Lucas Fernandez",
    position: "Defensive Midfielder",
    initials: "LF",
    clipsReviewed: 36,
    avgSprintCount: 11.2,
    pressSuccessRate: 78,
  },
  {
    id: "7",
    name: "Noah Williams",
    position: "Goalkeeper",
    initials: "NW",
    clipsReviewed: 22,
    avgSprintCount: 2.1,
    pressSuccessRate: 0,
  },
  {
    id: "8",
    name: "Kai Thompson",
    position: "Left Back",
    initials: "KT",
    clipsReviewed: 27,
    avgSprintCount: 14.8,
    pressSuccessRate: 71,
  },
  {
    id: "9",
    name: "James Mitchell",
    position: "Center Back",
    initials: "JM",
    clipsReviewed: 30,
    avgSprintCount: 7.9,
    pressSuccessRate: 76,
  },
  {
    id: "10",
    name: "Alex Rivera",
    position: "Attacking Midfielder",
    initials: "AR",
    clipsReviewed: 38,
    avgSprintCount: 13.5,
    pressSuccessRate: 58,
  },
  {
    id: "11",
    name: "Tyler Brooks",
    position: "Right Winger",
    initials: "TB",
    clipsReviewed: 31,
    avgSprintCount: 17.3,
    pressSuccessRate: 61,
  },
  {
    id: "12",
    name: "Chris Martinez",
    position: "Striker",
    initials: "CM",
    clipsReviewed: 25,
    avgSprintCount: 16.1,
    pressSuccessRate: 52,
  },
]

type SortOption = "name" | "clips" | "sprints" | "press"

export default function PlayersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [positionFilter, setPositionFilter] = useState("all")
  const [sortBy, setSortBy] = useState<SortOption>("name")

  const filteredAndSortedPlayers = useMemo(() => {
    let result = players.filter((player) => {
      const matchesSearch =
        !searchQuery ||
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.position.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesPosition =
        positionFilter === "all" ||
        player.position.toLowerCase().includes(positionFilter.toLowerCase())

      return matchesSearch && matchesPosition
    })

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "clips":
          return b.clipsReviewed - a.clipsReviewed
        case "sprints":
          return b.avgSprintCount - a.avgSprintCount
        case "press":
          return b.pressSuccessRate - a.pressSuccessRate
        default:
          return 0
      }
    })

    return result
  }, [searchQuery, positionFilter, sortBy])

  const positions = ["all", "goalkeeper", "back", "midfielder", "winger", "striker"]

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="ml-60 flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Players</h1>
          <p className="text-sm text-muted-foreground">
            {filteredAndSortedPlayers.length} of {players.length} players
          </p>
        </div>

        {/* Search and filters */}
        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search players..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={positionFilter} onValueChange={setPositionFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Position" />
            </SelectTrigger>
            <SelectContent>
              {positions.map((pos) => (
                <SelectItem key={pos} value={pos}>
                  {pos === "all" ? "All Positions" : pos.charAt(0).toUpperCase() + pos.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-40">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="clips">Clips Reviewed</SelectItem>
              <SelectItem value="sprints">Sprint Count</SelectItem>
              <SelectItem value="press">Press Success</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Players grid */}
        {filteredAndSortedPlayers.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredAndSortedPlayers.map((player) => (
              <PlayerCard key={player.id} {...player} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12">
            <p className="text-muted-foreground">No players match your search</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => {
                setSearchQuery("")
                setPositionFilter("all")
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
