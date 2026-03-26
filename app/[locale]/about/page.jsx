import About from "@/components/About"

export const metadata = {
  title: "About Hebat",
  description:
    "Learn more about Hebat — a trusted source for premium products and accessories in the Middle East.",
  openGraph: {
    title: "About Hebat | Premium Quality Products",
    description:
      "Discover Hebat's story — our mission, our values, and our promise to deliver premium products.",
    url: `${process.env.NEXT_PUBLIC_URL}/about`,
    siteName: "Hebat",
    images: [{ url: "/hebat_cover.png", width: 1200, height: 630, alt: "About Hebat" }],
    locale: "en_GB",
    type: "website",
  },
  alternates: {
    languages: {
      en: `${process.env.NEXT_PUBLIC_URL}/about`,
      ar: `${process.env.NEXT_PUBLIC_URL}/ar/about`,
    },
  },
}

export default function AboutPage() {
  return <About />
}
