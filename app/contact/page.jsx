import Contact from "@/components/Contact"

export const metadata = {
  title: "Contact Us",
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
    locale: "en_GB",
    type: "website",
  },
}

export default function ContactPage() {
  return <Contact />
}
