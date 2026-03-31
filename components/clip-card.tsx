import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnnotationTag, type TagType } from "@/components/annotation-tag"
import { Play, Trash2 } from "lucide-react"

interface ClipCardProps {
  id: string
  matchLabel: string
  date: string
  sessionType: "Game" | "Practice"
  tags: TagType[]
  thumbnail?: string
  onDelete?: (id: string) => void
}

export function ClipCard({ id, matchLabel, date, sessionType, tags, onDelete }: ClipCardProps) {
  return (
    <Link href={`/clips/${id}`}>
      <Card className="group cursor-pointer bg-card border-border transition-all hover:border-primary/50 hover:bg-card/80">
        <CardContent className="p-0">
          <div className="flex gap-4">
            {/* Thumbnail */}
            <div className="relative h-24 w-40 flex-shrink-0 overflow-hidden rounded-l-lg bg-muted">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-muted">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/80 opacity-0 transition-opacity group-hover:opacity-100">
                  <Play className="h-5 w-5 text-primary-foreground" fill="currentColor" />
                </div>
              </div>
              {/* Soccer pitch lines */}
              <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 160 96">
                <rect x="2" y="2" width="156" height="92" fill="none" stroke="currentColor" strokeWidth="1" className="text-foreground/30" />
                <line x1="80" y1="2" x2="80" y2="94" stroke="currentColor" strokeWidth="1" className="text-foreground/30" />
                <circle cx="80" cy="48" r="15" fill="none" stroke="currentColor" strokeWidth="1" className="text-foreground/30" />
              </svg>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col justify-center gap-2 py-3 pr-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-card-foreground">{matchLabel}</h3>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={sessionType === "Game" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {sessionType}
                  </Badge>
                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onDelete(id)
                      }}
                      className="rounded-md border border-border p-1 text-muted-foreground hover:border-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{date}</p>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag, index) => (
                  <AnnotationTag key={index} type={tag} />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
