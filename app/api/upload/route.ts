import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const uploadsDir = path.join(process.cwd(), "public", "uploads")

async function ensureUploadsDir() {
  try {
    await fs.mkdir(uploadsDir, { recursive: true })
  } catch (error) {
    console.error("Error creating uploads directory:", error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const url = formData.get("url") as string
    const title = formData.get("title") as string
    const matchLabel = formData.get("matchLabel") as string
    const sessionType = formData.get("sessionType") as string

    // Validate inputs
    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 })
    }

    if (!matchLabel) {
      return NextResponse.json({ error: "No match label provided" }, { status: 400 })
    }

    // Validate YouTube/Vimeo
    const ytRegex = /youtube\.com\/watch\?v=|youtu\.be\/|vimeo\.com\//i
    if (!ytRegex.test(url)) {
      return NextResponse.json({ error: "Must be YouTube or Vimeo URL" }, { status: 400 })
    }

    const timestamp = Date.now()
    const clipId = `clip_${timestamp}_${Math.random().toString(36).substr(2, 9)}`
    const videoUrl = url

    console.log(`URL clip saved: ${matchLabel} ${url}`)

    return NextResponse.json(
      {
        success: true,
        title,
        videoUrl,
        clipId,
        matchLabel,
        sessionType,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    )
  }
}
