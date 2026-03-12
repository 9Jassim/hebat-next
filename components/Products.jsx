"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Client from "@/lib/api"

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

export default function Products() {
  const params = useParams()

  const category = params?.category || null
  const subcategory = params?.subcategory || null

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [displayCategory, setDisplayCategory] = useState("All Products")

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let res

        if (category && subcategory) {
          res = await Client.get(`/products/category/${category}/${subcategory}`)
          setDisplayCategory(deslugify(subcategory))
        } else if (category) {
          res = await Client.get(`/products/category/${category}`)
          setDisplayCategory(deslugify(category))
        } else {
          res = await Client.get("/products")
          setDisplayCategory("All Products")
        }

        setProducts(res.data.products || [])
      } catch (err) {
        console.error("❌ Error loading products:", err)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category, subcategory])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-700">
        Loading products...
      </div>
    )
  }

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
      ...(category
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: deslugify(category),
              item: `https://hebatofficial.com/products/${category}`,
            },
          ]
        : []),
      ...(subcategory
        ? [
            {
              "@type": "ListItem",
              position: 4,
              name: deslugify(subcategory),
              item: `https://hebatofficial.com/products/${category}/${subcategory}`,
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
        <div className="w-full max-w-6xl mb-2 text-sm text-gray-500">
          <nav className="flex items-center space-x-2">
            <Link href="/" className="hover:text-yellow-600 font-medium">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-yellow-600 font-medium">
              Products
            </Link>

            {category && (
              <>
                <span>/</span>
                <Link
                  href={`/products/${category}`}
                  className="hover:text-yellow-600 font-medium capitalize"
                >
                  {deslugify(category)}
                </Link>
              </>
            )}

            {subcategory && (
              <>
                <span>/</span>
                <span className="text-gray-800 font-semibold capitalize">
                  {deslugify(subcategory)}
                </span>
              </>
            )}
          </nav>
        </div>

        <div className="w-full max-w-6xl mb-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-yellow-500 mb-2 capitalize">
            {displayCategory}
          </h1>
          <p className="text-gray-700 text-sm font-medium text-left">
            Showing {products.length} product{products.length !== 1 && "s"}
          </p>
        </div>

        <div className="gap-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 w-full max-w-6xl">
          {products.length > 0 ? (
            products.map(product => {
              const firstCat =
                Array.isArray(product.categories) && product.categories.length > 0
                  ? product.categories[0]?.name
                  : "others"

              return (
                <Link
                  key={product.slug}
                  href={`/products/${slugify(firstCat)}/product/${product.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-[340px]">
                    <div className="p-3 flex-shrink-0 h-44 sm:h-48 md:h-52">
                      <div className="relative w-full h-full rounded-xl border border-gray-200 bg-white overflow-hidden shadow-md flex items-center justify-center">
                        <img
                          src={product.images?.[0]?.s3Url || "/hebat_product_fill.png"}
                          alt={product.name}
                          loading="lazy"
                          decoding="async"
                          className="object-contain w-full h-full scale-100 transition-transform duration-500 ease-in-out group-hover:scale-110 will-change-transform"
                        />
                      </div>
                    </div>

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
            <p className="text-gray-600 text-sm text-center">No products found in this category.</p>
          )}
        </div>
      </div>
    </>
  )
}
