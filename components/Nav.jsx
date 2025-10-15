"use client"

import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { useAuth } from "@/context/AuthContext"
import Client from "@/lib/api"
import EditCategories from "@/components/EditCategories"
import { useSearchParams } from "next/navigation"

export default function Nav() {
  const searchParams = useSearchParams()
  const activeCategory = decodeURIComponent(searchParams.get("category") || "")
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [showCategories, setShowCategories] = useState(false)
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState("")
  const [filtered, setFiltered] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [hydrated, setHydrated] = useState(false)

  const searchRef = useRef(null)
  const resultsRef = useRef(null)

  // ✅ Wait for client hydration
  useEffect(() => {
    setHydrated(true)
  }, [])

  // ✅ Fetch categories and products only after hydration
  useEffect(() => {
    if (!hydrated) return
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          Client.get("/products/category", { withCredentials: true }),
          Client.get("/products"),
        ])
        setCategories(catRes.data.categories || [])
        setProducts(prodRes.data.products || [])
        console.log("Categories response:", catRes.data)
      } catch (err) {
        console.error("❌ Error fetching categories/products:", err)
        setCategories([])
      }
    }
    fetchData()
  }, [hydrated])

  // ✅ Search functionality
  const handleSearch = e => {
    const value = e.target.value
    setSearch(value)

    if (value.trim() === "") {
      setFiltered([])
      setShowDropdown(false)
      return
    }

    const query = value.toLowerCase()
    const matches = products.filter(
      p =>
        p.name.toLowerCase().includes(query) ||
        p.barcode?.toLowerCase().includes(query) ||
        p.model?.toLowerCase().includes(query)
    )

    setFiltered(matches)
    setShowDropdown(matches.length > 0)
    setActiveIndex(-1)
  }

  // ✅ Keyboard navigation
  const handleKeyDown = e => {
    if (!showDropdown || filtered.length === 0) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex(prev => (prev < filtered.length - 1 ? prev + 1 : 0))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex(prev => (prev > 0 ? prev - 1 : filtered.length - 1))
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault()
      const selected = filtered[activeIndex]
      window.location.href = `/products/${selected.slug}`
      setShowDropdown(false)
      setSearch("")
    }
  }

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = e => {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target) &&
        !resultsRef.current?.contains(e.target)
      ) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // ✅ Reload categories when admin updates them
  const reloadCategories = async () => {
    try {
      const res = await Client.get("/products/category")
      setCategories(res.data.categories || [])
    } catch (err) {
      console.error("Error reloading categories:", err)
    }
  }

  return (
    <>
      {/* Main Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black shadow-md">
        <div className="max-w-screen-xl mx-auto flex flex-wrap items-center justify-between p-4 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <img
              src="https://hebat-products.s3.me-south-1.amazonaws.com/Hebat_Logo_Text_page-0001.jpg"
              className="h-12"
              alt="Hebat Logo"
            />
          </Link>

          {/* Center Search Bar */}
          <div
            className="relative flex-1 max-w-md mx-auto w-full"
            ref={searchRef}
            onKeyDown={handleKeyDown}
          >
            <input
              type="text"
              placeholder="Search by name, model, or barcode..."
              value={search}
              onChange={handleSearch}
              onFocus={() => search && setShowDropdown(true)}
              className="w-full bg-gray-100 border border-yellow-500 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 p-2.5"
            />

            {/* Dropdown */}
            {showDropdown && (
              <div
                ref={resultsRef}
                className="absolute top-11 left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto"
              >
                {filtered.length > 0 ? (
                  filtered.map((product, index) => (
                    <Link
                      key={product._id}
                      href={`/products/${product.slug}`}
                      className={`flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                        activeIndex === index ? "bg-yellow-100" : "hover:bg-yellow-100"
                      }`}
                      onClick={() => {
                        setShowDropdown(false)
                        setSearch("")
                      }}
                    >
                      <img
                        src={product.image?.s3Url || "/hebat_product_fill.png"}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded-md border border-gray-200"
                      />
                      <div>
                        <p className="text-gray-900 font-medium">{product.name}</p>
                        <p className="text-xs text-gray-600">
                          {product.model || "No model"} — {product.barcode || "No barcode"}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm px-3 py-2">No products found</p>
                )}
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-400 rounded-lg md:hidden hover:bg-gray-800 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>

          {/* Main Links */}
          <div className={`${open ? "block" : "hidden"} w-full md:block md:w-auto`}>
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-700 rounded-lg bg-black md:flex-row md:space-x-6 md:mt-0 md:border-0">
              <li>
                <Link href="/" className="block py-2 px-3 text-white hover:text-yellow-500">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="block py-2 px-3 text-white hover:text-yellow-500">
                  Products
                </Link>
              </li>

              {user && (
                <>
                  <li>
                    <Link
                      href="/newproduct"
                      className="block py-2 px-3 text-white hover:text-yellow-500"
                    >
                      New Product
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => setShowCategories(true)}
                      className="block py-2 px-3 text-white hover:text-yellow-500"
                    >
                      Manage Categories
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={logout}
                      className="block py-2 px-3 text-white hover:text-yellow-500"
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* ✅ Category Bar (non-scrollable) */}
        <div className="bg-black border-t border-gray-800">
          <div className="max-w-screen-xl mx-auto px-4 flex flex-wrap justify-center md:justify-start">
            {categories.length > 0 ? (
              categories.map(category => {
                const isActive = activeCategory === category.name
                return (
                  <Link
                    key={category._id}
                    href={`/products?category=${encodeURIComponent(category.name)}`}
                    className={`block py-2 px-3 rounded-sm ${
                      isActive
                        ? "text-yellow-500 font-semibold underline"
                        : "text-white hover:text-yellow-500"
                    }`}
                  >
                    {category.name}
                  </Link>
                )
              })
            ) : (
              <p className="text-gray-400 text-sm py-2">Loading categories...</p>
            )}
          </div>
        </div>
      </nav>

      {/* Admin Category Modal */}
      {showCategories && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 p-6 relative">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Manage Categories</h2>
            <EditCategories onUpdated={reloadCategories} />
            <button
              onClick={() => setShowCategories(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  )
}
