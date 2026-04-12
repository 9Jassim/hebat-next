"use client"

import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useLanguage } from "@/context/LanguageContext"
import Client from "@/lib/api"
import EditCategories from "@/components/EditCategories"
import CategoryBar from "@/components/CategoryBar"
import Fuse from "fuse.js"
import { useTheme } from "@/context/ThemeContext"
import { Sun, Moon } from "lucide-react"

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
  const { t, p, isAr, toggleHref } = useLanguage()
  const { dark, toggle: toggleTheme } = useTheme()

  const [open, setOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const lastScrollY = useRef(0)
  const [showCategories, setShowCategories] = useState(false)
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState("")
  const [filtered, setFiltered] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const searchRef = useRef(null)
  const searchSectionRef = useRef(null)
  const categoryBarWrapRef = useRef(null)
  const resultsRef = useRef(null)
  const adminMenuRef = useRef(null)
  const navRef = useRef(null)
  const itemRefs = useRef([])
  const fuseRef = useRef(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await Client.get("/products", { withCredentials: true })
        const prods = res.data.products || []
        setProducts(prods)
        fuseRef.current = new Fuse(prods, {
          keys: ["name", "name_ar", "model", "barcode"],
          threshold: 0.4,
          distance: 100,
          minMatchCharLength: 2,
          includeScore: true,
        })
      } catch (err) {
        console.error("❌ Products fetch error:", err)
      }
    }
    fetchProducts()
  }, [refreshTrigger])

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const getSearchEl = () => searchSectionRef.current
    const getCatEl = () => categoryBarWrapRef.current

    const clearMobileStyles = () => {
      const s = getSearchEl()
      const c = getCatEl()
      if (s) {
        s.style.maxHeight = ""
        s.style.opacity = ""
        s.style.overflow = ""
      }
      if (c) {
        c.style.maxHeight = ""
        c.style.opacity = ""
        c.style.overflow = ""
      }
    }

    const showAll = () => {
      nav.style.transform = "translateY(0)"
      if (window.innerWidth < 768) {
        const s = getSearchEl()
        const c = getCatEl()
        if (s) {
          s.style.maxHeight = "200px"
          s.style.opacity = "1"
          s.style.overflow = ""
        }
        if (c) {
          c.style.maxHeight = "200px"
          c.style.opacity = "1"
          c.style.overflow = ""
        }
      } else {
        clearMobileStyles()
      }
    }

    const hideDesktop = () => {
      nav.style.transform = "translateY(-110%)"
    }

    const hideMobile = () => {
      const s = getSearchEl()
      const c = getCatEl()
      if (s) {
        s.style.overflow = "hidden"
        s.style.maxHeight = "0px"
        s.style.opacity = "0"
      }
      if (c) {
        c.style.overflow = "hidden"
        c.style.maxHeight = "0px"
        c.style.opacity = "0"
      }
    }

    const THRESHOLD = 80
    let debt = 0

    const handleScroll = () => {
      const y = window.scrollY || 0
      const delta = y - lastScrollY.current
      lastScrollY.current = y

      if (y <= 10) {
        debt = 0
        showAll()
        return
      }

      debt += delta
      if (debt > THRESHOLD) {
        debt = THRESHOLD
        if (window.innerWidth < 768) hideMobile()
        else hideDesktop()
      } else if (debt < -THRESHOLD) {
        debt = -THRESHOLD
        showAll()
      }
    }

    const handleResize = () => {
      debt = 0
      nav.style.transform = ""
      clearMobileStyles()
      lastScrollY.current = window.scrollY || 0
    }

    document.addEventListener("scroll", handleScroll, { passive: true, capture: true })
    window.addEventListener("resize", handleResize, { passive: true })
    return () => {
      document.removeEventListener("scroll", handleScroll, { capture: true })
      window.removeEventListener("resize", handleResize)
    }
  }, [])

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

  useEffect(() => {
    itemRefs.current = []
  }, [filtered])

  useEffect(() => {
    if (activeIndex >= 0 && itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex].scrollIntoView({ block: "nearest", behavior: "smooth" })
    }
  }, [activeIndex])

  const handleSearch = e => {
    const value = e.target.value
    setSearch(value)
    if (!value.trim()) {
      setFiltered([])
      setShowDropdown(false)
      return
    }
    const match = fuseRef.current
      ? fuseRef.current.search(value).map(r => r.item)
      : products.filter(pr => pr.name.toLowerCase().includes(value.toLowerCase()))
    setFiltered(match)
    setShowDropdown(match.length > 0)
    setActiveIndex(-1)
  }

  const handleKeyDown = e => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (showDropdown && activeIndex >= 0) {
        const pr = filtered[activeIndex]
        let categorySlug = "others"
        if (Array.isArray(pr.categories) && pr.categories.length > 0) {
          const firstCat = pr.categories[0]
          categorySlug = firstCat?.name
            ? firstCat.name
                .toLowerCase()
                .replace(/&/g, "and")
                .replace(/[^a-z0-9]+/g, "-")
            : "others"
        } else if (pr.category?.name) {
          categorySlug = pr.category.name
            .toLowerCase()
            .replace(/&/g, "and")
            .replace(/[^a-z0-9]+/g, "-")
        }
        router.push(p(`/products/${categorySlug}/${pr.slug}`))
        closeMenus()
        return
      }
      if (search.trim()) {
        router.push(p(`/products?search=${encodeURIComponent(search.trim())}`))
        closeMenus()
      }
    }
    if (!showDropdown || !filtered.length) return
    if (e.key === "ArrowDown") setActiveIndex(i => (i < filtered.length - 1 ? i + 1 : 0))
    else if (e.key === "ArrowUp") setActiveIndex(i => (i > 0 ? i - 1 : filtered.length - 1))
  }

  const closeMenus = () => {
    setShowDropdown(false)
    setOpen(false)
    setAdminOpen(false)
  }
  const reloadCategories = () => setRefreshTrigger(x => x + 1)

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 w-full z-50 bg-[#111111]"
        style={{
          transition: "transform 0.3s ease",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between px-4 py-3 gap-2">
          {/* Top Row */}
          <div className="flex justify-between items-center w-full md:w-auto">
            <Link
              href={p("/")}
              onClick={closeMenus}
              className="flex items-center select-none w-28 md:w-36"
            >
              <img
                src="/hebat_logo.png"
                alt="Hebat Logo"
                width="2546"
                height="500"
                decoding="async"
                loading="eager"
                draggable={false}
                className="h-9 sm:h-11 w-auto object-contain block select-none pointer-events-none"
              />
            </Link>

            <div className="flex items-center gap-2 md:hidden">
              {/* Language toggle (mobile) */}
              <Link
                href={toggleHref}
                className="text-xs font-bold text-yellow-400 border border-yellow-400/40 rounded-full px-3 py-1 hover:bg-yellow-400 hover:text-black transition-all duration-200"
              >
                {isAr ? "EN" : "عربي"}
              </Link>

              {/* Dark mode toggle (mobile) */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle dark mode"
                className="w-7 h-7 flex items-center justify-center rounded-full border border-white/15 text-gray-400 hover:text-white transition-all duration-200"
              >
                {dark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setOpen(!open)}
                className="text-gray-400 hover:text-white p-1.5 rounded-lg transition-colors"
              >
                {open ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div
            ref={searchSectionRef}
            className="order-3 md:order-none w-full md:flex-1"
            style={{ transition: "max-height 0.3s ease, opacity 0.3s ease" }}
          >
            <div
              ref={searchRef}
              onKeyDown={handleKeyDown}
              className="relative w-full md:max-w-xl mx-auto"
            >
              <div className="relative">
                <svg
                  className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder={t("search")}
                  value={search}
                  onChange={handleSearch}
                  onFocus={() => search && setShowDropdown(true)}
                  className="w-full bg-white/5 border border-white/10 focus:border-yellow-500/50 focus:bg-white/8 text-white placeholder-gray-500 text-sm rounded-xl ps-9 pe-4 py-2.5 outline-none transition-all duration-200"
                />
              </div>

              {showDropdown && (
                <div
                  ref={resultsRef}
                  className="absolute top-full start-0 w-full mt-1 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-[90] max-h-72 overflow-y-auto scrollbar-dark"
                >
                  {filtered.length ? (
                    filtered.map((pr, i) => {
                      const firstCategory =
                        Array.isArray(pr.categories) && pr.categories.length > 0
                          ? pr.categories[0]?.name
                          : pr.category?.name || "others"

                      return (
                        <Link
                          key={pr._id || i}
                          href={p(`/products/${slugify(firstCategory)}/${pr.slug}`)}
                          onClick={closeMenus}
                          ref={el => (itemRefs.current[i] = el)}
                          className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                            i === activeIndex
                              ? "bg-yellow-500/20 border-s-2 border-yellow-500"
                              : "hover:bg-white/5"
                          } ${i !== filtered.length - 1 ? "border-b border-white/5" : ""}`}
                        >
                          <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-white overflow-hidden">
                            <img
                              src={pr.images?.[0]?.s3Url || "/hebat_product_fill.png"}
                              alt={pr.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="text-start min-w-0">
                            <p className="font-medium text-gray-200 truncate">
                              {isAr && pr.name_ar ? pr.name_ar : pr.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {pr.model || "—"} · {pr.barcode || "—"}
                            </p>
                          </div>
                        </Link>
                      )
                    })
                  ) : (
                    <p className="text-gray-500 text-sm px-4 py-3">No products found</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href={p("/")}
              onClick={closeMenus}
              className="text-gray-400 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/5 transition-all duration-150"
            >
              {t("home")}
            </Link>
            <Link
              href={p("/products")}
              onClick={closeMenus}
              className="text-gray-400 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/5 transition-all duration-150"
            >
              {t("products")}
            </Link>

            {/* Language Toggle */}
            <Link
              href={toggleHref}
              className="text-xs font-bold text-yellow-400 border border-yellow-400/40 rounded-full px-3 py-1.5 hover:bg-yellow-400 hover:text-black ms-1 transition-all duration-200"
            >
              {isAr ? "EN" : "عربي"}
            </Link>

            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="w-8 h-8 flex items-center justify-center rounded-full border border-white/15 text-gray-400 hover:text-white hover:border-white/30 transition-all duration-200"
            >
              {dark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* Admin Controls */}
            {user && (
              <div className="relative ms-1" ref={adminMenuRef}>
                <button
                  onClick={e => {
                    e.stopPropagation()
                    setAdminOpen(prev => !prev)
                  }}
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all duration-150"
                >
                  {t("adminControls")}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${adminOpen ? "rotate-180" : ""}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {adminOpen && (
                  <ul className="absolute start-0 mt-1 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl min-w-[180px] z-[80] overflow-hidden py-1">
                    {[
                      { href: "/admin/newproduct", label: "New Product" },
                      { href: "/admin/newsletter", label: "Newsletter" },
                      { href: "/admin/contacts", label: "Contact Messages" },
                      { href: "/admin/banners", label: "Manage Banners" },
                      { href: "/admin/homepage", label: "Homepage Settings" },
                    ].map(item => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={closeMenus}
                          className="block py-2 px-4 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <button
                        onClick={() => {
                          setShowCategories(true)
                          closeMenus()
                        }}
                        className="block w-full text-start py-2 px-4 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        Manage Categories
                      </button>
                    </li>
                    <li className="border-t border-white/8 mt-1 pt-1">
                      <button
                        onClick={async () => {
                          await logout()
                          closeMenus()
                          setTimeout(() => router.replace(p("/")), 50)
                        }}
                        className="block w-full text-start py-2 px-4 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors"
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
            <div className="w-full md:hidden border-t border-white/8 mt-1 pt-3 pb-1">
              <ul className="space-y-0.5">
                <li>
                  <Link
                    href={p("/")}
                    onClick={closeMenus}
                    className="block py-2 px-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    {t("home")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={p("/products")}
                    onClick={closeMenus}
                    className="block py-2 px-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    {t("products")}
                  </Link>
                </li>

                {user && (
                  <li ref={adminMenuRef}>
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        setAdminOpen(prev => !prev)
                      }}
                      className="py-2 px-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg w-full text-start flex items-center justify-between transition-colors"
                    >
                      {t("adminControls")}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${adminOpen ? "rotate-180" : ""}`}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                      </svg>
                    </button>

                    {adminOpen && (
                      <ul className="mt-1 ms-3 border-s border-white/10 ps-3 space-y-0.5">
                        {[
                          { href: "/admin/newproduct", label: "New Product" },
                          { href: "/admin/newsletter", label: "Newsletter" },
                          { href: "/admin/contacts", label: "Contact Messages" },
                          { href: "/admin/banners", label: "Manage Banners" },
                          { href: "/admin/homepage", label: "Homepage Settings" },
                        ].map(item => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={closeMenus}
                              className="block py-2 px-3 text-sm text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                        <li>
                          <button
                            onClick={() => {
                              setShowCategories(true)
                              closeMenus()
                            }}
                            className="block w-full text-start py-2 px-3 text-sm text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                          >
                            Manage Categories
                          </button>
                        </li>
                        <li className="pt-1">
                          <button
                            onClick={() => {
                              logout()
                              closeMenus()
                            }}
                            className="block w-full text-start py-2 px-3 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-colors"
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
        <div
          ref={categoryBarWrapRef}
          className="relative z-[40]"
          style={{ transition: "max-height 0.3s ease, opacity 0.3s ease" }}
        >
          <CategoryBar refreshTrigger={refreshTrigger} />
        </div>
      </nav>

      {/* Manage Categories Modal */}
      {showCategories && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 relative">
            <h2 className="text-lg font-bold mb-4 text-gray-900">Manage Categories</h2>
            <EditCategories onUpdated={reloadCategories} />
            <button
              onClick={() => setShowCategories(false)}
              className="absolute top-4 end-4 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
