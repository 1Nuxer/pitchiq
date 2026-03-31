import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Film, Zap, ShieldCheck } from "lucide-react"

interface PlayerCardProps {
  id: string
  name: string
  position: string
  initials: string
  clipsReviewed: number
  avgSprintCount: number
  pressSuccessRate: number
}

export function PlayerCard({
  id,
  name,
  position,
  initials,
  clipsReviewed,
  avgSprintCount,
  pressSuccessRate,
}: PlayerCardProps) {
  return (
    <Card className="bg-card border-border transition-all hover:border-primary/50">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-lg font-semibold text-primary">
            {initials}
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-card-foreground">{name}</h3>
                <Badge variant="secondary" className="mt-1">
                  {position}
                </Badge>
              </div>
              <Link href={`/players/${id}`}>
                <Button variant="outline" size="sm">
                  View Profile
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Film className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-card-foreground">{clipsReviewed}</p>
                  <p className="text-xs text-muted-foreground">Clips</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-card-foreground">{avgSprintCount}</p>
                  <p className="text-xs text-muted-foreground">Avg Sprints</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-card-foreground">{pressSuccessRate}%</p>
                  <p className="text-xs text-muted-foreground">Press %</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
