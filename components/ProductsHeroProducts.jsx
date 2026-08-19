"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Floating product tiles — a drifting cloud of small product thumbnails at
 * varying depth, with mouse parallax, teasing the catalog behind the hero
 * headline. Tiles are weighted toward the trailing edge (mirrored in RTL) so
 * the headline stays readable, and the count scales with viewport width so
 * wide screens don't feel empty.
 */

// Ordered scatter: the first entries are the "core" cluster; later ones fill
// out toward the edges as the tile count grows on wider screens.
// Each entry: [left%, top%, depth]  (depth 0..1 → size / opacity / parallax)
const SPOTS = [
  [0.58, 0.22, 1.0],
  [0.82, 0.52, 0.85],
  [0.9, 0.2, 0.6],
  [0.68, 0.78, 0.68],
  [0.5, 0.8, 0.4],
  [0.95, 0.74, 0.45],
  [0.44, 0.34, 0.52],
  [0.75, 0.36, 0.5],
  [0.98, 0.44, 0.7],
  [0.62, 0.56, 0.34],
  [0.88, 0.85, 0.32],
  [0.72, 0.13, 0.5],
  [0.55, 0.46, 0.26],
  [0.99, 0.14, 0.42],
  [0.84, 0.28, 0.9],
  [0.66, 0.42, 0.3],
  [0.93, 0.62, 0.5],
  [0.48, 0.6, 0.3],
]

function tileCount(variant, w) {
  let n
  if (w < 640) n = 4
  else if (w < 1024) n = 6
  else if (w < 1440) n = 9
  else if (w < 1920) n = 12
  else n = 16
  // The compact hero band is shorter — trim the largest counts a touch
  if (variant === "compact" && n > 11) n = 11
  return n
}

export default function ProductsHeroProducts({ images = [], variant = "full", mirror = false }) {
  const wrapRef = useRef(null)
  const [vw, setVw] = useState(() => (typeof window !== "undefined" ? window.innerWidth : 1280))

  // Track viewport width (rAF-debounced) to scale the tile count
  useEffect(() => {
    let raf = 0
    const onResize = () => {
      window.cancelAnimationFrame(raf)
      raf = window.requestAnimationFrame(() => setVw(window.innerWidth))
    }
    onResize()
    window.addEventListener("resize", onResize)
    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  const pool = images.filter(Boolean)
  const N = Math.min(tileCount(variant, vw), SPOTS.length, pool.length)

  // Drift + mouse parallax
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const tiles = Array.from(wrap.children)
    if (!tiles.length) return

    const items = tiles.map(el => ({
      el,
      d: parseFloat(el.dataset.depth),
      amp: parseFloat(el.dataset.amp),
      spd: parseFloat(el.dataset.spd),
      ph: parseFloat(el.dataset.ph),
    }))

    let mx = 0
    let my = 0
    let tmx = 0
    let tmy = 0
    const onMove = e => {
      const r = wrap.getBoundingClientRect()
      if (e.clientY > r.bottom || e.clientY < r.top) return
      tmx = e.clientX / window.innerWidth - 0.5
      tmy = (e.clientY - r.top) / r.height - 0.5
    }
    window.addEventListener("pointermove", onMove, { passive: true })

    let raf = 0
    let t = 0
    const frame = () => {
      t += 1
      mx += (tmx - mx) * 0.05
      my += (tmy - my) * 0.05
      for (const it of items) {
        const floatY = reduce ? 0 : Math.sin(t * it.spd + it.ph) * it.amp
        const px = mx * (1 - it.d) * 46
        const py = my * (1 - it.d) * 46 + floatY
        it.el.style.transform = `translate3d(${px}px, ${py}px, 0) scale(${0.55 + it.d * 0.65})`
      }
      raf = window.requestAnimationFrame(frame)
    }
    frame()

    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener("pointermove", onMove)
    }
  }, [images, variant, vw, mirror])

  if (pool.length === 0 || N === 0) return null

  const size = variant === "compact" ? 72 : vw >= 1920 ? 128 : 116
  // The compact hero band is short — keep tiles in the upper portion so they
  // don't reach (and flicker at) the bottom fade / seam.
  const topScale = variant === "compact" ? 0.55 : 1

  return (
    <div ref={wrapRef} aria-hidden="true" className="absolute inset-0 pointer-events-none">
      {Array.from({ length: N }).map((_, i) => {
        const [left, top, depth] = SPOTS[i]
        return (
          <div
            key={i}
            data-depth={depth}
            data-amp={6 + (1 - depth) * 12}
            data-spd={0.006 + (i % 5) * 0.0016}
            data-ph={i * 1.3}
            className="absolute will-change-transform"
            style={{
              [mirror ? "right" : "left"]: `${left * 100}%`,
              top: `${top * topScale * 100}%`,
              width: size,
              height: size,
              opacity: 0.28 + depth * 0.62,
              filter: depth < 0.5 ? "blur(1.5px)" : "none",
            }}
          >
            <div className="w-full h-full rounded-2xl bg-white border border-white/10 shadow-2xl shadow-black/50 p-2.5 flex items-center justify-center">
              <img
                src={pool[i % pool.length]}
                alt=""
                loading="lazy"
                decoding="async"
                draggable="false"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
