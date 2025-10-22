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
  const [mainImage, setMainImage] = useState(null)
  const [clamped, setClamped] = useState(true)
  const [openRemove, setOpenRemove] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openAddImage, setOpenAddImage] = useState(false)
  const [uploading, setUploading] = useState(false)
  const descRef = useRef(null)
  const [isClamped, setIsClamped] = useState(false)
  const imageInputRef = useRef(null)
  const [previewImages, setPreviewImages] = useState([])

  // ✅ Fetch product data
  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await Client.get(`/products/${slug}`, { withCredentials: true })
        const p = res.data.product
        setProduct(p)
        setMainImage(p?.images?.[0]?.s3Url || p?.image?.s3Url || "/hebat_product_fill.png")
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

  // ✅ Remove product
  const handleRemove = async () => {
    try {
      await Client.delete(`/products/${product._id}`, { withCredentials: true })
      setOpenRemove(false)
      router.push(`/products`)
    } catch (err) {
      console.error("Error deleting product:", err)
    }
  }

  // ✅ Remove a single image
  const handleRemoveImage = async s3Key => {
    const confirmDelete = window.confirm("Are you sure you want to remove this image?")
    if (!confirmDelete) return
    try {
      // 🧠 Optimistically update UI first
      const updatedImages = product.images.filter(img => img.s3Key !== s3Key)
      setProduct(prev => ({ ...prev, images: updatedImages }))

      // 🧩 Update main image if the removed one was active
      if (mainImage && product.images.find(img => img.s3Key === s3Key)?.s3Url === mainImage) {
        if (updatedImages.length > 0) {
          setMainImage(updatedImages[0].s3Url) // next image
        } else {
          setMainImage(null) // fallback
        }
      }

      // 🧾 Call API to remove from backend + S3
      await Client.delete(`/products/${product._id}/image/${encodeURIComponent(s3Key)}`, {
        withCredentials: true,
      })
    } catch (err) {
      console.error("❌ Error removing image:", err)
    }
  }

  const handlePreviewSelection = e => {
    const files = Array.from(e.target.files)
    if (!files.length) return

    const newPreviews = files.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }))

    // ✅ Merge with any previously selected previews
    setPreviewImages(prev => [...prev, ...newPreviews])
  }

  // ✅ Add new images
  const handleAddImages = async e => {
    e.preventDefault()
    if (!previewImages.length) return alert("Please select at least one image.")

    setUploading(true)
    const formData = new FormData()

    // ✅ Append actual files from state (not just input ref)
    previewImages.forEach(({ file }) => formData.append("images", file))

    try {
      const res = await Client.post(`/products/${product._id}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      })

      const updatedProduct = res.data.product
      setProduct(updatedProduct)

      // ✅ Set new main image if no image existed before
      if ((!product.images || product.images.length === 0) && updatedProduct.images.length > 0) {
        setMainImage(updatedProduct.images[0].s3Url)
      }

      // 🧹 Clean up previews and close dialog
      setPreviewImages([])
      imageInputRef.current.value = ""
      setOpenAddImage(false)
    } catch (err) {
      console.error("❌ Failed to add images:", err)
      alert("Error uploading images")
    } finally {
      setUploading(false)
    }
  }

  if (!product)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-700">
        Loading product...
      </div>
    )

  const images = product.images?.length ? product.images : product.image ? [product.image] : []

  return (
    <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        <span className="text-gray-800 font-semibold">{product.name}</span>
      </nav>

      {/* ✅ Admin Controls */}
      {user && (
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => setOpenEdit(true)}
            className="text-white bg-green-700 hover:bg-green-600 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            ✏️ Edit
          </button>

          <button
            onClick={() => setOpenAddImage(true)}
            className="text-white bg-blue-700 hover:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            ➕ Add Image
          </button>

          <button
            onClick={() => setOpenRemove(true)}
            className="text-white bg-red-700 hover:bg-red-600 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            🗑️ Remove Product
          </button>
        </div>
      )}

      {/* ✅ Product Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* 🖼️ Image Gallery */}
        <div className="order-1 lg:order-2">
          {/* Main Image Frame */}
          <div className="relative w-full rounded-2xl overflow-hidden shadow-md bg-white border border-gray-200">
            <img
              src={mainImage || "/hebat_product_fill.png"}
              alt={product.name}
              className="w-full h-[400px] object-contain bg-white p-2"
            />
          </div>

          {/* Thumbnails — Always visible, even if only one */}
          {images.length > 0 && (
            <div
              className="
        flex gap-3 mt-4 
        overflow-x-auto 
        pb-3 pt-1
        scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent
      "
            >
              {images.map(img => (
                <div
                  key={img.s3Key}
                  className="relative flex-shrink-0 bg-white border border-gray-300 rounded-xl p-1 shadow-sm hover:shadow-md transition-all duration-200"
                  style={{ minWidth: "88px" }}
                >
                  {/* Thumbnail */}
                  <img
                    src={img.s3Url}
                    alt={img.name}
                    onClick={() => setMainImage(img.s3Url)}
                    className={`w-20 h-20 rounded-lg object-contain cursor-pointer transition-all duration-200 ${
                      mainImage === img.s3Url
                        ? "ring-2 ring-yellow-500 scale-105"
                        : "hover:scale-105"
                    }`}
                  />

                  {/* ✅ Properly aligned remove button */}
                  {user && (
                    <button
                      onClick={() => handleRemoveImage(img.s3Key)}
                      className="
        absolute top-1 right-1
        bg-black/70 text-white text-xs 
        rounded-full p-1.5
        hover:bg-red-600 shadow-md
        flex items-center justify-center
      "
                      title="Remove image"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
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
            className={`text-gray-800 mb-4 transition-all duration-300 ${clamped ? "line-clamp-3" : ""}`}
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

      {/* ✅ Add Image Dialog */}
      <Dialog open={openAddImage} onClose={() => setOpenAddImage(false)} fullWidth>
        <DialogTitle>Add New Images</DialogTitle>
        <DialogContent>
          <form onSubmit={handleAddImages} className="flex flex-col gap-4 mt-2">
            {/* File input */}
            <input
              ref={imageInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handlePreviewSelection}
              className="text-sm text-gray-800"
            />

            {/* ✅ Show all selected previews */}
            {previewImages.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-2">
                {previewImages.map((img, i) => (
                  <div
                    key={i}
                    className="relative w-24 h-24 rounded-lg border border-gray-300 bg-gray-100 overflow-hidden flex items-center justify-center"
                  >
                    <img
                      src={img.previewUrl}
                      alt={`Preview ${i + 1}`}
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => setPreviewImages(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 bg-black/60 text-white text-xs rounded-full p-1 hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload button */}
            <Button type="submit" variant="contained" disabled={uploading}>
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </form>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenAddImage(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* ✅ Edit & Remove Product Modals */}
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

      <Dialog open={openRemove} onClose={() => setOpenRemove(false)}>
        <DialogTitle>Remove Product From Inventory?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenRemove(false)}>Cancel</Button>
          <Button onClick={handleRemove} color="error">
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
