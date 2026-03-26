import Products from "@/components/Products"

export async function generateMetadata({ params }) {
  const rawCategory = params.category || ""
  const categoryName = rawCategory
    .replace(/-/g, " ")
    .replace(/\band\b/g, "&")
    .replace(/\b\w/g, c => c.toUpperCase())

  const description = `Explore premium ${categoryName} at Hebat — trusted quality, innovation, and top performance in the Middle East.`
  const isAr = params.locale === "ar"
  const canonical = isAr
    ? `${process.env.NEXT_PUBLIC_URL}/ar/products/${rawCategory}`
    : `${process.env.NEXT_PUBLIC_URL}/products/${rawCategory}`

  return {
    title: categoryName,
    description,
    openGraph: {
      title: categoryName,
      description,
      type: "website",
      url: canonical,
      siteName: "Hebat",
    },
    alternates: {
      canonical,
      languages: {
        en: `${process.env.NEXT_PUBLIC_URL}/products/${rawCategory}`,
        ar: `${process.env.NEXT_PUBLIC_URL}/ar/products/${rawCategory}`,
      },
    },
  }
}

export default function CategoryPage() {
  return <Products />
}
