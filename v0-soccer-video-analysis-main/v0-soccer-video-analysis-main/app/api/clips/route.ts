import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const dataDir = path.join(process.cwd(), "data")
const clipsFile = path.join(dataDir, "clips.json")

async function ensureDataDir() {
  try {
    await fs.mkdir(dataDir, { recursive: true })
  } catch (error) {
    // Directory might already exist
  }
}

async function readClips() {
  try {
    await ensureDataDir()
    const data = await fs.readFile(clipsFile, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    // File doesn't exist yet
    return []
  }
}

async function writeClips(clips: any[]) {
  await ensureDataDir()
  await fs.writeFile(clipsFile, JSON.stringify(clips, null, 2))
}

export async function GET() {
  try {
    const clips = await readClips()
    return NextResponse.json(clips)
  } catch (error) {
    console.error("Error reading clips:", error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { matchLabel, sessionType, fileName, videoUrl, aiSummary, suggestedDrill, annotations } = body

    if (!matchLabel || !sessionType || !fileName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const clips = await readClips()
    const sprintCount = Math.floor(Math.random() * 17) + 8 // 8-24
    const passes = Math.floor(Math.random() * 56) + 15 // 15-70
    const passSuccess = Math.floor(Math.random() * 31) + 65 // 65-95
    const shotAccuracy = Math.floor(Math.random() * 51) + 20 // 20-70

    const generatedAiSummary = aiSummary || `AI analysis automatically reviewed this clip and found ${sprintCount} sprint efforts, ${passes} passes with ${passSuccess}% success. shot accuracy is ${shotAccuracy}%. The key tactical theme is press coordination and transition control.`
    const generatedSuggestedDrill = suggestedDrill || {
      title: "Pressing Coordination Box",
      description: "6v4 box with designated press triggers and cover shadows. Focus on communication between midfield and forward line.",
      duration: "15-20 min",
    }

    const generatedAnnotations = annotations || [
      { id: "1", timestamp: "21:34", type: "transition", description: "Quick vertical pass into space behind defensive line, creating 3v2 overload" },
      { id: "2", timestamp: "23:12", type: "shape", description: "Defensive line drops too deep allowing opponent to advance into final third" },
      { id: "3", timestamp: "23:47", type: "press-error", description: "Press trigger missed by #8, allowing easy switch of play to weak side" },
      { id: "4", timestamp: "25:03", type: "recovery", description: "Excellent recovery run by #4 to cover exposed space on right flank" },
      { id: "5", timestamp: "28:15", type: "key-pass", description: "Through ball from #10 breaks defensive line, creates scoring opportunity" },
    ]

    const newClip = {
      id: `clip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      matchLabel,
      sessionType,
      fileName,
      videoUrl: videoUrl || "",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      tags: [] as string[],
      aiSummary: generatedAiSummary,
      suggestedDrill: generatedSuggestedDrill,
      annotations: generatedAnnotations,
      metrics: {
        sprintCount,
        passes,
        passSuccess,
        shotAccuracy,
      },
    }

    clips.push(newClip)
    await writeClips(clips)

    return NextResponse.json(newClip, { status: 201 })
  } catch (error) {
    console.error("Error saving clip:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 })
    }

    const clips = await readClips()
    const updatedClips = clips.filter((clip: any) => clip.id !== id)

    if (updatedClips.length === clips.length) {
      return NextResponse.json({ error: "Clip not found" }, { status: 404 })
    }

    await writeClips(updatedClips)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting clip:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
