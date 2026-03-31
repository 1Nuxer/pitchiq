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
    const file = formData.get("file") as File
    const matchLabel = formData.get("matchLabel") as string
    const sessionType = formData.get("sessionType") as string

    // Validate inputs
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    if (!matchLabel) {
      return NextResponse.json(
        { error: "No match label provided" },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith("video/")) {
      return NextResponse.json(
        { error: "File must be a video" },
        { status: 400 }
      )
    }

    // Validate file size (500MB max)
    const maxSize = 500 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 500MB limit" },
        { status: 400 }
      )
    }

    // Save file to public/uploads
    await ensureUploadsDir()
    
    const buffer = await file.arrayBuffer()
    const timestamp = Date.now()
    const ext = file.name.split('.').pop() || 'mp4'
    const filename = `${timestamp}.${ext}`
    const filepath = path.join(uploadsDir, filename)
    
    await fs.writeFile(filepath, new Uint8Array(buffer))

    const clipId = `clip_${timestamp}_${Math.random().toString(36).substr(2, 9)}`
    const videoUrl = `/uploads/${filename}`

    console.log(`Upload saved: ${matchLabel}`)
    console.log(`File: ${filename} to ${filepath}`)
    console.log(`URL: ${videoUrl}`)

    return NextResponse.json(
      {
        success: true,
        message: "Clip uploaded successfully",
        clipId,
        matchLabel,
        sessionType,
        videoUrl,
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
