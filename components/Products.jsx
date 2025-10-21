"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useParams } from "next/navigation"
import Link from "next/link"
import Client from "@/lib/api"
import Head from "next/head"

// ✅ Slugify helper
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
  const searchParams = useSearchParams()
  const params = useParams()

  // 🔍 Inputs
  const selectedCategoryFromQuery = searchParams.get("category")
  const searchQuery = searchParams.get("search")?.trim() || ""
  const selectedCategoryFromPath = params?.category // e.g. "sports-and-outdoors"

  // 🧠 Unified category (path has priority)
  const selectedCategory = selectedCategoryFromPath || selectedCategoryFromQuery

  const [products, setProducts] = useState([])
  const [showing, setShowing] = useState([])
  const [loading, setLoading] = useState(true)
  const [displayCategory, setDisplayCategory] = useState("All Products")

  // 🔧 Normalize for consistent comparison
  const normalize = str =>
    str?.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "").normalize("NFKC").trim() || ""

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await Client.get("/products")
        let fetched = res.data.products || []

        // ✅ Case 1: Category filter (check if product has that category slug)
        if (selectedCategory) {
          const normalizedQuery = normalize(selectedCategory)
          const filtered = fetched.filter(p =>
            Array.isArray(p.categories)
              ? p.categories.some(c => normalize(slugify(c?.name)) === normalizedQuery)
              : p.category && normalize(slugify(p.category.name)) === normalizedQuery
          )

          setShowing(filtered)
          setDisplayCategory(deslugify(selectedCategory))
        }

        // ✅ Case 2: Search filter
        else if (searchQuery) {
          const query = searchQuery.toLowerCase()
          const filtered = fetched.filter(
            p =>
              p.name.toLowerCase().includes(query) ||
              p.model?.toLowerCase().includes(query) ||
              p.barcode?.toLowerCase().includes(query)
          )
          setShowing(filtered)
          setDisplayCategory(`Search results for "${searchQuery}"`)
        }

        // ✅ Case 3: Default (All Products — deduped)
        else {
          const uniqueProducts = Array.from(
            new Map(fetched.map(p => [p._id || p.slug, p])).values()
          )
          setShowing(uniqueProducts)
          setDisplayCategory("All Products")
        }

        setProducts(fetched)
      } catch (err) {
        console.error("❌ Error loading products:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [selectedCategory, searchQuery])

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-700">
        Loading products...
      </div>
    )

  // ✅ Breadcrumb JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hebat.com/" },
      { "@type": "ListItem", position: 2, name: "Products", item: "https://hebat.com/products" },
      ...(selectedCategory
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: displayCategory,
              item: `https://hebat.com/products/${encodeURIComponent(
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
                item: `https://hebat.com/products?search=${encodeURIComponent(searchQuery)}`,
              },
            ]
          : []),
    ],
  }

  // ✅ SEO
  const pageTitle =
    selectedCategory || searchQuery ? `${displayCategory} | Hebat` : "All Products | Hebat"
  const pageDescription = selectedCategory
    ? `Explore ${displayCategory} products from Hebat — premium quality and top performance.`
    : searchQuery
      ? `Search results for "${searchQuery}" from Hebat — explore our premium range.`
      : "Explore all premium products from Hebat — trusted quality and style."

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      </Head>

      <div className="flex flex-col items-center justify-center pt-10 px-4 sm:px-6 lg:px-8 w-full">
        {/* Breadcrumb */}
        <div className="w-full max-w-6xl mb-2 text-sm text-gray-500">
          <nav className="flex items-center space-x-2">
            <Link href="/" className="hover:text-yellow-600 font-medium">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-yellow-600 font-medium">
              Products
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
            {displayCategory}
          </h1>
          <p className="text-gray-700 text-sm font-medium text-left">
            Showing {showing.length} product{showing.length !== 1 && "s"}
          </p>
        </div>

        {/* Product Grid */}
        <div className="gap-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 w-full max-w-6xl">
          {showing.length > 0 ? (
            showing.map(product => {
              // ✅ Choose first category or fallback
              const firstCat =
                Array.isArray(product.categories) && product.categories.length > 0
                  ? product.categories[0]?.name
                  : product.category?.name || "others"

              return (
                <Link key={product.slug} href={`/products/${slugify(firstCat)}/${product.slug}`}>
                  <div className="group bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-[340px]">
                    {/* Image Frame */}
                    <div className="p-3 flex-shrink-0 h-44 sm:h-48 md:h-52">
                      <div className="relative w-full h-full rounded-xl border-2 border-gray-100 bg-white overflow-hidden shadow-md flex items-center justify-center">
                        <img
                          src={product.image?.s3Url || "/hebat_product_fill.png"}
                          alt={product.name}
                          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 rounded-xl pointer-events-none"></div>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col justify-between px-3 pb-3 text-left flex-grow">
                      <h5 className="text-sm sm:text-base font-semibold text-gray-900 leading-snug mb-1 group-hover:text-yellow-500 transition-colors line-clamp-2">
                        {product.name}
                      </h5>
                      <div className="text-xs text-gray-600 space-y-[2px]">
                        <p>Model: {product.model || "N/A"}</p>
                        <p>Barcode: {product.barcode || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })
          ) : (
            <p className="text-gray-600 text-sm text-center">
              {searchQuery
                ? `No products found matching "${searchQuery}".`
                : "No products found in this category."}
            </p>
          )}
        </div>
      </div>
    </>
  )
}
