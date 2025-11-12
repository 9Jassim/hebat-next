import Client from "@/lib/api"

export default async function sitemap() {
  const baseUrl = "https://hebatofficial.com"

  // Helper: SEO-friendly slug generator
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

    // ✅ Fetch all products
    const prodRes = await Client.get("/products")
    const products = prodRes.data?.products || []

    // ✅ Category URLs
    const categoryUrls = categories.map(cat => ({
      url: `${baseUrl}/products/${slugify(cat.name)}`,
      lastModified: new Date(cat.updatedAt || new Date()).toISOString(),
      changeFrequency: "weekly",
      priority: 0.8,
    }))

    // ✅ Product + Variant URLs (with image tags)
    const productUrls = []

    for (const product of products) {
      const firstCategoryName =
        Array.isArray(product.categories) && product.categories.length > 0
          ? product.categories[0].name
          : product.category?.name || "products"

      const categorySlug = slugify(firstCategoryName)
      const parentSlug = product.slug

      // Collect all relevant images for the product
      const allImages = [
        ...(product.images || []),
        ...(product.variants?.colors?.flatMap(c => c.images || []) || []),
        ...(product.variants?.models?.flatMap(m => m.images || []) || []),
      ]

      // ✅ Parent product entry
      productUrls.push({
        url: `${baseUrl}/products/${categorySlug}/${parentSlug}`,
        lastModified: new Date(product.updatedAt || new Date()).toISOString(),
        changeFrequency: "weekly",
        priority: 0.7,
        images: allImages
          .filter(img => img?.s3Url)
          .map(img => ({
            loc: img.s3Url,
            title: product.name,
          })),
      })

      // ✅ Variant colors
      if (product.variants?.colors?.length) {
        for (const color of product.variants.colors) {
          const colorImages = color.images?.filter(img => img?.s3Url) || []
          productUrls.push({
            url: `${baseUrl}/products/${categorySlug}/${color.slug}`,
            lastModified: new Date(product.updatedAt || new Date()).toISOString(),
            changeFrequency: "weekly",
            priority: 0.6,
            images: colorImages.map(img => ({
              loc: img.s3Url,
              title: `${product.name} - ${color.name}`,
            })),
          })
        }
      }

      // ✅ Variant models
      if (product.variants?.models?.length) {
        for (const model of product.variants.models) {
          const modelImages = model.images?.filter(img => img?.s3Url) || []
          productUrls.push({
            url: `${baseUrl}/products/${categorySlug}/${model.slug}`,
            lastModified: new Date(product.updatedAt || new Date()).toISOString(),
            changeFrequency: "weekly",
            priority: 0.6,
            images: modelImages.map(img => ({
              loc: img.s3Url,
              title: `${product.name} - ${model.name}`,
            })),
          })
        }
      }
    }

    // ✅ Combine static + dynamic URLs
    return [
      // Static
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
      // Dynamic
      ...categoryUrls,
      ...productUrls,
    ]
  } catch (error) {
    console.error("❌ Error generating sitemap:", error.message)

    // Fallback
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
