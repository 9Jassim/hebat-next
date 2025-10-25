import Products from "@/components/Products"

export const metadata = {
  title: "Our Products",
  description:
    "Explore a wide range of premium Hebat products, carefully selected for quality and customer satisfaction.",
  keywords: ["arabvape", "hebat", "morslon", "products"],
  openGraph: {
    title: "Hebat Products",
    description: "Shop high-quality vape products and accessories from Hebat.",
    url: "https://hebat.com/products",
    siteName: "Hebat",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Hebat Products",
      },
    ],
    locale: "en_US",
    type: "website",
  },
}

export default function ProductsPage() {
  return <Products />
}
