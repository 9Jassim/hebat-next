"use client"

import { useEffect, useState } from "react"
import Client from "@/lib/api"
import { motion, useAnimation } from "framer-motion"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function Banners({ images }) {
  const [banners, setBanners] = useState([])
  const [ratios, setRatios] = useState([]) // per-slide aspect ratios
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const controls = useAnimation()

  // Load banners
  useEffect(() => {
    if (images?.length) {
      setBanners(images.map(url => ({ image: { s3Url: url }, path: "#" })))
    } else {
      Client.get("/banner")
        .then(res => setBanners(res.data.banners || []))
        .catch(err => console.error("❌ Failed to fetch banners:", err))
    }
  }, [images])

  const len = banners.length

  // Auto-slide
  useEffect(() => {
    if (!len) return
    const t = setInterval(() => {
      if (!paused) next()
    }, 5000)
    return () => clearInterval(t)
  }, [len, paused])

  const next = () => setIndex(i => (i + 1) % len)
  const prev = () => setIndex(i => (i - 1 + len) % len)

  // Slide animation
  useEffect(() => {
    if (!len) return
    controls.start({
      x: `-${index * 100}%`,
      transition: { duration: 0.7, ease: "easeInOut" },
    })
  }, [index, len, controls])

  // Capture natural aspect ratio per image
  const handleImgLoad = i => e => {
    const { naturalWidth, naturalHeight } = e.currentTarget
    if (!naturalWidth || !naturalHeight) return
    setRatios(prev => {
      const copy = [...prev]
      copy[i] = `${naturalWidth} / ${naturalHeight}`
      return copy
    })
  }

  const currentAspect = ratios[index] || "16 / 9"

  if (!len)
    return (
      <div className="w-full rounded-3xl overflow-hidden shadow-2xl">
        <div style={{ aspectRatio: "16 / 9" }} className="bg-gray-100 w-full" />
      </div>
    )

  return (
    <div
      className="
    relative w-full rounded-3xl shadow-2xl overflow-hidden select-none
    mx-auto
    max-h-[45vh] sm:max-h-[50vh] md:max-h-[55vh] lg:max-h-none
  "
      style={{
        aspectRatio: currentAspect,
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Track (no height hacks; track takes container height) */}
      <motion.div className="flex w-full h-full" dir="ltr" animate={controls}>
        {banners.map((b, i) => (
          <div key={i} className="w-full h-full flex-shrink-0">
            <Link href={b.path || "#"} className="block w-full h-full">
              <img
                src={b.image?.s3Url}
                alt={`Banner ${i + 1}`}
                onLoad={handleImgLoad(i)}
                draggable={false}
                className="
                  w-full h-full
                  object-contain
                  transition-transform duration-700 ease-in-out
                  bg-transparent
                "
                loading="eager"
                decoding="async"
              />
            </Link>
          </div>
        ))}
      </motion.div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="
          absolute left-3 sm:left-4 top-1/2 -translate-y-1/2
          bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition
        "
        aria-label="Previous banner"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <button
        onClick={next}
        className="
          absolute right-3 sm:right-4 top-1/2 -translate-y-1/2
          bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition
        "
        aria-label="Next banner"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </div>
  )
}
