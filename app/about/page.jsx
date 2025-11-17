import About from "@/components/About"
export const metadata = {
  title: "About Hebat",
  description:
    "Learn more about Hebat — a trusted source for premium products and accessories in the Middle East. Discover our mission, values, and commitment to quality and customer satisfaction.",
  keywords: [
    "Hebat",
    "About Hebat",
    "premium products",
    "ArabVape",
    "Morslon",
    "Middle East",
    "quality accessories",
    "trusted brand",
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
    title: "About Hebat | Premium Quality Products",
    description:
      "Discover Hebat’s story — our mission, our values, and our promise to deliver premium products and exceptional customer experiences.",
    url: `${process.env.NEXT_PUBLIC_URL}/about`,
    siteName: "Hebat",
    images: [
      {
        url: "/hebat_cover.png",
        width: 1200,
        height: 630,
        alt: "About Hebat - Premium Products and Accessories",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
}

export default function AboutPage() {
  return <About />
}
