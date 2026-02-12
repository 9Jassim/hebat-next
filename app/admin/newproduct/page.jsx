"use client"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Client from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@mui/material"

export default function NewProduct() {
  const router = useRouter()
  const { user } = useAuth()

  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState([])

  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])

  const [variants, setVariants] = useState({ colors: [], models: [] })
  const [showVariants, setShowVariants] = useState(false)

  const [specifications, setSpecifications] = useState([{ name: "", value: "" }])
  const [featuresText, setFeaturesText] = useState("")

  const categoryRef = useRef(null)
  const modelRef = useRef(null)
  const barcodeRef = useRef(null)
  const nameRef = useRef(null)
  const descriptionRef = useRef(null)
  const manualRef = useRef(null)
  const imagesRef = useRef(null)

  // ✅ Fetch categories
  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await Client.get("/products/category")
        setCategories(res.data.categories || [])
      } catch (err) {
        console.error("Failed to fetch categories:", err)
      }
    }
    getCategories()
  }, [user, router])

  // ✅ Handle selecting multiple images
  const handleImageSelect = e => {
    const files = Array.from(e.target.files)
    setImages(prev => [...prev, ...files])
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setImagePreviews(prev => [...prev, ...newPreviews])
    e.target.value = ""
  }

  const removeImage = index => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  // ✅ Category handlers
  const handleSelectCategory = e => {
    const id = e.target.value
    if (id && !selectedCategories.includes(id)) {
      setSelectedCategories([...selectedCategories, id])
    }
  }

  const removeCategory = id => {
    setSelectedCategories(prev => prev.filter(catId => catId !== id))
  }

  // ✅ Specifications
  const addSpecification = () => {
    setSpecifications(prev => [...prev, { name: "", value: "" }])
  }

  const updateSpecification = (index, field, value) => {
    const updated = [...specifications]
    updated[index][field] = value
    setSpecifications(updated)
  }

  const removeSpecification = index => {
    setSpecifications(prev => prev.filter((_, i) => i !== index))
  }

  // ✅ Variants
  const addColorVariant = () => {
    setVariants(prev => ({
      ...prev,
      colors: [...prev.colors, { name: "", image: null, preview: null }],
    }))
  }

  const updateColorVariant = (index, field, value) => {
    const updated = [...variants.colors]
    updated[index][field] = value
    setVariants(prev => ({ ...prev, colors: updated }))
  }

  const updateColorImage = (index, file) => {
    const updated = [...variants.colors]
    updated[index].image = file
    updated[index].preview = URL.createObjectURL(file)
    setVariants(prev => ({ ...prev, colors: updated }))
  }

  const removeColorVariant = index => {
    const updated = [...variants.colors]
    if (updated[index].preview) URL.revokeObjectURL(updated[index].preview)
    updated.splice(index, 1)
    setVariants(prev => ({ ...prev, colors: updated }))
  }

  const addModelVariant = () => {
    setVariants(prev => ({
      ...prev,
      models: [...prev.models, { name: "" }],
    }))
  }

  const updateModelVariant = (index, value) => {
    const updated = [...variants.models]
    updated[index].name = value
    setVariants(prev => ({ ...prev, models: updated }))
  }

  const removeModelVariant = index => {
    const updated = [...variants.models]
    updated.splice(index, 1)
    setVariants(prev => ({ ...prev, models: updated }))
  }

  // ✅ Submit
  const addProduct = async e => {
    e.preventDefault()
    const formData = new FormData()

    formData.append("model", modelRef.current.value)
    formData.append("barcode", barcodeRef.current.value)
    formData.append("name", nameRef.current.value)
    formData.append("description", descriptionRef.current.value)
    selectedCategories.forEach(cat => formData.append("categories", cat))
    if (manualRef.current.files[0]) formData.append("manual", manualRef.current.files[0])
    images.forEach(file => formData.append("images", file))

    const plainVariants = {
      colors: variants.colors.map(v => ({ name: v.name })),
      models: variants.models.map(v => ({ name: v.name })),
    }
    if (showVariants && (plainVariants.colors.length > 0 || plainVariants.models.length > 0)) {
      formData.append("variants", JSON.stringify(plainVariants))
    }

    variants.colors.forEach((v, i) => {
      if (v.image) formData.append(`variant_color_image_${i}`, v.image)
    })

    // ✅ Features (comma separated -> array)
    const features = featuresText
      .split(",")
      .map(f => f.trim())
      .filter(Boolean)

    if (features.length > 0) {
      formData.append("features", JSON.stringify(features))
    }

    // ✅ Specifications (remove empty ones)
    const cleanSpecs = specifications.filter(s => s.name.trim() && s.value.trim())

    if (cleanSpecs.length > 0) {
      formData.append("specifications", JSON.stringify(cleanSpecs))
    }

    try {
      const res = await Client.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      })

      const product = res.data.product
      const slug = product.slug

      const firstCategoryId = selectedCategories[0]
      const firstCategory = categories.find(cat => cat._id === firstCategoryId)
      const categorySlug = firstCategory
        ? firstCategory.name
            .toLowerCase()
            .replace(/&/g, "and")
            .replace(/[^a-z0-9]+/g, "-")
        : "others"
      router.push(`/products/${categorySlug}/${slug}`)
    } catch (err) {
      console.error("Add product error:", err)
      alert("Error adding product")
    }
  }

  if (!user)
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-600">
        You must be logged in as an admin to access this page.
      </div>
    )

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <h1 className="text-2xl font-bold text-yellow-500 mb-6">Add New Product</h1>

      {/* Main Form */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Product Information</h2>

        <form onSubmit={addProduct} className="space-y-5">
          {/* Basic Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Model</label>
              <input
                ref={modelRef}
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Product model"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Barcode</label>
              <input
                ref={barcodeRef}
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Product barcode"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Name</label>
            <input
              ref={nameRef}
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Product name"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Description</label>
            <textarea
              ref={descriptionRef}
              rows="4"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Product description"
            ></textarea>
          </div>

          {/* Features */}
          <div>
            <label className="block mb-1 text-sm font-medium">Features</label>
            <p className="text-xs text-gray-500 mb-2">Write features separated by commas.</p>

            <textarea
              rows="3"
              value={featuresText}
              onChange={e => setFeaturesText(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-yellow-500 focus:border-yellow-500"
              placeholder=""
            />
          </div>

          {/* Specifications */}
          <div>
            <h2 className="text-md font-semibold text-gray-800 mb-2">Specifications</h2>

            <div className="space-y-3">
              {specifications.map((spec, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2 border border-gray-200 rounded-lg p-3 bg-gray-50"
                >
                  <input
                    type="text"
                    value={spec.name}
                    onChange={e => updateSpecification(i, "name", e.target.value)}
                    placeholder="Specification name"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-yellow-500 focus:border-yellow-500"
                  />

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={spec.value}
                      onChange={e => updateSpecification(i, "value", e.target.value)}
                      placeholder="Value"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-yellow-500 focus:border-yellow-500"
                    />

                    <button
                      type="button"
                      onClick={() => removeSpecification(i)}
                      className="px-3 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700"
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
              className="!bg-yellow-500 hover:!bg-yellow-600 text-white text-xs mt-3"
            >
              + Add Specification
            </Button>
          </div>

          {/* Categories */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Categories</label>
            <select
              onChange={handleSelectCategory}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:ring-yellow-500 focus:border-yellow-500"
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
          </div>

          {/* Images (Parent Product) */}
          <div>
            <h2 className="text-md font-semibold text-gray-800 mb-2">Product Images</h2>
            <p className="text-sm text-gray-600 mb-2">
              Upload main images for the parent product before adding variant images.
            </p>
            <input
              ref={imagesRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageSelect}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-gray-50 cursor-pointer"
            />

            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="relative">
                    <img
                      src={src}
                      alt={`preview-${i}`}
                      className="w-24 h-24 object-cover rounded border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-0 right-0 bg-black bg-opacity-60 text-white text-xs rounded-full p-1 hover:bg-red-600"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Manual */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Manual (Optional)
            </label>
            <input
              ref={manualRef}
              type="file"
              name="manual"
              className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-gray-50 cursor-pointer"
            />
          </div>

          {/* Variants Section */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <button
              type="button"
              onClick={() => setShowVariants(!showVariants)}
              className="text-sm font-medium text-yellow-600 hover:underline"
            >
              {showVariants ? "Hide Variants" : "Add Variants"}
            </button>

            {showVariants && (
              <div className="mt-4 space-y-6">
                {/* Color Variants */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Color Variants</h3>
                  <p className="text-xs text-gray-500 mb-3">
                    Each color variant can have its own image.
                  </p>
                  {variants.colors.map((color, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-3 bg-gray-50 mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={color.name}
                          onChange={e => updateColorVariant(i, "name", e.target.value)}
                          placeholder="Color name"
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-yellow-500 focus:border-yellow-500"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => updateColorImage(i, e.target.files[0])}
                          className="text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => removeColorVariant(i)}
                          className="text-red-600 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                      {color.preview && (
                        <div className="flex justify-center">
                          <img
                            src={color.preview}
                            alt={`${color.name} preview`}
                            className="w-20 h-20 object-cover rounded border border-gray-300"
                          />
                        </div>
                      )}
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
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Model Variants</h3>
                  {variants.models.map((m, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 mb-2 border border-gray-200 rounded-lg p-2 bg-gray-50"
                    >
                      <input
                        type="text"
                        value={m.name}
                        onChange={e => updateModelVariant(i, e.target.value)}
                        placeholder="Model name"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-yellow-500 focus:border-yellow-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeModelVariant(i)}
                        className="text-red-600 font-bold"
                      >
                        ✕
                      </button>
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

          {/* Submit */}
          <Button
            type="submit"
            variant="contained"
            className="!bg-yellow-500 hover:!bg-yellow-600 text-white font-semibold"
          >
            Add Product
          </Button>
        </form>
      </div>
    </div>
  )
}
