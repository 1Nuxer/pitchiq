import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const dataDir = path.join(process.cwd(), "data")
const clipsFile = path.join(dataDir, "clips.json")

async function ensureDataDir() {
  try {
    await fs.mkdir(dataDir, { recursive: true })
  } catch {}
}

async function readClips() {
  try {
    await ensureDataDir()
    const data = await fs.readFile(clipsFile, "utf-8")
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function writeClips(clips: any[]) {
  await ensureDataDir()
  await fs.writeFile(clipsFile, JSON.stringify(clips, null, 2))
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  try {
    const clips = await readClips()
    const clip = clips.find((c: any) => c.id === id)
    if (!clip) {
      return NextResponse.json({ error: "Clip not found" }, { status: 404 })
    }
    return NextResponse.json(clip)
  } catch (error) {
    console.error("Error fetching clip:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  try {
    const clips = await readClips()
    const clipIndex = clips.findIndex((clip: any) => clip.id === id)
    if (clipIndex === -1) {
      return NextResponse.json({ error: "Clip not found" }, { status: 404 })
    }

    const body = await request.json()
    const { coachNotes, drawings, annotations, aiSummary, suggestedDrill, metrics } = body

    if (Array.isArray(coachNotes)) {
      clips[clipIndex].coachNotes = coachNotes
    }
    if (Array.isArray(drawings)) {
      clips[clipIndex].drawings = drawings
    }
    if (Array.isArray(annotations)) {
      clips[clipIndex].annotations = annotations
    }
    if (typeof aiSummary === "string") {
      clips[clipIndex].aiSummary = aiSummary
    }
    if (suggestedDrill && typeof suggestedDrill === "object") {
      clips[clipIndex].suggestedDrill = suggestedDrill
    }
    if (metrics && typeof metrics === "object") {
      clips[clipIndex].metrics = metrics
    }

    await writeClips(clips)
    return NextResponse.json(clips[clipIndex])
  } catch (error) {
    console.error("Error patching clip:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  try {
    const clips = await readClips()
    let updatedClips = clips.filter((clip: any) => clip.id !== id)

    if (updatedClips.length === clips.length) {
      // Fallback: try query string id (if client still uses /api/clips?id=)
      const queryId = new URL(request.url).searchParams.get("id")
      if (queryId) {
        updatedClips = clips.filter((clip: any) => clip.id !== queryId)
      }
    }

    if (updatedClips.length === clips.length) {
      return NextResponse.json({ error: "Clip not found" }, { status: 404 })
    }
    await writeClips(updatedClips)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting clip:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
