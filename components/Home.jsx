"use client"

import Link from "next/link"
import Banners from "@/components/Banners"
import { useLanguage } from "@/context/LanguageContext"
import { useEffect, useState, useRef } from "react"
import Client from "@/lib/api"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { ShieldCheck, Layers, Star, ChevronDown, ArrowRight, ArrowUpRight, Zap } from "lucide-react"
import PageDecorations from "@/components/PageDecorations"

const slugify = str =>
  str
    ?.toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-") || ""

function FadeUp({ children, delay = 0, className = "" }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

const TICKER_ITEMS = [
  "HEBAT",
  "هيبات",
  "QUALITY",
  "جودة",
  "INNOVATION",
  "ابتكار",
  "HEBAT",
  "هيبات",
  "EXCELLENCE",
  "تميز",
  "DIVERSITY",
  "تنوع",
]

const translations = {
  en: {
    tagline: "HEBAT",
    heading: "Crafted for Quality,\nBuilt to Impress",
    badge1: "Quality Guaranteed",
    values: [
      {
        Icon: ShieldCheck,
        title: "Uncompromising Quality",
        desc: "Every product held to the highest standards of craftsmanship.",
      },
      {
        Icon: Layers,
        title: "Diverse Range",
        desc: "A wide lineup designed for every lifestyle.",
      },
      {
        Icon: Star,
        title: "A Brand You Trust",
        desc: "Hebat stands for reliability, innovation, and excellence.",
      },
    ],
    externalCta: "Buy on Morslon",
    browseCta: "Explore Products",
    categoriesHeading: "Our Categories",
    categoriesLabel: "Browse",
    productsHeading: "Our Products",
    productsLabel: "Featured",
    viewAll: "View All",
  },
  ar: {
    tagline: "هيبات",
    heading: "مصنوع بجودة،\nمبني ليبهر",
    badge1: "جودة مضمونة",
    values: [
      {
        Icon: ShieldCheck,
        title: "جودة لا تُساوم",
        desc: "كل منتج يُصنع وفق أعلى معايير الجودة والإتقان.",
      },
      {
        Icon: Layers,
        title: "تشكيلة متنوعة",
        desc: "مجموعة واسعة من المنتجات المصممة لكل أسلوب حياة.",
      },
      {
        Icon: Star,
        title: "علامة تجارية تثق بها",
        desc: "هيبات تعني الموثوقية والابتكار والتميز.",
      },
    ],
    externalCta: "اشتري على مورسلون",
    browseCta: "استعرض المنتجات",
    categoriesHeading: "تصنيفاتنا",
    categoriesLabel: "تصفح",
    productsHeading: "منتجاتنا",
    productsLabel: "مميز",
    viewAll: "عرض الكل",
  },
}

export default function Home() {
  const { locale, isAr, p } = useLanguage()
  const c = translations[locale] || translations.en

  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [configHeading, setConfigHeading] = useState(null)
  const [configHeading_ar, setConfigHeading_ar] = useState(null)
  const FEATURED_PAGE = 7
  const [pageIndex, setPageIndex] = useState(0)
  const [spotlightPos, setSpotlightPos] = useState(0)
  const isPaused = useRef(false)

  const heading = (isAr ? configHeading_ar : configHeading) || c.heading

  const numPages = Math.max(1, Math.ceil(products.length / FEATURED_PAGE))

  useEffect(() => {
    if (products.length < 2) return
    const id = setInterval(() => {
      if (isPaused.current) return
      setPageIndex(prev => (prev + 1) % numPages)
      setSpotlightPos(Math.floor(Math.random() * Math.min(FEATURED_PAGE, products.length)))
    }, 8000)
    return () => clearInterval(id)
  }, [products.length, numPages])
  const [expandedCat, setExpandedCat] = useState(null)

  useEffect(() => {
    const load = async () => {
      const [configRes, catRes, prodRes] = await Promise.all([
        Client.get("/homepage-config").catch(() => ({ data: { config: null } })),
        Client.get("/products/category").catch(() => ({ data: { categories: [] } })),
        Client.get("/products").catch(() => ({ data: { products: [] } })),
      ])

      const config = configRes.data.config

      if (config?.heroHeading) setConfigHeading(config.heroHeading)
      if (config?.heroHeading_ar) setConfigHeading_ar(config.heroHeading_ar)

      const allCats = catRes.data.categories || []
      const catMap = {}
      allCats.forEach(cat => {
        catMap[cat._id] = { ...cat, children: [] }
      })
      allCats.forEach(cat => {
        const parentId = cat.parent?._id || cat.parent
        if (parentId && catMap[parentId]) catMap[parentId].children.push(catMap[cat._id])
      })
      const rootsWithChildren = allCats.filter(cat => !cat.parent).map(cat => catMap[cat._id])

      if (config?.featuredCategories?.length) {
        const configIds = new Set(config.featuredCategories.map(c => c._id || c))
        setCategories(rootsWithChildren.filter(cat => configIds.has(cat._id)))
      } else {
        setCategories(rootsWithChildren)
      }

      if (config?.featuredProducts?.length) {
        setProducts(config.featuredProducts)
      } else {
        const all = prodRes.data.products || []
        const unique = Array.from(new Map(all.map(pr => [pr._id || pr.slug, pr])).values())
        setProducts(unique.slice(0, 12))
      }
    }

    load().finally(() => setLoading(false))
  }, [])

  return (
    <section className="relative overflow-x-hidden">
      {/* ─── Side decorations (desktop only) ─── */}
      <div className="pointer-events-none select-none hidden xl:block absolute inset-0 z-0">
        {/* LEFT column */}
        <div className="absolute left-3 top-[8%] flex flex-col items-center gap-2.5">
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-yellow-400/35 to-transparent" />
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/50" />
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-yellow-500/45 [writing-mode:vertical-rl] rotate-180">
            {isAr ? "هيبات" : "HEBAT"}
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/50" />
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-yellow-400/35 to-transparent" />
        </div>

        <div className="absolute left-3 top-[32%] flex flex-col items-center gap-2.5">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-yellow-400/25 to-transparent" />
          <div className="w-3 h-3 rounded-sm border border-yellow-400/40 rotate-45" />
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-yellow-400/25 to-transparent" />
        </div>

        <div className="absolute left-3 top-[58%] flex flex-col items-center gap-2.5">
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-yellow-400/35 to-transparent" />
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/50" />
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-yellow-500/45 [writing-mode:vertical-rl] rotate-180">
            {isAr ? "جودة" : "QUALITY"}
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/50" />
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-yellow-400/35 to-transparent" />
        </div>

        <div className="absolute left-3 top-[82%] flex flex-col items-center gap-2.5">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-yellow-400/20 to-transparent" />
          <div className="w-3 h-3 rounded-sm border border-yellow-400/35 rotate-45" />
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-yellow-400/20 to-transparent" />
        </div>

        {/* RIGHT column */}
        <div className="absolute right-3 top-[15%] flex flex-col items-center gap-2.5">
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-yellow-400/35 to-transparent" />
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/50" />
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-yellow-500/45 [writing-mode:vertical-rl]">
            {isAr ? "ابتكار" : "INNOVATION"}
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/50" />
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-yellow-400/35 to-transparent" />
        </div>

        <div className="absolute right-3 top-[42%] flex flex-col items-center gap-2.5">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-yellow-400/25 to-transparent" />
          <div className="w-3 h-3 rounded-sm border border-yellow-400/40 rotate-45" />
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-yellow-400/25 to-transparent" />
        </div>

        <div className="absolute right-3 top-[65%] flex flex-col items-center gap-2.5">
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-yellow-400/35 to-transparent" />
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/50" />
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-yellow-500/45 [writing-mode:vertical-rl]">
            {isAr ? "تميز" : "EXCELLENCE"}
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/50" />
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-yellow-400/35 to-transparent" />
        </div>

        <div className="absolute right-3 top-[88%] flex flex-col items-center gap-2.5">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-yellow-400/20 to-transparent" />
          <div className="w-3 h-3 rounded-sm border border-yellow-400/35 rotate-45" />
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-yellow-400/20 to-transparent" />
        </div>
      </div>

      <PageDecorations />

      {/* ─── Banners ─── */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-10 pt-8 pb-0">
        <div className="mx-auto max-w-7xl">
          <Banners />
        </div>
      </div>

      {/* ─── Hero ─── */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 pt-14 pb-10">
        {/* Background decorations */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute ltr:right-[5%] rtl:left-[5%] top-[10%] w-[320px] h-[320px] rounded-full bg-yellow-400/10 blur-3xl" />
          <div className="absolute ltr:left-[5%] rtl:right-[5%] bottom-[5%] w-8 h-8 border-2 border-yellow-500/20 rotate-12" />
          <div className="absolute ltr:left-[2%] rtl:right-[2%] top-[20%] w-4 h-4 rounded-full bg-yellow-500/20" />
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* ── Left: Text ── */}
          <div className="flex flex-col gap-7 z-10">
            {/* Brand badge */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="inline-flex items-center gap-2 self-start bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-1.5"
            >
              <Zap className="w-3 h-3 fill-yellow-500 text-yellow-500" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-yellow-600">
                {c.tagline}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="text-5xl sm:text-6xl font-black text-gray-950 dark:text-white leading-[1.04] tracking-tight whitespace-pre-line">
                {heading}
              </h1>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-1 w-12 rounded-full bg-yellow-500" />
                <div className="h-1 w-4 rounded-full bg-yellow-500/30" />
              </div>
            </motion.div>

            {/* Value props */}
            <div className="flex flex-col gap-4">
              {c.values.map(({ Icon, title, desc }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: isAr ? 16 : -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5, ease: "easeOut" }}
                  className="flex items-start gap-3.5"
                >
                  <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-100 dark:border-yellow-500/20 flex items-center justify-center shadow-sm">
                    <Icon className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5, ease: "easeOut" }}
              className="flex flex-wrap gap-3"
            >
              <Link
                href={p("/products")}
                className="group inline-flex items-center gap-2 px-7 py-3.5 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-2xl shadow-lg shadow-yellow-500/25 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 text-sm"
              >
                {c.browseCta}
                <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() => window.open("https://morslon.com/", "_blank")}
                className="group inline-flex items-center gap-2 px-7 py-3.5 bg-gray-950 hover:bg-gray-800 text-white font-bold rounded-2xl transition-all duration-200 hover:-translate-y-0.5 text-sm"
              >
                {c.externalCta}
                <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </motion.div>
          </div>

          {/* ── Right: Image ── */}
          <FadeUp delay={0.2} className="flex justify-center items-center">
            <div className="relative w-full max-w-md pt-6 pb-10 px-4">
              {/* Floating image */}
              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <Link href={p("/products")}>
                  <img
                    src="/hebat_cover.png"
                    alt="Hebat Product Showcase"
                    className="relative w-full rounded-3xl object-contain max-h-[28rem] drop-shadow-2xl"
                  />
                </Link>
              </motion.div>

              {/* Floating badge bottom-left */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5, ease: "easeOut" }}
                className="absolute bottom-2 ltr:left-0 rtl:right-0 bg-white dark:bg-gray-800 rounded-2xl shadow-xl px-4 py-3 border border-gray-100/80 dark:border-gray-700 flex items-center gap-3 z-10"
              >
                <div className="w-9 h-9 rounded-xl bg-yellow-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-yellow-500/30">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white leading-snug">
                    {c.badge1}
                  </p>
                  <div className="flex gap-0.5 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Floating badge top-right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.85, duration: 0.5, ease: "easeOut" }}
                className="absolute top-2 ltr:right-0 rtl:left-0 bg-yellow-500 rounded-2xl shadow-lg shadow-yellow-500/30 px-3 py-2 z-10"
              >
                <p className="text-[10px] font-black text-black uppercase tracking-wider">
                  {isAr ? "علامة موثوقة" : "Trusted Brand"}
                </p>
              </motion.div>
            </div>
          </FadeUp>
        </div>
      </div>

      {/* ─── Ticker Strip ─── */}
      <style>{`
        @keyframes hebat-ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .hebat-ticker-track {
          animation: hebat-ticker 24s linear infinite;
          will-change: transform;
        }
      `}</style>
      <div className="relative z-10 w-full overflow-hidden bg-yellow-500 py-3.5 my-10">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-yellow-500 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-yellow-500 to-transparent z-10" />

        <div className="hebat-ticker-track flex whitespace-nowrap" dir="ltr">
          {Array.from({ length: 6 }, () => TICKER_ITEMS)
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

      {/* ─── Categories + Products wrapper ─── */}
      <div className="relative z-10">
        {/* ─── Featured Products ─── */}
        {loading ? (
          <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-10 pb-14">
            {/* Header skeleton */}
            <div className="flex items-end justify-between mb-8">
              <div className="space-y-2">
                <div className="h-2.5 w-16 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
                <div className="h-8 w-48 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
              </div>
              <div className="h-4 w-16 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
            </div>
            {/* Cards skeleton */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="col-span-2 row-span-2 rounded-3xl bg-gray-100 dark:bg-gray-800 animate-pulse min-h-[380px]" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse h-64"
                />
              ))}
            </div>
          </div>
        ) : (
          products.length > 0 && (
            <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-10 pb-14">
              {/* Section header */}
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-yellow-600 mb-1.5">
                    {c.productsLabel}
                  </p>
                  <h2 className="text-3xl font-black text-gray-950 dark:text-white tracking-tight leading-none">
                    {c.productsHeading}
                  </h2>
                </div>
                <Link
                  href={p("/products")}
                  className="group flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-yellow-600 transition-colors"
                >
                  {c.viewAll}
                  <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {(() => {
                const n = products.length
                const pageOffset = (pageIndex * FEATURED_PAGE) % n
                const page = Array.from(
                  { length: Math.min(FEATURED_PAGE, n) },
                  (_, i) => products[(pageOffset + i) % n]
                )
                const clampedPos = spotlightPos % page.length
                const featured = page[clampedPos]
                const featuredCat =
                  Array.isArray(featured?.categories) && featured.categories.length > 0
                    ? featured.categories[0]
                    : featured?.category
                const featuredName = isAr && featured?.name_ar ? featured.name_ar : featured?.name
                const gridProducts = page.filter((_, i) => i !== clampedPos)

                return (
                  <div
                    className="relative"
                    onMouseEnter={() => {
                      isPaused.current = true
                    }}
                    onMouseLeave={() => {
                      isPaused.current = false
                    }}
                  >
                    {/* Progress bar */}
                    <motion.div
                      key={`bar-${pageIndex}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 8, ease: "linear" }}
                      className="absolute -top-3 start-0 end-0 h-0.5 bg-yellow-500/40 origin-start rounded-full"
                    />

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={pageIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
                      >
                        {/* ── Spotlight card ── */}
                        <Link
                          href={p(
                            `/products/${slugify(featuredCat?.name || "others")}/${featured?.slug}`
                          )}
                          onMouseEnter={() => {
                            isPaused.current = true
                          }}
                          onMouseLeave={() => {
                            isPaused.current = false
                          }}
                          className="group col-span-2 row-span-2 relative rounded-3xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700/50 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col min-h-[380px]"
                        >
                          <div className="relative flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white overflow-hidden min-h-[300px]">
                            <div className="absolute inset-0 bg-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <img
                              src={featured?.images?.[0]?.s3Url || "/hebat_product_fill.png"}
                              alt={featuredName}
                              loading="eager"
                              className="absolute inset-0 w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-500 drop-shadow-xl"
                            />
                            <span className="absolute top-4 start-4 bg-yellow-500 text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md shadow-yellow-500/30">
                              {isAr ? "مميز" : "Featured"}
                            </span>
                          </div>
                          <div className="px-6 py-5 border-t border-gray-100 dark:border-gray-700/50">
                            <p className="text-base font-black text-gray-900 dark:text-white line-clamp-2 group-hover:text-yellow-600 transition-colors leading-snug">
                              {featuredName}
                            </p>
                            {featured?.model && (
                              <p className="text-xs text-gray-400 font-mono mt-1">
                                {featured.model}
                              </p>
                            )}
                            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-yellow-600">
                              {isAr ? "اعرف أكثر" : "View product"}
                              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                            </div>
                          </div>
                          <div className="absolute bottom-0 start-0 end-0 h-1 bg-yellow-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-start" />
                        </Link>

                        {/* ── Grid cards ── */}
                        {gridProducts.map(product => {
                          const cat =
                            Array.isArray(product.categories) && product.categories.length > 0
                              ? product.categories[0]
                              : product.category
                          const name = isAr && product.name_ar ? product.name_ar : product.name
                          return (
                            <Link
                              key={product.slug}
                              href={p(
                                `/products/${slugify(cat?.name || "others")}/${product.slug}`
                              )}
                              onMouseEnter={() => {
                                isPaused.current = true
                              }}
                              onMouseLeave={() => {
                                isPaused.current = false
                              }}
                              className="group relative rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                            >
                              <div className="p-3 flex-shrink-0 h-44">
                                <div className="relative w-full h-full rounded-xl bg-white border border-gray-100 dark:border-gray-700/30 overflow-hidden flex items-center justify-center">
                                  <img
                                    src={product.images?.[0]?.s3Url || "/hebat_product_fill.png"}
                                    alt={name}
                                    loading="lazy"
                                    decoding="async"
                                    draggable="false"
                                    className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500"
                                  />
                                </div>
                              </div>
                              <div className="px-3 py-3 border-t border-gray-100 dark:border-gray-700/50 flex flex-col gap-0.5 flex-grow">
                                <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-yellow-600 transition-colors leading-snug">
                                  {name}
                                </p>
                                {product.model && (
                                  <p className="text-xs text-gray-400 font-mono">{product.model}</p>
                                )}
                              </div>
                              <div className="absolute bottom-0 start-0 end-0 h-0.5 bg-yellow-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-start" />
                            </Link>
                          )
                        })}
                      </motion.div>
                    </AnimatePresence>

                    {/* Dot indicators — one per page */}
                    {numPages > 1 && (
                      <div className="flex items-center justify-center gap-1.5 mt-6">
                        {Array.from({ length: numPages }, (_, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setPageIndex(i)
                              setSpotlightPos(Math.floor(Math.random() * FEATURED_PAGE))
                            }}
                            className={`rounded-full transition-all duration-300 ${pageIndex === i ? "w-5 h-1.5 bg-yellow-500" : "w-1.5 h-1.5 bg-gray-300 hover:bg-yellow-400"}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })()}
            </div>
          )
        )}

        {/* ─── Categories — closing section ─── */}
        {loading ? (
          <div className="px-4 sm:px-6 lg:px-8 pb-10 pt-4">
            <div className="mx-auto max-w-7xl bg-gray-100 dark:bg-gray-800 rounded-3xl animate-pulse h-96" />
          </div>
        ) : (
          categories.length > 0 && (
            <div className="px-4 sm:px-6 lg:px-8 pb-10 pt-4">
              <div className="mx-auto max-w-7xl bg-gray-950 rounded-3xl overflow-hidden ring-1 ring-white/[0.06]">
                {/* Header */}
                <div className="px-8 lg:px-12 pt-10 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.07]">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.45em] text-yellow-500/80 mb-2">
                      {c.categoriesLabel}
                    </p>
                    <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-none">
                      {c.categoriesHeading}
                    </h2>
                  </div>
                  <Link
                    href={p("/products")}
                    className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 text-white/60 hover:text-white hover:border-yellow-500/50 hover:bg-yellow-500/10 transition-all duration-200 text-sm font-semibold flex-shrink-0"
                  >
                    {c.viewAll}
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
                  </Link>
                </div>

                {/* Category rows */}
                <div>
                  {categories.slice(0, 10).map((cat, i) => {
                    const name = isAr && cat.name_ar ? cat.name_ar : cat.name
                    const hasChildren = cat.children?.length > 0
                    const isExpanded = expandedCat === cat._id

                    return (
                      <div key={cat._id}>
                        <Link
                          href={p(`/products/${slugify(cat.name)}`)}
                          onClick={e => {
                            if (hasChildren) {
                              e.preventDefault()
                              setExpandedCat(isExpanded ? null : cat._id)
                            }
                          }}
                          className={`group flex items-center gap-5 px-8 lg:px-12 py-5 border-b border-white/[0.06] hover:bg-yellow-500/[0.07] transition-all duration-300 ${isExpanded ? "bg-white/5" : ""}`}
                        >
                          {/* Index */}
                          <span className="text-white/20 font-black text-xs tabular-nums w-6 select-none flex-shrink-0">
                            {String(i + 1).padStart(2, "0")}
                          </span>

                          {/* Name */}
                          <span className="text-white/80 group-hover:text-white font-bold text-lg sm:text-xl flex-1 transition-colors duration-200 leading-tight">
                            {name}
                          </span>

                          {/* Child count */}
                          {hasChildren && (
                            <span className="text-white/30 text-xs font-medium hidden sm:block flex-shrink-0">
                              {cat.children.length} {isAr ? "تصنيف فرعي" : "subcategories"}
                            </span>
                          )}

                          {/* Arrow / chevron */}
                          {hasChildren ? (
                            <ChevronDown
                              className={`w-4 h-4 text-white/30 group-hover:text-white/60 flex-shrink-0 transition-all duration-300 ${isExpanded ? "rotate-180" : ""}`}
                            />
                          ) : (
                            <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-yellow-400 flex-shrink-0 rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-all duration-200" />
                          )}
                        </Link>

                        {/* Subcategory expand */}
                        <AnimatePresence>
                          {isExpanded && cat.children?.length > 0 && (
                            <motion.div
                              key={cat._id + "-sub"}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden bg-white/[0.03]"
                            >
                              <div className="px-8 lg:px-12 py-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                {cat.children.map((sub, si) => {
                                  const subName = isAr && sub.name_ar ? sub.name_ar : sub.name
                                  return (
                                    <motion.div
                                      key={sub._id}
                                      initial={{ opacity: 0, x: isAr ? 8 : -8 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ duration: 0.2, delay: si * 0.03 }}
                                    >
                                      <Link
                                        href={p(`/products/${slugify(sub.name)}`)}
                                        className="group flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border border-white/10 hover:border-yellow-500/40 hover:bg-yellow-500/10 transition-all duration-200"
                                      >
                                        <span className="text-white/60 group-hover:text-white text-sm font-medium transition-colors truncate">
                                          {subName}
                                        </span>
                                        <ArrowRight className="w-3 h-3 text-white/20 group-hover:text-yellow-400 flex-shrink-0 rtl:rotate-180 transition-colors" />
                                      </Link>
                                    </motion.div>
                                  )
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </div>

                {/* Bottom CTA */}
                <div className="px-8 lg:px-12 py-8 flex items-center justify-between gap-4 flex-wrap">
                  <p className="text-white/30 text-sm">
                    {isAr
                      ? `${categories.length} تصنيف متاح`
                      : `${categories.length} categories available`}
                  </p>
                  <Link
                    href={p("/products")}
                    className="group inline-flex items-center gap-2.5 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-2xl transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-yellow-500/20 text-sm"
                  >
                    {c.browseCta}
                    <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          )
        )}
      </div>
      {/* end categories+products wrapper */}
    </section>
  )
}
