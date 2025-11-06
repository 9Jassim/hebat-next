import Client from "@/lib/api"

export default async function sitemap() {
  const baseUrl = "https://hebatofficial.com"

  // Helper: convert category names into clean, SEO-friendly slugs
  const slugify = str =>
    str
      ?.toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-") || ""

  try {
    // ✅ Fetch categories
    const catRes = await Client.get("/products/category", {
      withCredentials: true,
    })
    const categories = catRes.data?.categories || []

    // ✅ Fetch products
    const prodRes = await Client.get("/products")
    const products = prodRes.data?.products || []

    // ✅ Category URLs
    const categoryUrls = categories.map(cat => ({
      url: `${baseUrl}/products/${slugify(cat.name)}`,
      lastModified: new Date(cat.updatedAt || new Date()).toISOString(),
      changeFrequency: "weekly",
      priority: 0.8,
    }))

    // ✅ Product URLs
    const productUrls = products.map(product => {
      const firstCategoryName =
        Array.isArray(product.categories) && product.categories.length > 0
          ? product.categories[0].name
          : product.category?.name || "products"

      const categorySlug = slugify(firstCategoryName)
      const productSlug = product.slug

      return {
        url: `${baseUrl}/products/${categorySlug}/${productSlug}`,
        lastModified: new Date(product.updatedAt || new Date()).toISOString(),
        changeFrequency: "weekly",
        priority: 0.7,
      }
    })

    // ✅ Combine static, category, and product URLs
    return [
      // Static URLs
      {
        url: `${baseUrl}/`,
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly",
        priority: 1.0,
      },
      {
        url: `${baseUrl}/products`,
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly",
        priority: 0.9,
      },
      // Dynamic URLs
      ...categoryUrls,
      ...productUrls,
    ]
  } catch (error) {
    console.error("❌ Error generating sitemap:", error.message)

    // Fallback sitemap if API calls fail
    return [
      {
        url: `${baseUrl}/`,
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly",
        priority: 1.0,
      },
      {
        url: `${baseUrl}/products`,
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly",
        priority: 0.9,
      },
    ]
  }
}
