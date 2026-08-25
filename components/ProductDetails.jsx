"use client"

import { useEffect, useState, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FileText } from "lucide-react"
import Client from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import { useLanguage } from "@/context/LanguageContext"
import PageDecorations from "@/components/PageDecorations"
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
import ProductsHeroAurora from "@/components/ProductsHeroAurora"

import Link from "next/link"

const youtubeId = url => {
  const match = url?.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  return match?.[1] || null
}

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
      <div className="min-h-screen animate-pulse">
        {/* Hero skeleton */}
        <div className="bg-gray-950 px-4 sm:px-6 lg:px-8 pt-10 pb-16">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <div className="h-4 bg-white/10 rounded w-40" />
              <div className="h-10 bg-white/10 rounded w-3/4" />
              <div className="h-10 bg-white/10 rounded w-1/2" />
              <div className="flex gap-3 pt-4">
                <div className="h-12 bg-white/10 rounded-2xl w-44" />
                <div className="h-12 bg-white/10 rounded-2xl w-36" />
              </div>
              <div className="flex gap-8 pt-8">
                <div className="h-12 bg-white/10 rounded w-20" />
                <div className="h-12 bg-white/10 rounded w-20" />
                <div className="h-12 bg-white/10 rounded w-20" />
              </div>
            </div>
            <div className="w-full h-[400px] bg-white/10 rounded-2xl" />
          </div>
        </div>
        {/* Content skeleton */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-[1.6fr_0.9fr] gap-10">
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/5" />
            <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-xl mt-6" />
          </div>
          <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl" />
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

  const videoId = youtubeId(product.youtubeUrl)

  return (
    <div className="relative min-h-screen">
      {/* ===================== CINEMATIC HERO ===================== */}
      <header className="relative overflow-clip bg-gray-950 text-white isolate">
        {/* Aurora + soft glow blobs sit behind the product stage */}
        <ProductsHeroAurora variant="compact" />
        <div className="pointer-events-none absolute -top-40 ltr:-right-32 rtl:-left-32 w-[520px] h-[520px] rounded-full bg-yellow-400/20 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-44 ltr:-left-24 rtl:-right-24 w-[420px] h-[420px] rounded-full bg-amber-500/10 blur-[80px]" />
        {/* fade to page */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-gray-950 to-transparent z-[2]" />

        <div className="relative z-[3] max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-9 pb-16 sm:pt-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-white/40 mb-8 flex-wrap">
            <Link href={p("/")} className="hover:text-yellow-400 transition-colors font-medium">
              {t("home")}
            </Link>
            <span className="text-white/25 select-none">›</span>
            <Link
              href={p(`/products/${category}`)}
              className="hover:text-yellow-400 transition-colors font-medium"
            >
              {categoryLabel}
            </Link>
            <span className="text-white/25 select-none">›</span>
            <span className="text-white/80 font-semibold">{displayName}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Copy side */}
            <div className="order-2 lg:order-1">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.02] [text-wrap:balance]"
              >
                {displayName}
              </motion.h1>

              {/* Meta chips */}
              {(product.barcode || product.model) && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.18 }}
                  className="mt-7 flex flex-wrap gap-2"
                >
                  {product.model && (
                    <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs">
                      <span className="font-bold uppercase tracking-wider text-white/40">
                        {t("model")}
                      </span>
                      <span className="font-semibold text-white/90">{product.model}</span>
                    </span>
                  )}
                  {product.barcode && (
                    <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs">
                      <span className="font-bold uppercase tracking-wider text-white/40">
                        {t("barcode")}
                      </span>
                      <span className="font-semibold text-white/90">{product.barcode}</span>
                    </span>
                  )}
                </motion.div>
              )}
            </div>

            {/* Gallery stage */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="order-1 lg:order-2 relative"
            >
              {/* Gold halo behind the product */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="w-[80%] aspect-square rounded-full bg-yellow-400/20 blur-[70px]" />
              </div>
              <div className="relative">
                <ProductGallery
                  images={images}
                  mainImage={mainImage}
                  setMainImage={setMainImage}
                  user={user}
                  handleRemoveImage={handleRemoveImage}
                  variantImage={product.selectedVariant?.images?.[0]?.s3Url}
                  variantName={product.selectedVariant?.name}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* ===================== CONTENT ===================== */}
      <div className="relative">
        <PageDecorations />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          {/* Admin Controls */}
          {user && (
            <div className="mb-8 flex flex-wrap gap-3">
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

          <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_0.9fr] gap-8 lg:gap-12 items-start">
            {/* Main column */}
            <div className="min-w-0">
              {/* Description */}
              {description && (
                <section>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                    {t("description")}
                  </h2>
                  <p
                    ref={descRef}
                    className={`text-gray-700 dark:text-gray-300 text-[15px] leading-relaxed transition-all duration-300 ${
                      clamped ? "line-clamp-5" : ""
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
                </section>
              )}

              {/* Variants */}
              {product.variants && <ProductVariants product={product} />}

              {/* Features */}
              <ProductFeatures
                features={product.features}
                features_ar={product.features_ar}
                isAr={isAr}
              />

              {/* Video */}
              {videoId && (
                <div className="mt-8">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                    {isAr ? "الفيديو" : "Video"}
                  </h2>
                  <div
                    className="relative w-full rounded-2xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700/50"
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
              )}
            </div>

            {/* Sticky aside */}
            <aside
              className="lg:sticky self-start space-y-6"
              style={{ top: "calc(var(--nav-height) + 24px)" }}
            >
              {/* Specifications */}
              <ProductSpecifications specifications={product.specifications} isAr={isAr} />

              {/* Manual */}
              <div className="border-t border-gray-100 dark:border-gray-700/50 pt-5">
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                  {t("manual")}
                </h2>
                {product.manual ? (
                  <a
                    href={product.manual.s3Url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
                  >
                    <FileText size={14} />
                    {t("viewManual")}
                  </a>
                ) : (
                  <p className="text-gray-400 text-sm">{t("noManual")}</p>
                )}
              </div>

              {/* Share */}
              <div className="border-t border-gray-100 dark:border-gray-700/50 pt-5">
                <ShareButtons product={product} />
              </div>
            </aside>
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
