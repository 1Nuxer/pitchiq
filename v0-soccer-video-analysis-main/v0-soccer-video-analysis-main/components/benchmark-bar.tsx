import { cn } from "@/lib/utils"

interface BenchmarkBarProps {
  label: string
  percentile: number
  className?: string
}

export function BenchmarkBar({ label, percentile, className }: BenchmarkBarProps) {
  const getColor = (value: number) => {
    if (value >= 75) return "bg-tag-recovery"
    if (value >= 50) return "bg-primary"
    if (value >= 25) return "bg-tag-shape"
    return "bg-tag-press-error"
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-medium text-foreground">{percentile}th</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all", getColor(percentile))}
          style={{ width: `${percentile}%` }}
        />
      </div>
    </div>
  )
}
