"use client"

import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { usePathname } from "next/navigation"
import Client from "@/lib/api"
import { useLanguage } from "@/context/LanguageContext"

const slugify = str =>
  str
    ?.toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-") || ""

const buildCategoryTree = categories => {
  const map = {}
  const roots = []

  categories.forEach(cat => {
    map[cat._id] = { ...cat, children: [] }
  })
  categories.forEach(cat => {
    if (cat.parent) {
      const parentId = cat.parent?._id || cat.parent
      map[parentId]?.children.push(map[cat._id])
    } else {
      roots.push(map[cat._id])
    }
  })

  return roots
}

const findActiveCategory = (categories, slug) => {
  for (const cat of categories) {
    if (slugify(cat.name) === slug) return cat
    const foundChild = cat.children.find(child => slugify(child.name) === slug)
    if (foundChild) return cat
  }
  return null
}

export default function CategoryBar({ refreshTrigger }) {
  const { isAr, p, t } = useLanguage()
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const scrollRef = useRef(null)
  const [showFade, setShowFade] = useState(true)

  const navRef = useRef(null)
  const pathname = usePathname()

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await Client.get("/products/category")
      setCategories(buildCategoryTree(res.data.categories || []))
    }
    fetchCategories()
  }, [refreshTrigger])

  useEffect(() => {
    const handleOutsideClick = e => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveCategory(null)
      }
    }
    document.addEventListener("mousedown", handleOutsideClick)
    document.addEventListener("touchstart", handleOutsideClick)
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
      document.removeEventListener("touchstart", handleOutsideClick)
    }
  }, [])

  // Reset active category on scroll so stale state doesn't cause double-tap bug
  useEffect(() => {
    const reset = () => setActiveCategory(null)
    document.addEventListener("scroll", reset, { passive: true, capture: true })
    return () => document.removeEventListener("scroll", reset, { capture: true })
  }, [])

  const isMobile = () => window.innerWidth < 768

  const basePath = isAr ? "/ar/products" : "/products"
  const isProductsPage = pathname === basePath
  const pathParts = pathname.split("/")
  const currentSlug = isAr ? pathParts[3] || null : pathParts[2] || null

  const activeFromRoute = findActiveCategory(categories, currentSlug)

  useEffect(() => {
    const el = document.querySelector("[data-active='true']")
    if (el) el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
  }, [activeFromRoute])

  useEffect(() => {
    handleScroll()
  }, [categories])

  const handleClick = (e, cat) => {
    const hasChildren = cat.children.length > 0
    if (isMobile() && hasChildren) {
      e.preventDefault()
      setActiveCategory(activeCategory?._id === cat._id ? null : cat)
    } else {
      setActiveCategory(cat)
    }
  }

  const handleMouseEnter = cat => {
    if (!isMobile()) setActiveCategory(cat.children.length ? cat : null)
  }

  const handleMouseLeave = () => {
    if (!isMobile()) setActiveCategory(null)
  }

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 5
    setShowFade(!isAtEnd)
  }

  return (
    <div
      ref={navRef}
      className="bg-[#111111]"
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="max-w-screen-xl mx-auto relative" onMouseLeave={handleMouseLeave}>
        {/* Horizontal scrollable category strip */}
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto no-scrollbar px-3 py-2 gap-1"
          >
            {/* All */}
            <Link
              href={p("/products")}
              data-active={isProductsPage}
              onClick={() => setActiveCategory(null)}
              onMouseEnter={() => {
                if (!isMobile()) setActiveCategory(null)
              }}
              className={`px-3.5 py-1.5 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-200 ${
                isProductsPage
                  ? "bg-yellow-500 text-black"
                  : "text-gray-400 hover:text-white hover:bg-white/8"
              }`}
            >
              {t("all")}
            </Link>

            {/* Categories */}
            {categories.map(cat => {
              const slug = slugify(cat.name)
              const isActive = activeFromRoute?._id === cat._id
              const displayName = isAr && cat.name_ar ? cat.name_ar : cat.name

              return (
                <Link
                  key={cat._id}
                  href={p(`/products/${slug}`)}
                  data-active={isActive}
                  onClick={e => handleClick(e, cat)}
                  onMouseEnter={() => handleMouseEnter(cat)}
                  className={`px-3.5 py-1.5 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                    isActive
                      ? "bg-yellow-500 text-black"
                      : "text-gray-400 hover:text-white hover:bg-white/8"
                  }`}
                >
                  {displayName}
                  {cat.children.length > 0 && (
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-60"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Fade gradient */}
          {showFade && (
            <div className="pointer-events-none absolute end-0 top-0 h-full w-12 ltr:bg-gradient-to-l rtl:bg-gradient-to-r from-[#111111] to-transparent" />
          )}
        </div>

        {/* Subcategory dropdown — vertical list */}
        {activeCategory && activeCategory.children.length > 0 && (
          <div
            className="absolute top-full start-0 w-full z-50"
            style={{
              background: "#151515",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            <div className="flex flex-col py-2 max-w-screen-xl mx-auto">
              {activeCategory.children.map(sub => (
                <Link
                  key={sub._id}
                  href={p(`/products/${slugify(sub.name)}`)}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors duration-150"
                  onClick={() => setActiveCategory(null)}
                >
                  {isAr && sub.name_ar ? sub.name_ar : sub.name}
                </Link>
              ))}

              <div className="mx-3 my-1 border-t border-[#2a2a2a]" />

              <Link
                href={p(`/products/${slugify(activeCategory.name)}`)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/8 transition-all duration-150 font-medium"
                onClick={() => setActiveCategory(null)}
              >
                {t("viewAll")}
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="rtl:rotate-180"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
