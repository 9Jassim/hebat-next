"use client"

import { useEffect, useRef } from "react"

/**
 * Aurora gradient mesh — soft morphing clouds of gold / amber light drifting
 * over the dark hero. No hard shapes; additive blending gives a warm
 * "showroom lighting" glow. Near-zero cost, fills its positioned parent.
 */
export default function ProductsHeroAurora({ variant = "full" }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const parent = canvas.parentElement

    let W = 0
    let H = 0
    let DPR = 1
    let raf = 0

    const size = () => {
      DPR = Math.min(window.devicePixelRatio || 1, 2)
      W = parent.clientWidth
      H = parent.clientHeight
      canvas.width = Math.max(1, Math.floor(W * DPR))
      canvas.height = Math.max(1, Math.floor(H * DPR))
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    }
    size()

    const tones = [
      [252, 187, 23], // gold
      [224, 160, 0], // deep gold
      [255, 214, 120], // warm light
      [186, 120, 0], // amber
    ]
    const COUNT = variant === "compact" ? 4 : 6
    const blobs = []
    for (let i = 0; i < COUNT; i++) {
      blobs.push({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.00022,
        vy: (Math.random() - 0.5) * 0.00022,
        r: 0.32 + Math.random() * 0.3,
        tone: tones[i % tones.length],
        a: 0.1 + Math.random() * 0.12,
        ph: Math.random() * Math.PI * 2,
      })
    }

    let t = 0
    const draw = () => {
      t += 1
      ctx.clearRect(0, 0, W, H)
      ctx.globalCompositeOperation = "lighter"
      const base = Math.max(W, H)
      for (const b of blobs) {
        if (!reduce) {
          b.x += b.vx
          b.y += b.vy
          if (b.x < -0.1 || b.x > 1.1) b.vx *= -1
          if (b.y < -0.1 || b.y > 1.1) b.vy *= -1
        }
        const pulse = 1 + Math.sin(t * 0.006 + b.ph) * 0.12
        const cx = b.x * W
        const cy = b.y * H
        const rad = b.r * base * pulse
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad)
        const [r, gr, bl] = b.tone
        g.addColorStop(0, `rgba(${r},${gr},${bl},${b.a})`)
        g.addColorStop(0.5, `rgba(${r},${gr},${bl},${b.a * 0.35})`)
        g.addColorStop(1, `rgba(${r},${gr},${bl},0)`)
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(cx, cy, rad, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalCompositeOperation = "source-over"
      raf = window.requestAnimationFrame(draw)
    }
    draw()

    const onResize = () => size()
    window.addEventListener("resize", onResize)
    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
    }
  }, [variant])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full block pointer-events-none"
    />
  )
}
