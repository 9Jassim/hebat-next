// ✅ Server component
import ProductDetails from "@/components/ProductDetails"
import Client from "@/lib/api"

// ✅ Generate SEO metadata dynamically for products & variants
export async function generateMetadata({ params }) {
  const { category, slug } = params

  try {
    const res = await Client.get(`/products/${slug}`)
    const { product, selectedVariant } = res.data

    // 🧠 Determine which name & description to show
    const displayName = selectedVariant?.name
      ? `${product.name} – ${selectedVariant.name}`
      : product.name

    const description =
      selectedVariant?.description ||
      product.description ||
      `Discover ${displayName} — premium ${product.category?.name || category} from Hebat.`

    // 🖼️ Variant-specific image if available
    const imageUrl =
      selectedVariant?.images?.[0]?.s3Url || product.images?.[0]?.s3Url || "/hebat_cover.png"

    const productUrl = `${process.env.NEXT_PUBLIC_URL}/products/${encodeURIComponent(
      category
    )}/${encodeURIComponent(slug)}`

    return {
      title: displayName,
      description,
      keywords: [
        displayName,
        product.model,
        product.barcode,
        selectedVariant?.name,
        product.category?.name || category,
        "arabvape",
        "hebat",
        "morslon",
        "products",
        "Middle East",
        "Bahrain",
        "secure payment",
        "fast delivery",
      ].filter(Boolean),
      openGraph: {
        title: displayName,
        description,
        url: productUrl,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: displayName,
          },
        ],
        type: "website",
      },
      alternates: {
        canonical: productUrl,
      },
    }
  } catch (error) {
    console.error("❌ Metadata generation failed:", error.message)
    return {
      title: "Product Not Found",
      description:
        "Explore premium products from Hebat — trusted across Bahrain and the Middle East for quality and performance.",
      openGraph: {
        title: "Product Not Found | Hebat",
        description: "Discover high-quality accessories, electronics, tools, and more at Hebat.",
        images: [{ url: "/hebat_cover.png", width: 1200, height: 630 }],
        type: "website",
        locale: "en_GB",
      },
    }
  }
}

// ✅ Product page rendering (client component)
export default function ProductPage({ params }) {
  return <ProductDetails params={params} />
}
