"use client"

import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import Client from "@/lib/api"
import EditCategories from "@/components/EditCategories"
import CategoryBar from "@/components/CategoryBar"

const slugify = str =>
  str
    ?.toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-") || ""

export default function Nav() {
  const router = useRouter()
  const { user, logout } = useAuth()

  const [open, setOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const [showCategories, setShowCategories] = useState(false)
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState("")
  const [filtered, setFiltered] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const searchRef = useRef(null)
  const resultsRef = useRef(null)
  const adminMenuRef = useRef(null)
  const navRef = useRef(null)

  // ✅ Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await Client.get("/products", { withCredentials: true })
        setProducts(res.data.products || [])
      } catch (err) {
        console.error("❌ Products fetch error:", err)
      }
    }
    fetchProducts()
  }, [refreshTrigger])

  // ✅ Close dropdowns and hamburger when clicking outside
  useEffect(() => {
    const handleClickOutside = e => {
      if (adminMenuRef.current && !adminMenuRef.current.contains(e.target)) setAdminOpen(false)
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target) &&
        !resultsRef.current?.contains(e.target)
      )
        setShowDropdown(false)
      if (navRef.current && !navRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // ✅ Search logic
  const handleSearch = e => {
    const value = e.target.value
    setSearch(value)
    if (!value.trim()) {
      setFiltered([])
      setShowDropdown(false)
      return
    }
    const q = value.toLowerCase()
    const match = products.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.model?.toLowerCase().includes(q) ||
        p.barcode?.toLowerCase().includes(q)
    )
    setFiltered(match)
    setShowDropdown(match.length > 0)
    setActiveIndex(-1)
  }

  const handleKeyDown = e => {
    if (e.key === "Enter") {
      e.preventDefault()

      if (showDropdown && activeIndex >= 0) {
        const p = filtered[activeIndex]

        // ✅ Handle multiple categories gracefully
        let categorySlug = "others"
        if (Array.isArray(p.categories) && p.categories.length > 0) {
          const firstCat = p.categories[0]
          categorySlug = firstCat?.name
            ? firstCat.name
                .toLowerCase()
                .replace(/&/g, "and")
                .replace(/[^a-z0-9]+/g, "-")
            : "others"
        } else if (p.category?.name) {
          // fallback for old products with single category
          categorySlug = p.category.name
            .toLowerCase()
            .replace(/&/g, "and")
            .replace(/[^a-z0-9]+/g, "-")
        }

        router.push(`/products/${categorySlug}/${p.slug}`)
        closeMenus()
        return
      }

      if (search.trim()) {
        router.push(`/products?search=${encodeURIComponent(search.trim())}`)
        closeMenus()
      }
    }

    if (!showDropdown || !filtered.length) return

    if (e.key === "ArrowDown") {
      setActiveIndex(i => (i < filtered.length - 1 ? i + 1 : 0))
    } else if (e.key === "ArrowUp") {
      setActiveIndex(i => (i > 0 ? i - 1 : filtered.length - 1))
    }
  }

  // ✅ Close menus globally
  const closeMenus = () => {
    setShowDropdown(false)
    setOpen(false)
    setAdminOpen(false)
  }

  const reloadCategories = () => setRefreshTrigger(x => x + 1)

  return (
    <>
      <nav ref={navRef} className="fixed top-0 left-0 w-full z-50 bg-black shadow-md">
        {/* Container */}
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between p-4 gap-2">
          {/* Top Row (Logo + Hamburger) */}
          <div className="flex justify-between items-center w-full md:w-auto">
            <Link href="/" onClick={closeMenus} className="flex items-center space-x-3">
              <img src="/hebat_logo.png" className="h-8 sm:h-10" alt="Hebat Logo" />
            </Link>

            <button
              onClick={() => setOpen(!open)}
              className="md:hidden text-white p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* 🔍 Search Bar */}
          <div
            ref={searchRef}
            onKeyDown={handleKeyDown}
            className="relative w-full md:max-w-xl mx-auto mt-2 md:mt-0 order-3 md:order-none"
          >
            <input
              type="text"
              placeholder="Search by name, model, or barcode..."
              value={search}
              onChange={handleSearch}
              onFocus={() => search && setShowDropdown(true)}
              className="w-full bg-gray-100 border border-yellow-500 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 p-2.5"
            />

            {showDropdown && (
              <div
                ref={resultsRef}
                className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-b-md shadow-lg z-[90] max-h-72 overflow-y-auto"
              >
                {filtered.length ? (
                  filtered.map((p, i) => {
                    // ✅ Use first category from array or fallback to single category
                    const firstCategory =
                      Array.isArray(p.categories) && p.categories.length > 0
                        ? p.categories[0]?.name
                        : p.category?.name || "others"

                    return (
                      <Link
                        key={p._id || i}
                        href={`/products/${slugify(firstCategory)}/${p.slug}`}
                        onClick={closeMenus}
                        className={`flex items-center gap-3 px-3 py-2 text-sm ${
                          i === activeIndex ? "bg-yellow-100" : "hover:bg-yellow-100"
                        }`}
                      >
                        <img
                          src={p.image?.s3Url || "/hebat_product_fill.png"}
                          alt={p.name}
                          className="w-10 h-10 object-cover rounded-md border border-gray-200"
                        />
                        <div className="text-left">
                          <p className="font-medium text-gray-900">{p.name}</p>
                          <p className="text-xs text-gray-600 truncate">
                            {p.model || "No model"} — {p.barcode || "No barcode"}
                          </p>
                        </div>
                      </Link>
                    )
                  })
                ) : (
                  <p className="text-gray-500 text-sm px-3 py-2">No products found</p>
                )}
              </div>
            )}
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" onClick={closeMenus} className="text-white hover:text-yellow-500">
              Home
            </Link>
            <Link
              href="/products"
              onClick={closeMenus}
              className="text-white hover:text-yellow-500"
            >
              Products
            </Link>

            {/* Admin Controls */}
            {user && (
              <div className="relative" ref={adminMenuRef}>
                <button
                  onClick={e => {
                    e.stopPropagation()
                    setAdminOpen(prev => !prev)
                  }}
                  className="text-white hover:text-yellow-500 flex items-center"
                >
                  Admin Controls
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className={`w-4 h-4 ml-1 transition-transform ${adminOpen ? "rotate-180" : ""}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {adminOpen && (
                  <ul className="absolute left-0 mt-2 bg-black border border-gray-700 rounded-lg shadow-lg min-w-[180px] z-[80] transition-all duration-150 ease-in-out">
                    <li>
                      <Link
                        href="/newproduct"
                        onClick={closeMenus}
                        className="block py-2 px-4 text-sm text-white hover:text-yellow-500"
                      >
                        New Product
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setShowCategories(true)
                          closeMenus()
                        }}
                        className="block w-full text-left py-2 px-4 text-sm text-white hover:text-yellow-500"
                      >
                        Manage Categories
                      </button>
                    </li>
                    <li>
                      <Link
                        href="/newsletter"
                        onClick={closeMenus}
                        className="block py-2 px-4 text-sm text-white hover:text-yellow-500"
                      >
                        Newsletter
                      </Link>
                    </li>
                    <li className="border-t border-gray-700">
                      <button
                        onClick={() => {
                          logout()
                          closeMenus()
                        }}
                        className="block w-full text-left py-2 px-4 text-sm text-white hover:text-yellow-500"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          {open && (
            <div className="w-full md:hidden border-t border-gray-700 mt-2 pt-2">
              <ul className="space-y-1 text-left">
                <li>
                  <Link
                    href="/"
                    onClick={closeMenus}
                    className="block py-2 text-white hover:text-yellow-500"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products"
                    onClick={closeMenus}
                    className="block py-2 text-white hover:text-yellow-500"
                  >
                    Products
                  </Link>
                </li>

                {user && (
                  <li ref={adminMenuRef}>
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        setAdminOpen(prev => !prev)
                      }}
                      className="py-2 px-3 text-white hover:text-yellow-500 w-full text-left flex items-center justify-between"
                    >
                      Admin Controls
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className={`w-4 h-4 ml-1 transition-transform ${
                          adminOpen ? "rotate-180" : ""
                        }`}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                      </svg>
                    </button>

                    {adminOpen && (
                      <ul className="bg-black border border-gray-700 rounded-lg shadow-lg mt-1 space-y-1 z-[90] relative">
                        <li>
                          <Link
                            href="/newproduct"
                            onClick={closeMenus}
                            className="block py-2 px-4 text-sm text-white hover:text-yellow-500"
                          >
                            New Product
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              setShowCategories(true)
                              closeMenus()
                            }}
                            className="block w-full text-left py-2 px-4 text-sm text-white hover:text-yellow-500"
                          >
                            Manage Categories
                          </button>
                        </li>
                        <li>
                          <Link
                            href="/newsletter"
                            onClick={closeMenus}
                            className="block py-2 px-4 text-sm text-white hover:text-yellow-500"
                          >
                            Newsletter
                          </Link>
                        </li>
                        <li className="border-t border-gray-700">
                          <button
                            onClick={() => {
                              logout()
                              closeMenus()
                            }}
                            className="block w-full text-left py-2 px-4 text-sm text-white hover:text-yellow-500"
                          >
                            Logout
                          </button>
                        </li>
                      </ul>
                    )}
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* CategoryBar */}
        <div className="relative z-[40] mt-1">
          <CategoryBar refreshTrigger={refreshTrigger} />
        </div>
      </nav>

      {/* Manage Categories Modal */}
      {showCategories && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50">
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
