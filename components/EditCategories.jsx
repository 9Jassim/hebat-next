"use client"

import { useEffect, useState } from "react"
import Client from "@/lib/api"
import EditForm from "./EditCategoryForm"

export default function EditCategories({ onClose, onUpdated }) {
  const [categories, setCategories] = useState([])
  const [editingCategory, setEditingCategory] = useState(null)
  const [expanded, setExpanded] = useState({})
  const [loading, setLoading] = useState(false)

  // Fetch categories
  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)

      const res = await Client.get("/products/category", {
        withCredentials: true,
      })

      const cats = res.data.categories || []
      setCategories(cats)

      // expand parents automatically
      const expandedParents = {}
      cats.forEach(cat => {
        if (cat.parent) expandedParents[cat.parent] = true
      })
      setExpanded(expandedParents)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Expand / collapse
  const toggleCategory = id => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Build tree from flat list
  const buildCategoryTree = (parent = null) => {
    return categories
      .filter(cat => {
        if (!cat.parent && parent === null) return true
        if (cat.parent && parent) return String(cat.parent._id) === String(parent)
        return false
      })
      .map(cat => ({
        ...cat,
        children: buildCategoryTree(cat._id),
      }))
  }

  const categoryTree = buildCategoryTree()

  // CRUD handlers
  const handleEdit = category => {
    setEditingCategory(category)
  }

  const handleCreate = () => {
    setEditingCategory({ name: "", parent: null })
  }

  const handleSave = async data => {
    try {
      if (data._id) {
        await Client.put(`/products/category/${data._id}`, data, { withCredentials: true })
      } else {
        await Client.post(`/products/category`, data, { withCredentials: true })
      }

      await loadCategories()
      setEditingCategory(null)

      if (onUpdated) onUpdated()
    } catch (error) {
      console.error("Failed to save category:", error)
    }
  }

  const handleDelete = async id => {
    if (!confirm("Delete this category?")) return

    try {
      await Client.delete(`/products/category/${id}`, { withCredentials: true })

      setCategories(prev => prev.filter(c => c._id !== id))

      if (onUpdated) onUpdated()
    } catch (error) {
      console.error("Failed to delete category:", error)
    }
  }

  // Recursive category renderer
  const CategoryItem = ({ category, level = 0 }) => {
    const hasChildren = category.children && category.children.length > 0

    return (
      <>
        <li
          className="flex justify-between items-center py-2 px-2 hover:bg-gray-50 rounded"
          style={{ paddingLeft: `${level * 20}px` }}
        >
          <div className="flex items-center gap-2">
            {hasChildren && (
              <button onClick={() => toggleCategory(category._id)} className="text-gray-500 w-4">
                {expanded[category._id] ? "▼" : "▶"}
              </button>
            )}

            {!hasChildren && <span className="w-4"></span>}

            <span className="font-medium text-gray-900">{category.name}</span>
          </div>

          <div className="space-x-3">
            <button
              className="text-yellow-600 hover:text-yellow-700 font-medium"
              onClick={() => handleEdit(category)}
            >
              Edit
            </button>

            <button
              className="text-red-500 hover:text-red-600 font-medium"
              onClick={() => handleDelete(category._id)}
            >
              Delete
            </button>
          </div>
        </li>

        {expanded[category._id] &&
          category.children?.map(child => (
            <CategoryItem key={child._id} category={child} level={level + 1} />
          ))}
      </>
    )
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
          categories={categories}
        />
      ) : categoryTree.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {categoryTree.map(cat => (
            <CategoryItem key={cat._id} category={cat} />
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 text-sm italic">No categories found.</p>
      )}
    </div>
  )
}
