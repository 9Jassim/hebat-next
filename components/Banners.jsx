"use client"

import { useEffect, useState, useRef } from "react"
import Client from "@/lib/api"
import { motion, useAnimation } from "framer-motion"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

const SWIPE_THRESHOLD = 50

// Module-level cache — survives component unmount/remount (page navigation)
let _cachedBanners = null
let _cachedRatios = []

export default function Banners({ images }) {
  const [banners, setBanners] = useState(_cachedBanners ?? [])
  const [ratios, setRatios] = useState(_cachedRatios)
  const [loaded, setLoaded] = useState(!!_cachedBanners)
  // index into the extended track: 0 = clone of last, 1..len = real slides, len+1 = clone of first
  const [index, setIndex] = useState(1)
  const [paused, setPaused] = useState(false)
  const controls = useAnimation()

  const dragStartX = useRef(null)
  const hasDragged = useRef(false)
  const indexRef = useRef(1)

  // Load banners (skip fetch if already cached)
  useEffect(() => {
    if (images?.length) {
      const mapped = images.map(url => ({ image: { s3Url: url }, path: "#" }))
      _cachedBanners = mapped
      setBanners(mapped)
      setLoaded(true)
    } else if (_cachedBanners) {
      setLoaded(true)
    } else {
      Client.get("/banner")
        .then(res => {
          const data = res.data.banners || []
          _cachedBanners = data
          setBanners(data)
        })
        .catch(err => console.error("❌ Failed to fetch banners:", err))
        .finally(() => setLoaded(true))
    }
  }, [images])

  const len = banners.length

  // Extended track: [clone-of-last, ...banners, clone-of-first]
  const slides = len ? [banners[len - 1], ...banners, banners[0]] : []

  // Map extended-track index → original banners index for ratios
  const toRatioIdx = i => {
    if (i === 0) return len - 1
    if (i === len + 1) return 0
    return i - 1
  }

  // Keep indexRef in sync so visibility handler always has the latest index
  useEffect(() => {
    indexRef.current = index
  }, [index])

  // Pause + re-sync when tab is hidden/shown to prevent animation jump on return
  useEffect(() => {
    if (!len) return
    const handleVisibility = () => {
      if (document.hidden) {
        setPaused(true)
      } else {
        // Stop any in-flight animation and snap to current position instantly
        controls.stop()
        const i = indexRef.current
        // If stuck on a clone, resolve to the real slide
        if (i === 0) {
          controls.set({ x: `-${len * 100}%` })
          setIndex(len)
        } else if (i === len + 1) {
          controls.set({ x: `-100%` })
          setIndex(1)
        } else {
          controls.set({ x: `-${i * 100}%` })
        }
        setPaused(false)
      }
    }
    document.addEventListener("visibilitychange", handleVisibility)
    return () => document.removeEventListener("visibilitychange", handleVisibility)
  }, [len, controls])

  // Auto-slide
  useEffect(() => {
    if (!len) return
    const t = setInterval(() => {
      if (!paused) setIndex(i => i + 1)
    }, 5000)
    return () => clearInterval(t)
  }, [len, paused])

  const next = () => setIndex(i => i + 1)
  const prev = () => setIndex(i => i - 1)

  // Animate to current index, then silently jump if we landed on a clone
  useEffect(() => {
    if (!len) return
    controls
      .start({
        x: `-${index * 100}%`,
        transition: { duration: 0.7, ease: "easeInOut" },
      })
      .then(() => {
        if (index === 0) {
          // landed on clone-of-last → jump to real last
          controls.set({ x: `-${len * 100}%` })
          setIndex(len)
        } else if (index === len + 1) {
          // landed on clone-of-first → jump to real first
          controls.set({ x: `-100%` })
          setIndex(1)
        }
      })
  }, [index, len, controls])

  // Capture natural aspect ratio per image (keyed to original banners array)
  const handleImgLoad = i => e => {
    const { naturalWidth, naturalHeight } = e.currentTarget
    if (!naturalWidth || !naturalHeight) return
    setRatios(prev => {
      const copy = [...prev]
      copy[i] = `${naturalWidth} / ${naturalHeight}`
      _cachedRatios = copy
      return copy
    })
  }

  // ── Pointer drag/swipe handlers ──
  const onPointerDown = e => {
    dragStartX.current = e.clientX
    hasDragged.current = false
    setPaused(true)
  }

  const onPointerMove = e => {
    if (dragStartX.current === null) return
    if (Math.abs(e.clientX - dragStartX.current) > 5) hasDragged.current = true
  }

  const onPointerUp = e => {
    if (dragStartX.current === null) return
    const delta = e.clientX - dragStartX.current
    if (Math.abs(delta) >= SWIPE_THRESHOLD) delta < 0 ? next() : prev()
    dragStartX.current = null
    setPaused(false)
  }

  const onPointerLeave = e => {
    if (dragStartX.current !== null) {
      const delta = e.clientX - dragStartX.current
      if (Math.abs(delta) >= SWIPE_THRESHOLD) delta < 0 ? next() : prev()
      dragStartX.current = null
    }
    setPaused(false)
  }

  const onClickCapture = e => {
    if (hasDragged.current) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const currentAspect = ratios[toRatioIdx(index)] || "16 / 9"

  // Still fetching — show skeleton
  if (!loaded)
    return (
      <div className="w-full rounded-3xl overflow-hidden shadow-2xl">
        <div style={{ aspectRatio: "16 / 9" }} className="bg-gray-100 animate-pulse w-full" />
      </div>
    )

  // Loaded but no banners — render nothing
  if (!len) return null

  // Banners exist but first ratio not yet known — preload images silently then show skeleton
  if (!ratios[0])
    return (
      <>
        <div className="hidden" aria-hidden="true">
          {banners.map((b, i) => (
            <img key={i} src={b.image?.s3Url} onLoad={handleImgLoad(i)} alt="" />
          ))}
        </div>
        <div className="w-full rounded-3xl overflow-hidden shadow-2xl">
          <div style={{ aspectRatio: "16 / 9" }} className="bg-gray-100 animate-pulse w-full" />
        </div>
      </>
    )

  return (
    <div
      className="relative w-full rounded-3xl shadow-2xl overflow-hidden select-none mx-auto
        max-h-[45vh] sm:max-h-[50vh] md:max-h-[55vh] lg:max-h-none cursor-grab active:cursor-grabbing"
      style={{ aspectRatio: currentAspect, touchAction: "pan-y" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={onPointerLeave}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onDragStart={e => e.preventDefault()}
      onClickCapture={onClickCapture}
    >
      {/* Extended track: clone-of-last + real slides + clone-of-first */}
      <motion.div
        className="flex w-full h-full"
        dir="ltr"
        animate={controls}
        initial={{ x: "-100%" }}
      >
        {slides.map((b, i) => (
          <div key={i} className="w-full h-full flex-shrink-0">
            <Link href={b.path || "#"} className="block w-full h-full">
              <img
                src={b.image?.s3Url}
                alt={`Banner ${i}`}
                onLoad={i >= 1 && i <= len ? handleImgLoad(i - 1) : undefined}
                draggable={false}
                className="w-full h-full object-contain bg-transparent"
                loading="eager"
                decoding="async"
              />
            </Link>
          </div>
        ))}
      </motion.div>

      {/* Arrows — only show when more than one banner */}
      {len > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2
              bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition"
            aria-label="Previous banner"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2
              bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition"
            aria-label="Next banner"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </>
      )}
    </div>
  )
}
