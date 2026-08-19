"use client"

import { useEffect, useState, useRef, useCallback, useMemo } from "react"
import {
  ArrowUp,
  ArrowRight,
  ArrowUpRight,
  Zap,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import Client from "@/lib/api"
import { useLanguage } from "@/context/LanguageContext"
import PageDecorations from "@/components/PageDecorations"
import ProductsHeroAurora from "@/components/ProductsHeroAurora"
import ProductsHeroProducts from "@/components/ProductsHeroProducts"
import ProductCard from "@/components/ProductCard"

const PAGE_SIZE = 20

const slugify = str =>
  str
    ?.toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-") || ""

const deslugify = str =>
  str
    ?.replace(/-/g, " ")
    .replace(/\band\b/g, "&")
    .replace(/\b\w/g, c => c.toUpperCase()) || ""

const HERO = {
  en: {
    eyebrow: "The Full Collection",
    heading: "Everything Hebat makes.",
    sub: "Electronics, home appliances, accessories, tools and sports gear — engineered to one standard, gathered in one place. Explore the range built to impress.",
    browse: "Browse all products",
    shop: "Shop on Morslon",
    qualityChecked: "Quality checked",
    categories: "Categories",
    spotlightLabel: "Featured",
    spotlightHeading: "Spotlight picks",
    featured: "Featured",
    viewProduct: "View product",
  },
  ar: {
    eyebrow: "المجموعة الكاملة",
    heading: "كل ما تصنعه هيبات.",
    sub: "إلكترونيات، أجهزة منزلية، إكسسوارات، أدوات ومعدات رياضية — مصنوعة وفق معيار واحد، مجموعة في مكان واحد. استكشف التشكيلة المصممة لتبهر.",
    browse: "تصفح كل المنتجات",
    shop: "تسوق على مورسلون",
    qualityChecked: "مفحوص الجودة",
    categories: "التصنيفات",
    spotlightLabel: "مميز",
    spotlightHeading: "اختيارات مميزة",
    featured: "مميز",
    viewProduct: "عرض المنتج",
  },
}

const TICKER_ITEMS = [
  "HEBAT",
  "هيبات",
  "QUALITY",
  "جودة",
  "INNOVATION",
  "ابتكار",
  "EXCELLENCE",
  "تميز",
  "DIVERSITY",
  "تنوع",
]

function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col animate-pulse">
      <div className="aspect-square bg-gray-100 dark:bg-gray-800 m-3 rounded-xl" />
      <div className="px-3 pb-4 space-y-2">
        <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full w-4/5" />
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-3/5" />
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-2/5 mt-1" />
      </div>
    </div>
  )
}

