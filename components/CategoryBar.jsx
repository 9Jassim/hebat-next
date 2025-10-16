"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Client from "@/lib/api"

export default function CategoryBar({ refreshTrigger }) {
  const searchParams = useSearchParams()
  const activeCategory = decodeURIComponent(searchParams.get("category") || "")
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

  return (
    <div className="fixed top-[72px] left-0 right-0 z-40 bg-black border-t border-gray-800 shadow-sm overflow-x-auto no-scrollbar">
      <div className="max-w-screen-xl mx-auto px-2 flex items-center space-x-3 md:space-x-4 py-2">
        {loading ? (
          <p className="text-gray-400 text-sm py-3">Loading categories...</p>
        ) : categories.length ? (
          categories.map(c => {
            const isActive = activeCategory === c.name
            return (
              <Link
                key={c._id}
                href={`/products?category=${encodeURIComponent(c.name)}`}
                className={`whitespace-nowrap px-3 py-2 rounded-md transition-colors duration-200 text-sm sm:text-base ${
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
          <p className="text-gray-400 text-sm py-3">No categories available</p>
        )}
      </div>
    </div>
  )
}
