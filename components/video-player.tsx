"use client"

import { useEffect, useRef } from "react"

export type VideoStrokePoint = {
  x: number
  y: number
}

export type VideoStroke = {
  id: string
  time: number
  width: number
  color: string
  points: VideoStrokePoint[]
}


interface VideoPlayerProps {
  videoUrl?: string
  videoRef: React.RefObject<HTMLVideoElement>
  drawMode: boolean
  playbackRate?: number
  onPlaybackRateChange?: (rate: number) => void
  onDrawReady?: (canvas: HTMLCanvasElement | null) => void
  strokes?: VideoStroke[]
  onStrokeCreated?: (stroke: VideoStroke) => void
}

function resizeCanvas(canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1
  const width = Math.floor(rect.width * dpr)
  const height = Math.floor(rect.height * dpr)

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.scale(dpr, dpr)
    }
  }
}

function drawStroke(ctx: CanvasRenderingContext2D, stroke: VideoStroke, bounds: { width: number; height: number }) {
  if (!stroke.points.length) return
  ctx.save()
  ctx.lineJoin = "round"
  ctx.lineCap = "round"
  ctx.strokeStyle = stroke.color
  ctx.lineWidth = stroke.width

  const [first, ...rest] = stroke.points
  ctx.beginPath()
  ctx.moveTo(first.x * bounds.width, first.y * bounds.height)

  rest.forEach((pt) => {
    ctx.lineTo(pt.x * bounds.width, pt.y * bounds.height)
  })

  ctx.stroke()
  ctx.restore()
}


export function VideoPlayer({
  videoUrl,
  videoRef,
  drawMode,
  playbackRate,
  onDrawReady,
  strokes = [],
  onStrokeCreated,
}: VideoPlayerProps) {
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate || 1
    }
  }, [playbackRate])
  const overlayRef = useRef<HTMLCanvasElement | null>(null)
  const drawingRef = useRef<boolean>(false)
  const currentStrokeRef = useRef<VideoStroke | null>(null)

  useEffect(() => {
    const canvas = overlayRef.current
    if (!canvas) return

    resizeCanvas(canvas)
    if (onDrawReady) onDrawReady(canvas)

    const redraw = () => {
      const rect = canvas.getBoundingClientRect()
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      ctx.clearRect(0, 0, rect.width, rect.height)
      
      const video = videoRef.current
      if (video) {
        const currentTime = Math.floor(video.currentTime)
        const visibleStrokes = strokes.filter(s => Math.floor(s.time) === currentTime)
        visibleStrokes.forEach((s) => drawStroke(ctx, s, rect))
      }
    }

    redraw()

    const handleVideoTimeUpdate = () => redraw()
    const video = videoRef.current
    if (video) {
      video.addEventListener('timeupdate', handleVideoTimeUpdate)
      video.addEventListener('seeked', handleVideoTimeUpdate)
      video.addEventListener('pause', handleVideoTimeUpdate)
      return () => {
        video.removeEventListener('timeupdate', handleVideoTimeUpdate)
        video.removeEventListener('seeked', handleVideoTimeUpdate)
        video.removeEventListener('pause', handleVideoTimeUpdate)
      }
    }
  }, [strokes, onDrawReady, videoRef])

  useEffect(() => {
    const canvas = overlayRef.current
    if (!canvas) return

    const onResize = () => {
      resizeCanvas(canvas)
      const rect = canvas.getBoundingClientRect()
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      ctx.clearRect(0, 0, rect.width, rect.height)
      strokes.forEach((s) => drawStroke(ctx, s, rect))
    }

    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [strokes])

  const getNormalizedPoint = (event: PointerEvent): VideoStrokePoint => {
    const canvas = overlayRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
    const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height))
    return { x, y }
  }

  const drawOnCanvas = (from: VideoStrokePoint, to: VideoStrokePoint) => {
    const canvas = overlayRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx || !currentStrokeRef.current) return
    const rect = canvas.getBoundingClientRect()

    ctx.save()
    ctx.lineJoin = "round"
    ctx.lineCap = "round"
    ctx.strokeStyle = currentStrokeRef.current.color
    ctx.lineWidth = currentStrokeRef.current.width

    ctx.beginPath()
    ctx.moveTo(from.x * rect.width, from.y * rect.height)
    ctx.lineTo(to.x * rect.width, to.y * rect.height)
    ctx.stroke()
    ctx.restore()
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawMode || !overlayRef.current || !videoRef.current) return
    drawingRef.current = true
    overlayRef.current.setPointerCapture(event.pointerId)

    const firstPoint = getNormalizedPoint(event.nativeEvent)
    const newStroke: VideoStroke = {
      id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
      time: Math.floor(videoRef.current.currentTime),
      width: 4,
      color: "rgba(0, 200, 255, 0.85)",
      points: [firstPoint],
    }
    currentStrokeRef.current = newStroke
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current || !currentStrokeRef.current) return

    const nextPoint = getNormalizedPoint(event.nativeEvent)
    const stroke = currentStrokeRef.current
    const previousPoint = stroke.points[stroke.points.length - 1]
    stroke.points.push(nextPoint)
    drawOnCanvas(previousPoint, nextPoint)
  }

  const commitStroke = () => {
    if (!drawingRef.current || !currentStrokeRef.current || !onStrokeCreated) {
      drawingRef.current = false
      currentStrokeRef.current = null
      return
    }

    onStrokeCreated(currentStrokeRef.current)
    drawingRef.current = false
    currentStrokeRef.current = null
  }

  const handlePointerUp = () => {
    commitStroke()
    const canvas = overlayRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        strokes.forEach((s) => drawStroke(ctx, s, canvas.getBoundingClientRect()))
      }
    }
  }
  const handlePointerCancel = () => {
    commitStroke()
    const canvas = overlayRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        strokes.forEach((s) => drawStroke(ctx, s, canvas.getBoundingClientRect()))
      }
    }
  }

  const getMimeTypeFromUrl = (url?: string) => {
    if (!url) return undefined
    const extension = url.split("?")[0].split(".").pop()?.toLowerCase()
    switch (extension) {
      case "mp4":
        return "video/mp4"
      case "mov":
        return "video/quicktime"
      case "webm":
        return "video/webm"
      case "ogv":
      case "ogg":
        return "video/ogg"
      case "mkv":
        return "video/x-matroska"
      case "flv":
        return "video/x-flv"
      case "avi":
        return "video/x-msvideo"
      default:
        return undefined
    }
  }

  const mimeType = getMimeTypeFromUrl(videoUrl)


  return (
    <div className="relative overflow-hidden rounded-lg bg-black">
      <video
        ref={videoRef}
        controls
        className="w-full aspect-video bg-black"
        controlsList="nodownload"
        preload="metadata"
        src={videoUrl}



      >
        {videoUrl && mimeType && <source src={videoUrl} type={mimeType} />}
        {videoUrl && !mimeType && <source src={videoUrl} />}
        Your browser does not support the video tag or no video was provided.
      </video>

      <canvas
        ref={overlayRef}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          left: 0,
          top: 0,
          zIndex: 10,
          pointerEvents: drawMode ? "auto" : "none",
          touchAction: "none",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      />
    </div>
  )
}
