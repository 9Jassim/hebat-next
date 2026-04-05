"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Client from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import { useLanguage } from "@/context/LanguageContext"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import Button from "@mui/material/Button"
import EditProductForm from "@/components/EditProductForm"
import ProductGallery from "@/components/ProductGallery"
import ShareButtons from "@/components/ShareButtons"
import ProductVariants from "@/components/ProductVariants"
import ProductSpecifications from "@/components/ProductSpecifications"
import ProductFeatures from "@/components/ProductFeatures"

import Link from "next/link"

export default function ProductDetails({ params }) {
  const router = useRouter()
  const { slug, category } = params
  const { user } = useAuth()
  const { isAr, p, t } = useLanguage()

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

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await Client.get(`/products/${slug}`, { withCredentials: true })
        const { product: p, selectedVariant } = res.data

        let displayName = p.name
        if (selectedVariant?.name) {
          displayName = `${p.name} – ${selectedVariant.name}`
        }

        let mainImg =
          selectedVariant?.images?.[0]?.s3Url || p?.images?.[0]?.s3Url || "/hebat_product_fill.png"

        setProduct({ ...p, displayName, selectedVariant })
        setMainImage(mainImg)
      } catch (err) {
        console.error("❌ Failed to fetch product:", err)
      }
    }
    getProduct()
  }, [slug])

  useEffect(() => {
    if (!product) return

    const allVariantSlugs = [
      product.slug,
      ...(product.variants?.colors?.map(c => c.slug) || []),
      ...(product.variants?.models?.map(m => m.slug) || []),
    ]

    if (!allVariantSlugs.includes(slug)) {
      const parentUrl = `/products/${category}/${product.slug}`
      router.push(parentUrl)
    }
  }, [product, slug, category, router])

  useEffect(() => {
    const checkClamp = () => {
      if (descRef.current) {
        const el = descRef.current
        if (clamped) {
          setIsClamped(el.scrollHeight > el.clientHeight + 1)
        }
      }
    }

    checkClamp()
    window.addEventListener("resize", checkClamp)
    return () => window.removeEventListener("resize", checkClamp)
  }, [product?.description, clamped])

  const handleRemove = async () => {
    try {
      await Client.delete(`/products/${product._id}`, { withCredentials: true })
      setOpenRemove(false)
      router.push(`/products`)
    } catch (err) {
      console.error("Error deleting product:", err)
    }
  }

  const handleRemoveImage = async s3Key => {
    const confirmDelete = window.confirm("Are you sure you want to remove this image?")
    if (!confirmDelete) return
    try {
      const updatedImages = product.images.filter(img => img.s3Key !== s3Key)
      setProduct(prev => ({ ...prev, images: updatedImages }))

      if (mainImage && product.images.find(img => img.s3Key === s3Key)?.s3Url === mainImage) {
        if (updatedImages.length > 0) {
          setMainImage(updatedImages[0].s3Url)
        } else {
          setMainImage(null)
        }
      }

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

    const previews = files.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file),
      progress: 0,
    }))

    setPreviewImages(prev => [...prev, ...previews])
    e.target.value = null
  }

  const handleRemovePreview = index => {
    setPreviewImages(prev => {
      const updated = [...prev]
      URL.revokeObjectURL(updated[index].previewUrl)
      updated.splice(index, 1)
      return updated
    })
  }

  const handleAddImages = async e => {
    e.preventDefault()
    if (!previewImages.length) return alert("Please select at least one image.")
    setUploading(true)

    try {
      for (let i = 0; i < previewImages.length; i++) {
        const formData = new FormData()
        formData.append("images", previewImages[i].file)

        const res = await Client.post(`/products/${product._id}/images`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
          onUploadProgress: e => {
            const percent = Math.round((e.loaded * 100) / e.total)
            setPreviewImages(prev =>
              prev.map((img, idx) => (idx === i ? { ...img, progress: percent } : img))
            )
          },
        })

        const updatedProduct = res.data.product
        setProduct(updatedProduct)

        if ((!product.images || product.images.length === 0) && updatedProduct.images.length > 0) {
          setMainImage(updatedProduct.images[0].s3Url)
        }

        setPreviewImages(prev =>
          prev.map((img, idx) => (idx === i ? { ...img, progress: 100 } : img))
        )
      }

      alert("✅ All images uploaded successfully!")
      setPreviewImages([])
      imageInputRef.current.value = ""
      setOpenAddImage(false)
    } catch (err) {
      console.error("❌ Failed to upload images:", err)
      alert("Error uploading images")
    } finally {
      setUploading(false)
    }
  }

  if (!product)
    return (
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2 mb-6">
          <div className="h-4 bg-gray-200 rounded w-12" />
          <div className="h-4 bg-gray-200 rounded w-2" />
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-4 bg-gray-200 rounded w-2" />
          <div className="h-4 bg-gray-200 rounded w-36" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Gallery skeleton */}
          <div>
            <div className="w-full aspect-square bg-gray-200 rounded-2xl mb-3" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-20 h-20 bg-gray-200 rounded-xl flex-shrink-0" />
              ))}
            </div>
          </div>

          {/* Details skeleton */}
          <div className="space-y-3">
            <div className="h-7 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-5 bg-gray-200 rounded w-28 mt-4" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-4/5" />
            </div>
          </div>
        </div>
      </div>
    )

  const displayName =
    isAr && product.name_ar
      ? product.selectedVariant?.name
        ? `${product.name_ar} – ${product.selectedVariant.name}`
        : product.name_ar
      : product.displayName || product.name

  const description = isAr && product.description_ar ? product.description_ar : product.description

  const images = product.images?.length ? product.images : product.image ? [product.image] : []

  const categoryLabel =
    isAr && product.categories[0]?.name_ar
      ? product.categories[0].name_ar
      : product.categories[0]?.name

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 flex items-center flex-wrap gap-1.5">
          <Link href={p("/")} className="hover:text-yellow-500 transition-colors font-medium">
            {t("home")}
          </Link>
          <span className="text-gray-300 select-none">›</span>
          <Link
            href={p(`/products/${category}`)}
            className="hover:text-yellow-500 transition-colors font-medium"
          >
            {categoryLabel}
          </Link>
          <span className="text-gray-300 select-none">›</span>
          <span className="text-gray-800 font-semibold">{displayName}</span>
        </nav>

        {/* Admin Controls */}
        {user && (
          <div className="mb-6 flex flex-wrap gap-3">
            <button
              onClick={() => setOpenEdit(true)}
              className="text-white bg-green-700 hover:bg-green-600 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors"
            >
              ✏️ Edit
            </button>
            <button
              onClick={() => setOpenAddImage(true)}
              className="text-white bg-blue-700 hover:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors"
            >
              ➕ Add Image
            </button>
            <button
              onClick={() => setOpenRemove(true)}
              className="text-white bg-red-700 hover:bg-red-600 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors"
            >
              🗑️ Remove Product
            </button>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left — Gallery (sticky) */}
          <div className="lg:sticky self-start" style={{ top: "calc(var(--nav-height) + 24px)" }}>
            <ProductGallery
              images={images}
              mainImage={mainImage}
              setMainImage={setMainImage}
              user={user}
              handleRemoveImage={handleRemoveImage}
              variantImage={product.selectedVariant?.images?.[0]?.s3Url}
              variantName={product.selectedVariant?.name}
            />

            <div className="mt-4">
              <ShareButtons product={product} />
            </div>

            {product.youtubeUrl &&
              (() => {
                const match = product.youtubeUrl.match(
                  /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
                )
                const videoId = match?.[1]
                if (!videoId) return null
                return (
                  <div className="mt-5">
                    <div
                      className="relative w-full rounded-2xl overflow-hidden shadow-md"
                      style={{ paddingBottom: "56.25%" }}
                    >
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="Product Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    </div>
                  </div>
                )
              })()}
          </div>

          {/* Right — Product Info */}
          <div className="order-2 lg:order-1">
            {/* Category label */}
            <div className="flex items-center gap-2 mb-2">
              <div className="h-0.5 w-6 bg-yellow-500 rounded-full" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-yellow-500">
                {categoryLabel}
              </span>
            </div>

            {/* Product name */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-snug">
              {displayName}
            </h1>

            {/* Meta chips */}
            {(product.barcode || product.model) && (
              <div className="flex flex-wrap gap-2 mb-5">
                {product.barcode && (
                  <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      {t("barcode")}
                    </span>
                    <span className="text-sm font-semibold text-gray-700">{product.barcode}</span>
                  </div>
                )}
                {product.model && (
                  <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      {t("model")}
                    </span>
                    <span className="text-sm font-semibold text-gray-700">{product.model}</span>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div className="border-t border-gray-100 pt-5 mb-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                {t("description")}
              </h2>
              <p
                ref={descRef}
                className={`text-gray-700 text-sm leading-relaxed transition-all duration-300 ${
                  clamped ? "line-clamp-4" : ""
                }`}
              >
                {description}
              </p>
              {(isClamped || !clamped) && (
                <button
                  onClick={() => setClamped(!clamped)}
                  className="mt-2 text-yellow-600 hover:underline text-sm font-medium"
                >
                  {clamped ? t("readMore") : t("readLess")}
                </button>
              )}
            </div>

            {/* Variants */}
            {product.variants && <ProductVariants product={product} />}

            {/* Features */}
            <ProductFeatures
              features={product.features}
              features_ar={product.features_ar}
              isAr={isAr}
            />

            {/* Specifications */}
            <ProductSpecifications specifications={product.specifications} isAr={isAr} />

            {/* Manual */}
            <div className="mt-6 border-t border-gray-100 pt-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                {t("manual")}
              </h2>
              {product.manual ? (
                <a
                  href={product.manual.s3Url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  {t("viewManual")}
                </a>
              ) : (
                <p className="text-gray-400 text-sm">{t("noManual")}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Image Dialog */}
      <Dialog open={openAddImage} onClose={() => setOpenAddImage(false)}>
        <DialogTitle>Add New Images</DialogTitle>
        <DialogContent>
          <form onSubmit={handleAddImages} className="flex flex-col gap-3 mt-2">
            <input
              ref={imageInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handlePreviewSelection}
              className="text-sm text-gray-800"
            />

            {previewImages.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3">
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
                      onClick={() => handleRemovePreview(i)}
                      disabled={uploading}
                      className="absolute top-1 right-1 bg-black/60 text-white text-xs rounded-full p-1 hover:bg-red-600"
                    >
                      ✕
                    </button>

                    {uploading && img.progress !== undefined && (
                      <div className="absolute bottom-0 start-0 w-full bg-black/30 h-2">
                        <div
                          className="bg-yellow-500 h-2 transition-all duration-300"
                          style={{ width: `${img.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <Button
              type="submit"
              variant="contained"
              disabled={uploading || previewImages.length === 0}
            >
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddImage(false)} disabled={uploading}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="md" fullWidth>
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

      {/* Remove Dialog */}
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
