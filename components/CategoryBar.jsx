"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Client from "@/lib/api"

const slugify = str =>
  str
    ?.toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-") || ""

export default function CategoryBar({ refreshTrigger }) {
  const pathname = usePathname()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const currentCategoryFromPath =
    pathname?.startsWith("/products/") && pathname.split("/")[2] ? pathname.split("/")[2] : null
  const isProductsPage = pathname?.startsWith("/products")

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

  return (
    <div className="sticky top-[100px] md:top-[80px] left-0 right-0 z-40 bg-black border-t border-gray-800 shadow-sm">
      <div className="max-w-screen-xl mx-auto flex items-center py-2 px-2 relative">
        {loading ? (
          <p className="text-gray-400 text-sm py-1">Loading categories...</p>
        ) : (
          <>
            {/* 🧷 Fixed “All Products” on the left */}
            <div className="flex-shrink-0 sticky left-0 z-10 bg-black pr-3">
              <Link
                href="/products"
                className={`whitespace-nowrap px-3 py-2 rounded-md text-sm sm:text-base transition-colors ${
                  isProductsPage && !currentCategoryFromPath
                    ? "text-yellow-500 font-semibold underline underline-offset-4"
                    : "text-white hover:text-yellow-500"
                }`}
              >
                All Products
              </Link>
            </div>

            {/* Scrollable categories */}
            <div className="flex-1 overflow-x-auto no-scrollbar">
              <div className="flex space-x-3 md:space-x-4">
                {categories.length ? (
                  categories.map(c => {
                    const catSlug = slugify(c.name)
                    const isActive = currentCategoryFromPath === catSlug
                    return (
                      <Link
                        key={c._id}
                        href={`/products/${catSlug}`}
                        className={`whitespace-nowrap px-3 py-2 rounded-md text-sm sm:text-base transition-colors ${
                          isActive
                            ? "text-yellow-500 font-semibold underline underline-offset-4"
                            : "text-white hover:text-yellow-500"
                        }`}
                      >
                        {c.name}
                      </Link>
                    )
                  })
                ) : (
                  <p className="text-gray-400 text-sm py-1">No categories found</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
