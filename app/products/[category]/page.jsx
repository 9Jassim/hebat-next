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
    title: `${pageTitle}`,
    description,
    keywords: [
      "Hebat",
      "premium products",
      "Bahrain",
      "Middle East",
      categoryName,
      `${categoryName} accessories`,
      `${categoryName} collection`,
      "Hebat Middle East",
      "online shopping",
      "fast delivery",
      "secure payment",
      "هيبات",
      " منتجات هيبات",
      "هيبت",
      "تسوق أونلاين",
      "تسوق عبر الإنترنت",
      "متجر البحرين",
      "متجر إلكتروني",
      "الإلكترونيات",
      "الأجهزة المنزلية",
      "الأدوات",
      "إكسسوارات",
      "منتجات منزلية",
      "معدات رياضية",
      "منتجات عالية الجودة",
      "أفضل الأسعار",
      "عروض تسوق",
      "صفقات حصرية",
      "توصيل سريع",
      "دفع آمن",
      "تسوق البحرين",
      "الشرق الأوسط",
      "منتجات هيبات",
    ],
    openGraph: {
      title: `${categoryName}`,
      description,
      type: "website",
      url: `${process.env.NEXT_PUBLIC_URL}/products/${rawCategory}`,
      siteName: "Hebat",
    },
  }
}

export default function CategoryPage() {
  return <Products />
}
