"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { StatCard } from "@/components/stat-card"
import { PitchHeatmap } from "@/components/pitch-heatmap"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  Film,
  User,
  TrendingUp,
  Users,
  GitCompare,
  BarChart3,
  Video,
  X,
  Sparkles,
  Target,
  ShieldCheck,
  Zap,
  Loader2,
  Download,
  Share2,
} from "lucide-react"

interface ReportType {
  id: string
  title: string
  description: string
  icon: React.ElementType
}

const reportTypes: ReportType[] = [
  {
    id: "clip",
    title: "Clip Report",
    description: "Detailed analysis of individual video clips with AI annotations",
    icon: Film,
  },
  {
    id: "player-session",
    title: "Player Session Report",
    description: "Individual player performance breakdown for a specific session",
    icon: User,
  },
  {
    id: "player-trend",
    title: "Player Trend Report",
    description: "Track player development and performance trends over time",
    icon: TrendingUp,
  },
  {
    id: "team-tactical",
    title: "Team Tactical Report",
    description: "Comprehensive team tactical analysis with heatmaps and patterns",
    icon: Users,
  },
  {
    id: "practice-game-delta",
    title: "Practice vs Game Delta",
    description: "Compare practice performance metrics against match day execution",
    icon: GitCompare,
  },
  {
    id: "benchmark",
    title: "Benchmark Comparison",
    description: "Compare player and team metrics against league benchmarks",
    icon: BarChart3,
  },
  {
    id: "highlight-reel",
    title: "Monthly Highlight Reel",
    description: "Auto-generated compilation of key moments from the month",
    icon: Video,
  },
]

