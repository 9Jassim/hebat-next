// ✅ Remove "use client" here
import ProductDetails from "@/components/ProductDetails" // this is your "use client" file
import Client from "@/lib/api"

export async function generateMetadata({ params }) {
  const { slug } = params
  try {
    const res = await Client.get(`/products/${slug}`)
    const product = res.data.product

    return {
      title: `${product.name}`,
      description: product.description || "Premium product from Hebat.",
      openGraph: {
        title: product.name,
        description: product.description,
        url: `https://hebat.com/products/${slug}`,
        images: [
          {
            url: product.image?.s3Url || "/default-og.jpg",
            width: 1200,
            height: 630,
            alt: product.name,
          },
        ],
      },
    }
  } catch {
    return {
      title: "Hebat Product",
      description: "Explore premium products from Hebat.",
    }
  }
}

export default function ProductPage({ params }) {
  return <ProductDetails params={params} />
}
