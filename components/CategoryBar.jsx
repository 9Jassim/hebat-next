"use client"

import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import Client from "@/lib/api"

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

export default function CategoryBar({ refreshTrigger }) {
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)

  const navRef = useRef(null)

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await Client.get("/products/category")
      setCategories(buildCategoryTree(res.data.categories || []))
    }

    fetchCategories()
  }, [refreshTrigger])

  // close when clicking outside
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

  const handleClick = (e, cat) => {
    const hasChildren = cat.children.length > 0

    if (isMobile() && hasChildren) {
      e.preventDefault()
      setActiveCategory(activeCategory?._id === cat._id ? null : cat)
    } else {
      setActiveCategory(null)
    }
  }

  const handleMouseEnter = cat => {
    if (!isMobile() && cat.children.length > 0) {
      setActiveCategory(cat)
    }
  }

  const handleMouseLeave = () => {
    if (!isMobile()) {
      setActiveCategory(null)
    }
  }

  return (
    <div
      ref={navRef}
      className="sticky top-[100px] md:top-[80px] z-40 bg-black border-t border-gray-800"
    >
      <div className="max-w-screen-xl mx-auto relative" onMouseLeave={handleMouseLeave}>
        <div className="flex items-center py-2 px-2">
          <Link href="/products" className="px-3 py-2 text-white hover:text-yellow-500">
            All Products
          </Link>

          <div className="flex space-x-4 ml-4 overflow-x-auto no-scrollbar">
            {categories.map(cat => {
              const slug = slugify(cat.name)
              const hasChildren = cat.children.length > 0

              return (
                <Link
                  key={cat._id}
                  href={`/products/${slug}`}
                  onClick={e => handleClick(e, cat)}
                  onMouseEnter={() => handleMouseEnter(cat)}
                  className="px-3 py-2 whitespace-nowrap text-white hover:text-yellow-500"
                >
                  {cat.name}
                </Link>
              )
            })}
          </div>
        </div>

        {activeCategory && activeCategory.children.length > 0 && (
          <div className="absolute top-full left-0 w-full bg-black border-t border-gray-800 shadow-lg">
            <div className="max-w-screen-xl mx-auto py-3 px-2">
              {activeCategory.children.map(sub => (
                <Link
                  key={sub._id}
                  href={`/products/${slugify(activeCategory.name)}?subcategory=${slugify(
                    sub.name
                  )}`}
                  className="block px-3 py-2 text-gray-300 hover:text-yellow-500"
                  onClick={() => setActiveCategory(null)}
                >
                  {sub.name}
                </Link>
              ))}

              <Link
                href={`/products/${slugify(activeCategory.name)}`}
                className="block px-3 py-2 text-white hover:text-yellow-500 mt-2"
                onClick={() => setActiveCategory(null)}
              >
                View All
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
