"use client"

import { useEffect, useRef, useCallback, useMemo, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function ProductGallery({
  images = [],
  mainImage,
  setMainImage,
  user,
  handleRemoveImage,
  variantImage,
  variantName,
}) {
  const containerRef = useRef(null)
  const thumbsRef = useRef(null)
  const thumbRefs = useRef([])

  // ------------------------------
  // STATE: track loaded thumbnails
  // ------------------------------
  const [allThumbsLoaded, setAllThumbsLoaded] = useState(false)
  const [loadedCount, setLoadedCount] = useState(0)

  // ---------------------------------
  // Combine images with variant image
  // ---------------------------------
  const combinedImages = useMemo(() => {
    if (variantImage && !images.some(img => img.s3Url === variantImage)) {
      return [
        ...images,
        {
          s3Url: variantImage,
          s3Key: `variant-${variantName || "image"}`,
          name: variantName || "Variant",
          isVariant: true,
        },
      ]
    }
    return images
  }, [images, variantImage, variantName])

  const handleThumbLoaded = () => {
    setLoadedCount(prev => {
      const next = prev + 1
      if (next === combinedImages.length) {
        setAllThumbsLoaded(true)
      }
      return next
    })
  }

  // ------------------------------
  // Sync selected index
  // ------------------------------
  const indexRef = useRef(0)

  useEffect(() => {
    const i = combinedImages.findIndex(img => img.s3Url === mainImage)
    indexRef.current = i >= 0 ? i : 0
  }, [combinedImages, mainImage])

  const goToIndex = useCallback(
    i => {
      if (!combinedImages.length) return
      const next = (i + combinedImages.length) % combinedImages.length
      indexRef.current = next
      setMainImage(combinedImages[next].s3Url)
    },
    [combinedImages, setMainImage]
  )

  const goToNext = () => goToIndex(indexRef.current + 1)
  const goToPrev = () => goToIndex(indexRef.current - 1)

  // ------------------------------
  // Swipe + Momentum handling
  // ------------------------------
  const startX = useRef(0)
  const startY = useRef(0)
  const startTime = useRef(0)
  const dragging = useRef(false)

  const onPointerDown = e => {
    dragging.current = true
    startX.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0
    startY.current = e.clientY ?? e.touches?.[0]?.clientY ?? 0
    startTime.current = Date.now()
  }

  const onPointerUp = e => {
    if (!dragging.current) return
    dragging.current = false

    const cx = e.clientX ?? e.changedTouches?.[0]?.clientX
    const cy = e.clientY ?? e.changedTouches?.[0]?.clientY

    const diffX = cx - startX.current
    const diffY = cy - startY.current
    const duration = Date.now() - startTime.current

    const absX = Math.abs(diffX)
    const absY = Math.abs(diffY)

    // Only horizontal gestures
    if (absX > absY) {
      const velocity = absX / duration // px per ms

      // Momentum thresholds
      if (absX > 50 || velocity > 0.5) {
        if (diffX < 0) {
          goToNext()
        } else {
          goToPrev()
        }
      }
    }
  }

  // ------------------------------
  // Ensure valid main image
  // ------------------------------
  useEffect(() => {
    if (combinedImages.length > 0 && !combinedImages.find(img => img.s3Url === mainImage)) {
      setMainImage(combinedImages[0].s3Url)
    }
  }, [combinedImages, mainImage, setMainImage])

  // ------------------------------
  // Auto-scroll active thumbnail
  // ------------------------------
  useEffect(() => {
    const activeIndex = combinedImages.findIndex(img => img.s3Url === mainImage)
    if (activeIndex >= 0 && thumbRefs.current[activeIndex]) {
      thumbRefs.current[activeIndex].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      })
    }
  }, [mainImage, combinedImages])

  return (
    <div className="order-1 lg:order-2 select-none relative">
      {/* MAIN IMAGE */}

      <div
        ref={containerRef}
        className="relative w-full rounded-2xl overflow-hidden shadow-md bg-white border border-gray-200"
        onMouseDown={onPointerDown}
        onMouseUp={onPointerUp}
        onTouchStart={onPointerDown}
        onTouchEnd={onPointerUp}
        style={{
          height: "400px",
          touchAction: "pan-y", // ✅ allow vertical scroll
        }}
      >
        <img
          src={mainImage || "/hebat_product_fill.png"}
          alt="Product main image"
          draggable={false}
          decoding="async"
          loading="eager"
          onDragStart={e => e.preventDefault()}
          className="w-full h-full object-contain p-2 pointer-events-none select-none"
        />

        {combinedImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={goToPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* THUMBNAILS */}

      <div
        ref={thumbsRef}
        className={`
          flex gap-3 mt-4 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-gray-400
          transition-opacity duration-500
          ${allThumbsLoaded ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        style={{
          minHeight: "100px",
        }}
      >
        {combinedImages.map((img, index) => (
          <div
            key={img.s3Key || index}
            ref={el => (thumbRefs.current[index] = el)}
            className={`
              relative flex-shrink-0 rounded-xl overflow-hidden shadow-sm transition-all duration-200
              ${
                mainImage === img.s3Url
                  ? "border-[2px] border-yellow-500"
                  : "border border-gray-300"
              }
            `}
            style={{
              width: "86px",
              height: "86px",
              backgroundColor: "white",
            }}
          >
            <Image
              src={img.s3Url}
              alt={img.name}
              fill
              sizes="86px"
              onClick={() => goToIndex(index)}
              onLoadingComplete={handleThumbLoaded}
              className="object-contain cursor-pointer"
            />

            {user && !img.isVariant && (
              <button
                type="button"
                onClick={() => handleRemoveImage(img.s3Key)}
                className="absolute top-1 right-1 bg-black/70 text-white text-xs rounded-full p-1.5 hover:bg-red-600 shadow-md z-10"
              >
                ✕
              </button>
            )}

            {img.isVariant && (
              <span className="absolute bottom-1 left-1 text-[10px] text-yellow-700 font-medium bg-white/70 px-1 rounded z-10">
                Variant
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
