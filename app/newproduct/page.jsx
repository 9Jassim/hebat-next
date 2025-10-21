"use client"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Client from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

export default function NewProduct() {
  const router = useRouter()
  const { user } = useAuth()

  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState([])

  const categoryRef = useRef(null)
  const modelRef = useRef(null)
  const barcodeRef = useRef(null)
  const nameRef = useRef(null)
  const descriptionRef = useRef(null)
  const manualRef = useRef(null)
  const imageRef = useRef(null)

  // Fetch categories
  useEffect(() => {
    if (!user) {
      router.push("/admin")
      return
    }

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

  // ✅ Add category to selected list
  const handleSelectCategory = e => {
    const id = e.target.value
    if (id && !selectedCategories.includes(id)) {
      setSelectedCategories([...selectedCategories, id])
    }
  }

  // ✅ Remove category tag
  const removeCategory = id => {
    setSelectedCategories(prev => prev.filter(catId => catId !== id))
  }

  // ✅ Add new product
  const addProduct = async e => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("model", modelRef.current.value)
    formData.append("barcode", barcodeRef.current.value)
    formData.append("name", nameRef.current.value)
    formData.append("description", descriptionRef.current.value)

    // ✅ Add multiple categories
    selectedCategories.forEach(cat => formData.append("categories", cat))

    if (manualRef.current.files[0]) formData.append("manual", manualRef.current.files[0])
    if (imageRef.current.files[0]) formData.append("image", imageRef.current.files[0])

    try {
      const res = await Client.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      })

      const product = res.data.product
      const slug = product.slug

      // ✅ Redirect using first selected category (from UI)
      if (selectedCategories.length > 0) {
        const firstCategoryId = selectedCategories[0]
        // Fetch its name from your already-loaded category list
        const firstCategory = categories.find(cat => cat._id === firstCategoryId)
        const categorySlug = firstCategory
          ? firstCategory.name
              .toLowerCase()
              .replace(/&/g, "and")
              .replace(/[^a-z0-9]+/g, "-")
          : "others"

        router.push(`/products/${categorySlug}/${slug}`)
      } else {
        // fallback to products page
        router.push("/products")
      }
    } catch (err) {
      console.error("Add product error:", err)
      alert("Error adding product")
    }
  }

  // ✅ Add new category inline
  const addCategory = async () => {
    try {
      const res = await Client.post("/products/category", {
        name: categoryRef.current.value,
      })
      setCategories(prev => [...prev, res.data.category])
      categoryRef.current.value = ""
      setNewCategory(false)
    } catch (err) {
      console.error("Add category error:", err)
    }
  }

  return (
    <div className="flex flex-col w-full pt-10">
      <form
        onSubmit={addProduct}
        className="flex flex-col my-2 gap-3 p-2.5 shadow-lg border border-gray-300 rounded-lg w-full max-w-sm mx-auto pt-5 bg-yellow-500"
      >
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900">
          New Product
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

        {/* Barcode */}
        <div>
          <label htmlFor="barcode" className="block mb-2 text-sm font-medium text-gray-900">
            Barcode
          </label>
          <input
            ref={barcodeRef}
            type="text"
            id="barcode"
            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-yellow-500 focus:border-yellow-500"
            placeholder="Product barcode"
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

        {/* Categories */}
        <div>
          <label htmlFor="categories" className="block mb-2 text-sm font-medium text-gray-900">
            Categories (Select one or more)
          </label>

          <div className="flex flex-col space-y-2">
            {/* Category dropdown */}
            <select
              id="categories"
              onChange={handleSelectCategory}
              className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs"
            >
              <option value="">--Select Category--</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Selected category tags */}
            {selectedCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
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
                        title="Remove"
                      >
                        ✕
                      </button>
                    </span>
                  )
                })}
              </div>
            )}
          </div>

          {/* Add new category inline */}
          <span
            className="mx-2 cursor-pointer text-sm underline"
            onClick={() => setNewCategory(!newCategory)}
          >
            New
          </span>

          {newCategory && (
            <div className="flex mt-2">
              <input
                type="text"
                id="category-name"
                ref={categoryRef}
                className="block p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs flex-1"
                placeholder="new category name"
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
          Add Product
        </button>
      </form>
    </div>
  )
}
