import ProductDetails from "@/components/ProductDetails"
import Client from "@/lib/api"

export async function generateMetadata({ params }) {
  const { locale, category, slug } = params
  const isAr = locale === "ar"

  try {
    const res = await Client.get(`/products/${slug}`)
    const { product, selectedVariant } = res.data

    const displayName = selectedVariant?.name
      ? `${isAr && product.name_ar ? product.name_ar : product.name} – ${selectedVariant.name}`
      : isAr && product.name_ar
        ? product.name_ar
        : product.name

    const description =
      isAr && product.description_ar
        ? product.description_ar
        : product.description ||
          `Discover ${displayName} — premium ${product.category?.name || category} from Hebat.`

    const imageUrl =
      selectedVariant?.images?.[0]?.s3Url || product.images?.[0]?.s3Url || "/hebat_cover.png"

    const enUrl = `${process.env.NEXT_PUBLIC_URL}/products/${encodeURIComponent(category)}/${encodeURIComponent(slug)}`
    const arUrl = `${process.env.NEXT_PUBLIC_URL}/ar/products/${encodeURIComponent(category)}/${encodeURIComponent(slug)}`
    const canonical = isAr ? arUrl : enUrl

    return {
      title: displayName,
      description,
      openGraph: {
        title: displayName,
        description,
        url: canonical,
        images: [{ url: imageUrl, width: 1200, height: 630, alt: displayName }],
        type: "website",
      },
      alternates: {
        canonical,
        languages: { en: enUrl, ar: arUrl },
      },
    }
  } catch {
    return {
      title: "Product Not Found",
      description: "Explore premium products from Hebat.",
    }
  }
}

export default function ProductPage({ params }) {
  return <ProductDetails params={params} />
}
