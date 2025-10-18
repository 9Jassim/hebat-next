"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Client from "@/lib/api"

// Helper to slugify category names
function slugify(name = "") {
  return name
    .toLowerCase()
    .replace(/&/g, "and") // replace "&" with "and"
    .replace(/[^a-z0-9\s-]/g, "") // remove special chars
    .trim()
    .replace(/\s+/g, "-") // replace spaces with dashes
}

export default function CategoryBar({ refreshTrigger }) {
  const pathname = usePathname() // e.g. /products/sports-and-outdoors
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const fetchCategories = async () => {
      try {
        const res = await Client.get("/products/category", { withCredentials: true })
        if (active) setCategories(res.data.categories || [])
      } catch (err) {
        console.error("❌ Categories fetch error:", err)
      } finally {
        if (active) setLoading(false)
      }
    }
    fetchCategories()
    const t = setTimeout(fetchCategories, 1500)
    return () => {
      active = false
      clearTimeout(t)
    }
  }, [refreshTrigger])

  // Extract current category slug from the path
  const activeCategory = pathname.split("/")[2] || ""

  return (
    <div className="fixed top-[72px] left-0 right-0 z-40 bg-black border-t border-gray-800 shadow-sm overflow-x-auto no-scrollbar">
      <div className="max-w-screen-xl mx-auto px-2 flex items-center space-x-3 md:space-x-4 py-2">
        {loading ? (
          <p className="text-gray-400 text-sm py-3">Loading categories...</p>
        ) : categories.length ? (
          <>
            {/* All Products link */}
            <Link
              href="/products"
              className={`whitespace-nowrap px-3 py-2 rounded-md transition-colors duration-200 text-sm sm:text-base ${
                pathname === "/products"
                  ? "text-yellow-500 font-semibold underline underline-offset-4"
                  : "text-white hover:text-yellow-500"
              }`}
            >
              All Products
            </Link>

            {/* Dynamic category links */}
            {categories.map(c => {
              const slug = slugify(c.name)
              const isActive = activeCategory === slug

              return (
                <Link
                  key={c._id}
                  href={`/products/${slug}`}
                  className={`whitespace-nowrap px-3 py-2 rounded-md transition-colors duration-200 text-sm sm:text-base ${
                    isActive
                      ? "text-yellow-500 font-semibold underline underline-offset-4"
                      : "text-white hover:text-yellow-500"
                  }`}
                >
                  {c.name}
                </Link>
              )
            })}
          </>
        ) : (
          <p className="text-gray-400 text-sm py-3">No categories available</p>
        )}
      </div>
    </div>
  )
}
