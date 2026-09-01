"use client"

import { useEffect, useState, useRef } from "react"
import Client from "@/lib/api"
import { Button } from "@mui/material"

export default function EditProductForm({ product, setProduct, handleCloseE }) {
  const [categories, setCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [newCategory, setNewCategory] = useState(false)

  const [variants, setVariants] = useState({ colors: [], models: [] })
  const [showVariants, setShowVariants] = useState(false)

  const [existingManual, setExistingManual] = useState(null)
  const [removeManual, setRemoveManual] = useState(false)

  // Feature / overview images (tall marketing infographics)
  const [featureImages, setFeatureImages] = useState([]) // existing [{ s3Url, s3Key, name }]
  const [featureRemove, setFeatureRemove] = useState([]) // s3Keys queued for removal
  const [newFeatures, setNewFeatures] = useState([]) // [{ file, preview }]
  const featureInputRef = useRef(null)

  // ✅ NEW
  const [specifications, setSpecifications] = useState([])
  const [features, setFeatures] = useState([])
  const [features_ar, setFeaturesAr] = useState([])
  const [showFeaturesAr, setShowFeaturesAr] = useState(false)

  // ✅ Hide/show toggles
  const [showSpecifications, setShowSpecifications] = useState(false)
  const [showFeatures, setShowFeatures] = useState(false)

  const [isDirty, setIsDirty] = useState(false)

  const categoryRef = useRef(null)
  const modelRef = useRef(null)
  const barcodeRef = useRef(null)
  const nameRef = useRef(null)
  const nameArRef = useRef(null)
  const descriptionRef = useRef(null)
  const descriptionArRef = useRef(null)
  const manualRef = useRef(null)
  const youtubeUrlRef = useRef(null)

  const [copied, setCopied] = useState(false)

  const markDirty = () => setIsDirty(true)

  const redirectUrl = product?._id ? `${process.env.NEXT_PUBLIC_URL}/go/${product._id}` : ""

  const copyRedirectUrl = () => {
    navigator.clipboard.writeText(redirectUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Fetch categories
  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await Client.get("/products/category", { withCredentials: true })
        setCategories(res.data.categories || [])
      } catch {}
    }
    getCategories()
  }, [])

  // Load product
  useEffect(() => {
    if (!product) return

    modelRef.current.value = product.model || ""
    barcodeRef.current.value = product.barcode || ""
    nameRef.current.value = product.name || ""
    if (nameArRef.current) nameArRef.current.value = product.name_ar || ""
    descriptionRef.current.value = product.description || ""
    if (descriptionArRef.current) descriptionArRef.current.value = product.description_ar || ""
    if (youtubeUrlRef.current) youtubeUrlRef.current.value = product.youtubeUrl || ""

    setSelectedCategories(product.categories?.map(cat => cat._id) || [])
    setVariants(product.variants || { colors: [], models: [] })

    setSpecifications(product.specifications || [])
    setFeatures(product.features || [])
    setFeaturesAr(product.features_ar || [])

    setExistingManual(product.manual?.s3Url ? product.manual : null)
    setRemoveManual(false)

    setFeatureImages(product.featureImages || [])
    setFeatureRemove([])
    setNewFeatures(prev => {
      prev.forEach(f => URL.revokeObjectURL(f.preview))
      return []
    })
    if (featureInputRef.current) featureInputRef.current.value = ""

    if (manualRef.current) manualRef.current.value = ""

    // Reset toggles
    setShowVariants(false)
    setShowSpecifications(false)
    setShowFeatures(false)

    setIsDirty(false)
  }, [product])

  // ============================
  // Categories
  // ============================
  const handleSelectCategory = e => {
    markDirty()
    const id = e.target.value
    if (id && !selectedCategories.includes(id)) {
      setSelectedCategories(prev => [...prev, id])
    }
  }

  const removeCategory = id => {
    markDirty()
    setSelectedCategories(prev => prev.filter(cat => cat !== id))
  }

  // ============================
  // Variants - Colors
  // ============================
  const updateColorVariant = (index, field, value) => {
    markDirty()
    const updated = [...variants.colors]
    updated[index][field] = value
    setVariants(prev => ({ ...prev, colors: updated }))
  }

  const updateColorImage = (index, file) => {
    markDirty()
    const updated = [...variants.colors]

    if (updated[index].preview) URL.revokeObjectURL(updated[index].preview)

    updated[index].images = [] // only 1 image allowed
    updated[index].newImage = file
    updated[index].preview = URL.createObjectURL(file)

    setVariants(prev => ({ ...prev, colors: updated }))
  }

  const addColorVariant = () => {
    markDirty()
    setVariants(prev => ({
      ...prev,
      colors: [...prev.colors, { _id: null, name: "", images: [] }],
    }))
  }

  const removeColorVariant = index => {
    markDirty()
    const updated = [...variants.colors]
    if (updated[index].preview) URL.revokeObjectURL(updated[index].preview)
    updated.splice(index, 1)
    setVariants(prev => ({ ...prev, colors: updated }))
  }

  // ============================
  // Variants - Models
  // ============================
  const updateModelVariant = (index, value) => {
    markDirty()
    const updated = [...variants.models]
    updated[index].name = value
    setVariants(prev => ({ ...prev, models: updated }))
  }

  const addModelVariant = () => {
    markDirty()
    setVariants(prev => ({
      ...prev,
      models: [...prev.models, { _id: null, name: "" }],
    }))
  }

  const removeModelVariant = index => {
    markDirty()
    const updated = [...variants.models]
    updated.splice(index, 1)
    setVariants(prev => ({ ...prev, models: updated }))
  }

  // ============================
  // Specifications
  // ============================
  const addSpecification = () => {
    markDirty()
    setSpecifications(prev => [...prev, { name: "", value: "" }])
  }

  const updateSpecification = (index, field, value) => {
    markDirty()
    const updated = [...specifications]
    updated[index][field] = value
    setSpecifications(updated)
  }

  const removeSpecification = index => {
    markDirty()
    setSpecifications(prev => prev.filter((_, i) => i !== index))
  }

  // ============================
  // Features
  // ============================
  const addFeature = () => {
    markDirty()
    setFeatures(prev => [...prev, ""])
  }

  const updateFeature = (index, value) => {
    markDirty()
    const updated = [...features]
    updated[index] = value
    setFeatures(updated)
  }

  const removeFeature = index => {
    markDirty()
    setFeatures(prev => prev.filter((_, i) => i !== index))
  }

  const addFeatureAr = () => {
    markDirty()
    setFeaturesAr(prev => [...prev, ""])
  }
  const updateFeatureAr = (index, value) => {
    markDirty()
    const updated = [...features_ar]
    updated[index] = value
    setFeaturesAr(updated)
  }
  const removeFeatureAr = index => {
    markDirty()
    setFeaturesAr(prev => prev.filter((_, i) => i !== index))
  }

  // ============================
  // Feature / overview images
  // ============================
  const handleFeatureSelect = e => {
    markDirty()
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setNewFeatures(prev => [
      ...prev,
      ...files.map(file => ({ file, preview: URL.createObjectURL(file) })),
    ])
    e.target.value = ""
  }

  const removeNewFeature = index => {
    markDirty()
    setNewFeatures(prev => {
      const updated = [...prev]
      URL.revokeObjectURL(updated[index].preview)
      updated.splice(index, 1)
      return updated
    })
  }

  const removeExistingFeature = s3Key => {
    markDirty()
    setFeatureRemove(prev => (prev.includes(s3Key) ? prev : [...prev, s3Key]))
  }

  const undoRemoveFeature = s3Key => {
    markDirty()
    setFeatureRemove(prev => prev.filter(k => k !== s3Key))
  }

  // ============================
  // Confirm Save
  // ============================
  const editProduct = async e => {
    e.preventDefault()

    if (isDirty) {
      const confirmSave = window.confirm("Are you sure you want to save these changes?")
      if (!confirmSave) return
    }

    await submitForm()
  }

  // ============================
  // Submit
  // ============================
  const submitForm = async () => {
    const formData = new FormData()

    formData.append("model", modelRef.current.value)
    formData.append("barcode", barcodeRef.current.value)
    formData.append("name", nameRef.current.value)
    formData.append("name_ar", nameArRef.current?.value || "")
    formData.append("description", descriptionRef.current.value)
    formData.append("description_ar", descriptionArRef.current?.value || "")
    formData.append("youtubeUrl", youtubeUrlRef.current?.value || "")

    selectedCategories.forEach(cat => formData.append("categories", cat))

    formData.append("removeManual", removeManual ? "true" : "false")

    if (!removeManual && manualRef.current.files[0]) {
      formData.append("manual", manualRef.current.files[0])
    }

    // Feature / overview images.
    // Backend contract: store on product.featureImages: [{ s3Url, s3Key, name }].
    //  - new files arrive under the repeated "featureImages" field
    //  - "removeFeatureImages" is a JSON array of s3Keys to delete
    formData.append("removeFeatureImages", JSON.stringify(featureRemove))
    newFeatures.forEach(nf => formData.append("featureImages", nf.file))

    // Variants
    const plainVariants = {
      colors: variants.colors.map(v => ({
        _id: v._id ? String(v._id) : null,
        name: v.name,
      })),
      models: variants.models.map(v => ({
        _id: v._id ? String(v._id) : null,
        name: v.name,
      })),
    }

    formData.append("variants", JSON.stringify(plainVariants))

    // Attach new color images
    variants.colors.forEach((v, idx) => {
      if (v.newImage instanceof File) {
        const key = v._id ? `variant_color_image_${v._id}` : `variant_color_image_index_${idx}`
        formData.append(key, v.newImage)
      }
    })

    // ✅ Specifications
    const cleanSpecs = specifications.filter(s => s.name?.trim() && s.value?.trim())
    formData.append("specifications", JSON.stringify(cleanSpecs))

    // ✅ Features
    const cleanFeatures = features.map(f => f.trim()).filter(Boolean)
    formData.append("features", JSON.stringify(cleanFeatures))

    // ✅ Arabic Features
    const cleanFeaturesAr = features_ar.map(f => f.trim()).filter(Boolean)
    formData.append("features_ar", JSON.stringify(cleanFeaturesAr))

    try {
      const res = await Client.put(`/products/${product._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      })

      setIsDirty(false)
      setProduct(res.data.product)

      setExistingManual(res.data.product?.manual?.s3Url ? res.data.product.manual : null)

      handleCloseE()
    } catch (err) {
      console.error("❌ Error updating product:", err)
      alert("Failed to update product.")
    }
  }

  // Add new category inline
  const addCategory = async () => {
    markDirty()
    try {
      const res = await Client.post(
        "/products/category",
        { name: categoryRef.current.value },
        { withCredentials: true }
      )
      setCategories(prev => [...prev, res.data.category])
      categoryRef.current.value = ""
      setNewCategory(false)
    } catch {}
  }

  // ============================
  // RENDER
  // ============================
  return (
    <div className="max-h-[75vh] overflow-y-auto px-1 sm:px-2">
      <form onSubmit={editProduct} className="bg-white rounded-xl p-4 sm:p-6">
        <h1 className="text-xl font-bold text-yellow-500 mb-4 text-center">Edit Product</h1>

        {/* QR Redirect URL */}
        {redirectUrl && (
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-500">QR Redirect URL</label>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={redirectUrl}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-default select-all"
              />
              <button
                type="button"
                onClick={copyRedirectUrl}
                className="shrink-0 px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        )}

        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block mb-1 text-sm font-medium">Model</label>
            <input
              ref={modelRef}
              onChange={markDirty}
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="Product model"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Barcode</label>
            <input
              ref={barcodeRef}
              onChange={markDirty}
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="Product barcode"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block mb-1 text-sm font-medium">Name (English)</label>
            <input
              ref={nameRef}
              onChange={markDirty}
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="Product name"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block mb-1 text-sm font-medium">Name (Arabic)</label>
            <input
              ref={nameArRef}
              onChange={markDirty}
              type="text"
              dir="rtl"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="Product name in Arabic"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="block mb-1 text-sm font-medium">Description (English)</label>
          <textarea
            ref={descriptionRef}
            onChange={markDirty}
            rows="3"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          ></textarea>
        </div>

        {/* Description Arabic */}
        <div className="mb-3">
          <label className="block mb-1 text-sm font-medium">Description (Arabic)</label>
          <textarea
            ref={descriptionArRef}
            onChange={markDirty}
            rows="3"
            dir="rtl"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="Product description in Arabic"
          ></textarea>
        </div>

        {/* YouTube Video */}
        <div className="mb-3">
          <label className="block mb-1 text-sm font-medium">YouTube URL (optional)</label>
          <input
            ref={youtubeUrlRef}
            type="url"
            onChange={markDirty}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        {/* Categories */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900">Categories</label>
          <select
            onChange={handleSelectCategory}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50"
          >
            <option value="">--Select Category--</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedCategories.map(id => {
                const cat = categories.find(c => c._id === id)
                return (
                  <span
                    key={id}
                    className="flex items-center bg-black text-white px-2 py-1 rounded text-xs"
                  >
                    {cat?.name || "Unknown"}
                    <button
                      type="button"
                      onClick={() => removeCategory(id)}
                      className="ml-1 text-yellow-400 hover:text-red-400"
                    >
                      ✕
                    </button>
                  </span>
                )
              })}
            </div>
          )}

          <span
            className="mx-2 cursor-pointer text-sm underline text-gray-700"
            onClick={() => setNewCategory(!newCategory)}
          >
            New
          </span>

          {newCategory && (
            <div className="flex mt-2">
              <input
                type="text"
                ref={categoryRef}
                onChange={markDirty}
                className="block p-2 border border-gray-300 rounded-lg bg-gray-50 text-sm flex-1"
                placeholder="New category name"
              />
              <button
                onClick={addCategory}
                type="button"
                className="h-9 text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm ml-1 px-3"
              >
                +
              </button>
            </div>
          )}
        </div>

        {/* Manual */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900">Manual</label>

          {existingManual && !removeManual && (
            <div className="flex items-center justify-between gap-2 p-2 mb-2 border border-gray-200 rounded-lg bg-gray-50">
              <a
                href={existingManual.s3Url}
                target="_blank"
                rel="noreferrer"
                className="text-sm underline text-blue-600 truncate"
                title={existingManual.name}
              >
                {existingManual.name || "View manual"}
              </a>

              <button
                type="button"
                className="text-xs px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={() => {
                  markDirty()
                  setRemoveManual(true)
                  if (manualRef.current) manualRef.current.value = ""
                }}
              >
                Remove
              </button>
            </div>
          )}

          {existingManual && removeManual && (
            <div className="flex items-center justify-between gap-2 p-2 mb-2 border border-yellow-200 rounded-lg bg-yellow-50">
              <span className="text-sm text-yellow-800 truncate">
                Manual will be removed on save.
              </span>

              <button
                type="button"
                className="text-xs px-2 py-1 rounded bg-gray-700 text-white hover:bg-gray-800"
                onClick={() => {
                  markDirty()
                  setRemoveManual(false)
                }}
              >
                Undo
              </button>
            </div>
          )}

          <input
            ref={manualRef}
            onChange={e => {
              markDirty()
              if (e.target.files?.[0]) setRemoveManual(false)
            }}
            type="file"
            name="manual"
            className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-gray-50 cursor-pointer"
          />
        </div>

        {/* Feature / Overview Images */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-900">Feature Images</label>
          <p className="text-xs text-gray-400 mb-2">
            Tall marketing / infographic images shown in the &quot;Overview&quot; section.
          </p>

          {(featureImages.length > 0 || newFeatures.length > 0) && (
            <div className="flex flex-wrap gap-3 mb-2">
              {featureImages.map(img => {
                const removed = featureRemove.includes(img.s3Key)
                return (
                  <div
                    key={img.s3Key || img.s3Url}
                    className={`relative w-20 h-28 rounded-lg border overflow-hidden bg-gray-50 ${
                      removed ? "opacity-40 border-red-300" : "border-gray-200"
                    }`}
                  >
                    <img src={img.s3Url} alt="" className="w-full h-full object-cover" />
                    {removed ? (
                      <button
                        type="button"
                        onClick={() => undoRemoveFeature(img.s3Key)}
                        className="absolute inset-x-1 bottom-1 bg-gray-700 text-white text-[10px] rounded py-0.5 hover:bg-gray-800"
                      >
                        Undo
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => removeExistingFeature(img.s3Key)}
                        className="absolute top-1 right-1 bg-black/60 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                        title="Remove"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                )
              })}

              {newFeatures.map((nf, i) => (
                <div
                  key={i}
                  className="relative w-20 h-28 rounded-lg border border-green-300 overflow-hidden bg-gray-50"
                >
                  <img src={nf.preview} alt={`New feature ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewFeature(i)}
                    className="absolute top-1 right-1 bg-black/60 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            ref={featureInputRef}
            onChange={handleFeatureSelect}
            type="file"
            accept="image/*"
            multiple
            className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-gray-50 cursor-pointer"
          />
        </div>

        {/* Variants */}
        <div className="border-t border-gray-200 pt-4 mb-4">
          <button
            type="button"
            onClick={() => setShowVariants(!showVariants)}
            className="text-sm font-medium text-yellow-600 hover:underline"
          >
            {showVariants ? "Hide Variants" : "Edit Variants"}
          </button>

          {showVariants && (
            <div className="mt-3 space-y-4">
              {/* Color Variants */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Color Variants</h3>
                {variants.colors.map((color, i) => (
                  <div
                    key={color._id || i}
                    className="relative border border-gray-200 rounded-lg p-3 bg-gray-50 mb-3"
                  >
                    <button
                      type="button"
                      onClick={() => removeColorVariant(i)}
                      className="absolute top-1.5 right-1.5 text-red-500 hover:text-red-600 text-sm font-bold rounded-full w-5 h-5 flex items-center justify-center bg-white border border-gray-300 shadow-sm"
                      title="Remove"
                    >
                      ✕
                    </button>

                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={color.name}
                        onChange={e => updateColorVariant(i, "name", e.target.value)}
                        placeholder="Color name"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => updateColorImage(i, e.target.files[0])}
                        className="text-xs"
                      />
                    </div>

                    <div className="flex justify-center mt-2">
                      {color.preview ? (
                        <img
                          src={color.preview}
                          alt={`${color.name}-preview`}
                          className="w-16 h-16 object-cover rounded border border-gray-300"
                        />
                      ) : color.images?.[0]?.s3Url ? (
                        <img
                          src={color.images[0].s3Url}
                          alt={`${color.name}-image`}
                          className="w-16 h-16 object-cover rounded border border-gray-300"
                        />
                      ) : (
                        <div className="w-16 h-16 flex items-center justify-center rounded border border-gray-200 bg-gray-50 text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <Button
                  onClick={addColorVariant}
                  variant="contained"
                  size="small"
                  className="!bg-yellow-500 hover:!bg-yellow-600 text-white text-xs"
                >
                  + Add Color
                </Button>
              </div>

              {/* Model Variants */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Model Variants</h3>
                {variants.models.map((m, i) => (
                  <div
                    key={m._id || i}
                    className="relative flex items-center gap-2 mb-2 border border-gray-200 rounded-lg p-2 bg-gray-50"
                  >
                    <button
                      type="button"
                      onClick={() => removeModelVariant(i)}
                      className="absolute top-1 right-1 text-red-500 hover:text-red-600 text-sm font-bold rounded-full w-5 h-5 flex items-center justify-center bg-white border border-gray-300 shadow-sm"
                      title="Remove"
                    >
                      ✕
                    </button>

                    <input
                      type="text"
                      value={m.name}
                      onChange={e => updateModelVariant(i, e.target.value)}
                      placeholder="Model name"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                    />
                  </div>
                ))}
                <Button
                  onClick={addModelVariant}
                  variant="contained"
                  size="small"
                  className="!bg-yellow-500 hover:!bg-yellow-600 text-white text-xs"
                >
                  + Add Model
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Specifications Toggle */}
        <div className="border-t border-gray-200 pt-4 mb-4">
          <button
            type="button"
            onClick={() => setShowSpecifications(!showSpecifications)}
            className="text-sm font-medium text-yellow-600 hover:underline"
          >
            {showSpecifications ? "Hide Specifications" : "Edit Specifications"}
          </button>

          {showSpecifications && (
            <div className="mt-3">
              <div className="space-y-2">
                {specifications.map((spec, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2 border border-gray-200 rounded-lg p-2 bg-gray-50"
                  >
                    <input
                      type="text"
                      value={spec.name}
                      onChange={e => updateSpecification(i, "name", e.target.value)}
                      placeholder="Name (EN)"
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                    />
                    <input
                      type="text"
                      value={spec.name_ar || ""}
                      onChange={e => updateSpecification(i, "name_ar", e.target.value)}
                      placeholder="Name (AR)"
                      dir="rtl"
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={e => updateSpecification(i, "value", e.target.value)}
                      placeholder="Value (EN)"
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={spec.value_ar || ""}
                        onChange={e => updateSpecification(i, "value_ar", e.target.value)}
                        placeholder="Value (AR)"
                        dir="rtl"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpecification(i)}
                        className="px-2 rounded bg-red-600 text-white text-xs hover:bg-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                onClick={addSpecification}
                variant="contained"
                size="small"
                className="!bg-yellow-500 hover:!bg-yellow-600 text-white text-xs mt-2"
              >
                + Add Specification
              </Button>
            </div>
          )}
        </div>

        {/* Features Toggle */}
        <div className="border-t border-gray-200 pt-4 mb-4">
          <button
            type="button"
            onClick={() => setShowFeatures(!showFeatures)}
            className="text-sm font-medium text-yellow-600 hover:underline"
          >
            {showFeatures ? "Hide Features" : "Edit Features"}
          </button>

          {showFeatures && (
            <div className="mt-3">
              <div className="space-y-2">
                {features.map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 border border-gray-200 rounded-lg p-2 bg-gray-50"
                  >
                    <input
                      type="text"
                      value={feature}
                      onChange={e => updateFeature(i, e.target.value)}
                      placeholder="Feature text..."
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                    />

                    <button
                      type="button"
                      onClick={() => removeFeature(i)}
                      className="px-2 py-1 rounded bg-red-600 text-white text-xs hover:bg-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                onClick={addFeature}
                variant="contained"
                size="small"
                className="!bg-yellow-500 hover:!bg-yellow-600 text-white text-xs mt-2"
              >
                + Add Feature
              </Button>
            </div>
          )}
        </div>

        {/* Arabic Features Toggle */}
        <div className="border-t border-gray-200 pt-4 mb-4">
          <button
            type="button"
            onClick={() => setShowFeaturesAr(!showFeaturesAr)}
            className="text-sm font-medium text-yellow-600 hover:underline"
          >
            {showFeaturesAr ? "Hide Features (Arabic)" : "Edit Features (Arabic)"}
          </button>

          {showFeaturesAr && (
            <div className="mt-3">
              <div className="space-y-2">
                {features_ar.map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 border border-gray-200 rounded-lg p-2 bg-gray-50"
                  >
                    <input
                      type="text"
                      value={feature}
                      onChange={e => updateFeatureAr(i, e.target.value)}
                      placeholder="Feature text (Arabic)..."
                      dir="rtl"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeatureAr(i)}
                      className="px-2 py-1 rounded bg-red-600 text-white text-xs hover:bg-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                onClick={addFeatureAr}
                variant="contained"
                size="small"
                className="!bg-yellow-500 hover:!bg-yellow-600 text-white text-xs mt-2"
              >
                + Add Feature (Arabic)
              </Button>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="mt-5 flex justify-center">
          <Button
            type="submit"
            variant="contained"
            className="!bg-yellow-500 hover:!bg-yellow-600 text-white font-semibold"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}
