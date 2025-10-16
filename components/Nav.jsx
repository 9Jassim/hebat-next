"use client"

import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import Client from "@/lib/api"
import EditCategories from "@/components/EditCategories"
import CategoryBar from "@/components/CategoryBar"

export default function Nav() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [showCategories, setShowCategories] = useState(false)
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState("")
  const [filtered, setFiltered] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const searchRef = useRef(null)
  const resultsRef = useRef(null)

  // ✅ fetch once on mount
  useEffect(() => {
    let active = true
    const fetchProducts = async () => {
      try {
        const res = await Client.get("/products", { withCredentials: true })
        if (active) setProducts(res.data.products || [])
      } catch (err) {
        console.error("❌ Products fetch error:", err)
      }
    }
    fetchProducts()
    const t = setTimeout(fetchProducts, 1500)
    return () => {
      active = false
      clearTimeout(t)
    }
  }, [refreshTrigger])

  // ✅ search logic
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

  // ✅ keyboard
  const handleKeyDown = e => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (showDropdown && activeIndex >= 0) {
        router.push(`/products/${filtered[activeIndex].slug}`)
        setShowDropdown(false)
        setSearch("")
        return
      }
      if (search.trim()) {
        router.push(`/products?search=${encodeURIComponent(search.trim())}`)
        setShowDropdown(false)
      }
    }
    if (!showDropdown || !filtered.length) return
    if (e.key === "ArrowDown") setActiveIndex(i => (i < filtered.length - 1 ? i + 1 : 0))
    else if (e.key === "ArrowUp") setActiveIndex(i => (i > 0 ? i - 1 : filtered.length - 1))
  }

  // ✅ close dropdown outside
  useEffect(() => {
    const close = e => {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target) &&
        !resultsRef.current?.contains(e.target)
      )
        setShowDropdown(false)
    }
    document.addEventListener("mousedown", close)
    return () => document.removeEventListener("mousedown", close)
  }, [])

  const reloadCategories = () => setRefreshTrigger(x => x + 1)

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-black shadow-md">
        <div className="max-w-screen-xl mx-auto flex flex-wrap items-center justify-between p-4 gap-4">
          <Link href="/" className="flex items-center space-x-3">
            <img
              src="https://hebat-products.s3.me-south-1.amazonaws.com/Hebat_Logo_Text_page-0001.jpg"
              className="h-12"
              alt="Hebat Logo"
            />
          </Link>

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

            {showDropdown && (
              <div
                ref={resultsRef}
                className="absolute top-11 left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto"
              >
                {filtered.length ? (
                  filtered.map((p, i) => (
                    <Link
                      key={p._id}
                      href={`/products/${p.slug}`}
                      className={`flex items-center gap-3 px-3 py-2 text-sm ${
                        i === activeIndex ? "bg-yellow-100" : "hover:bg-yellow-100"
                      }`}
                      onClick={() => {
                        setShowDropdown(false)
                        setSearch("")
                      }}
                    >
                      <img
                        src={p.image?.s3Url || "/hebat_product_fill.png"}
                        alt={p.name}
                        className="w-10 h-10 object-cover rounded-md border border-gray-200"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-600">
                          {p.model || "No model"} — {p.barcode || "No barcode"}
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
      </nav>

      <div className="mt-[72px]">
        <CategoryBar refreshTrigger={refreshTrigger} />
      </div>

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
