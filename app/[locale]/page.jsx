import Home from "@/components/Home"

export async function generateMetadata({ params }) {
  const isAr = params.locale === "ar"
  const canonical = isAr ? `${process.env.NEXT_PUBLIC_URL}/ar` : `${process.env.NEXT_PUBLIC_URL}`

  return {
    title: { absolute: isAr ? "هيبات | منتجات متميزة" : "Hebat | Premium Products" },
    description: isAr
      ? "اكتشف هيبات — مصدرك الموثوق للمنتجات المتميزة والإكسسوارات في الشرق الأوسط."
      : "Discover Hebat — your trusted source for premium products and accessories in the Middle East.",
    openGraph: {
      title: isAr ? "هيبات | منتجات متميزة" : "Hebat | Premium Products",
      description: isAr
        ? "اكتشف هيبات — مصدرك الموثوق للمنتجات المتميزة والإكسسوارات في الشرق الأوسط."
        : "Discover Hebat — your trusted source for premium products and accessories in the Middle East.",
      url: canonical,
      siteName: "Hebat",
      images: [{ url: "/hebat_cover.png", width: 1200, height: 630, alt: "Hebat" }],
      locale: isAr ? "ar_BH" : "en_GB",
      type: "website",
    },
    alternates: {
      canonical,
      languages: {
        en: `${process.env.NEXT_PUBLIC_URL}`,
        ar: `${process.env.NEXT_PUBLIC_URL}/ar`,
      },
    },
  }
}

export default function Page() {
  return <Home />
}
