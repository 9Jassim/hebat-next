// ✅ Keep this as a server component
import ProductDetails from "@/components/ProductDetails"
import Client from "@/lib/api"

// ✅ Generate SEO metadata dynamically per product
export async function generateMetadata({ params }) {
  const { category, slug } = params
  try {
    const res = await Client.get(`/products/${slug}`)
    const product = res.data.product

    const productUrl = `${process.env.NEXT_PUBLIC_URL}/products/${encodeURIComponent(
      category
    )}/${encodeURIComponent(slug)}`

    return {
      title: `${product.name}`,
      description:
        product.description ||
        `Discover ${product.name} — premium ${product.category?.name || category} from Hebat.`,
      keywords: [
        product.name,
        product.model,
        product.barcode,
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
        title: product.name,
        description: product.description || "Premium product from Hebat.",
        url: productUrl,
        images: [
          {
            url: product.image?.s3Url || "/hebat_cover.png",
            width: 1200,
            height: 630,
            alt: product.name,
          },
        ],
        type: "website",
      },
      alternates: {
        canonical: productUrl,
      },
    }
  } catch {
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

// ✅ Product details render
export default function ProductPage({ params }) {
  return <ProductDetails params={params} />
}
