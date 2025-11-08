"use client"

import { useEffect, useRef, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function ProductGallery({
  images = [],
  mainImage,
  setMainImage,
  user,
  handleRemoveImage,
}) {
  const containerRef = useRef(null)
  const thumbsRef = useRef(null)
  const thumbRefs = useRef([])

  const indexRef = useRef(0)
  useEffect(() => {
    const i = images.findIndex(img => img.s3Url === mainImage)
    indexRef.current = i >= 0 ? i : 0
  }, [images, mainImage])

  const goToIndex = useCallback(
    i => {
      if (!images.length) return
      const next = (i + images.length) % images.length
      indexRef.current = next
      setMainImage(images[next].s3Url)
    },
    [images, setMainImage]
  )

  const goToNext = useCallback(() => {
    if (images.length < 2) return
    goToIndex(indexRef.current + 1)
  }, [images.length, goToIndex])

  const goToPrev = useCallback(() => {
    if (images.length < 2) return
    goToIndex(indexRef.current - 1)
  }, [images.length, goToIndex])

  // ---- Swipe / Drag logic ----
  const startX = useRef(0)
  const dragging = useRef(false)

  const onPointerDown = e => {
    dragging.current = true
    startX.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0

    if (containerRef.current?.setPointerCapture && e.pointerId != null) {
      containerRef.current.setPointerCapture(e.pointerId)
    }
  }

  const onPointerMove = () => {
    if (!dragging.current) return
  }

  const onPointerUp = e => {
    if (!dragging.current) return
    dragging.current = false

    const cx = e.clientX ?? e.changedTouches?.[0]?.clientX
    if (cx == null) return

    const diff = cx - startX.current
    const threshold = 60

    if (Math.abs(diff) > threshold && images.length > 1) {
      if (diff < 0) goToNext()
      else goToPrev()
    }
  }

  // Ensure main image always valid
  useEffect(() => {
    if (images.length > 0 && !images.find(img => img.s3Url === mainImage)) {
      setMainImage(images[0].s3Url)
    }
  }, [images, mainImage, setMainImage])

  // Auto-scroll thumbnail into view when image changes
  useEffect(() => {
    const activeIndex = images.findIndex(img => img.s3Url === mainImage)
    if (activeIndex >= 0 && thumbRefs.current[activeIndex]) {
      thumbRefs.current[activeIndex].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      })
    }
  }, [mainImage, images])

  return (
    <div className="order-1 lg:order-2 select-none relative">
      {/* Main Image */}
      <div
        ref={containerRef}
        className="relative w-full rounded-2xl overflow-hidden shadow-md bg-white border border-gray-200"
        style={{ touchAction: "pan-y" }} // ✅ allow vertical scroll, handle horizontal swipe
        onMouseDown={onPointerDown}
        onMouseMove={onPointerMove}
        onMouseUp={onPointerUp}
        onTouchStart={onPointerDown}
        onTouchMove={onPointerMove}
        onTouchEnd={onPointerUp}
      >
        <img
          src={mainImage || "/hebat_product_fill.png"}
          alt="Product main image"
          draggable={false}
          onDragStart={e => e.preventDefault()}
          className="w-full h-[400px] object-contain bg-white p-2 pointer-events-none transition-opacity duration-300"
        />

        {/* Arrows */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={goToPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition"
              title="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition"
              title="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 0 && (
        <div
          ref={thumbsRef}
          className="flex gap-3 mt-4 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent"
        >
          {images.map((img, index) => (
            <div
              key={img.s3Key}
              ref={el => (thumbRefs.current[index] = el)}
              className="relative flex-shrink-0 bg-white border border-gray-300 rounded-xl p-1 shadow-sm transition-all duration-200"
              style={{ minWidth: "88px" }}
            >
              <img
                src={img.s3Url}
                alt={img.name}
                draggable={false}
                onDragStart={e => e.preventDefault()}
                onClick={() => goToIndex(index)}
                className={`w-20 h-20 rounded-lg object-contain cursor-pointer ${
                  mainImage === img.s3Url ? "ring-2 ring-yellow-500" : ""
                }`}
              />

              {user && (
                <button
                  type="button"
                  onClick={() => handleRemoveImage(img.s3Key)}
                  className="absolute top-1 right-1 bg-black/70 text-white text-xs rounded-full p-1.5 hover:bg-red-600 shadow-md"
                  title="Remove image"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
