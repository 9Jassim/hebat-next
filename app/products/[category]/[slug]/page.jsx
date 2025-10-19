// ✅ Keep this as a server component
import ProductDetails from "@/components/ProductDetails"
import Client from "@/lib/api"

// ✅ Generate SEO metadata dynamically per product
export async function generateMetadata({ params }) {
  const { category, slug } = params
  try {
    const res = await Client.get(`/products/${slug}`)
    const product = res.data.product

    const productUrl = `https://hebat.com/products/${encodeURIComponent(
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
      ],
      openGraph: {
        title: product.name,
        description: product.description || "Premium product from Hebat.",
        url: productUrl,
        images: [
          {
            url: product.image?.s3Url || "/default-og.jpg",
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
      title: "Hebat Product",
      description: "Explore premium products from Hebat.",
    }
  }
}

// ✅ Product details render
export default function ProductPage({ params }) {
  return <ProductDetails params={params} />
}
