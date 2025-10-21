"use client"

import { useEffect, useState, Fragment, useRef } from "react"
import { useRouter } from "next/navigation"
import Client from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import Button from "@mui/material/Button"
import EditProductForm from "@/components/EditProductForm"
import Link from "next/link"

// ✅ Helper functions
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
    .replace(/\band\b/gi, "&")
    .replace(/\b\w/g, c => c.toUpperCase()) || ""

export default function ProductDetails({ params }) {
  const router = useRouter()
  const { slug, category } = params
  const { user } = useAuth()

  const [product, setProduct] = useState(null)
  const [clamped, setClamped] = useState(true)
  const [openRemove, setOpenRemove] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const descRef = useRef(null)
  const [isClamped, setIsClamped] = useState(false)

  // ✅ Fetch product data
  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await Client.get(`/products/${slug}`, { withCredentials: true })
        setProduct(res.data.product)
      } catch (err) {
        console.error("❌ Failed to fetch product:", err)
      }
    }
    getProduct()
  }, [slug])

  // ✅ Detect clamping
  useEffect(() => {
    const checkClamp = () => {
      if (descRef.current) {
        const el = descRef.current
        setIsClamped(el.scrollHeight > el.clientHeight + 1)
      }
    }
    checkClamp()
    window.addEventListener("resize", checkClamp)
    return () => window.removeEventListener("resize", checkClamp)
  }, [product?.description])

  const handleRemove = async () => {
    try {
      await Client.delete(`/products/${product._id}`, { withCredentials: true })
      setOpenRemove(false)
      router.push(`/products`)
    } catch (err) {
      console.error("Error deleting product:", err)
    }
  }

  if (!product)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-700">
        Loading product...
      </div>
    )

  // ✅ Build breadcrumb with proper slugified links
  const categorySlug = slugify(product.category?.name || category)

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
      {
        "@type": "ListItem",
        position: 3,
        name: product.category?.name || deslugify(category),
        item: `https://hebat.com/products/${categorySlug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.name,
        item: `https://hebat.com/products/${categorySlug}/${slug}`,
      },
    ],
  }

  return (
    <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ✅ SEO JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* ✅ Breadcrumb Navigation */}
      <nav className="text-sm text-gray-600 mb-6 flex items-center flex-wrap gap-1">
        <Link href="/" className="hover:text-yellow-600 font-medium">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-yellow-600 font-medium">
          Products
        </Link>
        <span>/</span>
        <Link
          href={`/products/${slugify(product.category?.name || category)}`}
          className="hover:text-yellow-600 font-medium capitalize"
        >
          {product.category?.name || deslugify(category)}
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-semibold">{product.name}</span>
      </nav>

      {/* ✅ Admin Controls */}
      {user && (
        <div className="mb-6 flex flex-wrap gap-3">
          {/* Edit */}
          <Fragment>
            <button
              onClick={() => setOpenEdit(true)}
              type="button"
              className="text-white bg-green-700 hover:bg-green-600 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center"
            >
              ✏️ Edit
            </button>
            <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
              <DialogTitle>Edit Product Details</DialogTitle>
              <DialogContent>
                <EditProductForm
                  product={product}
                  setProduct={setProduct}
                  handleCloseE={() => setOpenEdit(false)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenEdit(false)}>Close</Button>
              </DialogActions>
            </Dialog>
          </Fragment>

          {/* Remove */}
          <Fragment>
            <button
              onClick={() => setOpenRemove(true)}
              type="button"
              className="text-white bg-red-700 hover:bg-red-600 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center"
            >
              🗑️ Remove
            </button>
            <Dialog open={openRemove} onClose={() => setOpenRemove(false)}>
              <DialogTitle>Remove Product From Inventory?</DialogTitle>
              <DialogActions>
                <Button onClick={() => setOpenRemove(false)}>Cancel</Button>
                <Button onClick={handleRemove} color="error">
                  Remove
                </Button>
              </DialogActions>
            </Dialog>
          </Fragment>
        </div>
      )}

      {/* ✅ Product Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Image */}
        <div className="order-1 lg:order-2">
          <img
            src={product.image?.s3Url || "/hebat_product_fill.png"}
            alt={product.name}
            className="w-full rounded-lg shadow-md"
          />
        </div>

        {/* Details */}
        <div className="order-2 lg:order-1">
          <h1 className="block text-2xl font-bold text-yellow-500 mb-3">{product.name}</h1>
          <p className="text-gray-700 text-sm mb-2">
            <strong>Barcode:</strong> {product.barcode || "N/A"}
          </p>
          <p className="text-gray-700 text-sm mb-4">
            <strong>Model:</strong> {product.model || "N/A"}
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
          <p
            ref={descRef}
            className={`text-gray-800 mb-4 transition-all duration-300 ${
              clamped ? "line-clamp-3" : ""
            }`}
          >
            {product.description}
          </p>

          {isClamped && (
            <button
              onClick={() => setClamped(!clamped)}
              className="text-yellow-600 hover:underline text-sm font-medium"
            >
              {clamped ? "Read more" : "Read less"}
            </button>
          )}

          <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">Manual</h2>
          {product.manual ? (
            <a
              href={product.manual.s3Url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              📄 View Manual
            </a>
          ) : (
            <p className="text-gray-600 text-sm">No manual available</p>
          )}
        </div>
      </div>
    </div>
  )
}
