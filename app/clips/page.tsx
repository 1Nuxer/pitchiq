"use client"

import { useState, useMemo, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ClipCard } from "@/components/clip-card"
import { UploadClipDialog } from "@/components/upload-clip-dialog"
import { FilterDialog } from "@/components/filter-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Upload, X } from "lucide-react"
import type { TagType } from "@/components/annotation-tag"

// Mock data
const clips: {
  id: string
  matchLabel: string
  date: string
  sessionType: "Game" | "Practice"
  tags: TagType[]
}[] = []

export default function ClipsPage() {
  const [clips, setClips] = useState<{
    id: string
    matchLabel: string
    date: string
    sessionType: "Game" | "Practice"
    tags: TagType[]
  }[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [filterDialogOpen, setFilterDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [filters, setFilters] = useState({
    sessionType: "all",
    tags: [] as string[],
    dateRange: "all",
  })

  // Fetch clips on mount
  useEffect(() => {
    const fetchClips = async () => {
      try {
        const response = await fetch("/api/clips")
        const data = await response.json()
        setClips(data)
      } catch (error) {
        console.error("Error fetching clips:", error)
      }
    }

    fetchClips()
  }, [])

  const filteredClips = useMemo(() => {
    const filtered = clips.filter((clip) => {
      // Search filter
      const matchesSearch =
        !searchQuery ||
        clip.matchLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clip.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clip.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      // Session type filter
      const matchesType =
        filters.sessionType === "all" || clip.sessionType === filters.sessionType

      // Tag filter
      const matchesTags =
        filters.tags.length === 0 ||
        filters.tags.some((filterTag) => clip.tags.includes(filterTag as TagType))

      return matchesSearch && matchesType && matchesTags
    })

// Sort by creation time (id timestamp), newest first
    filtered.sort((a, b) => {
      const aTime = parseInt(a.id.split('_')[1])
      const bTime = parseInt(b.id.split('_')[1])
      return bTime - aTime
    })

    
    return filtered
  }, [clips, searchQuery, filters])

  const activeFilterCount =
    (filters.sessionType !== "all" ? 1 : 0) +
    filters.tags.length +
    (filters.dateRange !== "all" ? 1 : 0)

  const clearFilters = () => {
    setSearchQuery("")
    setFilters({ sessionType: "all", tags: [], dateRange: "all" })
  }

  const deleteClip = async (id: string) => {
    if (!confirm("Delete this clip?")) return
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/clips?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const details = await response.json().catch(() => null)
        throw new Error(`Unable to delete clip${details?.error ? `: ${details.error}` : ""}`)
      }

      setClips((prev) => prev.filter((clip) => clip.id !== id))
    } catch (error) {
      console.error("Delete failed:", error)
      // optional toast
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="ml-60 flex-1 p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Clips</h1>
            <p className="text-sm text-muted-foreground">
              {filteredClips.length} of {clips.length} clips
            </p>
          </div>
          <Button onClick={() => setUploadDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Clip
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search clips by match, date, or annotation..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={() => setFilterDialogOpen(true)}>
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Active filters display */}
        {activeFilterCount > 0 && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {filters.sessionType !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {filters.sessionType}
                <button onClick={() => setFilters((f) => ({ ...f, sessionType: "all" }))}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tag}
                <button
                  onClick={() =>
                    setFilters((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }))
                  }
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all
            </Button>
          </div>
        )}

        {/* Clips list */}
        {filteredClips.length > 0 ? (
          <div className="space-y-3">
            {filteredClips.map((clip) => (
              <ClipCard
                key={clip.id}
                {...clip}
                onDelete={isDeleting ? undefined : deleteClip}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12">
            <p className="text-muted-foreground">No clips match your filters</p>
            <Button variant="ghost" size="sm" className="mt-2" onClick={clearFilters}>
              Clear filters
            </Button>
          </div>
        )}
      </main>

      <UploadClipDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} />
      <FilterDialog
        open={filterDialogOpen}
        onOpenChange={setFilterDialogOpen}
        filters={filters}
        onApply={setFilters}
      />
    </div>
  )
}
