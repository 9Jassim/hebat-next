"use client"

import { useEffect, useState } from "react"
import Client from "@/lib/api"

const slugify = str =>
  str
    ?.toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-") || ""

export default function AdminHomepagePage() {
  const [heroHeading, setHeroHeading] = useState("")
  const [heroHeading_ar, setHeroHeading_ar] = useState("")

  const [allCategories, setAllCategories] = useState([])
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([])

  const [allProducts, setAllProducts] = useState([])
  const [selectedProductIds, setSelectedProductIds] = useState([])
  const [productSearch, setProductSearch] = useState("")

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Load current config + all categories + all products
  useEffect(() => {
    const load = async () => {
      const [configRes, catRes, prodRes] = await Promise.all([
        Client.get("/homepage-config"),
        Client.get("/products/category"),
        Client.get("/products"),
      ])

      const config = configRes.data.config
      if (config) {
        setHeroHeading(config.heroHeading || "")
        setHeroHeading_ar(config.heroHeading_ar || "")
        setSelectedCategoryIds((config.featuredCategories || []).map(c => c._id || c))
        setSelectedProductIds((config.featuredProducts || []).map(p => p._id || p))
      }

      const cats = (catRes.data.categories || []).filter(c => !c.parent)
      setAllCategories(cats)

      const prods = prodRes.data.products || []
      const unique = Array.from(new Map(prods.map(p => [p._id, p])).values())
      setAllProducts(unique)
    }

    load().catch(console.error)
  }, [])

  const toggleCategory = id => {
    setSelectedCategoryIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]))
  }

  const toggleProduct = id => {
    setSelectedProductIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]))
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      await Client.put(
        "/homepage-config",
        {
          heroHeading,
          heroHeading_ar,
          featuredCategoryIds: selectedCategoryIds,
          featuredProductIds: selectedProductIds,
        },
        { withCredentials: true }
      )
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error("❌ Failed to save:", err)
      alert("Failed to save homepage config")
    } finally {
      setSaving(false)
    }
  }

  const filteredProducts = allProducts.filter(p => {
    const q = productSearch.toLowerCase()
    return (
      !q ||
      p.name?.toLowerCase().includes(q) ||
      p.name_ar?.includes(q) ||
      p.model?.toLowerCase().includes(q)
    )
  })

  return (
    <section className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-yellow-500">🏠 Homepage Settings</h1>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-xl shadow disabled:opacity-60 transition"
          >
            {saving ? "Saving..." : saved ? "✅ Saved!" : "Save Changes"}
          </button>
        </div>

        {/* ── Hero Text ── */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Hero Heading</h2>
          <p className="text-sm text-gray-500">
            Leave blank to use the default heading. Use \n for a line break.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                English Heading
              </label>
              <textarea
                rows={3}
                value={heroHeading}
                onChange={e => setHeroHeading(e.target.value)}
                placeholder={"Crafted for Quality,\nBuilt to Impress"}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-yellow-400 outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                Arabic Heading
              </label>
              <textarea
                rows={3}
                dir="rtl"
                value={heroHeading_ar}
                onChange={e => setHeroHeading_ar(e.target.value)}
                placeholder={"مصنوع بجودة،\nمبني ليبهر"}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-yellow-400 outline-none resize-none text-right"
              />
            </div>
          </div>
        </div>

        {/* ── Featured Categories ── */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">Featured Categories</h2>
          <p className="text-sm text-gray-500 mb-4">
            Choose which categories appear on the homepage. If none selected, all root categories
            are shown.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {allCategories.map(cat => {
              const selected = selectedCategoryIds.includes(cat._id)
              return (
                <button
                  key={cat._id}
                  onClick={() => toggleCategory(cat._id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    selected
                      ? "bg-yellow-500 border-yellow-500 text-white shadow"
                      : "border-gray-200 text-gray-700 hover:border-yellow-400 hover:text-yellow-600"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center text-xs ${
                      selected ? "bg-white border-white text-yellow-500" : "border-gray-300"
                    }`}
                  >
                    {selected && "✓"}
                  </span>
                  <span className="truncate">{cat.name}</span>
                  {cat.name_ar && (
                    <span className="truncate text-xs opacity-70" dir="rtl">
                      {cat.name_ar}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
          {selectedCategoryIds.length > 0 && (
            <p className="text-xs text-yellow-600 mt-3 font-medium">
              {selectedCategoryIds.length} categor{selectedCategoryIds.length === 1 ? "y" : "ies"}{" "}
              selected
            </p>
          )}
        </div>

        {/* ── Featured Products ── */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">Featured Products</h2>
          <p className="text-sm text-gray-500 mb-4">
            Choose which products appear in the featured row. If none selected, the first 12
            products are shown.
          </p>

          <input
            type="text"
            placeholder="Search by name, model..."
            value={productSearch}
            onChange={e => setProductSearch(e.target.value)}
            className="w-full sm:w-80 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-yellow-400 outline-none mb-4"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[480px] overflow-y-auto pr-1">
            {filteredProducts.map(product => {
              const selected = selectedProductIds.includes(product._id)
              const name = product.name
              return (
                <button
                  key={product._id}
                  onClick={() => toggleProduct(product._id)}
                  className={`relative flex flex-col rounded-xl border overflow-hidden text-left transition-all ${
                    selected
                      ? "border-yellow-500 shadow-md ring-2 ring-yellow-400"
                      : "border-gray-200 hover:border-yellow-300"
                  }`}
                >
                  {/* Selected badge */}
                  {selected && (
                    <span className="absolute top-1.5 right-1.5 z-10 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow">
                      ✓
                    </span>
                  )}
                  <div className="h-28 bg-gray-50 flex items-center justify-center p-2">
                    <img
                      src={product.images?.[0]?.s3Url || "/hebat_product_fill.png"}
                      alt={name}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <div className="px-2 py-2">
                    <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug">
                      {name}
                    </p>
                    {product.model && (
                      <p className="text-xs text-gray-400 mt-0.5">{product.model}</p>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {selectedProductIds.length > 0 && (
            <p className="text-xs text-yellow-600 mt-3 font-medium">
              {selectedProductIds.length} product{selectedProductIds.length === 1 ? "" : "s"}{" "}
              selected
            </p>
          )}
        </div>

        {/* Bottom save */}
        <div className="flex justify-end pb-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-xl shadow disabled:opacity-60 transition"
          >
            {saving ? "Saving..." : saved ? "✅ Saved!" : "Save Changes"}
          </button>
        </div>
      </div>
    </section>
  )
}
