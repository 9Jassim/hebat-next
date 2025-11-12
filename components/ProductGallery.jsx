"use client"

import { useEffect, useRef, useCallback, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function ProductGallery({
  images = [],
  mainImage,
  setMainImage,
  user,
  handleRemoveImage,
  variantImage, // ✅ new
  variantName, // ✅ new
}) {
  const containerRef = useRef(null)
  const thumbsRef = useRef(null)
  const thumbRefs = useRef([])
  const indexRef = useRef(0)

  // ✅ Combine normal images + variant image (if not already in gallery)
  const combinedImages = useMemo(() => {
    if (variantImage && !images.some(img => img.s3Url === variantImage)) {
      return [
        ...images,
        {
          s3Url: variantImage,
          s3Key: `variant-${variantName || "image"}`,
          name: variantName || "Variant",
          isVariant: true, // ✅ mark variant
        },
      ]
    }
    return images
  }, [images, variantImage, variantName])

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

  const goToNext = useCallback(() => {
    if (combinedImages.length < 2) return
    goToIndex(indexRef.current + 1)
  }, [combinedImages.length, goToIndex])

  const goToPrev = useCallback(() => {
    if (combinedImages.length < 2) return
    goToIndex(indexRef.current - 1)
  }, [combinedImages.length, goToIndex])

  // Swipe handling
  const startX = useRef(0)
  const dragging = useRef(false)
  const onPointerDown = e => {
    dragging.current = true
    startX.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0
  }
  const onPointerUp = e => {
    if (!dragging.current) return
    dragging.current = false
    const cx = e.clientX ?? e.changedTouches?.[0]?.clientX
    const diff = cx - startX.current
    if (Math.abs(diff) > 60 && combinedImages.length > 1) {
      diff < 0 ? goToNext() : goToPrev()
    }
  }

  // Ensure main image valid
  useEffect(() => {
    if (combinedImages.length > 0 && !combinedImages.find(img => img.s3Url === mainImage)) {
      setMainImage(combinedImages[0].s3Url)
    }
  }, [combinedImages, mainImage, setMainImage])

  // Auto-scroll active thumbnail
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
      {/* Main Image */}
      <div
        ref={containerRef}
        className="relative w-full rounded-2xl overflow-hidden shadow-md bg-white border border-gray-200"
        onMouseDown={onPointerDown}
        onMouseUp={onPointerUp}
        onTouchStart={onPointerDown}
        onTouchEnd={onPointerUp}
      >
        <img
          src={mainImage || "/hebat_product_fill.png"}
          alt="Product main image"
          draggable={false}
          onDragStart={e => e.preventDefault()}
          className="w-full h-[400px] object-contain bg-white p-2 pointer-events-none transition-opacity duration-300"
        />

        {combinedImages.length > 1 && (
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
      {combinedImages.length > 0 && (
        <div
          ref={thumbsRef}
          className="flex gap-3 mt-4 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent"
        >
          {combinedImages.map((img, index) => (
            <div
              key={img.s3Key || index}
              ref={el => (thumbRefs.current[index] = el)}
              className={`relative flex-shrink-0 bg-white border ${
                img.isVariant ? "border-yellow-500" : "border-gray-300"
              } rounded-xl p-1 shadow-sm transition-all duration-200`}
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

              {/* ✅ Only show remove for non-variant images */}
              {user && !img.isVariant && (
                <button
                  type="button"
                  onClick={() => handleRemoveImage(img.s3Key)}
                  className="absolute top-1 right-1 bg-black/70 text-white text-xs rounded-full p-1.5 hover:bg-red-600 shadow-md"
                  title="Remove image"
                >
                  ✕
                </button>
              )}

              {/* Optional: small label for variant */}
              {img.isVariant && (
                <span className="absolute bottom-1 left-1 text-[10px] text-yellow-700 font-medium bg-white/80 px-1 rounded">
                  Variant
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
