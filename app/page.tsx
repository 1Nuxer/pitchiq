import Link from "next/link"
import { AppSidebar } from "@/components/app-sidebar"
import { StatCard } from "@/components/stat-card"
import { ClipCard } from "@/components/clip-card"
import { AIInsightsPanel } from "@/components/ai-insights-panel"
import { Film, Users, Calendar, Sparkles } from "lucide-react"
import type { TagType } from "@/components/annotation-tag"

// Mock data
const recentClips: {
  id: string
  matchLabel: string
  date: string
  sessionType: "Game" | "Practice"
  tags: TagType[]
}[] = [
  {
    id: "1",
    matchLabel: "vs Riverside FC",
    date: "March 28, 2026",
    sessionType: "Game",
    tags: ["press-error", "shape", "transition"],
  },
  {
    id: "2",
    matchLabel: "vs Metro United",
    date: "March 25, 2026",
    sessionType: "Game",
    tags: ["recovery", "key-pass"],
  },
  {
    id: "3",
    matchLabel: "Pressing Drill Session",
    date: "March 24, 2026",
    sessionType: "Practice",
    tags: ["transition", "press-error"],
  },
  {
    id: "4",
    matchLabel: "vs Coastal Athletic",
    date: "March 22, 2026",
    sessionType: "Game",
    tags: ["shape", "recovery", "transition"],
  },
  {
    id: "5",
    matchLabel: "Shape Work Session",
    date: "March 20, 2026",
    sessionType: "Practice",
    tags: ["shape", "transition"],
  },
]

const aiInsights = [
  { text: "Defensive shape consistently breaks down when fullbacks push high without midfield cover" },
  { text: "Press success rate dropped 12% in the final third against Metro United's deep block" },
  { text: "Marcus Webb shows strong support run timing but needs work on first touch under pressure" },
  { text: "Transition moments in the last 3 games averaged 4.2 seconds — faster than league average" },
]

const suggestedDrills = [
  {
    title: "Shadow Press Drill",
    description: "Work on coordinated pressing triggers and cover shadows",
    duration: "15-20 min",
  },
  {
    title: "4v2 Rondo with Transition",
    description: "Quick possession switches with immediate counter movement",
    duration: "12 min",
  },
]

export default function DashboardPage() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      {/* Main content */}
      <main className="ml-60 flex flex-1 flex-col">
        <div className="flex flex-1">
          {/* Content area */}
          <div className="flex-1 p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-foreground">
                Welcome back, Coach Nathan
              </h1>
              <p className="text-sm text-muted-foreground">{today}</p>
            </div>

            {/* Stat cards */}
            <div className="mb-8 grid grid-cols-4 gap-4">
              <StatCard
                label="Total Clips"
                value="247"
                icon={Film}
                trend={{ value: 8, isPositive: true }}
              />
              <StatCard
                label="Players Tracked"
                value="18"
                icon={Users}
              />
              <StatCard
                label="Sessions This Month"
                value="12"
                icon={Calendar}
                trend={{ value: 4, isPositive: true }}
              />
              <StatCard
                label="AI Insights Generated"
                value="89"
                icon={Sparkles}
                trend={{ value: 23, isPositive: true }}
              />
            </div>

            {/* Recent Clips */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Recent Clips</h2>
                <Link
                  href="/clips"
                  className="text-sm text-primary hover:underline"
                >
                  View all clips
                </Link>
              </div>
              <div className="space-y-3">
                {recentClips.map((clip) => (
                  <ClipCard key={clip.id} {...clip} />
                ))}
              </div>
            </div>
          </div>

          {/* Right rail */}
          <div className="border-l border-border p-6">
            <AIInsightsPanel insights={aiInsights} drills={suggestedDrills} />
          </div>
        </div>
      </main>
    </div>
  )
}
