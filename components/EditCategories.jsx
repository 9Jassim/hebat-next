"use client"
import { useEffect, useState } from "react"
import Client from "@/lib/api"
import EditForm from "./EditForm"
export default function EditCategories({ onClose }) {
  const [categories, setCategories] = useState([])
  const [editingCategory, setEditingCategory] = useState(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    async function loadCategories() {
      try {
        setLoading(true)
        const res = await Client.get("/categories")
        setCategories(res.data.categories || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    loadCategories()
  }, [])
  const handleEdit = (category) => {
    setEditingCategory(category)
  }
  const handleCreate = () => {
    setEditingCategory({ name: "", description: "" })
  }
  const handleSave = async (data) => {
    try {
      if (data._id) {
        await Client.put(`/categories/${data._id}`, data)
      } else {
        await Client.post(`/categories`, data)
      }
      // reload
      const res = await Client.get("/categories")
      setCategories(res.data.categories || [])
      setEditingCategory(null)
    } catch (e) {
      console.error(e)
    }
  }
  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return
    try {
      await Client.delete(`/categories/${id}`)
      setCategories((c) => c.filter((x) => x._id !== id))
    } catch (e) {
      console.error(e)
    }
  }
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-lg font-semibold">Categories</h4>
        <div>
          <button className="px-3 py-1 bg-brand-yellow text-black rounded mr-2" onClick={handleCreate}>New</button>
          {onClose && <button className="px-3 py-1 bg-gray-200 rounded" onClick={onClose}>Close</button>}
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {editingCategory ? (
            <EditForm category={editingCategory} onSave={handleSave} onCancel={() => setEditingCategory(null)} />
          ) : (
            <ul className="divide-y">
              {categories.map((cat) => (
                <li key={cat._id} className="flex justify-between items-center py-2">
                  <div>
                    <div className="font-medium">{cat.name}</div>
                    <div className="text-sm text-gray-600">{cat.description}</div>
                  </div>
                  <div className="space-x-2">
                    <button className="text-brand-yellow" onClick={() => handleEdit(cat)}>Edit</button>
                    <button className="text-red-500" onClick={() => handleDelete(cat._id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}
