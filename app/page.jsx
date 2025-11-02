import Home from "@/components/Home"

export const metadata = {
  title: {
    default: "Hebat | Premium Products",
    template: "%s | Hebat",
  },
  description:
    "Explore a wide range of premium Hebat products, carefully selected for quality and customer satisfaction.",
  keywords: [
    "HEBAT",
    "online shopping",
    "Bahrain store",
    "Middle East e-commerce",
    "accessories",
    "appliances",
    "electronics",
    "sports",
    "outdoor gear",
    "tools",
    "home products",
    "gadgets",
    "online offers",
    "deals",
    "fast delivery",
    "secure payment",
    "shop online",
    "buy online Bahrain",
    "best prices",
    "quality products",
    "هيبات",
    "تسوق أونلاين",
    "البحرين",
    "الشرق الأوسط",
    "أكسسوارات",
    "أجهزة منزلية",
    "إلكترونيات",
    "رياضة",
    "هواء طلق",
    "عروض",
    "توصيل سريع",
    "دفع آمن",
    "منتجات عالية الجودة",
  ],
  openGraph: {
    title: "Hebat Products",
    description: "Shop high-quality vape products and accessories from Hebat.",
    url: "https://hebatofficial.com/",
    siteName: "Hebat",
    images: [
      {
        url: "/hebat_cover.png",
        width: 1200,
        height: 630,
        alt: "Hebat",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
}

export default function ProductsPage() {
  return <Home />
}
