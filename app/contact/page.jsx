import Contact from "@/components/Contact"

export const metadata = {
  title: "Contact Us | Hebat",
  description:
    "Get in touch with Hebat for inquiries, partnerships, or support. We're here to help with all your premium product needs across the Middle East.",
  keywords: [
    "Hebat contact",
    "contact Hebat",
    "customer support",
    "Hebat Middle East",
    "premium products",
    "Morslon",
    "ArabVape",
  ],
  openGraph: {
    title: "Contact Hebat | We're Here to Help",
    description:
      "Reach out to Hebat for questions, partnerships, or product support. Our team is ready to assist you.",
    url: "https://hebat.com/contact",
    siteName: "Hebat",
    images: [
      {
        url: "/hebat_cover.png",
        width: 1200,
        height: 630,
        alt: "Contact Hebat",
      },
    ],
    locale: "en_US",
    type: "website",
  },
}

export default function ContactPage() {
  return <Contact />
}
