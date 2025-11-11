"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

export default function ProductVariants({ product }) {
  const [currentSlug, setCurrentSlug] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const parts = window.location.pathname.split("/")
      setCurrentSlug(parts[parts.length - 1])
    }
  }, [])

  if (!product?.variants) return null

  const baseImage = product?.images?.[0]?.s3Url || "/hebat_product_fill.png"

  const colors = product?.variants?.colors || []
  const models = product?.variants?.models || []

  const categorySlug =
    product?.categories?.[0]?.slug ||
    product?.categories?.[0]?.name?.toLowerCase().replace(/\s+/g, "-") ||
    "products"

  return (
    <div className="mt-6 space-y-6">
      {/* 🎨 Color Variants */}
      {colors.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Available Colors</h3>

          <div className="flex flex-wrap gap-4">
            {colors.map(variant => {
              const img = variant?.images?.[0]?.s3Url || baseImage || "/hebat_product_fill.png"
              const isActive = variant.slug === currentSlug

              return (
                <Link
                  key={variant.slug}
                  href={`/products/${categorySlug}/${variant.slug}`}
                  className="group flex flex-col items-center w-28"
                  prefetch={false}
                >
                  <div className="w-24 h-24">
                    <div
                      className={`relative w-full h-full rounded-xl bg-white border overflow-hidden shadow-sm flex items-center justify-center transition-colors duration-150
                        ${
                          isActive
                            ? "border-yellow-500 outline outline-2 outline-yellow-400 outline-offset-0"
                            : "border-gray-200 hover:border-yellow-300"
                        }`}
                    >
                      <img
                        src={img}
                        alt={variant.name}
                        loading="lazy"
                        decoding="async"
                        className="object-contain w-full h-full"
                        style={{
                          transformOrigin: "center center",
                          backfaceVisibility: "hidden",
                          WebkitFontSmoothing: "antialiased",
                          imageRendering: "high-quality",
                          filter: "brightness(1.02) contrast(1.04)",
                        }}
                      />
                      <div className="absolute inset-0 pointer-events-none rounded-xl transition-opacity duration-300 bg-gradient-to-b from-transparent to-black/5 opacity-0 group-hover:opacity-100"></div>
                    </div>
                  </div>

                  <span
                    className={`mt-2 text-sm font-semibold text-center tracking-wide transition-colors duration-150 ${
                      isActive ? "text-yellow-600" : "text-gray-700 group-hover:text-yellow-600"
                    }`}
                  >
                    {variant.name}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* 📱 Model Variants */}
      {models.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Compatible Models</h3>

          {/* ✅ Grid layout keeps alignment perfect */}
          <div className="grid gap-2 grid-cols-[repeat(auto-fill,minmax(9rem,1fr))]">
            {models.map(variant => {
              const isActive = variant.slug === currentSlug
              return (
                <Link
                  key={variant.slug}
                  href={`/products/${categorySlug}/${variant.slug}`}
                  className={`min-h-[3.5rem] flex items-center justify-center text-center rounded-md border text-sm font-medium px-3 py-2 whitespace-normal break-normal leading-normal transition-colors duration-150
    ${
      isActive
        ? "border-yellow-500 bg-yellow-100 text-yellow-700"
        : "border-gray-300 bg-gray-100 text-gray-800 hover:bg-yellow-100 hover:text-yellow-700"
    }`}
                >
                  {variant.name.replaceAll(",", ", ")}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
