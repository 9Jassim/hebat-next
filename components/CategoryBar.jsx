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

// 🔍 Find active category OR parent if subcategory
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

  // 📦 Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await Client.get("/products/category")
      setCategories(buildCategoryTree(res.data.categories || []))
    }

    fetchCategories()
  }, [refreshTrigger])

  // ❌ Close dropdown when clicking outside
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

  const isMobile = () => window.innerWidth < 768

  // 📍 Get current slug from URL (works for both /products/x and /ar/products/x)
  const basePath = isAr ? "/ar/products" : "/products"
  const isProductsPage = pathname === basePath
  const pathParts = pathname.split("/")
  const currentSlug = isAr
    ? pathParts[3] || null   // /ar/products/[slug]
    : pathParts[2] || null   // /products/[slug]

  // 🎯 Get active category based on route
  const activeFromRoute = findActiveCategory(categories, currentSlug)

  // 🚀 Auto scroll active item into view
  useEffect(() => {
    const el = document.querySelector("[data-active='true']")
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      })
    }
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
    if (!isMobile()) {
      setActiveCategory(cat.children.length ? cat : null)
    }
  }

  const handleMouseLeave = () => {
    if (!isMobile()) {
      setActiveCategory(null)
    }
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
      className="sticky top-[100px] md:top-[80px] z-40 bg-black border-t border-gray-800"
    >
      <div className="max-w-screen-xl mx-auto relative" onMouseLeave={handleMouseLeave}>
        {/* ✅ Scrollable Category Bar */}
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto no-scrollbar px-2 py-2 gap-4"
          >
            {/* All */}
            <Link
              href={p("/products")}
              data-active={isProductsPage}
              onClick={() => setActiveCategory(null)}
              onMouseEnter={() => { if (!isMobile()) setActiveCategory(null) }}
              className={`px-3 py-2 whitespace-nowrap border-b-2 ${
                isProductsPage ? "text-yellow-500 border-yellow-500" : "text-white border-transparent"
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
                  className={`px-3 py-2 whitespace-nowrap border-b-2 transition ${
                    isActive
                      ? "text-yellow-500 border-yellow-500"
                      : "text-white border-transparent hover:text-yellow-500"
                  }`}
                >
                  {displayName}
                </Link>
              )
            })}
          </div>

          {/* Gradient fade */}
          {showFade && (
            <div className="pointer-events-none absolute end-0 top-0 h-full w-10 ltr:bg-gradient-to-l rtl:bg-gradient-to-r from-black to-transparent transition-opacity duration-200" />
          )}
        </div>

        {/* Dropdown */}
        {activeCategory && activeCategory.children.length > 0 && (
          <div className="absolute top-full start-0 w-full bg-black border-t border-gray-800 shadow-lg">
            <div className="max-w-screen-xl mx-auto py-3 px-2">
              {activeCategory.children.map(sub => (
                <Link
                  key={sub._id}
                  href={p(`/products/${slugify(sub.name)}`)}
                  className="block px-3 py-2 text-gray-300 hover:text-yellow-500"
                  onClick={() => setActiveCategory(null)}
                >
                  {isAr && sub.name_ar ? sub.name_ar : sub.name}
                </Link>
              ))}

              <Link
                href={p(`/products/${slugify(activeCategory.name)}`)}
                className="block px-3 py-2 text-white hover:text-yellow-500 mt-2"
                onClick={() => setActiveCategory(null)}
              >
                {t("viewAll")}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
