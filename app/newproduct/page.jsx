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
  const categoryRef = useRef(null)

  // Properly structured refs
  const modelRef = useRef(null)
  const barcodeRef = useRef(null)
  const nameRef = useRef(null)
  const descriptionRef = useRef(null)
  const categorySelectRef = useRef(null)
  const manualRef = useRef(null)
  const imageRef = useRef(null)

  // Fetch categories and handle auth redirect
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

  // Add new product
  const addProduct = async e => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("model", modelRef.current.value)
    formData.append("barcode", barcodeRef.current.value)
    formData.append("name", nameRef.current.value)
    formData.append("description", descriptionRef.current.value)
    formData.append("category", categorySelectRef.current.value)
    if (manualRef.current.files[0]) formData.append("manual", manualRef.current.files[0])
    if (imageRef.current.files[0]) formData.append("image", imageRef.current.files[0])

    try {
      const res = await Client.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      })
      const slug = res.data.product.slug
      router.push(`/products/${slug}`)
    } catch (err) {
      console.error("Add product error:", err)
      alert("Error adding product")
    }
  }

  // Add new category
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

        <div>
          <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900">
            Category
          </label>
          <select
            id="category"
            name="category"
            ref={categorySelectRef}
            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs"
          >
            <option value="">--Category--</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>

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
