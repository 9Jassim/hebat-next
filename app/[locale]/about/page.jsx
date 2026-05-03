import About from "@/components/About"

export async function generateMetadata({ params }) {
  const isAr = params.locale === "ar"
  const canonical = isAr
    ? `${process.env.NEXT_PUBLIC_URL}/ar/about`
    : `${process.env.NEXT_PUBLIC_URL}/about`

  return {
    title: isAr ? "من نحن" : "About Us",
    description: isAr
      ? "تعرف على المزيد حول هيبات — مصدرك الموثوق للمنتجات المتميزة والإكسسوارات في الشرق الأوسط."
      : "Learn more about Hebat — a trusted source for premium products and accessories in the Middle East.",
    openGraph: {
      title: isAr ? "من نحن | هيبات" : "About Hebat | Premium Quality Products",
      description: isAr
        ? "اكتشف قصة هيبات — مهمتنا وقيمنا وتعهدنا بتقديم منتجات متميزة."
        : "Discover Hebat's story — our mission, our values, and our promise to deliver premium products.",
      url: canonical,
      siteName: "Hebat",
      images: [{ url: "/hebat_cover.png", width: 1200, height: 630, alt: "About Hebat" }],
      locale: isAr ? "ar_BH" : "en_GB",
      type: "website",
    },
    alternates: {
      canonical,
      languages: {
        en: `${process.env.NEXT_PUBLIC_URL}/about`,
        ar: `${process.env.NEXT_PUBLIC_URL}/ar/about`,
      },
    },
  }
}

export default function AboutPage() {
  return <About />
}
