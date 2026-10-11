import NewArrivalsPage from "@/components/NewArrivalsPage"

export async function generateMetadata({ params }) {
  const isAr = params.locale === "ar"
  const canonical = isAr
    ? `${process.env.NEXT_PUBLIC_URL}/ar/new-arrivals`
    : `${process.env.NEXT_PUBLIC_URL}/new-arrivals`

  return {
    title: isAr ? "أحدث المنتجات" : "New Arrivals",
    description: isAr
      ? "اكتشف أحدث منتجات هيبات — أحدث الإضافات إلى تشكيلتنا من الإلكترونيات والأجهزة المنزلية والإكسسوارات."
      : "Discover the latest Hebat products — the newest additions to our lineup of electronics, home appliances, and accessories.",
    openGraph: {
      title: isAr ? "أحدث المنتجات | هيبات" : "New Arrivals | Hebat",
      description: isAr
        ? "أحدث الإضافات إلى تشكيلة هيبات — كن أول من يكتشفها."
        : "The freshest additions to the Hebat lineup — be the first to explore them.",
      url: canonical,
      siteName: "Hebat",
      images: [{ url: "/hebat_cover.png", width: 1200, height: 630, alt: "Hebat New Arrivals" }],
      locale: isAr ? "ar_BH" : "en_GB",
      alternateLocales: [isAr ? "en_GB" : "ar_BH"],
      type: "website",
    },
    alternates: {
      canonical,
      languages: {
        en: `${process.env.NEXT_PUBLIC_URL}/new-arrivals`,
        ar: `${process.env.NEXT_PUBLIC_URL}/ar/new-arrivals`,
      },
    },
  }
}

export default function NewArrivalsRoute() {
  return <NewArrivalsPage />
}
