"use client"

import { useRef } from "react"
import Link from "next/link"

/**
 * A single product card: perspective tilt toward the pointer, a shine sweep,
 * image zoom on hover and a gold accent bar. `isNew` cards get a staggered
 * entrance animation the first time they mount (used with infinite scroll so
 * already-seen cards don't re-animate).
 */
export default function ProductCard({ product, href, catLabel, productName, isNew, index = 0, t }) {
  const cardRef = useRef(null)

  const onMove = e => {
    const el = cardRef.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(820px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg) translateY(-4px)`
  }
  const onLeave = () => {
    const el = cardRef.current
    if (el) el.style.transform = ""
  }

  return (
    <div
      className={`h-full ${isNew ? "product-card-enter" : ""}`}
      style={isNew ? { animationDelay: `${(index % 5) * 0.06}s` } : undefined}
    >
      <Link href={href} className="group block h-full" prefetch={false}>
        <div
          ref={cardRef}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          className="relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700/50 shadow-sm hover:shadow-xl hover:border-yellow-300 dark:hover:border-yellow-500/50 transition-[box-shadow,border-color,transform] duration-300 flex flex-col h-full [transform-style:preserve-3d] will-change-transform"
        >
          {/* Image */}
          <div className="p-3 flex-shrink-0 h-44 sm:h-48 md:h-52">
            <div className="relative w-full h-full rounded-xl border border-gray-200 dark:border-gray-700/50 bg-white overflow-hidden shadow-sm flex items-center justify-center">
              <img
                src={product.images?.[0]?.s3Url || "/hebat_product_fill.png"}
                alt={productName}
                loading="lazy"
                decoding="async"
                draggable="false"
                className="object-contain w-full h-full [transform:translateZ(28px)] transition-transform duration-500 ease-out group-hover:scale-110"
              />

              {/* Shine sweep */}
              <span className="pointer-events-none absolute inset-0 -translate-x-[130%] group-hover:translate-x-[130%] transition-transform duration-[850ms] ease-out bg-gradient-to-r from-transparent via-white/50 to-transparent mix-blend-overlay" />

              {/* Category badge */}
              {catLabel && (
                <span className="absolute top-2 start-2 z-10 text-[10px] font-semibold bg-white/90 dark:bg-gray-900/80 backdrop-blur border border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-300 px-2 py-0.5 rounded-full shadow-sm">
                  {catLabel}
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="px-3 pb-4 flex flex-col gap-1 flex-grow">
            <h5 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-yellow-500 transition-colors duration-200">
              {productName}
            </h5>

            <div className="mt-auto pt-2 space-y-0.5">
              {product.model && (
                <p className="text-[11px] text-gray-400 truncate">
                  <span className="font-medium text-gray-500 dark:text-gray-400">
                    {t("model")}:
                  </span>{" "}
                  <span className="font-mono">{product.model}</span>
                </p>
              )}
              {product.barcode && (
                <p className="text-[11px] text-gray-400 truncate">
                  <span className="font-medium text-gray-500 dark:text-gray-400">
                    {t("barcode")}:
                  </span>{" "}
                  <span className="font-mono">{product.barcode}</span>
                </p>
              )}
            </div>
          </div>

          {/* Gold accent bar */}
          <div className="h-0.5 bg-yellow-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-start" />
        </div>
      </Link>
    </div>
  )
}
