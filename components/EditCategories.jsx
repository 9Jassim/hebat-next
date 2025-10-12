"use client"

import { useEffect, useState } from "react"
import Client from "@/lib/api"
import EditForm from "./EditCategoryForm" // optional - skip if not yet built

export default function EditCategories({ onClose }) {
  const [categories, setCategories] = useState([])
  const [editingCategory, setEditingCategory] = useState(null)
  const [loading, setLoading] = useState(false)

  // Fetch categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true)
        const res = await Client.get("/products/category", { withCredentials: true })
        setCategories(res.data.categories || [])
      } catch (error) {
        console.error("Failed to load categories:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  // CRUD handlers
  const handleEdit = category => {
    setEditingCategory(category)
  }

  const handleCreate = () => {
    setEditingCategory({ name: "", description: "" })
  }

  const handleSave = async data => {
    try {
      if (data._id) {
        await Client.put(`/products/category/${data._id}`, data, { withCredentials: true })
      } else {
        await Client.post(`/products/category`, data, { withCredentials: true })
      }

      // Reload categories
      const res = await Client.get("/products/category", { withCredentials: true })
      setCategories(res.data.categories || [])
      setEditingCategory(null)
    } catch (error) {
      console.error("Failed to save category:", error)
    }
  }

  const handleDelete = async id => {
    if (!confirm("Delete this category?")) return
    try {
      await Client.delete(`/products/category/${id}`, { withCredentials: true })
      setCategories(prev => prev.filter(c => c._id !== id))
    } catch (error) {
      console.error("Failed to delete category:", error)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <p className="text-gray-600">Loading categories...</p>
      </div>
    )
  }

  return (
    <div className="p-2">
      {/* Header */}
      <div className="flex justify-between items-center mb-3 border-b pb-2">
        <h4 className="text-lg font-semibold text-gray-800">Categories</h4>
        <div className="space-x-2">
          <button
            className="px-3 py-1 bg-yellow-500 text-black rounded hover:bg-yellow-400 font-medium"
            onClick={handleCreate}
          >
            + New
          </button>
          {onClose && (
            <button
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-gray-800 font-medium"
              onClick={onClose}
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {editingCategory ? (
        <EditForm
          category={editingCategory}
          onSave={handleSave}
          onCancel={() => setEditingCategory(null)}
        />
      ) : categories.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {categories.map(cat => (
            <li
              key={cat._id}
              className="flex justify-between items-center py-3 px-2 hover:bg-gray-50 rounded transition"
            >
              <div>
                <div className="font-medium text-gray-900">{cat.name}</div>
                {cat.description && <div className="text-sm text-gray-600">{cat.description}</div>}
              </div>
              <div className="space-x-3">
                <button
                  className="text-yellow-600 hover:text-yellow-700 font-medium"
                  onClick={() => handleEdit(cat)}
                >
                  Edit
                </button>
                <button
                  className="text-red-500 hover:text-red-600 font-medium"
                  onClick={() => handleDelete(cat._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 text-sm italic">No categories found.</p>
      )}
    </div>
  )
}
