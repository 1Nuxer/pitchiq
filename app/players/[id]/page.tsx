"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ClipCard } from "@/components/clip-card"
import { BenchmarkBar } from "@/components/benchmark-bar"
import { EditPlayerDialog } from "@/components/edit-player-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, Film, Zap, ShieldCheck, Target, Share2, Download } from "lucide-react"
import Link from "next/link"
import type { TagType } from "@/components/annotation-tag"
import { toast } from "sonner"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

// Mock data
const playerData = {
  id: "1",
  name: "Marcus Webb",
  position: "Central Midfielder",
  team: "Academy First Team",
  initials: "MW",
  number: 8,
}

const performanceData = [
  { month: "Jan", performance: 65, sprints: 11.2, pressSuccess: 68 },
  { month: "Feb", performance: 68, sprints: 11.8, pressSuccess: 70 },
  { month: "Mar", performance: 72, sprints: 12.1, pressSuccess: 71 },
  { month: "Apr", performance: 70, sprints: 11.9, pressSuccess: 69 },
  { month: "May", performance: 75, sprints: 12.4, pressSuccess: 72 },
  { month: "Jun", performance: 78, sprints: 12.8, pressSuccess: 74 },
  { month: "Jul", performance: 74, sprints: 12.2, pressSuccess: 71 },
  { month: "Aug", performance: 80, sprints: 13.1, pressSuccess: 75 },
  { month: "Sep", performance: 82, sprints: 13.5, pressSuccess: 78 },
  { month: "Oct", performance: 79, sprints: 12.9, pressSuccess: 76 },
  { month: "Nov", performance: 85, sprints: 14.0, pressSuccess: 80 },
  { month: "Dec", performance: 83, sprints: 13.8, pressSuccess: 79 },
]

const recentClips: {
  id: string
  matchLabel: string
  date: string
  sessionType: "Game" | "Practice"
  tags: TagType[]
}[] = [
  {
    id: "1",
    matchLabel: "vs Riverside FC - Pressing sequence",
    date: "March 28, 2026",
    sessionType: "Game",
    tags: ["transition", "key-pass"],
  },
  {
    id: "2",
    matchLabel: "vs Metro United - Defensive recovery",
    date: "March 25, 2026",
    sessionType: "Game",
    tags: ["recovery", "shape"],
  },
  {
    id: "3",
    matchLabel: "Pressing Drill - High intensity set",
    date: "March 24, 2026",
    sessionType: "Practice",
    tags: ["press-error", "transition"],
  },
]

const benchmarks = [
  { label: "Defensive Positioning", percentile: 72 },
  { label: "Support Runs", percentile: 85 },
  { label: "Pressing Contribution", percentile: 78 },
  { label: "Passing Accuracy", percentile: 68 },
]

export default function PlayerProfilePage() {
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success("Link copied to clipboard", {
      description: "Share this link with your coaching staff",
    })
  }

  const handleExport = () => {
    toast.success("Exporting player report...", {
      description: "PDF will be ready in a moment",
    })
    // Simulate export delay
    setTimeout(() => {
      toast.success("Export complete", {
        description: "Player report has been downloaded",
      })
    }, 2000)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="ml-60 flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/players"
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Players
          </Link>

          {/* Player header */}
          <div className="flex items-start gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 text-2xl font-semibold text-primary">
              {playerData.initials}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-foreground">
                    {playerData.name}
                  </h1>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="secondary">{playerData.position}</Badge>
                    <span className="text-sm text-muted-foreground">
                      #{playerData.number} - {playerData.team}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleExport}>
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
                    Edit Player
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Performance chart */}
          <div className="col-span-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Performance Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="month" 
                        stroke="rgba(255,255,255,0.5)"
                        tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
                      />
                      <YAxis 
                        stroke="rgba(255,255,255,0.5)"
                        tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "oklch(0.16 0.02 250)",
                          border: "1px solid oklch(0.25 0.02 250)",
                          borderRadius: "8px",
                          color: "white",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="performance"
                        name="Overall"
                        stroke="oklch(0.55 0.14 155)"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="pressSuccess"
                        name="Press %"
                        stroke="oklch(0.60 0.18 250)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent clips */}
            <Card className="mt-6 bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Film className="h-5 w-5 text-primary" />
                  Recent Clips
                </CardTitle>
                <Link href="/clips">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentClips.map((clip) => (
                  <ClipCard key={clip.id} {...clip} />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick stats */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Season Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Film className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Clips Reviewed</span>
                  </div>
                  <span className="font-semibold text-foreground">34</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Avg Sprint Count</span>
                  </div>
                  <span className="font-semibold text-foreground">12.4</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Press Success</span>
                  </div>
                  <span className="font-semibold text-foreground">72%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Pass Accuracy</span>
                  </div>
                  <span className="font-semibold text-foreground">84%</span>
                </div>
              </CardContent>
            </Card>

            {/* Benchmark comparison */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Benchmark Comparison</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {benchmarks.map((benchmark, index) => (
                  <BenchmarkBar key={index} {...benchmark} />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <EditPlayerDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        player={playerData}
      />
    </div>
  )
}
