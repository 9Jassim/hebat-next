"use client"

import { useEffect, useRef, useState } from "react"
import Client from "@/lib/api"

export default function EditProductForm({ product, setProduct, handleCloseE }) {
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState(false)
  const categoryRef = useRef(null)

  // Form refs
  const modelRef = useRef(null)
  const nameRef = useRef(null)
  const descriptionRef = useRef(null)
  const categorySelectRef = useRef(null)
  const manualRef = useRef(null)
  const imageRef = useRef(null)

  // Fetch categories on mount
  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await Client.get("/products/category", { withCredentials: true })
        setCategories(res.data.categories || [])
      } catch (err) {
        console.error("Failed to fetch categories:", err)
      }
    }
    getCategories()
  }, [])

  // Populate form fields when product or categories change
  useEffect(() => {
    if (!product || !modelRef.current) return

    modelRef.current.value = product.model || ""
    nameRef.current.value = product.name || ""
    descriptionRef.current.value = product.description || ""
    if (categorySelectRef.current && product.category?._id) {
      categorySelectRef.current.value = product.category._id
    }
  }, [product, categories])

  // Handle editing the product
  const editProduct = async e => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("model", modelRef.current.value)
    formData.append("name", nameRef.current.value)
    formData.append("description", descriptionRef.current.value)
    formData.append("category", categorySelectRef.current.value)

    if (manualRef.current.files[0]) formData.append("manual", manualRef.current.files[0])
    if (imageRef.current.files[0]) formData.append("image", imageRef.current.files[0])

    try {
      const res = await Client.put(`/products/${product._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      })
      setProduct(res.data.product)
      handleCloseE()
    } catch (err) {
      console.error("Error updating product:", err)
      alert("Failed to update product.")
    }
  }

  // Add new category
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
    } catch (err) {
      console.error("Error adding category:", err)
    }
  }

  return (
    <div>
      <form
        onSubmit={editProduct}
        className="flex flex-col my-2 gap-3 p-3 shadow-lg border border-gray-300 rounded-lg w-full max-w-sm mx-auto pt-5 bg-yellow-500"
      >
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 text-center mb-2">
          Edit Product
        </h1>

        {/* Model */}
        <div>
          <label htmlFor="model" className="block mb-2 text-sm font-medium text-gray-900">
            Model
          </label>
          <input
            ref={modelRef}
            type="text"
            id="model"
            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-yellow-500 focus:border-yellow-500"
            placeholder="Product model"
          />
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
            Name
          </label>
          <input
            ref={nameRef}
            type="text"
            id="name"
            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-yellow-500 focus:border-yellow-500"
            placeholder="Product name"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">
            Description
          </label>
          <textarea
            ref={descriptionRef}
            id="description"
            rows="4"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-yellow-500 focus:border-yellow-500"
            placeholder="Product description"
          ></textarea>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900">
            Category
          </label>
          <select
            ref={categorySelectRef}
            id="category"
            name="category"
            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs"
          >
            <option value="">--Category--</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
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
                id="category-name"
                className="block p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs flex-1"
                placeholder="New category name"
                ref={categoryRef}
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
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">Manual</label>
          <input
            ref={manualRef}
            type="file"
            id="manual"
            name="manual"
            className="p-1.5 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">Image</label>
          <input
            ref={imageRef}
            type="file"
            id="image"
            name="image"
            className="p-1.5 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="flex justify-center w-full text-white bg-black hover:bg-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center"
        >
          <svg
            className="m-1 w-5 h-5 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z"
              clipRule="evenodd"
            />
          </svg>
          Save Changes
        </button>
      </form>
    </div>
  )
}
