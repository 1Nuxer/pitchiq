"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Dumbbell, ChevronRight } from "lucide-react"
import { DrillDetailDialog } from "@/components/drill-detail-dialog"

interface InsightItem {
  text: string
}

interface DrillCard {
  title: string
  description: string
  duration: string
}

interface AIInsightsPanelProps {
  insights: InsightItem[]
  drills: DrillCard[]
  isLoading?: boolean
}

export function AIInsightsPanel({ insights, drills, isLoading }: AIInsightsPanelProps) {
  const [selectedDrill, setSelectedDrill] = useState<DrillCard | null>(null)
  const [drillDialogOpen, setDrillDialogOpen] = useState(false)

  const handleDrillClick = (drill: DrillCard) => {
    setSelectedDrill(drill)
    setDrillDialogOpen(true)
  }

  return (
    <>
      <div className="flex w-80 flex-col gap-4">
        {/* AI Insights */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-card-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/50 animate-pulse-glow" />
                    <div className="h-4 flex-1 rounded bg-muted animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              <ul className="space-y-2 text-sm text-muted-foreground">
                {insights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    <span>{insight.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Suggested Drills */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-card-foreground">
              <Dumbbell className="h-4 w-4 text-primary" />
              Suggested Drills
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {drills.map((drill, index) => (
              <button
                key={index}
                onClick={() => handleDrillClick(drill)}
                className="group w-full cursor-pointer rounded-lg border border-border bg-secondary/50 p-3 text-left transition-colors hover:bg-secondary"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-card-foreground">{drill.title}</h4>
                    <p className="mt-1 text-xs text-muted-foreground">{drill.description}</p>
                    <p className="mt-2 text-xs text-primary">{drill.duration}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </button>
            ))}
            <Button variant="outline" size="sm" className="w-full">
              View All Drills
            </Button>
          </CardContent>
        </Card>
      </div>

      <DrillDetailDialog
        open={drillDialogOpen}
        onOpenChange={setDrillDialogOpen}
        drill={selectedDrill}
      />
    </>
  )
}
