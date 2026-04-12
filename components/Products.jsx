"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Client from "@/lib/api"
import { useLanguage } from "@/context/LanguageContext"
import PageDecorations from "@/components/PageDecorations"

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

function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col animate-pulse">
      <div className="aspect-square bg-gray-100 m-3 rounded-xl" />
      <div className="px-3 pb-4 space-y-2">
        <div className="h-4 bg-gray-100 rounded-full w-4/5" />
        <div className="h-3 bg-gray-100 rounded-full w-3/5" />
        <div className="h-3 bg-gray-100 rounded-full w-2/5 mt-1" />
      </div>
    </div>
  )
}

export default function Products() {
  const params = useParams()
  const { isAr, p, t } = useLanguage()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategoryFromQuery, setSelectedCategoryFromQuery] = useState(null)

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search)
    setSelectedCategoryFromQuery(sp.get("category"))
    setSearchQuery(sp.get("search")?.trim() || "")
  }, [])

  const selectedCategoryFromPath = params?.category
  const selectedCategory = selectedCategoryFromPath || selectedCategoryFromQuery

  const [showing, setShowing] = useState([])
  const [sortBy, setSortBy] = useState("default")
  const [loading, setLoading] = useState(true)
  const [displayCategory, setDisplayCategory] = useState("")
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const observerRef = useRef(null)
  const showingRef = useRef(showing)
  const visibleCountRef = useRef(visibleCount)
  const animatedSlugs = useRef(new Set())

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

        if (selectedCategory) {
          const normalizedQuery = normalize(selectedCategory)

          const filtered = fetched.filter(pr =>
            Array.isArray(pr.categories)
              ? pr.categories.some(c => normalize(slugify(c?.name)) === normalizedQuery)
              : pr.category && normalize(slugify(pr.category.name)) === normalizedQuery
          )

          setShowing(filtered)

          const matchedCategory =
            filtered[0]?.categories?.find(c => slugify(c.name) === selectedCategory) ||
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
          setDisplayCategory(`Search results for "${searchQuery}"`)
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

  if (loading)
    return (
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 w-full">
        {/* Breadcrumb skeleton */}
        <div className="flex gap-2 mb-8">
          <div className="h-3 bg-gray-100 rounded-full w-10 animate-pulse" />
          <div className="h-3 bg-gray-100 rounded-full w-2 animate-pulse" />
          <div className="h-3 bg-gray-100 rounded-full w-20 animate-pulse" />
        </div>
        {/* Header skeleton */}
        <div className="mb-8 space-y-2">
          <div className="h-2 bg-gray-100 rounded-full w-16 animate-pulse" />
          <div className="h-8 bg-gray-100 rounded w-48 animate-pulse" />
          <div className="h-3 bg-gray-100 rounded-full w-24 animate-pulse" />
        </div>
        {/* Grid skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
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

  return (
    <div className="relative">
      <style>{`
        @keyframes product-in {
          0%   { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .product-card-enter {
          animation: product-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .product-card-enter:nth-child(2)  { animation-delay: 0.05s; }
        .product-card-enter:nth-child(3)  { animation-delay: 0.10s; }
        .product-card-enter:nth-child(4)  { animation-delay: 0.15s; }
        .product-card-enter:nth-child(5)  { animation-delay: 0.20s; }
        .product-card-enter:nth-child(6)  { animation-delay: 0.05s; }
        .product-card-enter:nth-child(7)  { animation-delay: 0.10s; }
        .product-card-enter:nth-child(8)  { animation-delay: 0.15s; }
        .product-card-enter:nth-child(9)  { animation-delay: 0.20s; }
        .product-card-enter:nth-child(10) { animation-delay: 0.05s; }
      `}</style>
      <PageDecorations />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-8 flex-wrap">
          <Link href={p("/")} className="hover:text-yellow-500 transition-colors font-medium">
            {t("home")}
          </Link>
          <span className="text-gray-300 dark:text-gray-600 select-none">›</span>
          <Link
            href={p("/products")}
            className="hover:text-yellow-500 transition-colors font-medium"
          >
            {t("products")}
          </Link>
          {(selectedCategory || searchQuery) && (
            <>
              <span className="text-gray-300 dark:text-gray-600 select-none">›</span>
              <span className="text-gray-600 dark:text-gray-300 font-semibold capitalize">
                {displayCategory}
              </span>
            </>
          )}
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-0.5 w-6 bg-yellow-500 rounded-full" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-yellow-500">
              {selectedCategory ? t("products") : searchQuery ? "Search" : "Collection"}
            </span>
          </div>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white capitalize mb-1">
                {displayCategory || t("allProducts")}
              </h1>
              <p className="text-sm text-gray-400 font-medium">
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
        </div>

        {/* Product Grid */}
        {visibleProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {visibleProducts.map(product => {
              const firstCatObj =
                Array.isArray(product.categories) && product.categories.length > 0
                  ? product.categories[0]
                  : product.category

              const firstCatSlug = firstCatObj?.name || "others"
              const catLabel =
                isAr && firstCatObj?.name_ar ? firstCatObj.name_ar : firstCatObj?.name
              const productName = isAr && product.name_ar ? product.name_ar : product.name
              const isNew = !animatedSlugs.current.has(product.slug)
              if (isNew) animatedSlugs.current.add(product.slug)

              return (
                <div key={product.slug} className={isNew ? "product-card-enter" : ""}>
                  <Link
                    href={p(`/products/${slugify(firstCatSlug)}/${product.slug}`)}
                    className="group"
                  >
                    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700/50 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-yellow-300 dark:hover:border-yellow-500/50 transition-all duration-300 flex flex-col h-full">
                      {/* Image */}
                      <div className="p-3 flex-shrink-0 h-44 sm:h-48 md:h-52">
                        <div className="relative w-full h-full rounded-xl border border-gray-200 dark:border-gray-700/50 bg-white overflow-hidden shadow-sm flex items-center justify-center">
                          <img
                            src={product.images?.[0]?.s3Url || "/hebat_product_fill.png"}
                            alt={productName}
                            loading="lazy"
                            decoding="async"
                            className="object-contain w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-110"
                          />

                          {/* Category badge — only when not filtering by a single category */}
                          {!selectedCategory && catLabel && (
                            <span className="absolute top-2 start-2 text-[10px] font-semibold bg-white/90 border border-gray-100 text-gray-500 px-2 py-0.5 rounded-full shadow-sm">
                              {catLabel}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="px-3 pb-4 flex flex-col gap-1 flex-grow">
                        <h5 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-yellow-500 transition-colors duration-200">
                          {productName}
                        </h5>

                        <div className="mt-auto pt-2 space-y-0.5">
                          {product.model && (
                            <p className="text-[11px] text-gray-400 truncate">
                              <span className="font-medium text-gray-500">{t("model")}:</span>{" "}
                              {product.model}
                            </p>
                          )}
                          {product.barcode && (
                            <p className="text-[11px] text-gray-400 truncate">
                              <span className="font-medium text-gray-500">{t("barcode")}:</span>{" "}
                              {product.barcode}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Yellow accent bar on hover */}
                      <div className="h-0.5 bg-yellow-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-start" />
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#d1d5db"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium text-sm">
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
    </div>
  )
}
