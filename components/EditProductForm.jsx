"use client"

import { useEffect, useState, useRef } from "react"
import Client from "@/lib/api"
import { Button } from "@mui/material"

// ✅ Helper slugify
const slugify = str =>
  str
    ?.toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-") || ""

export default function EditProductForm({ product, setProduct, handleCloseE }) {
  const [categories, setCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [newCategory, setNewCategory] = useState(false)
  const [variants, setVariants] = useState({ colors: [], models: [] })
  const [showVariants, setShowVariants] = useState(false)

  const categoryRef = useRef(null)
  const modelRef = useRef(null)
  const nameRef = useRef(null)
  const descriptionRef = useRef(null)
  const manualRef = useRef(null)

  // ✅ Fetch categories
  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await Client.get("/products/category", { withCredentials: true })
        setCategories(res.data.categories || [])
      } catch {}
    }
    getCategories()
  }, [])

  // ✅ Load product data
  useEffect(() => {
    if (!product) return
    if (modelRef.current) modelRef.current.value = product.model || ""
    if (nameRef.current) nameRef.current.value = product.name || ""
    if (descriptionRef.current) descriptionRef.current.value = product.description || ""
    setSelectedCategories(product.categories?.map(cat => cat._id) || [])
    setVariants(product.variants || { colors: [], models: [] })
  }, [product])

  // ✅ Category handlers
  const handleSelectCategory = e => {
    const id = e.target.value
    if (id && !selectedCategories.includes(id)) {
      setSelectedCategories(prev => [...prev, id])
    }
  }
  const removeCategory = id => {
    setSelectedCategories(prev => prev.filter(cat => cat !== id))
  }

  // ✅ Color variant handlers
  const updateColorVariant = (index, field, value) => {
    const updated = [...variants.colors]
    updated[index][field] = value
    setVariants(prev => ({ ...prev, colors: updated }))
  }

  const updateColorImage = (index, file) => {
    const updated = [...variants.colors]
    if (updated[index].preview) URL.revokeObjectURL(updated[index].preview)
    updated[index].images = []
    updated[index].newImage = file
    updated[index].preview = URL.createObjectURL(file)
    setVariants(prev => ({ ...prev, colors: updated }))
  }

  const addColorVariant = () => {
    setVariants(prev => ({
      ...prev,
      colors: [...prev.colors, { _id: null, name: "", images: [] }],
    }))
  }

  const removeColorVariant = index => {
    const updated = [...variants.colors]
    if (updated[index].preview) URL.revokeObjectURL(updated[index].preview)
    updated.splice(index, 1)
    setVariants(prev => ({ ...prev, colors: updated }))
  }

  // ✅ Model variant handlers
  const updateModelVariant = (index, value) => {
    const updated = [...variants.models]
    updated[index].name = value
    setVariants(prev => ({ ...prev, models: updated }))
  }

  const addModelVariant = () => {
    setVariants(prev => ({
      ...prev,
      models: [...prev.models, { _id: null, name: "" }],
    }))
  }

  const removeModelVariant = index => {
    const updated = [...variants.models]
    updated.splice(index, 1)
    setVariants(prev => ({ ...prev, models: updated }))
  }

  // ✅ Submit edits
  const editProduct = async e => {
    e.preventDefault()

    const formData = new FormData()

    formData.append("model", modelRef.current.value)
    formData.append("name", nameRef.current.value)
    formData.append("description", descriptionRef.current.value)
    selectedCategories.forEach(cat => formData.append("categories", cat))

    if (manualRef.current.files[0]) {
      formData.append("manual", manualRef.current.files[0])
    }

    // ✅ Build variants (no slug)
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

    // ✅ Attach color images
    variants.colors.forEach((v, idx) => {
      const file = v.newImage
      if (file instanceof File) {
        const key = v._id ? `variant_color_image_${v._id}` : `variant_color_image_index_${idx}`
        formData.append(key, file)
      }
    })

    try {
      const res = await Client.put(`/products/${product._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      })
      setProduct(res.data.product)
      handleCloseE()
    } catch (err) {
      console.error("❌ Error updating product:", err)
      alert("Failed to update product.")
    }
  }

  // ✅ Add new category inline
  const addCategory = async () => {
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

  return (
    <div className="max-h-[75vh] overflow-y-auto px-1 sm:px-2">
      <form onSubmit={editProduct} className="bg-white rounded-xl p-4 sm:p-6">
        <h1 className="text-xl font-bold text-yellow-500 mb-4 text-center">Edit Product</h1>

        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
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
            <label className="block mb-1 text-sm font-medium">Name</label>
            <input
              ref={nameRef}
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Product name"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="block mb-1 text-sm font-medium">Description</label>
          <textarea
            ref={descriptionRef}
            rows="3"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-yellow-500 focus:border-yellow-500"
          ></textarea>
        </div>

        {/* Categories */}
        <div className="mb-4">
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
          <input
            ref={manualRef}
            type="file"
            name="manual"
            className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-gray-50 cursor-pointer"
          />
        </div>

        {/* Variants */}
        <div className="border-t border-gray-200 pt-4">
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
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-yellow-500 focus:border-yellow-500"
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
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-yellow-500 focus:border-yellow-500"
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
