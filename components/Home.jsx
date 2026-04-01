"use client"

import Link from "next/link"
import Banners from "@/components/Banners"
import { useLanguage } from "@/context/LanguageContext"
import { useEffect, useState, useRef } from "react"
import Client from "@/lib/api"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { ShieldCheck, Layers, Star, ChevronDown } from "lucide-react"
import { useDragScroll } from "@/hooks/useDragScroll"

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
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

const translations = {
  en: {
    tagline: "HEBAT",
    heading: "Crafted for Quality,\nBuilt to Impress",
    values: [
      {
        Icon: ShieldCheck,
        title: "Uncompromising Quality",
        desc: "Every product is held to the highest standards of craftsmanship.",
      },
      {
        Icon: Layers,
        title: "Diverse Range",
        desc: "A wide lineup of products designed for every lifestyle.",
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
    productsHeading: "Our Products",
    viewAll: "View All",
  },
  ar: {
    tagline: "هيبات",
    heading: "مصنوع بجودة،\nمبني ليبهر",
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
    productsHeading: "منتجاتنا",
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

  const heading = (isAr ? configHeading_ar : configHeading) || c.heading
  const dragScroll = useDragScroll()
  const [expandedCat, setExpandedCat] = useState(null)

  useEffect(() => {
    const load = async () => {
      const [configRes, catRes, prodRes] = await Promise.all([
        Client.get("/homepage-config").catch(() => ({ data: { config: null } })),
        Client.get("/products/category").catch(() => ({ data: { categories: [] } })),
        Client.get("/products").catch(() => ({ data: { products: [] } })),
      ])

      const config = configRes.data.config

      // Hero heading overrides
      if (config?.heroHeading) setConfigHeading(config.heroHeading)
      if (config?.heroHeading_ar) setConfigHeading_ar(config.heroHeading_ar)

      // Build category tree so every root cat has its children attached
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

      // Products: use configured ones if set, otherwise first 12
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
    <section className="relative bg-gray-50 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 ltr:bg-gradient-to-br rtl:bg-gradient-to-bl from-yellow-50 via-white to-white -z-10" />

      {/* ─── Banners ───
      <div className="w-full px-4 sm:px-6 lg:px-10 pt-8 pb-4">
        <div className="mx-auto max-w-7xl">
          <Banners />
        </div>
      </div> */}

      {/* ─── Hero ─── */}
      <FadeUp className="mx-auto max-w-7xl px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="flex flex-col gap-7">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-500 mb-3">
                {c.tagline}
              </p>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight whitespace-pre-line">
                {heading}
              </h1>
            </div>

            {/* Value props */}
            <div className="flex flex-col gap-5">
              {c.values.map(({ Icon, title, desc }, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-yellow-100 flex items-center justify-center shadow-sm">
                    <Icon className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 leading-snug">{title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                href={p("/products")}
                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-xl shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              >
                {c.browseCta}
              </Link>
              <button
                onClick={() => window.open("https://morslon.com/", "_blank")}
                className="px-6 py-3 border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50 font-semibold rounded-xl transition-all duration-200"
              >
                {c.externalCta}
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="flex justify-center items-center relative">
            <Link
              href={p("/products")}
              className="relative block w-[90%] md:w-[34rem] lg:w-[38rem] transition-transform duration-500 ease-in-out hover:scale-105"
            >
              <div className="absolute inset-0 bg-yellow-400 rounded-3xl -rotate-3 translate-x-3 translate-y-3 opacity-20" />
              <img
                src="/hebat_cover.png"
                alt="Hebat Product Showcase"
                className="relative w-full rounded-3xl shadow-2xl object-contain max-h-[28rem]"
              />
            </Link>
          </div>
        </div>
      </FadeUp>

      {/* ─── Categories ─── */}
      {categories.length > 0 && (
        <FadeUp className="mx-auto max-w-7xl px-6 lg:px-8 pb-14">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-gray-900">{c.categoriesHeading}</h2>
            <Link
              href={p("/products")}
              className="text-sm font-medium text-yellow-600 hover:text-yellow-700 hover:underline"
            >
              {c.viewAll} →
            </Link>
          </div>

          {/* Parent category tiles + inline subcategory accordion */}
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
                  className={`group relative flex items-end rounded-2xl overflow-hidden h-28 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br ${gradient} ${isExpanded ? "ring-2 ring-white/60" : ""}`}
                >
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                  <span className="relative z-10 w-full px-3 pb-3 text-white font-semibold text-sm leading-tight drop-shadow flex items-center justify-between gap-1">
                    {name}
                    {hasChildren && (
                      <ChevronDown
                        className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                      />
                    )}
                  </span>
                </Link>
              )
            })}

            {/* Subcategory expand panel — spans all columns */}
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
                                {/* White wash to create a pastel/tinted look */}
                                <div className="absolute inset-0 bg-white/50 group-hover:bg-white/40 transition-colors" />
                                <span className="relative z-10 text-gray-800 font-semibold text-sm leading-snug">
                                  {subName}
                                </span>
                                <ChevronDown className="relative z-10 w-3.5 h-3.5 text-gray-600 -rotate-90 flex-shrink-0 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
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

      {/* ─── Featured Products ─── */}
      {products.length > 0 && (
        <FadeUp className="mx-auto max-w-7xl px-6 lg:px-8 pb-16">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-gray-900">{c.productsHeading}</h2>
            <Link
              href={p("/products")}
              className="text-sm font-medium text-yellow-600 hover:text-yellow-700 hover:underline"
            >
              {c.viewAll} →
            </Link>
          </div>

          <div
            ref={dragScroll.ref}
            onMouseDown={dragScroll.onMouseDown}
            onMouseUp={dragScroll.onMouseUp}
            onMouseLeave={dragScroll.onMouseLeave}
            onMouseMove={dragScroll.onMouseMove}
            onClickCapture={dragScroll.onClickCapture}
            onDragStart={e => e.preventDefault()}
            className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 cursor-grab select-none"
            dir="ltr"
          >
            {products.map(product => {
              const firstCat =
                Array.isArray(product.categories) && product.categories.length > 0
                  ? product.categories[0]
                  : product.category
              const catSlug = firstCat?.name || "others"
              const name = isAr && product.name_ar ? product.name_ar : product.name

              return (
                <Link
                  key={product.slug}
                  href={p(`/products/${slugify(catSlug)}/${product.slug}`)}
                  className="group flex-shrink-0 w-44 sm:w-52 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-[300px]"
                >
                  <div className="p-3 h-48 flex-shrink-0">
                    <div className="relative w-full h-full rounded-xl border border-gray-200 bg-white overflow-hidden shadow-md flex items-center justify-center">
                      <img
                        src={product.images?.[0]?.s3Url || "/hebat_product_fill.png"}
                        alt={name}
                        loading="lazy"
                        decoding="async"
                        draggable="false"
                        className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  <div className="px-3 pb-3 flex-grow flex flex-col justify-between">
                    <p className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-yellow-500 transition-colors leading-snug">
                      {name}
                    </p>
                    {product.model && <p className="text-xs text-gray-400 mt-1">{product.model}</p>}
                  </div>
                </Link>
              )
            })}
          </div>
        </FadeUp>
      )}
    </section>
  )
}
