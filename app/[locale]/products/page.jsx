import Products from "@/components/Products"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }) {
  const isAr = params.locale === "ar"
  const canonical = isAr
    ? `${process.env.NEXT_PUBLIC_URL}/ar/products`
    : `${process.env.NEXT_PUBLIC_URL}/products`

  return {
    title: isAr ? "المنتجات" : "Products",
    description: isAr
      ? "اكتشف مجموعة واسعة من منتجات هيبات المتميزة — من الإلكترونيات والأجهزة المنزلية إلى الإكسسوارات والأدوات ومستلزمات الرياضة."
      : "Explore a wide range of high-quality Hebat products — from electronics and home appliances to accessories, tools, and sports gear.",
    keywords: [
      "hebat",
      "hebat products",
      "accessories",
      "electronics",
      "home appliances",
      "bahrain online store",
      "middle east shopping",
      "هيبات",
      "منتجات هيبات",
    ],
    openGraph: {
      title: isAr ? "المنتجات | هيبات" : "Products | Hebat",
      description: isAr
        ? "اكتشف مجموعة منتجات هيبات الكاملة. تسوق عبر الإنترنت في البحرين والشرق الأوسط."
        : "Discover Hebat's complete product range. Shop online in Bahrain and the Middle East.",
      url: canonical,
      siteName: "Hebat",
      images: [{ url: "/hebat_cover.png", width: 1200, height: 630, alt: "Hebat Products" }],
      locale: isAr ? "ar_BH" : "en_GB",
      alternateLocales: [isAr ? "en_GB" : "ar_BH"],
      type: "website",
    },
    alternates: {
      canonical,
      languages: {
        en: `${process.env.NEXT_PUBLIC_URL}/products`,
        ar: `${process.env.NEXT_PUBLIC_URL}/ar/products`,
      },
    },
  }
}

export default function ProductsPage() {
  return <Products />
}