function ExpandedReport({
  report,
  onClose,
}: {
  report: ReportType
  onClose: () => void
}) {
  const [isExporting, setIsExporting] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [isCreatingPlan, setIsCreatingPlan] = useState(false)

  const Icon = report.icon

  const handleExport = async () => {
    setIsExporting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsExporting(false)
    toast.success("Report exported", {
      description: `${report.title} has been downloaded as PDF`,
    })
  }

  const handleShare = async () => {
    setIsSharing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSharing(false)
    navigator.clipboard.writeText(window.location.href + `?report=${report.id}`)
    toast.success("Link copied", {
      description: "Share this link with your coaching staff",
    })
  }

  const handleCreatePlan = async () => {
    setIsCreatingPlan(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsCreatingPlan(false)
    toast.success("Practice plan created", {
      description: "A new practice plan has been generated based on this report",
    })
  }

  // Generate report-specific content
  const getReportContent = () => {
    switch (report.id) {
      case "team-tactical":
        return (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Analysis Period</p>
                <p className="font-medium text-foreground">March 1-28, 2026</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sessions Analyzed</p>
                <p className="font-medium text-foreground">8 Games, 12 Practices</p>
              </div>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-medium text-foreground">
                Team Possession Heatmap
              </h4>
              <div className="aspect-[3/2] overflow-hidden rounded-lg border border-border">
                <PitchHeatmap />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <StatCard label="Avg Possession" value="58%" icon={Target} />
              <StatCard label="Press Success" value="71%" icon={ShieldCheck} />
              <StatCard label="Transitions/Game" value="14.2" icon={Zap} />
              <StatCard label="xG Created" value="1.8" icon={Target} />
            </div>
            <div>
              <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Analysis Summary
              </h4>
              <div className="rounded-lg border border-border bg-secondary/50 p-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {`The team's tactical profile this month shows a clear identity built around controlled possession with quick transitions when opportunities arise. Pressing efficiency has improved significantly since the beginning of the month, with coordinated triggers now executing at 71% success rate compared to 62% in February.

The heatmap reveals concentrated activity in the left half-space, suggesting a preference for building through the left side before switching play. This creates overloads effectively but also shows a potential over-reliance that opponents could exploit.

Key areas for development: The defensive block compresses well vertically but lateral shifting speed needs improvement, particularly when defending quick switches of play.`}
                </p>
              </div>
            </div>
          </>
        )
      case "clip":
        return (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Clips Analyzed</p>
                <p className="font-medium text-foreground">247 clips</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Duration</p>
                <p className="font-medium text-foreground">12h 34m</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <StatCard label="Avg Clip Length" value="3:02" icon={Film} />
              <StatCard label="AI Tags Applied" value="1,247" icon={Sparkles} />
              <StatCard label="Key Moments" value="89" icon={Target} />
              <StatCard label="Review Rate" value="78%" icon={ShieldCheck} />
            </div>
            <div>
              <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Analysis Summary
              </h4>
              <div className="rounded-lg border border-border bg-secondary/50 p-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Clip analysis reveals consistent patterns in transition moments, with 67% of tagged clips focusing on defensive-to-offensive transitions. The AI has identified 89 key moments worth coach review, with the highest concentration in the final third entries. Most common annotations: Transition (34%), Shape Issue (22%), Press Error (18%), Recovery (15%), Key Pass (11%).
                </p>
              </div>
            </div>
          </>
        )
      case "player-session":
        return (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sessions Covered</p>
                <p className="font-medium text-foreground">Last 5 sessions</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Players Tracked</p>
                <p className="font-medium text-foreground">18 players</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <StatCard label="Avg Distance" value="9.8km" icon={Zap} />
              <StatCard label="Avg Sprints" value="24" icon={TrendingUp} />
              <StatCard label="Top Speed" value="31.2 km/h" icon={Target} />
              <StatCard label="Involvement" value="82%" icon={Users} />
            </div>
            <div>
              <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Analysis Summary
              </h4>
              <div className="rounded-lg border border-border bg-secondary/50 p-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Individual player session data shows strong work rate across the squad with an average distance covered of 9.8km per game. Sprint counts have increased 12% over the last month, indicating improved fitness levels. Key performers: Marcus Webb (highest sprint count), Carlos Mendez (most key passes), Jamal King (highest defensive actions).
                </p>
              </div>
            </div>
          </>
        )
      case "player-trend":
        return (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Trend Period</p>
                <p className="font-medium text-foreground">Last 90 days</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data Points</p>
                <p className="font-medium text-foreground">324 metrics</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <StatCard label="Improving" value="12" icon={TrendingUp} />
              <StatCard label="Stable" value="4" icon={Target} />
              <StatCard label="Watch List" value="2" icon={ShieldCheck} />
              <StatCard label="Avg Growth" value="+8%" icon={Sparkles} />
            </div>
            <div>
              <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Analysis Summary
              </h4>
              <div className="rounded-lg border border-border bg-secondary/50 p-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Player development trends over 90 days show 12 players with significant improvement in key metrics. Notable progressions: Marcus Webb (press success +15%), Emma Chen (pass completion +9%), Carlos Mendez (sprint recovery -0.4s). Two players on watch list for fatigue indicators - recommend load management adjustments.
                </p>
              </div>
            </div>
          </>
        )
      case "practice-game-delta":
        return (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Practice Sessions</p>
                <p className="font-medium text-foreground">12 sessions</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Match Days</p>
                <p className="font-medium text-foreground">8 games</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <StatCard label="Press Success Delta" value="+4%" icon={ShieldCheck} />
              <StatCard label="Possession Delta" value="-3%" icon={Target} />
              <StatCard label="Intensity Match" value="87%" icon={Zap} />
              <StatCard label="Transfer Rate" value="72%" icon={GitCompare} />
            </div>
            <div>
              <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Analysis Summary
              </h4>
              <div className="rounded-lg border border-border bg-secondary/50 p-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Practice-to-game transfer analysis shows 72% skill transfer rate, above target threshold. Press success actually improves in games (+4%), indicating good pressure simulation in training. Possession drops 3% in games suggesting need for more realistic opposition intensity in practice. Recommend adding competitive small-sided games to bridge the gap.
                </p>
              </div>
            </div>
          </>
        )
      case "benchmark":
        return (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">League Position</p>
                <p className="font-medium text-foreground">3rd of 12</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Metrics Compared</p>
                <p className="font-medium text-foreground">28 KPIs</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <StatCard label="Above Avg" value="18" icon={TrendingUp} />
              <StatCard label="At Avg" value="6" icon={Target} />
              <StatCard label="Below Avg" value="4" icon={ShieldCheck} />
              <StatCard label="Top 3 In" value="7" icon={Sparkles} />
            </div>
            <div>
              <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Analysis Summary
              </h4>
              <div className="rounded-lg border border-border bg-secondary/50 p-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Benchmark comparison places the team in the top quartile for 18 of 28 tracked KPIs. Strengths: pressing intensity (1st), transition speed (2nd), set piece conversion (3rd). Areas for improvement: aerial duel success rate (9th), defensive 1v1s (8th), counter-attack prevention (7th). Overall tactical profile exceeds league average by 14%.
                </p>
              </div>
            </div>
          </>
        )
      case "highlight-reel":
        return (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Clips Selected</p>
                <p className="font-medium text-foreground">24 highlights</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Duration</p>
                <p className="font-medium text-foreground">8:42</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <StatCard label="Goals" value="8" icon={Target} />
              <StatCard label="Key Passes" value="6" icon={Sparkles} />
              <StatCard label="Defensive" value="5" icon={ShieldCheck} />
              <StatCard label="Team Play" value="5" icon={Users} />
            </div>
            <div>
              <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Analysis Summary
              </h4>
              <div className="rounded-lg border border-border bg-secondary/50 p-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Monthly highlight reel auto-generated from 247 reviewed clips. Selection criteria: tactical significance, skill execution, team cohesion moments. Featured players: Marcus Webb (5 clips), Carlos Mendez (4 clips), Jamal King (3 clips). Reel optimized for team review and social media formats available.
                </p>
              </div>
            </div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          {report.title}
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {getReportContent()}

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="default" onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Export PDF
          </Button>
          <Button variant="outline" onClick={handleShare} disabled={isSharing}>
            {isSharing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Share2 className="mr-2 h-4 w-4" />
            )}
            Share with Staff
          </Button>
          <Button variant="outline" onClick={handleCreatePlan} disabled={isCreatingPlan}>
            {isCreatingPlan ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Create Practice Plan"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function ReportCard({
  report,
  onGenerate,
  isGenerating,
  generatingId,
}: {
  report: ReportType
  onGenerate: (id: string) => void
  isGenerating: boolean
  generatingId: string | null
}) {
  const Icon = report.icon
  const isThisGenerating = isGenerating && generatingId === report.id

  return (
    <Card className="bg-card border-border transition-all hover:border-primary/50">
      <CardContent className="p-5">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="font-semibold text-card-foreground">{report.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{report.description}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => onGenerate(report.id)}
          disabled={isGenerating}
        >
          {isThisGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

export default function ReportsPage() {
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatingId, setGeneratingId] = useState<string | null>(null)

  const handleGenerate = async (reportId: string) => {
    setIsGenerating(true)
    setGeneratingId(reportId)
    
    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    setIsGenerating(false)
    setGeneratingId(null)
    
    // Expand the report view
    setExpandedReportId(reportId)
    toast.success("Report generated", {
      description: "Your report is ready to view",
    })
  }

  const expandedReport = expandedReportId 
    ? reportTypes.find((r) => r.id === expandedReportId)
    : null

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="ml-60 flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground">
            Generate AI-powered analysis reports
          </p>
        </div>

        {/* Expanded report */}
        {expandedReport && (
          <div className="mb-6">
            <ExpandedReport
              report={expandedReport}
              onClose={() => setExpandedReportId(null)}
            />
          </div>
        )}

        {/* Report types grid */}
        <div className="grid grid-cols-3 gap-4">
          {reportTypes.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              generatingId={generatingId}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
