"use client"
import { useState } from "react"
export default function EditForm({ category = {}, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: category?.name || "",
    description: category?.description || "",
  })
  const [saving, setSaving] = useState(false)
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave({ ...category, ...form })
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded p-2 bg-gray-50 text-black"
        />
      </div>
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
