"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Client from "@/lib/api"
import { useLanguage } from "@/context/LanguageContext"

// ✅ Slugify helper (EN only for URLs)
const slugify = str =>
  str
    ?.toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-") || ""

// ✅ Deslugify helper
const deslugify = str =>
  str
    ?.replace(/-/g, " ")
    .replace(/\band\b/g, "&")
    .replace(/\b\w/g, c => c.toUpperCase()) || ""

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
  const [loading, setLoading] = useState(true)
  const [displayCategory, setDisplayCategory] = useState("")

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

          // ✅ Get Arabic category name for display
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

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-700">
        {t("loadingProducts")}
      </div>
    )

  // ✅ Breadcrumb JSON-LD
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="flex flex-col items-center justify-center pt-10 px-4 sm:px-6 lg:px-8 w-full">
        {/* Breadcrumb */}
        <div className="w-full max-w-6xl mb-2 text-sm text-gray-500">
          <nav className="flex items-center space-x-2">
            <Link href={p("/")} className="hover:text-yellow-600 font-medium">
              {t("home")}
            </Link>
            <span>/</span>
            <Link href={p("/products")} className="hover:text-yellow-600 font-medium">
              {t("products")}
            </Link>
            {(selectedCategory || searchQuery) && (
              <>
                <span>/</span>
                <span className="text-gray-800 font-semibold capitalize">{displayCategory}</span>
              </>
            )}
          </nav>
        </div>

        {/* Header */}
        <div className="w-full max-w-6xl mb-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-yellow-500 mb-2 capitalize">
            {displayCategory || t("allProducts")}
          </h1>
          <p className="text-gray-700 text-sm font-medium text-start">
            {t("showing")} {showing.length} {showing.length !== 1 ? t("products") : t("product")}
          </p>
        </div>

        {/* Product Grid */}
        <div className="gap-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 w-full max-w-6xl">
          {showing.length > 0 ? (
            showing.map(product => {
              const firstCatObj =
                Array.isArray(product.categories) && product.categories.length > 0
                  ? product.categories[0]
                  : product.category

              const firstCatSlug = firstCatObj?.name || "others"

              return (
                <Link
                  key={product.slug}
                  href={p(`/products/${slugify(firstCatSlug)}/${product.slug}`)}
                  className="group"
                >
                  <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-[340px]">
                    <div className="p-3 flex-shrink-0 h-44 sm:h-48 md:h-52">
                      <div className="relative w-full h-full rounded-xl border border-gray-200 bg-white overflow-hidden shadow-md flex items-center justify-center">
                        <img
                          src={product.images?.[0]?.s3Url || "/hebat_product_fill.png"}
                          alt={isAr && product.name_ar ? product.name_ar : product.name}
                          loading="lazy"
                          decoding="async"
                          className="object-contain w-full h-full scale-100 transition-transform duration-500 ease-in-out group-hover:scale-110"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col justify-between px-3 pb-3 text-start flex-grow">
                      <h5 className="text-sm sm:text-base font-semibold text-gray-900 leading-snug mb-1 group-hover:text-yellow-500 transition-colors line-clamp-2">
                        {isAr && product.name_ar ? product.name_ar : product.name}
                      </h5>

                      <div className="text-xs text-gray-600 space-y-[2px]">
                        <p>
                          {t("model")}: {product.model || "N/A"}
                        </p>
                        <p>
                          {t("barcode")}: {product.barcode || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })
          ) : (
            <p className="text-gray-600 text-sm text-center">
              {searchQuery ? `${t("noResults")} "${searchQuery}".` : t("noProducts")}
            </p>
          )}
        </div>
      </div>
    </>
  )
}
