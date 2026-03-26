import Client from "@/lib/api"

const baseUrl = "https://hebatofficial.com"

const slugify = str =>
  str
    ?.toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-") || ""

// Build a sitemap entry with EN + AR hreflang alternates
const entry = ({ enPath, arPath, lastModified, changeFrequency, priority, images }) => [
  {
    url: `${baseUrl}${enPath}`,
    lastModified,
    changeFrequency,
    priority,
    ...(images?.length ? { images } : {}),
    alternates: {
      languages: {
        en: `${baseUrl}${enPath}`,
        ar: `${baseUrl}${arPath}`,
      },
    },
  },
  {
    url: `${baseUrl}${arPath}`,
    lastModified,
    changeFrequency,
    priority,
    ...(images?.length ? { images } : {}),
    alternates: {
      languages: {
        en: `${baseUrl}${enPath}`,
        ar: `${baseUrl}${arPath}`,
      },
    },
  },
]

export default async function sitemap() {
  const now = new Date().toISOString()

  // Static pages
  const staticEntries = [
    ...entry({ enPath: "/", arPath: "/ar/", lastModified: now, changeFrequency: "weekly", priority: 1.0 }),
    ...entry({ enPath: "/products", arPath: "/ar/products", lastModified: now, changeFrequency: "weekly", priority: 0.9 }),
    ...entry({ enPath: "/about", arPath: "/ar/about", lastModified: now, changeFrequency: "monthly", priority: 0.6 }),
    ...entry({ enPath: "/contact", arPath: "/ar/contact", lastModified: now, changeFrequency: "monthly", priority: 0.6 }),
  ]

  try {
    const [catRes, prodRes] = await Promise.all([
      Client.get("/products/category"),
      Client.get("/products"),
    ])

    const categories = catRes.data?.categories || []
    const products = prodRes.data?.products || []

    // Category pages
    const categoryEntries = categories.flatMap(cat => {
      const catSlug = slugify(cat.name)
      const lastModified = new Date(cat.updatedAt || now).toISOString()
      return entry({
        enPath: `/products/${catSlug}`,
        arPath: `/ar/products/${catSlug}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.8,
      })
    })

    // Product pages
    const productEntries = []

    for (const product of products) {
      const firstCategoryName =
        Array.isArray(product.categories) && product.categories.length > 0
          ? product.categories[0].name
          : product.category?.name || "products"

      const categorySlug = slugify(firstCategoryName)
      const lastModified = new Date(product.updatedAt || now).toISOString()

      const allImages = [
        ...(product.images || []),
        ...(product.variants?.colors?.flatMap(c => c.images || []) || []),
        ...(product.variants?.models?.flatMap(m => m.images || []) || []),
      ]
        .filter(img => img?.s3Url)
        .map(img => ({ loc: img.s3Url, title: product.name }))

      // Parent product
      productEntries.push(
        ...entry({
          enPath: `/products/${categorySlug}/${product.slug}`,
          arPath: `/ar/products/${categorySlug}/${product.slug}`,
          lastModified,
          changeFrequency: "weekly",
          priority: 0.7,
          images: allImages,
        })
      )

      // Color variants
      for (const color of product.variants?.colors || []) {
        if (!color.slug) continue
        const colorImages = (color.images || [])
          .filter(img => img?.s3Url)
          .map(img => ({ loc: img.s3Url, title: `${product.name} - ${color.name}` }))

        productEntries.push(
          ...entry({
            enPath: `/products/${categorySlug}/${color.slug}`,
            arPath: `/ar/products/${categorySlug}/${color.slug}`,
            lastModified,
            changeFrequency: "weekly",
            priority: 0.6,
            images: colorImages,
          })
        )
      }

      // Model variants
      for (const model of product.variants?.models || []) {
        if (!model.slug) continue
        const modelImages = (model.images || [])
          .filter(img => img?.s3Url)
          .map(img => ({ loc: img.s3Url, title: `${product.name} - ${model.name}` }))

        productEntries.push(
          ...entry({
            enPath: `/products/${categorySlug}/${model.slug}`,
            arPath: `/ar/products/${categorySlug}/${model.slug}`,
            lastModified,
            changeFrequency: "weekly",
            priority: 0.6,
            images: modelImages,
          })
        )
      }
    }

    return [...staticEntries, ...categoryEntries, ...productEntries]
  } catch (error) {
    console.error("❌ Error generating sitemap:", error.message)
    return staticEntries
  }
}
