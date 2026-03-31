"use client"

import { useEffect, useRef, useCallback } from "react"
import type { VideoStroke } from "./video-player"

interface YoutubeDrawOverlayProps {
  isDrawMode: boolean
  strokes: VideoStroke[]
  onStrokeCreated: (stroke: VideoStroke) => void
  onClearDrawings: () => void
}

export function YoutubeDrawOverlay({
  isDrawMode,
  strokes,
  onStrokeCreated,
  onClearDrawings,
}: YoutubeDrawOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawingRef = useRef(false)
  const currentStrokeRef = useRef<VideoStroke | null>(null)

  const getNormalizedPoint = useCallback((clientX: number, clientY: number): {x: number; y: number} => {
    const canvas = canvasRef.current
    if (!canvas) return {x: 0, y: 0}
    const rect = canvas.getBoundingClientRect()
    return {
      x: Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (clientY - rect.top) / rect.height))
    }
  }, [])

  const resizeCanvas = useCallback((canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = rect.width + 'px'
    canvas.style.height = rect.height + 'px'
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.scale(dpr, dpr)
  }, [])

  const drawStroke = useCallback((ctx: CanvasRenderingContext2D, stroke: VideoStroke) => {
    if (!stroke.points.length) return
    ctx.save()
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.strokeStyle = stroke.color
    ctx.lineWidth = stroke.width

    const [first, ...rest] = stroke.points
    ctx.beginPath()
      ctx.moveTo(first.x * Number(ctx.canvas.width / ctx.scale!), first.y * Number(ctx.canvas.height / ctx.scale!))
      rest.forEach(pt => ctx.lineTo(pt.x * Number(ctx.canvas.width / ctx.scale!), pt.y * Number(ctx.canvas.height / ctx.scale!)))
    ctx.stroke()
    ctx.restore()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleResize = () => {
      resizeCanvas(canvas)
    }
    window.addEventListener('resize', handleResize)
    resizeCanvas(canvas)

    return () => window.removeEventListener('resize', handleResize)
  }, [resizeCanvas])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!isDrawMode) return
    e.preventDefault()
    drawingRef.current = true
    canvasRef.current?.setPointerCapture(e.pointerId)

    const point = getNormalizedPoint(e.clientX, e.clientY)
    currentStrokeRef.current = {
      id: crypto.randomUUID?.() || Date.now().toString(),
      time: Date.now() / 1000, // fake time
      width: 4,
      color: 'rgba(0, 200, 255, 0.8)',
      points: [point]
    }
  }, [isDrawMode, getNormalizedPoint])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!drawingRef.current || !currentStrokeRef.current || !canvasRef.current) return
    e.preventDefault()

    const point = getNormalizedPoint(e.clientX, e.clientY)
    const stroke = currentStrokeRef.current
    const lastPoint = stroke.points[stroke.points.length - 1]
    
    stroke.points.push(point)
    
    const ctx = canvasRef.current.getContext('2d')
    if (ctx) {
      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'
      ctx.strokeStyle = stroke.color
      ctx.lineWidth = stroke.width
    ctx.lineTo(point.x * (canvasRef.current!.width / Number(ctx.scale!)), point.y * (canvasRef.current!.height / Number(ctx.scale!)))
      ctx.stroke()
    }
  }, [getNormalizedPoint])

  const handlePointerUp = useCallback(() => {
    if (!drawingRef.current || !currentStrokeRef.current || !onStrokeCreated) return
    drawingRef.current = false
    onStrokeCreated(currentStrokeRef.current)
    currentStrokeRef.current = null
  }, [onStrokeCreated])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const redraw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      strokes.forEach(stroke => drawStroke(ctx, stroke))
    }

    redraw()

    // Redraw on every frame (sync with YT player timing)
    const rafId = requestAnimationFrame(redraw)
    return () => cancelAnimationFrame(rafId)
  }, [strokes, drawStroke])

  const handleClear = useCallback(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    onClearDrawings()
  }, [onClearDrawings])

  if (!isDrawMode) return null

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto z-40 touch-none"
      style={{ cursor: 'crosshair' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
    />
  )
}
