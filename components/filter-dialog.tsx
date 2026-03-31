"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FilterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: {
    sessionType: string
    tags: string[]
    dateRange: string
  }
  onApply: (filters: { sessionType: string; tags: string[]; dateRange: string }) => void
}

const tagOptions = [
  { id: "transition", label: "Transition" },
  { id: "shape", label: "Shape Issue" },
  { id: "press-error", label: "Press Error" },
  { id: "recovery", label: "Recovery" },
  { id: "key-pass", label: "Key Pass" },
]

export function FilterDialog({ open, onOpenChange, filters, onApply }: FilterDialogProps) {
  const [localFilters, setLocalFilters] = useState(filters)

  const handleTagToggle = (tagId: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter((t) => t !== tagId)
        : [...prev.tags, tagId],
    }))
  }

  const handleApply = () => {
    onApply(localFilters)
    onOpenChange(false)
  }

  const handleReset = () => {
    const resetFilters = { sessionType: "all", tags: [], dateRange: "all" }
    setLocalFilters(resetFilters)
    onApply(resetFilters)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Filter Clips</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Session Type */}
          <div className="space-y-2">
            <Label>Session Type</Label>
            <Select
              value={localFilters.sessionType}
              onValueChange={(v) => setLocalFilters((prev) => ({ ...prev, sessionType: v }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Game">Games Only</SelectItem>
                <SelectItem value="Practice">Practice Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label>Date Range</Label>
            <Select
              value={localFilters.dateRange}
              onValueChange={(v) => setLocalFilters((prev) => ({ ...prev, dateRange: v }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="week">Past Week</SelectItem>
                <SelectItem value="month">Past Month</SelectItem>
                <SelectItem value="quarter">Past 3 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <Label>Annotation Tags</Label>
            <div className="space-y-2">
              {tagOptions.map((tag) => (
                <div key={tag.id} className="flex items-center gap-2">
                  <Checkbox
                    id={tag.id}
                    checked={localFilters.tags.includes(tag.id)}
                    onCheckedChange={() => handleTagToggle(tag.id)}
                  />
                  <label
                    htmlFor={tag.id}
                    className="text-sm text-foreground cursor-pointer"
                  >
                    {tag.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="ghost" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
