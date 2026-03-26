import Products from "@/components/Products"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Products",
  description:
    "Explore a wide range of high-quality Hebat products — from electronics and home appliances to accessories, tools, and sports gear.",
  keywords: [
    "hebat", "hebat products", "accessories", "electronics", "home appliances",
    "bahrain online store", "middle east shopping", "هيبات", "منتجات هيبات",
  ],
  openGraph: {
    title: "Products",
    description: "Discover Hebat's complete product range. Shop online in Bahrain and the Middle East.",
    url: `${process.env.NEXT_PUBLIC_URL}/products`,
    siteName: "Hebat",
    images: [{ url: "/hebat_cover.png", width: 1200, height: 630, alt: "Hebat Products" }],
    locale: "en_GB",
    alternateLocales: ["ar_BH"],
    type: "website",
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_URL}/products`,
    languages: {
      "en": `${process.env.NEXT_PUBLIC_URL}/products`,
      "ar": `${process.env.NEXT_PUBLIC_URL}/ar/products`,
    },
  },
}

export default function ProductsPage() {
  return <Products />
}
