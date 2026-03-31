"use client"
 
import { useEffect, useRef, useCallback } from "react"
import type { VideoStroke } from "./video-player"
 
interface YoutubeDrawOverlayProps {
  isDrawMode: boolean
  strokes: VideoStroke[]
  onStrokeCreated: (stroke: VideoStroke) => void
  onClearDrawings: () => void
  iframeRef?: React.RefObject<HTMLIFrameElement>
}
 
export function YoutubeDrawOverlay({
  isDrawMode,
  strokes,
  onStrokeCreated,
  onClearDrawings,
  iframeRef,
}: YoutubeDrawOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawingRef = useRef(false)
  const currentStrokeRef = useRef<VideoStroke | null>(null)
  const dprRef = useRef(window.devicePixelRatio || 1)
 
  // Auto-pause/resume YouTube when draw mode toggles
  useEffect(() => {
    const iframe = iframeRef?.current
    if (!iframe) return
 
    if (isDrawMode) {
      iframe.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: "pauseVideo", args: [] }),
        "*"
      )
    } else {
      iframe.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: "playVideo", args: [] }),
        "*"
      )
    }
  }, [isDrawMode, iframeRef])
 
  const resizeCanvas = useCallback((canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    dprRef.current = dpr
    canvas.width = Math.floor(rect.width * dpr)
    canvas.height = Math.floor(rect.height * dpr)
    canvas.style.width = rect.width + "px"
    canvas.style.height = rect.height + "px"
    const ctx = canvas.getContext("2d")
    if (ctx) ctx.scale(dpr, dpr)
  }, [])
 
  // Get logical (CSS) dimensions for coordinate mapping
  const getLogicalSize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return { width: 0, height: 0 }
    const rect = canvas.getBoundingClientRect()
    return { width: rect.width, height: rect.height }
  }, [])
 
  const getNormalizedPoint = useCallback(
    (clientX: number, clientY: number): { x: number; y: number } => {
      const canvas = canvasRef.current
      if (!canvas) return { x: 0, y: 0 }
      const rect = canvas.getBoundingClientRect()
      return {
        x: Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)),
        y: Math.max(0, Math.min(1, (clientY - rect.top) / rect.height)),
      }
    },
    []
  )
 
  const drawStroke = useCallback(
    (ctx: CanvasRenderingContext2D, stroke: VideoStroke) => {
      if (!stroke.points.length) return
      const { width, height } = getLogicalSize()
      ctx.save()
      ctx.lineJoin = "round"
      ctx.lineCap = "round"
      ctx.strokeStyle = stroke.color
      ctx.lineWidth = stroke.width
 
      const [first, ...rest] = stroke.points
      ctx.beginPath()
      ctx.moveTo(first.x * width, first.y * height)
      rest.forEach((pt) => ctx.lineTo(pt.x * width, pt.y * height))
      ctx.stroke()
      ctx.restore()
    },
    [getLogicalSize]
  )
 
  // Handle resize
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const handleResize = () => resizeCanvas(canvas)
    window.addEventListener("resize", handleResize)
    resizeCanvas(canvas)
    return () => window.removeEventListener("resize", handleResize)
  }, [resizeCanvas])
 
  // Redraw all strokes whenever strokes array changes
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const { width, height } = getLogicalSize()
    ctx.clearRect(0, 0, width, height)
    strokes.forEach((stroke) => drawStroke(ctx, stroke))
  }, [strokes, drawStroke, getLogicalSize])
 
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!isDrawMode) return
      e.preventDefault()
      drawingRef.current = true
      canvasRef.current?.setPointerCapture(e.pointerId)
 
      const point = getNormalizedPoint(e.clientX, e.clientY)
      currentStrokeRef.current = {
        id: crypto.randomUUID?.() || Date.now().toString(),
        time: Date.now() / 1000,
        width: 4,
        color: "rgba(0, 200, 255, 0.8)",
        points: [point],
      }
 
      // Begin the path for live drawing
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext("2d")
        const { width, height } = getLogicalSize()
        if (ctx) {
          ctx.lineJoin = "round"
          ctx.lineCap = "round"
          ctx.strokeStyle = "rgba(0, 200, 255, 0.8)"
          ctx.lineWidth = 4
          ctx.beginPath()
          ctx.moveTo(point.x * width, point.y * height)
        }
      }
    },
    [isDrawMode, getNormalizedPoint, getLogicalSize]
  )
 
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!drawingRef.current || !currentStrokeRef.current || !canvasRef.current) return
      e.preventDefault()
 
      const point = getNormalizedPoint(e.clientX, e.clientY)
      currentStrokeRef.current.points.push(point)
 
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      const { width, height } = getLogicalSize()
      if (ctx) {
        ctx.lineTo(point.x * width, point.y * height)
        ctx.stroke()
      }
    },
    [getNormalizedPoint, getLogicalSize]
  )
 
  const handlePointerUp = useCallback(() => {
    if (!drawingRef.current || !currentStrokeRef.current) return
    drawingRef.current = false
    onStrokeCreated(currentStrokeRef.current)
    currentStrokeRef.current = null
  }, [onStrokeCreated])
 
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full touch-none"
      style={{
        cursor: isDrawMode ? "crosshair" : "default",
        pointerEvents: isDrawMode ? "auto" : "none",
        zIndex: 40,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
    />
  )
}
 