export default function Products() {
  const params = useParams()
  const { isAr, p, t } = useLanguage()
  const c = isAr ? HERO.ar : HERO.en

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategoryFromQuery, setSelectedCategoryFromQuery] = useState(null)

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search)
    setSelectedCategoryFromQuery(sp.get("category"))
    setSearchQuery(sp.get("search")?.trim() || "")
  }, [])

  const selectedCategoryFromPath = params?.category
  const selectedCategory = selectedCategoryFromPath || selectedCategoryFromQuery
  const isLanding = !selectedCategory && !searchQuery

  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const [showing, setShowing] = useState([])
  const [allCats, setAllCats] = useState([])
  const [sortBy, setSortBy] = useState("default")
  const [loading, setLoading] = useState(true)
  const [displayCategory, setDisplayCategory] = useState("")
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const observerRef = useRef(null)
  const showingRef = useRef(showing)
  const visibleCountRef = useRef(visibleCount)
  const animatedSlugs = useRef(new Set())
  const gridRef = useRef(null)
  const [spotlight, setSpotlight] = useState([])
  const [spotIndex, setSpotIndex] = useState(0)
  const spotPausedRef = useRef(false)

  // Randomized product thumbnails for the floating hero tiles. Keyed on the
  // dataset identity (length + active filter) rather than the array reference,
  // so Strict Mode's double-fetch in dev doesn't reshuffle and flip the tiles.
  const heroImages = useMemo(() => {
    const arr = showing.map(pr => pr.images?.[0]?.s3Url).filter(Boolean)
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr.slice(0, 18)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showing.length, selectedCategory, searchQuery])

  useEffect(() => {
    showingRef.current = showing
  }, [showing])
  useEffect(() => {
    visibleCountRef.current = visibleCount
  }, [visibleCount])

  const normalize = str =>
    str?.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "").normalize("NFKC").trim() || ""

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await Client.get("/products")
        const fetched = res.data.products || []

        // Collect every distinct top category for the quick-filter chips
        const catBySlug = new Map()
        fetched.forEach(pr => {
          const obj =
            Array.isArray(pr.categories) && pr.categories.length > 0
              ? pr.categories[0]
              : pr.category
          if (obj?.name) {
            const s = slugify(obj.name)
            if (!catBySlug.has(s))
              catBySlug.set(s, { slug: s, name: obj.name, name_ar: obj.name_ar })
          }
        })
        setAllCats(
          [...catBySlug.values()].sort((a, b) => a.name.localeCompare(b.name)).slice(0, 14)
        )

        if (selectedCategory) {
          const normalizedQuery = normalize(selectedCategory)

          const filtered = fetched.filter(pr =>
            Array.isArray(pr.categories)
              ? pr.categories.some(cat => normalize(slugify(cat?.name)) === normalizedQuery)
              : pr.category && normalize(slugify(pr.category.name)) === normalizedQuery
          )

          setShowing(filtered)

          const matchedCategory =
            filtered[0]?.categories?.find(cat => slugify(cat.name) === selectedCategory) ||
            filtered[0]?.category

          setDisplayCategory(
            isAr && matchedCategory?.name_ar ? matchedCategory.name_ar : deslugify(selectedCategory)
          )
        } else if (searchQuery) {
          const query = searchQuery.toLowerCase()

          const filtered = fetched.filter(
            pr =>
              pr.name.toLowerCase().includes(query) ||
              pr.name_ar?.includes(query) ||
              pr.model?.toLowerCase().includes(query) ||
              pr.barcode?.toLowerCase().includes(query)
          )

          setShowing(filtered)
          setDisplayCategory(`${isAr ? "نتائج البحث عن" : "Search results for"} "${searchQuery}"`)
        } else {
          const uniqueProducts = Array.from(
            new Map(fetched.map(pr => [pr._id || pr.slug, pr])).values()
          )

          setShowing(uniqueProducts)
          setDisplayCategory(t("allProducts"))
        }
      } catch (err) {
        console.error("❌ Error loading products:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [selectedCategory, searchQuery, isAr])

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [showing])

  // Pick a fresh random set of spotlight products whenever the list loads
  useEffect(() => {
    if (selectedCategory || searchQuery || showing.length === 0) {
      setSpotlight([])
      return
    }
    const pool = [...showing]
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[pool[i], pool[j]] = [pool[j], pool[i]]
    }
    setSpotlight(pool.slice(0, Math.min(5, pool.length)))
    setSpotIndex(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- key on dataset identity so Strict Mode's double-fetch doesn't reshuffle
  }, [showing.length, selectedCategory, searchQuery])

  // Auto-advance the spotlight showcase
  useEffect(() => {
    const n = spotlight.length
    if (n < 2) return
    const id = setInterval(() => {
      if (!spotPausedRef.current) setSpotIndex(i => (i + 1) % n)
    }, 8000)
    return () => clearInterval(id)
  }, [spotlight.length])

  const sentinelRef = useCallback(el => {
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }
    if (el) {
      observerRef.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && visibleCountRef.current < showingRef.current.length) {
            setVisibleCount(prev => prev + PAGE_SIZE)
          }
        },
        { threshold: 0.1 }
      )
      observerRef.current.observe(el)
    }
  }, [])

  const scrollToGrid = () => gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })

  if (loading)
    return (
      <div className="relative">
        {/* Hero skeleton */}
        <div className="relative bg-gray-950 h-[340px] sm:h-[420px] flex items-end overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full space-y-4">
            <div className="h-3 w-32 bg-white/10 rounded-full animate-pulse" />
            <div className="h-12 w-2/3 bg-white/10 rounded-2xl animate-pulse" />
            <div className="h-3 w-1/2 bg-white/10 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    )

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hebatofficial.com/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: "https://hebatofficial.com/products",
      },
      ...(selectedCategory
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: displayCategory,
              item: `https://hebatofficial.com/products/${encodeURIComponent(
                selectedCategory.toLowerCase().replace(/\s+/g, "-")
              )}`,
            },
          ]
        : searchQuery
          ? [
              {
                "@type": "ListItem",
                position: 3,
                name: `Search: ${searchQuery}`,
                item: `https://hebatofficial.com/products?search=${encodeURIComponent(searchQuery)}`,
              },
            ]
          : []),
    ],
  }

  const sorted = [...showing].sort((a, b) => {
    const nameA = (isAr && a.name_ar ? a.name_ar : a.name) || ""
    const nameB = (isAr && b.name_ar ? b.name_ar : b.name) || ""
    if (sortBy === "az") return nameA.localeCompare(nameB)
    if (sortBy === "za") return nameB.localeCompare(nameA)
    return 0
  })

  const visibleProducts = sorted.slice(0, visibleCount)

  const firstCatOf = product => {
    const obj =
      Array.isArray(product.categories) && product.categories.length > 0
        ? product.categories[0]
        : product.category
    return obj
  }
  const hrefOf = product =>
    p(`/products/${slugify(firstCatOf(product)?.name || "others")}/${product.slug}`)
  const nameOf = product => (isAr && product.name_ar ? product.name_ar : product.name)

  return (
    <div className="relative">
      <style>{`
        @keyframes product-in {
          0%   { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .product-card-enter { animation: product-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes hebat-ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .hebat-ticker-track { animation: hebat-ticker 26s linear infinite; will-change: transform; }
        .marquee-strip:hover .hebat-ticker-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .product-card-enter { animation: none; }
          .hebat-ticker-track { animation: none; }
        }
      `}</style>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* ─────────────── HERO ─────────────── */}
      <header className="relative z-10 overflow-hidden bg-gray-950 text-white isolate">
        {/* Aurora + soft glow blobs sit BEHIND the floating product tiles */}
        <ProductsHeroAurora variant={isLanding ? "full" : "compact"} />
        <div className="pointer-events-none absolute -top-40 ltr:-right-32 rtl:-left-32 w-[520px] h-[520px] rounded-full bg-yellow-400/20 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-44 ltr:-left-24 rtl:-right-24 w-[420px] h-[420px] rounded-full bg-amber-500/12 blur-[80px]" />
        <ProductsHeroProducts
          variant={isLanding ? "full" : "compact"}
          images={heroImages}
          mirror={isAr}
        />
        {/* text-side scrim — keeps the headline crisp over the floating tiles */}
        <div className="pointer-events-none absolute inset-0 z-[2] ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-gray-950 via-gray-950/60 to-transparent" />
        {/* fade to page */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-gray-950 to-transparent z-[2]" />

        <div
          className={`relative z-[3] max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ${
            isLanding ? "pt-16 pb-20 sm:pt-20 sm:pb-24" : "pt-10 pb-12"
          }`}
        >
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-white/40 mb-6 flex-wrap">
            <Link href={p("/")} className="hover:text-yellow-400 transition-colors font-medium">
              {t("home")}
            </Link>
            <span className="text-white/25 select-none">›</span>
            <Link
              href={p("/products")}
              className="hover:text-yellow-400 transition-colors font-medium"
            >
              {t("products")}
            </Link>
            {(selectedCategory || searchQuery) && (
              <>
                <span className="text-white/25 select-none">›</span>
                <span className="text-white/80 font-semibold capitalize">{displayCategory}</span>
              </>
            )}
          </nav>

          {isLanding ? (
            <>
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2.5 border border-yellow-500/30 bg-yellow-500/10 rounded-full px-4 py-1.5"
              >
                <Zap className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                <span className="text-[10px] font-bold uppercase tracking-[0.34em] text-yellow-400">
                  {c.eyebrow}
                </span>
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] max-w-3xl [text-wrap:balance]"
              >
                {c.heading}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-5 max-w-xl text-white/70 text-sm sm:text-base leading-relaxed"
              >
                {c.sub}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.32 }}
                className="mt-8 flex flex-wrap gap-3"
              >
                <button
                  onClick={scrollToGrid}
                  className="group inline-flex items-center gap-2 px-7 py-3.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-2xl shadow-lg shadow-yellow-500/25 transition-all duration-200 hover:-translate-y-0.5 text-sm"
                >
                  {c.browse}
                  <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => window.open("https://morslon.com/", "_blank")}
                  className="group inline-flex items-center gap-2 px-7 py-3.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold rounded-2xl transition-all duration-200 hover:-translate-y-0.5 text-sm"
                >
                  {c.shop}
                  <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-12 flex gap-10 flex-wrap"
              >
                <div>
                  <div className="text-3xl font-black tracking-tight">
                    {showing.length}
                    <span className="text-yellow-500">+</span>
                  </div>
                  <div className="text-xs text-white/50 mt-0.5">{t("products")}</div>
                </div>
                <div>
                  <div className="text-3xl font-black tracking-tight">{allCats.length}</div>
                  <div className="text-xs text-white/50 mt-0.5">{c.categories}</div>
                </div>
                <div>
                  <div className="text-3xl font-black tracking-tight">
                    100<span className="text-yellow-500">%</span>
                  </div>
                  <div className="text-xs text-white/50 mt-0.5">{c.qualityChecked}</div>
                </div>
              </motion.div>
            </>
          ) : (
            /* Compact hero band (category / search) */
            <>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-0.5 w-6 bg-yellow-500 rounded-full" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-yellow-400">
                  {searchQuery ? (isAr ? "بحث" : "Search") : t("products")}
                </span>
              </div>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight [text-wrap:balance] flex items-center gap-3 ${
                  searchQuery ? "" : "capitalize"
                }`}
              >
                {searchQuery && <Search className="w-7 h-7 text-yellow-500 flex-shrink-0" />}
                {displayCategory || t("allProducts")}
              </motion.h1>
              <p className="mt-3 text-sm text-white/60 font-medium">
                {showing.length} {showing.length !== 1 ? t("products") : t("product")}
              </p>
            </>
          )}
        </div>
      </header>

      {/* ─────────────── MARQUEE (landing only) ─────────────── */}
      {isLanding && (
        <div className="marquee-strip relative z-10 w-full overflow-hidden bg-yellow-500 py-3.5 border-y-2 border-black">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-yellow-500 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-yellow-500 to-transparent z-10" />
          <div className="hebat-ticker-track flex whitespace-nowrap w-max" dir="ltr">
            {Array.from({ length: 4 }, () => TICKER_ITEMS)
              .flat()
              .map((item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-4 px-4 text-[11px] font-black uppercase tracking-[0.25em] text-black/70"
                >
                  {item}
                  <span className="w-1 h-1 rounded-full bg-black/40 flex-shrink-0" />
                </span>
              ))}
          </div>
        </div>
      )}

      <PageDecorations />

      {/* ─────────────── SPOTLIGHT — rotating showcase (landing only) ─────────────── */}
      {isLanding &&
        spotlight.length >= 3 &&
        (() => {
          const n = spotlight.length
          const idx = spotIndex % n
          const active = spotlight[idx]
          const activeCat = firstCatOf(active)
          const catLabel = isAr && activeCat?.name_ar ? activeCat.name_ar : activeCat?.name
          const go = dir => setSpotIndex(i => (((i + dir) % n) + n) % n)

          return (
            <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">
              {/* Header + stepper */}
              <div className="flex items-end justify-between gap-4 mb-7 flex-wrap">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-yellow-600 mb-2 flex items-center gap-2">
                    <span className="h-0.5 w-5 bg-yellow-500 rounded-full" />
                    {c.spotlightLabel}
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                    {c.spotlightHeading}
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-gray-400 tabular-nums">
                    {String(idx + 1).padStart(2, "0")}
                    <span className="text-gray-300 dark:text-gray-600">
                      {" "}
                      / {String(n).padStart(2, "0")}
                    </span>
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => go(-1)}
                      aria-label="Previous"
                      className="w-9 h-9 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-yellow-400 hover:text-yellow-600 hover:-translate-y-0.5 transition-all"
                    >
                      <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                    </button>
                    <button
                      onClick={() => go(1)}
                      aria-label="Next"
                      className="w-9 h-9 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-yellow-400 hover:text-yellow-600 hover:-translate-y-0.5 transition-all"
                    >
                      <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Showcase panel */}
              <div
                onMouseEnter={() => (spotPausedRef.current = true)}
                onMouseLeave={() => (spotPausedRef.current = false)}
                className="relative rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xl shadow-gray-200/40 dark:shadow-black/40 grid md:grid-cols-2 md:h-[440px]"
              >
                {/* Stage — product image (clickable) */}
                <Link
                  href={hrefOf(active)}
                  prefetch={false}
                  aria-label={nameOf(active)}
                  className="group relative bg-white h-72 md:h-full overflow-hidden flex items-center justify-center cursor-pointer"
                >
                  <div className="pointer-events-none absolute -top-1/4 ltr:-right-1/4 rtl:-left-1/4 w-2/3 h-2/3 rounded-full bg-yellow-400/10 blur-3xl" />
                  <span className="absolute top-5 start-5 z-10 bg-yellow-500 text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md shadow-yellow-500/30">
                    {c.featured}
                  </span>
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={active.slug}
                      src={active.images?.[0]?.s3Url || "/hebat_product_fill.png"}
                      alt={nameOf(active)}
                      loading="eager"
                      initial={{ opacity: 0, scale: 0.92, filter: "blur(6px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 1.04, filter: "blur(6px)" }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="relative z-[1] w-full h-full object-contain p-10 md:p-14 drop-shadow-2xl"
                    />
                  </AnimatePresence>
                  <span className="pointer-events-none absolute inset-0 z-[2] group-hover:bg-yellow-400/[0.06] transition-colors duration-300" />
                </Link>

                {/* Info panel — dark, editorial */}
                <div className="relative bg-gray-950 text-white p-8 lg:p-11 flex flex-col justify-between overflow-hidden h-full">
                  {/* Ghost index */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-10 ltr:-right-2 rtl:-left-2 font-black text-white/[0.04] leading-none select-none"
                    style={{ fontSize: "190px" }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active.slug}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="relative z-[1]"
                    >
                      {catLabel && (
                        <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-400 border border-yellow-500/25 bg-yellow-500/10 rounded-full px-3 py-1">
                          {catLabel}
                        </span>
                      )}
                      <h3 className="mt-5 text-2xl sm:text-3xl lg:text-[2rem] font-black leading-tight tracking-tight [text-wrap:balance] line-clamp-3">
                        {nameOf(active)}
                      </h3>
                      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                        {active.model && (
                          <p className="text-white/50">
                            <span className="text-white/35">{t("model")}:</span>{" "}
                            <span className="font-mono text-white/80">{active.model}</span>
                          </p>
                        )}
                        {active.barcode && (
                          <p className="text-white/50">
                            <span className="text-white/35">{t("barcode")}:</span>{" "}
                            <span className="font-mono text-white/80">{active.barcode}</span>
                          </p>
                        )}
                      </div>
                      <Link
                        href={hrefOf(active)}
                        prefetch={false}
                        className="group mt-7 inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-2xl shadow-lg shadow-yellow-500/25 transition-all duration-200 hover:-translate-y-0.5 text-sm"
                      >
                        {c.viewProduct}
                        <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                      </Link>
                    </motion.div>
                  </AnimatePresence>

                  {/* Thumbnail rail */}
                  <div className="relative z-[1] mt-8 flex items-center gap-2.5">
                    {spotlight.map((prod, i) => {
                      const on = i === idx
                      return (
                        <button
                          key={prod.slug}
                          onClick={() => setSpotIndex(i)}
                          aria-label={nameOf(prod)}
                          className={`relative w-12 h-12 rounded-xl overflow-hidden bg-white flex-shrink-0 transition-all duration-200 ${
                            on
                              ? "ring-2 ring-yellow-500 ring-offset-2 ring-offset-gray-950"
                              : "opacity-50 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={prod.images?.[0]?.s3Url || "/hebat_product_fill.png"}
                            alt=""
                            loading="lazy"
                            className="w-full h-full object-contain p-1"
                          />
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Auto-advance progress bar */}
                <motion.div
                  key={idx}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 8, ease: "linear" }}
                  className="absolute bottom-0 start-0 end-0 h-1 bg-yellow-500 origin-start z-10"
                />
              </div>
            </section>
          )
        })()}

      {/* ─────────────── CONTROLS + GRID ─────────────── */}
      <div
        ref={gridRef}
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 w-full scroll-mt-20"
      >
        {/* Section header + sort */}
        <div className="flex items-end justify-between gap-4 flex-wrap mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-0.5 w-6 bg-yellow-500 rounded-full" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-yellow-500">
                {isLanding ? (isAr ? "التشكيلة" : "Collection") : t("products")}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white capitalize">
              {displayCategory || t("allProducts")}
            </h2>
            <p className="text-sm text-gray-400 font-medium mt-1">
              {showing.length} {showing.length !== 1 ? t("products") : t("product")}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs text-gray-400 font-medium hidden sm:block">
              {isAr ? "ترتيب:" : "Sort:"}
            </span>
            <div className="flex rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden text-xs font-semibold">
              {[
                { key: "default", label: isAr ? "افتراضي" : "Default" },
                { key: "az", label: isAr ? "أ–ي" : "A–Z" },
                { key: "za", label: isAr ? "ي–أ" : "Z–A" },
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setSortBy(opt.key)}
                  className={`px-3 py-1.5 transition-colors ${
                    sortBy === opt.key
                      ? "bg-yellow-500 text-black"
                      : "bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {visibleProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {visibleProducts.map((product, i) => {
              const firstCatObj = firstCatOf(product)
              const catLabel =
                !selectedCategory && firstCatObj
                  ? isAr && firstCatObj?.name_ar
                    ? firstCatObj.name_ar
                    : firstCatObj?.name
                  : null
              const isNew = !animatedSlugs.current.has(product.slug)
              if (isNew) animatedSlugs.current.add(product.slug)

              return (
                <ProductCard
                  key={product.slug}
                  product={product}
                  href={hrefOf(product)}
                  catLabel={catLabel}
                  productName={nameOf(product)}
                  isNew={isNew}
                  index={i}
                  t={t}
                />
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center mb-4">
              <Search className="w-7 h-7 text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
              {searchQuery ? `${t("noResults")} "${searchQuery}".` : t("noProducts")}
            </p>
          </div>
        )}

        {/* Infinite scroll sentinel */}
        {visibleCount < showing.length && (
          <div ref={sentinelRef} className="w-full h-16 mt-4 flex items-center justify-center">
            <div className="flex gap-1.5">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Scroll to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 end-6 z-50 w-10 h-10 rounded-full bg-yellow-500 hover:bg-yellow-400 text-black shadow-lg shadow-yellow-500/30 flex items-center justify-center transition-colors duration-200"
            aria-label="Back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
