"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import Client from "@/lib/api"
import { useLanguage } from "@/context/LanguageContext"
import PageDecorations from "@/components/PageDecorations"
import ProductCard from "@/components/ProductCard"

// How many products the page shows. 30 fills the grid's 2/3/5-column rows
// exactly and keeps "new" meaningful relative to the catalogue size.
export const NEW_ARRIVALS_LIMIT = 30

const slugify = str =>
  str
    ?.toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-") || ""

const T = {
  en: {
    label: "Just Landed",
    heading: "New Arrivals",
    subtext: "The freshest additions to the Hebat lineup — be the first to explore them.",
    count: n => `${n} latest ${n === 1 ? "product" : "products"}`,
    empty: "No new arrivals yet — check back soon.",
    browseAll: "Browse all products",
  },
  ar: {
    label: "وصل حديثاً",
    heading: "أحدث المنتجات",
    subtext: "أحدث الإضافات إلى تشكيلة هيبات — كن أول من يكتشفها.",
    count: n => `أحدث ${n} منتج`,
    empty: "لا توجد منتجات جديدة حالياً — عد قريباً.",
    browseAll: "تصفح جميع المنتجات",
  },
}

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

export default function NewArrivalsPage() {
  const { isAr, p, t } = useLanguage()
  const c = isAr ? T.ar : T.en

  const [products, setProducts] = useState([])
  const [configHeading, setConfigHeading] = useState(null)
  const [configHeading_ar, setConfigHeading_ar] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [configRes, prodRes] = await Promise.all([
        Client.get("/homepage-config").catch(() => ({ data: { config: null } })),
        Client.get("/products").catch(() => ({ data: { products: [] } })),
      ])

      const config = configRes.data.config
      if (config?.newArrivalsHeading) setConfigHeading(config.newArrivalsHeading)
      if (config?.newArrivalsHeading_ar) setConfigHeading_ar(config.newArrivalsHeading_ar)

      const recent = [...(prodRes.data.products || [])].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      )

      // Admin-picked arrivals lead (so everything in the homepage hero is here
      // too), then the most recently created products fill the rest.
      const merged = new Map()
      for (const pr of [...(config?.newArrivals || []), ...recent]) {
        const key = pr?._id || pr?.slug
        if (key && !merged.has(key)) merged.set(key, pr)
      }
      setProducts(Array.from(merged.values()).slice(0, NEW_ARRIVALS_LIMIT))
    }

    load().finally(() => setLoading(false))
  }, [])

  const heading = (isAr ? configHeading_ar : configHeading) || c.heading

  const firstCatOf = product =>
    Array.isArray(product.categories) && product.categories.length > 0
      ? product.categories[0]
      : product.category
  const hrefOf = product =>
    p(`/products/${slugify(firstCatOf(product)?.name || "others")}/${product.slug}`)
  const nameOf = product => (isAr && product.name_ar ? product.name_ar : product.name)

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hebatofficial.com/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "New Arrivals",
        item: "https://hebatofficial.com/new-arrivals",
      },
    ],
  }

  return (
    <div className="relative">
      <style>{`
        @keyframes product-in {
          0%   { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .product-card-enter { animation: product-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @media (prefers-reduced-motion: reduce) {
          .product-card-enter { animation: none; }
        }
      `}</style>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <PageDecorations />

      {/* ─── Header ─── */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-8">
        <header className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gray-950 ring-1 ring-white/[0.06]">
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute inset-0 opacity-[0.15]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.06) 1px, transparent 1px)",
                backgroundSize: "44px 44px",
              }}
            />
            <div className="absolute top-1/2 ltr:right-[10%] rtl:left-[10%] -translate-y-1/2 w-[320px] h-[320px] rounded-full bg-yellow-400/20 blur-[90px]" />
            <div className="absolute -top-16 ltr:-left-16 rtl:-right-16 w-64 h-64 rounded-full bg-yellow-500/10 blur-3xl" />
          </div>

          <div className="relative flex flex-col gap-5 p-6 sm:p-10 lg:p-12">
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-yellow-500/25 bg-yellow-500/10 px-3.5 py-1.5">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400">
                {c.label}
              </span>
            </div>

            <div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[0.95] text-white">
                {heading}
              </h1>
              <div className="mt-4 flex items-center gap-2">
                <span className="h-1 w-12 rounded-full bg-yellow-500" />
                <span className="h-1 w-4 rounded-full bg-yellow-500/30" />
              </div>
            </div>

            <p className="max-w-md text-sm leading-relaxed text-white/50">{c.subtext}</p>

            {!loading && products.length > 0 && (
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
                {c.count(products.length)}
              </span>
            )}
          </div>
        </header>
      </div>

      {/* ─── Grid ─── */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product, i) => {
              const cat = firstCatOf(product)
              return (
                <ProductCard
                  key={product.slug}
                  product={product}
                  href={hrefOf(product)}
                  catLabel={cat ? (isAr && cat.name_ar ? cat.name_ar : cat.name) : null}
                  productName={nameOf(product)}
                  isNew
                  index={i}
                  t={t}
                />
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center mb-4">
              <Sparkles className="w-7 h-7 text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">{c.empty}</p>
          </div>
        )}

        {!loading && (
          <div className="mt-12 flex justify-center">
            <Link
              href={p("/products")}
              className="group inline-flex items-center gap-2 px-7 py-3.5 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-2xl shadow-lg shadow-yellow-500/25 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 text-sm"
            >
              {c.browseAll}
              <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
