import { cn } from "@/lib/utils"

type TagType = "transition" | "shape" | "press-error" | "recovery" | "key-pass" | "goal" | "shot" | "coach-note"

const tagConfig: Partial<Record<TagType, { label: string; className: string }>> = {
  transition: {
    label: "Transition",
    className: "bg-tag-transition/20 text-tag-transition border-tag-transition/30",
  },
  shape: {
    label: "Shape issue",
    className: "bg-tag-shape/20 text-tag-shape border-tag-shape/30",
  },
  "press-error": {
    label: "Press error",
    className: "bg-tag-press-error/20 text-tag-press-error border-tag-press-error/30",
  },
  recovery: {
    label: "Recovery",
    className: "bg-tag-recovery/20 text-tag-recovery border-tag-recovery/30",
  },
  "key-pass": {
    label: "Key pass",
    className: "bg-tag-key-pass/20 text-tag-key-pass border-tag-key-pass/30",
  },
  goal: {
    label: "Goal",
    className: "bg-emerald-500/20 text-emerald-500 border-emerald-500/30",
  },
  shot: {
    label: "Shot",
    className: "bg-orange-500/20 text-orange-500 border-orange-500/30",
  },
  "coach-note": {
    label: "Coach Note",
    className: "bg-indigo-500/20 text-indigo-500 border-indigo-500/30",
  },
}

interface AnnotationTagProps {
  type: TagType
  className?: string
}

export function AnnotationTag({ type, className }: AnnotationTagProps) {
  const config = tagConfig[type]
  
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        config?.className ?? "bg-gray-500/20 text-gray-500 border-gray-500/30",
        className
      )}
    >
      {config?.label ?? type ?? "Unknown"}
    </span>
  )
}

export type { TagType }
