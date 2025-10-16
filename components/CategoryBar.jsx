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
    <div className="bg-black border-t border-gray-800">
      <div className="max-w-screen-xl mx-auto px-4 flex flex-wrap justify-center md:justify-start">
        {loading ? (
          <p className="text-gray-400 text-sm py-3">Loading categories...</p>
        ) : categories.length ? (
          categories.map(c => {
            const isActive = activeCategory === c.name
            return (
              <Link
                key={c._id}
                href={`/products?category=${encodeURIComponent(c.name)}`}
                className={`block py-3 px-4 ${
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
