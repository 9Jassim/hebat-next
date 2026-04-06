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

const GRADIENTS = [
  "from-yellow-400 to-amber-500",
  "from-sky-400 to-blue-500",
  "from-emerald-400 to-teal-500",
  "from-rose-400 to-pink-500",
  "from-violet-400 to-purple-500",
  "from-orange-400 to-red-400",
  "from-cyan-400 to-indigo-400",
  "from-lime-400 to-green-500",
]

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

    load()
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
              <h1 className="text-5xl sm:text-6xl font-black text-gray-950 leading-[1.04] tracking-tight whitespace-pre-line">
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
                  <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-yellow-50 border border-yellow-100 flex items-center justify-center shadow-sm">
                    <Icon className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
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
                className="absolute bottom-2 ltr:left-0 rtl:right-0 bg-white rounded-2xl shadow-xl px-4 py-3 border border-gray-100/80 flex items-center gap-3 z-10"
              >
                <div className="w-9 h-9 rounded-xl bg-yellow-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-yellow-500/30">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 leading-snug">{c.badge1}</p>
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
        {products.length > 0 && (
          <FadeUp className="mx-auto max-w-7xl px-6 lg:px-8 pt-10 pb-14">
            {/* Section header */}
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-yellow-600 mb-1.5">
                  {c.productsLabel}
                </p>
                <h2 className="text-3xl font-black text-gray-950 tracking-tight leading-none">
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
                        className="group col-span-2 row-span-2 relative rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col min-h-[380px]"
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
                        <div className="px-6 py-5 border-t border-gray-100">
                          <p className="text-base font-black text-gray-900 line-clamp-2 group-hover:text-yellow-600 transition-colors leading-snug">
                            {featuredName}
                          </p>
                          {featured?.model && (
                            <p className="text-xs text-gray-400 font-mono mt-1">{featured.model}</p>
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
                            href={p(`/products/${slugify(cat?.name || "others")}/${product.slug}`)}
                            onMouseEnter={() => {
                              isPaused.current = true
                            }}
                            onMouseLeave={() => {
                              isPaused.current = false
                            }}
                            className="group relative rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                          >
                            <div className="p-3 flex-shrink-0 h-44">
                              <div className="relative w-full h-full rounded-xl bg-white border border-gray-100 overflow-hidden flex items-center justify-center">
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
                            <div className="px-3 py-3 border-t border-gray-100 flex flex-col gap-0.5 flex-grow">
                              <p className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-yellow-600 transition-colors leading-snug">
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
          </FadeUp>
        )}

        {/* ─── Categories ─── */}
        {categories.length > 0 && (
          <FadeUp className="mx-auto max-w-7xl px-6 lg:px-8 pb-14 pt-4">
            {/* Section header */}
            <div className="flex items-end justify-between mb-7">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-yellow-600 mb-1.5">
                  {c.categoriesLabel}
                </p>
                <h2 className="text-3xl font-black text-gray-950 tracking-tight leading-none">
                  {c.categoriesHeading}
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

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {categories.slice(0, 10).map((cat, i) => {
                const name = isAr && cat.name_ar ? cat.name_ar : cat.name
                const gradient = GRADIENTS[i % GRADIENTS.length]
                const hasChildren = cat.children?.length > 0
                const isExpanded = expandedCat === cat._id

                return (
                  <Link
                    key={cat._id}
                    href={p(`/products/${slugify(cat.name)}`)}
                    onClick={e => {
                      if (hasChildren) {
                        e.preventDefault()
                        setExpandedCat(isExpanded ? null : cat._id)
                      }
                    }}
                    className={`group relative flex flex-col justify-between rounded-2xl overflow-hidden h-32 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br ${gradient} ${isExpanded ? "ring-2 ring-offset-2 ring-yellow-400" : ""}`}
                  >
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />

                    {/* Index number */}
                    <span className="relative z-10 px-3 pt-3 text-white/30 font-black text-2xl leading-none tabular-nums select-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* Name + icon */}
                    <div className="relative z-10 px-3 pb-3 flex items-end justify-between gap-1">
                      <span className="text-white font-bold text-sm leading-tight drop-shadow-sm">
                        {name}
                      </span>
                      {hasChildren ? (
                        <ChevronDown
                          className={`w-4 h-4 text-white/70 flex-shrink-0 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                        />
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5 text-white/50 flex-shrink-0 rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
                      )}
                    </div>
                  </Link>
                )
              })}

              {/* Subcategory expand panel */}
              <AnimatePresence>
                {expandedCat &&
                  (() => {
                    const expandedIdx = categories.findIndex(c => c._id === expandedCat)
                    const cat = categories[expandedIdx]
                    if (!cat?.children?.length) return null
                    const gradient = GRADIENTS[expandedIdx % GRADIENTS.length]
                    return (
                      <motion.div
                        key={expandedCat}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="col-span-full overflow-hidden"
                      >
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 pt-2 pb-1">
                          {cat.children.map((sub, si) => {
                            const subName = isAr && sub.name_ar ? sub.name_ar : sub.name
                            return (
                              <motion.div
                                key={sub._id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: si * 0.04 }}
                              >
                                <Link
                                  href={p(`/products/${slugify(sub.name)}`)}
                                  className={`group relative flex items-center justify-between gap-2 px-4 py-3 rounded-xl overflow-hidden bg-gradient-to-br ${gradient} shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
                                >
                                  <div className="absolute inset-0 bg-white/50 group-hover:bg-white/40 transition-colors" />
                                  <span className="relative z-10 text-gray-800 font-semibold text-sm leading-snug">
                                    {subName}
                                  </span>
                                  <ArrowRight className="relative z-10 w-3.5 h-3.5 text-gray-600 flex-shrink-0 rtl:rotate-180 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-all" />
                                </Link>
                              </motion.div>
                            )
                          })}
                        </div>
                      </motion.div>
                    )
                  })()}
              </AnimatePresence>
            </div>
          </FadeUp>
        )}
      </div>
      {/* end categories+products wrapper */}
    </section>
  )
}
