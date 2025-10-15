"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Client from "@/lib/api"
import Head from "next/head"

export default function Products() {
  const searchParams = useSearchParams()
  const selectedCategory = searchParams.get("category")

  const [products, setProducts] = useState([])
  const [showing, setShowing] = useState([])
  const [loading, setLoading] = useState(true)
  const [displayCategory, setDisplayCategory] = useState("All Products")

  // 🔧 normalize text: lower, trim, remove extra spaces, replace & with and
  const normalize = str =>
    str
      ?.toLowerCase()
      .replace(/&/g, "and")
      .replace(/\s+/g, "") // remove all spaces
      .normalize("NFKC")
      .trim() || ""

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await Client.get("/products")
        const fetched = res.data.products || []
        setProducts(fetched)

        if (selectedCategory) {
          const normalizedQuery = normalize(selectedCategory)

          const filtered = fetched.filter(p => {
            const name = normalize(p.category?.name)
            return name === normalizedQuery
          })

          setShowing(filtered)
          setDisplayCategory(selectedCategory)
        } else {
          setShowing(fetched)
          setDisplayCategory("All Products")
        }
      } catch (err) {
        console.error("Error loading products:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [selectedCategory])

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-700">
        Loading products...
      </div>
    )

  // ✅ Breadcrumb structured data (SEO)
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://hebat.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: "https://hebat.com/products",
      },
      ...(selectedCategory
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: displayCategory,
              item: `https://hebat.com/products?category=${encodeURIComponent(selectedCategory)}`,
            },
          ]
        : []),
    ],
  }

  // ✅ Dynamic metadata for SEO
  const pageTitle = selectedCategory ? `${displayCategory} | Hebat` : "All Products | Hebat"
  const pageDescription = selectedCategory
    ? `Explore ${displayCategory} products from Hebat — premium quality and top performance.`
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

      <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10 mt-20 w-full">
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
            {selectedCategory && (
              <>
                <span>/</span>
                <span className="text-gray-800 font-semibold">{displayCategory}</span>
              </>
            )}
          </nav>
        </div>

        {/* Header */}
        <div className="w-full max-w-6xl mb-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-yellow-500 mb-2">{displayCategory}</h1>
          <p className="text-gray-700 text-sm font-medium text-left">
            Showing {showing.length} product{showing.length !== 1 && "s"}
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full max-w-6xl">
          {showing.length > 0 ? (
            showing.map(product => (
              <Link href={`/products/${product.slug}`} key={product.slug}>
                <div className="h-[300px] sm:h-[320px] md:h-[340px] border border-yellow-500 bg-yellow-500 rounded-lg overflow-hidden shadow hover:shadow-xl transform hover:scale-105 transition duration-300 flex flex-col">
                  {/* Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={product.image?.s3Url || "/hebat_product_fill.png"}
                      alt={product.name}
                      className="w-full h-48 sm:h-52 md:h-56 object-cover"
                    />
                  </div>

                  {/* Text */}
                  <div className="p-3 sm:p-4 flex-1 overflow-y-auto text-center hide-scrollbar">
                    <h5 className="text-sm sm:text-base font-semibold text-gray-900 leading-snug break-words">
                      {product.name}
                    </h5>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-600 text-sm text-center">No products found in this category.</p>
          )}
        </div>
      </div>
    </>
  )
}
