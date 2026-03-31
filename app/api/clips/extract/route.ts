import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { promisify } from "util"
import childProcess from "child_process"

const exec = promisify(childProcess.exec)
const dataDir = path.join(process.cwd(), "data")
const clipsFile = path.join(dataDir, "clips.json")

async function ensureDataDir() {
  try {
    await fs.mkdir(dataDir, { recursive: true })
  } catch (error) {
    console.error("Could not create data dir", error)
  }
}

async function readClips() {
  try {
    await ensureDataDir()
    const data = await fs.readFile(clipsFile, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

async function writeClips(clips: any[]) {
  await ensureDataDir()
  await fs.writeFile(clipsFile, JSON.stringify(clips, null, 2))
}

async function ensureFfmpegAvailable() {
  try {
    await exec("ffmpeg -version")
    return true
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clipId, start, end } = body

    if (!clipId || typeof start !== "number" || typeof end !== "number") {
      return NextResponse.json({ error: "clipId, start and end are required" }, { status: 400 })
    }
    if (start < 0 || end <= start) {
      return NextResponse.json({ error: "Invalid time range" }, { status: 400 })
    }

    const clips = await readClips()
    const clip = clips.find((c: any) => c.id === clipId)
    if (!clip) {
      return NextResponse.json({ error: "Clip not found" }, { status: 404 })
    }

    if (!clip.videoUrl || !clip.videoUrl.startsWith("/uploads/")) {
      return NextResponse.json({ error: "Clip video URL is not a local upload" }, { status: 400 })
    }

    const sourcePath = path.join(process.cwd(), "public", clip.videoUrl)
    try {
      await fs.access(sourcePath)
    } catch {
      return NextResponse.json({ error: "Source video file not found" }, { status: 404 })
    }

    const ffmpegAvailable = await ensureFfmpegAvailable()
    if (!ffmpegAvailable) {
      return NextResponse.json({ error: "ffmpeg is not available on the server" }, { status: 501 })
    }

    const parsed = path.parse(sourcePath)
    const extractedName = `${parsed.name}_extract_${Math.floor(start)}-${Math.floor(end)}${parsed.ext}`
    const extractedPath = path.join(parsed.dir, extractedName)
    const extractedUrl = `/uploads/${extractedName}`

    const command = `ffmpeg -y -ss ${start} -to ${end} -i "${sourcePath}" -c copy "${extractedPath}"`
    try {
      await exec(command)
    } catch (error) {
      // fallback to re-encode if copy-based extraction fails
      const fallbackCommand = `ffmpeg -y -ss ${start} -to ${end} -i "${sourcePath}" -c:v libx264 -c:a aac -strict -2 "${extractedPath}"`
      try {
        await exec(fallbackCommand)
      } catch (fallbackError) {
        console.error("Clip extraction failed", error, fallbackError)
        return NextResponse.json({ error: "Clip extraction failed" }, { status: 500 })
      }
    }

    const newClip = {
      id: `clip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      matchLabel: `${clip.matchLabel} (Extract ${formatTime(start)}-${formatTime(end)})`,
      sessionType: clip.sessionType,
      fileName: extractedName,
      videoUrl: extractedUrl,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      tags: [],
      aiSummary: `Extracted clip from ${formatTime(start)} to ${formatTime(end)} of ${clip.matchLabel}.`,
      suggestedDrill: clip.suggestedDrill,
      annotations: [],
      metrics: {},
    }

    clips.push(newClip)
    await writeClips(clips)

    return NextResponse.json({ success: true, clip: newClip }, { status: 201 })
  } catch (error) {
    console.error("Error extracting clip:", error)
    return NextResponse.json({ error: "Internal server error", details: String(error) }, { status: 500 })
  }
}

function formatTime(seconds: number) {
  const sec = Math.max(0, Math.floor(seconds))
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}
