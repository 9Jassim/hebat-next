"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Client from "@/lib/api"

export default function Products() {
  const scrollRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [showing, setShowing] = useState([])
  const searchRef = useRef("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          Client.get("/products"),
          Client.get("/products/category"),
        ])
        setProducts(prodRes.data.products)
        setShowing(prodRes.data.products)
        setCategories(catRes.data.categories)
      } catch (err) {
        console.error("Error loading products:", err)
      }
    }
    fetchData()
  }, [])

  // --- Category Scroll Logic ---
  const handleStart = e => {
    const pageX = e.pageX || e.touches[0].pageX
    setIsDragging(true)
    setStartX(pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }
  const handleMove = e => {
    if (!isDragging) return
    const pageX = e.pageX || e.touches[0].pageX
    const x = pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 1.5
    scrollRef.current.scrollLeft = scrollLeft - walk
  }
  const handleEnd = () => setIsDragging(false)

  // --- Filtering & Search ---
  const filter = name => {
    const filtered = products.filter(p => p.category?.name === name)
    setShowing(filtered)
  }
  const resetFilter = () => setShowing(products)
  const handleSearch = () => {
    const query = searchRef.current.value.toLowerCase()
    if (!query) return setShowing(products)

    const result = products.filter(
      p =>
        p.name.toLowerCase().includes(query) ||
        p.barcode?.toLowerCase().includes(query) ||
        p.model?.toLowerCase().includes(query)
    )

    setShowing(result)
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
      {/* Search */}
      <div className="w-full max-w-lg mb-6">
        <input
          type="text"
          placeholder="Search product name, barcode, model..."
          ref={searchRef}
          onChange={handleSearch}
          className="w-full bg-gray-100 border border-yellow-500 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 p-2.5"
        />
      </div>

      {/* Category Scroll */}
      <div
        ref={scrollRef}
        className="flex space-x-3 overflow-x-auto scrollbar-hide w-full max-w-3xl px-2 pb-4 cursor-grab active:cursor-grabbing"
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      >
        <button
          onClick={resetFilter}
          className="flex-shrink-0 px-5 py-2.5 bg-yellow-500 text-black border border-yellow-400 rounded-full text-sm font-medium hover:bg-yellow-600 transition"
        >
          All categories
        </button>
        {categories.map(cat => (
          <button
            key={cat._id}
            onClick={() => filter(cat.name)}
            className="flex-shrink-0 px-5 py-2.5 bg-yellow-500 text-black border border-yellow-400 rounded-full text-sm font-medium hover:bg-yellow-600 transition"
          >
            {cat.name}
          </button>
        ))}
      </div>

      <p className="text-gray-600 mt-4 mb-6 text-sm">
        Showing {showing.length} product{showing.length !== 1 && "s"}
      </p>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full max-w-6xl">
        {showing.map(product => (
          <Link href={`/products/${product.slug}`} key={product.slug}>
            <div className="h-[300px] sm:h-[320px] md:h-[340px] border border-yellow-500 bg-yellow-500 rounded-lg overflow-hidden shadow hover:shadow-xl transform hover:scale-105 transition duration-300 flex flex-col">
              {/* Image */}
              {product.image?.s3Url ? (
                <div className="flex-shrink-0">
                  <img
                    src={product.image?.s3Url}
                    alt={product.name}
                    className="w-full h-48 sm:h-52 md:h-56 object-cover"
                  />
                </div>
              ) : (
                <div className="flex-shrink-0">
                  <img
                    src="/hebat_product_fill.png"
                    alt="Product Image"
                    className="w-full h-48 sm:h-52 md:h-56 object-cover"
                  />
                </div>
              )}

              {/* Text (Full Name Visible, Scroll Hidden) */}
              <div className="p-3 sm:p-4 flex-1 overflow-y-auto text-center hide-scrollbar">
                <h5 className="text-sm sm:text-base font-semibold text-gray-900 leading-snug break-words">
                  {product.name}
                </h5>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
