import Contact from "@/components/Contact"

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with Hebat for inquiries, partnerships, or support.",
  openGraph: {
    title: "Contact Hebat | We're Here to Help",
    description: "Reach out to Hebat for questions, partnerships, or product support.",
    url: `${process.env.NEXT_PUBLIC_URL}/contact`,
    siteName: "Hebat",
    images: [{ url: "/hebat_cover.png", width: 1200, height: 630, alt: "Contact Hebat" }],
    locale: "en_GB",
    type: "website",
  },
  alternates: {
    languages: {
      en: `${process.env.NEXT_PUBLIC_URL}/contact`,
      ar: `${process.env.NEXT_PUBLIC_URL}/ar/contact`,
    },
  },
}

export default function ContactPage() {
  return <Contact />
}
