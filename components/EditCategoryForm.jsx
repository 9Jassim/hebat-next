"use client"

import { useState, useEffect } from "react"

export default function EditForm({ category = {}, categories = [], onSave, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    name_ar: "",
    parent: "",
  })

  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setForm({
      name: category?.name || "",
      name_ar: category?.name_ar || "",
      parent: category?.parent?._id || category?.parent || "",
    })
  }, [category])

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)

    try {
      await onSave({
        ...category,
        ...form,
        parent: form.parent || null,
      })
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Category Name */}
      <div>
        <label className="block text-sm font-medium">Name (English)</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded p-2 bg-gray-50 text-black"
        />
      </div>

      {/* Category Name Arabic */}
      <div>
        <label className="block text-sm font-medium">Name (Arabic)</label>
        <input
          name="name_ar"
          value={form.name_ar}
          onChange={handleChange}
          dir="rtl"
          className="w-full border rounded p-2 bg-gray-50 text-black"
          placeholder="Category name in Arabic"
        />
      </div>

      {/* Parent Category */}
      <div>
        <label className="block text-sm font-medium">Parent Category</label>

        <select
          name="parent"
          value={form.parent || ""}
          onChange={handleChange}
          className="w-full border rounded p-2 bg-gray-50 text-black"
        >
          <option value="">None (Top Level)</option>

          {categories
            .filter(c => c._id !== category?._id)
            .map(cat => (
              <option key={cat._id} value={cat._id.toString()}>
                {cat.name}
              </option>
            ))}
        </select>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded">
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-brand-yellow text-black rounded"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  )
}
