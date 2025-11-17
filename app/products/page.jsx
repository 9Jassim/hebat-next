import Products from "@/components/Products"

export const metadata = {
  title: "Products",
  description:
    "Explore a wide range of high-quality Hebat products — from electronics and home appliances to accessories, tools, and sports gear. Shop online across Bahrain and the Middle East with secure payment and fast delivery.",
  keywords: [
    "hebat",
    "Hebet",
    "hbat",
    "arabvape",
    "morslon",
    "hebat products",
    "accessories",
    "electronics",
    "home appliances",
    "sports gear",
    "outdoor equipment",
    "tools",
    "gadgets",
    "bahrain online store",
    "middle east shopping",
    "hebat online store",
    "buy online bahrain",
    "premium products",
    "secure payment",
    "fast delivery",
    "exclusive deals",
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
    title: "Products",
    description:
      "Discover Hebat’s complete product range — electronics, accessories, appliances, tools, and outdoor gear. Shop online in Bahrain and the Middle East with secure checkout and fast delivery.",
    url: `${process.env.NEXT_PUBLIC_URL}/products`,
    siteName: "Hebat",
    images: [
      {
        url: "/hebat_cover.png",
        width: 1200,
        height: 630,
        alt: "Hebat Products",
      },
    ],
    locale: "en_GB",
    alternateLocales: ["ar_BH"],
    type: "website",
  },
}

export default function ProductsPage() {
  return <Products />
}
