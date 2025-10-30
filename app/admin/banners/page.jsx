"use client"

import { useEffect, useState } from "react"
import Client from "@/lib/api"
import Banners from "@/components/Banners"

export default function AdminBannersPage() {
  const [banners, setBanners] = useState([])
  const [newBanner, setNewBanner] = useState({
    title: "",
    path: "/",
    order: "",
  })
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // ✅ Fetch banners from backend
  const fetchBanners = async () => {
    try {
      setLoading(true)
      const res = await Client.get("/banner")
      setBanners(res.data.banners || [])
    } catch (error) {
      console.error("❌ Error fetching banners:", error)
    } finally {
      setLoading(false)
    }
  }

  // ✅ Fetch banners on mount & when refreshTrigger changes
  useEffect(() => {
    fetchBanners()
  }, [refreshTrigger])

  // ✅ Refresh helper
  const refreshBanners = () => setRefreshTrigger(prev => prev + 1)

  // ✅ Handle new banner upload
  const handleUpload = async () => {
    if (!file) {
      alert("Please select an image")
      return
    }

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append("image", file)
      formData.append("title", newBanner.title)
      formData.append("path", newBanner.path)
      formData.append("order", newBanner.order || 0)

      const res = await Client.post("/banner", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      })

      if (res.status === 201) {
        alert("✅ Banner added successfully!")
        setNewBanner({ title: "", path: "/", order: "" })
        setFile(null)
        refreshBanners() // ⬅️ refresh after upload
      }
    } catch (error) {
      console.error("❌ Upload failed:", error)
      alert("Failed to upload banner")
    } finally {
      setLoading(false)
    }
  }

  // ✅ Handle delete
  const handleDelete = async id => {
    if (!confirm("Are you sure you want to delete this banner?")) return
    try {
      setLoading(true)
      await Client.delete(`/banner/${id}`, { withCredentials: true })
      alert("✅ Banner deleted successfully!")
      refreshBanners() // ⬅️ refresh after delete
    } catch (error) {
      console.error("❌ Delete failed:", error)
      alert("Failed to delete banner")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-yellow-500 mb-8">🛠️ Manage Banners</h1>

        {/* ✅ Live Preview */}
        <div className="mb-12">
          <Banners key={banners.length} images={banners.map(b => b.image.s3Url)} />
        </div>

        {/* ✅ Add Banner Form */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-10">
          <h2 className="text-2xl font-semibold mb-4">Add New Banner</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <input
              type="text"
              placeholder="Title"
              value={newBanner.title}
              onChange={e => setNewBanner({ ...newBanner, title: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400 outline-none"
            />
            <input
              type="text"
              placeholder="Path (e.g. /products/hebat)"
              value={newBanner.path}
              onChange={e => setNewBanner({ ...newBanner, path: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400 outline-none"
            />
            <input
              type="number"
              placeholder="Order"
              value={newBanner.order}
              onChange={e => setNewBanner({ ...newBanner, order: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400 outline-none"
            />
            <input
              type="file"
              accept="image/*"
              onChange={e => setFile(e.target.files[0])}
              className="border border-gray-300 rounded-lg px-4 py-2 cursor-pointer"
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 shadow-md disabled:opacity-70"
          >
            {loading ? "Uploading..." : "Upload Banner"}
          </button>
        </div>

        {/* ✅ Banner List */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Current Banners:</h3>

          {loading && banners.length === 0 ? (
            <p className="text-gray-500">Loading banners...</p>
          ) : banners.length === 0 ? (
            <p className="text-gray-500">No banners available.</p>
          ) : (
            <ul className="space-y-3">
              {banners.map(banner => (
                <li
                  key={banner._id}
                  className="flex items-center justify-between bg-gray-100 p-3 rounded-lg"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img
                      src={banner.image.s3Url}
                      alt={banner.title}
                      className="w-16 h-16 object-contain rounded-md border border-gray-300 bg-white"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800">{banner.title}</span>
                      <span className="text-xs text-gray-500 truncate max-w-[14rem]">
                        {banner.path}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(banner._id)}
                    className="text-red-500 hover:text-red-700 font-semibold"
                  >
                    Remove ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
