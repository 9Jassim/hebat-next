import Contact from "@/components/Contact"

export async function generateMetadata({ params }) {
  const isAr = params.locale === "ar"
  const canonical = isAr
    ? `${process.env.NEXT_PUBLIC_URL}/ar/contact`
    : `${process.env.NEXT_PUBLIC_URL}/contact`

  return {
    title: isAr ? "تواصل معنا" : "Contact Us",
    description: isAr
      ? "تواصل مع هيبات للاستفسارات أو الشراكات أو الدعم."
      : "Get in touch with Hebat for inquiries, partnerships, or support.",
    openGraph: {
      title: isAr ? "تواصل مع هيبات | نحن هنا للمساعدة" : "Contact Hebat | We're Here to Help",
      description: isAr
        ? "تواصل مع هيبات لأسئلتك أو شراكاتك أو دعم المنتجات."
        : "Reach out to Hebat for questions, partnerships, or product support.",
      url: canonical,
      siteName: "Hebat",
      images: [{ url: "/hebat_cover.png", width: 1200, height: 630, alt: "Contact Hebat" }],
      locale: isAr ? "ar_BH" : "en_GB",
      type: "website",
    },
    alternates: {
      canonical,
      languages: {
        en: `${process.env.NEXT_PUBLIC_URL}/contact`,
        ar: `${process.env.NEXT_PUBLIC_URL}/ar/contact`,
      },
    },
  }
}

export default function ContactPage() {
  return <Contact />
}
