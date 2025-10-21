import Products from "@/components/Products"

export async function generateMetadata({ params }) {
  const rawCategory = params.category || ""
  const categoryName = rawCategory
    .replace(/-/g, " ")
    .replace(/\band\b/g, "&")
    .replace(/\b\w/g, c => c.toUpperCase())

  const pageTitle = `${categoryName}`
  const description = `Explore premium ${categoryName} at Hebat — trusted quality, innovation, and top performance in the Middle East.`

  return {
    title: pageTitle, // uses layout’s "%s | Hebat"
    description,
    keywords: [
      "Hebat",
      "premium products",
      categoryName,
      `${categoryName} accessories`,
      `${categoryName} collection`,
      "Hebat Middle East",
    ],
    openGraph: {
      title: `${categoryName} | Hebat`,
      description,
      type: "website",
      url: `https://hebat.com/products/${rawCategory}`,
      siteName: "Hebat",
    },
  }
}

export default function CategoryPage() {
  return <Products />
}
