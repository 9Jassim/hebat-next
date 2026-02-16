import Script from "next/script"
import Providers from "./providers"
import "./globals.css"

const SITE_URL = process.env.NEXT_PUBLIC_URL?.startsWith("http")
  ? process.env.NEXT_PUBLIC_URL
  : "https://hebatofficial.com"

export const metadata = {
  robots: {
    index: true,
    follow: true,
  },
  title: {
    default: "Hebat | Premium Products",
    template: "%s | Hebat",
  },
  description:
    "Discover Hebat — your trusted source for premium products and accessories in the Middle East.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  keywords: [
    "HEBAT",
    "Hebet",
    "online shopping",
    "Bahrain store",
    "Middle East e-commerce",
    "accessories",
    "appliances",
    "electronics",
    "sports",
    "outdoor gear",
    "tools",
    "home products",
    "gadgets",
    "online offers",
    "deals",
    "fast delivery",
    "secure payment",
    "shop online",
    "buy online Bahrain",
    "best prices",
    "quality products",
    "هيبات",
    "تسوق أونلاين",
    "البحرين",
    "الشرق الأوسط",
    "أكسسوارات",
    "أجهزة منزلية",
    "إلكترونيات",
    "رياضة",
    "هواء طلق",
    "عروض",
    "توصيل سريع",
    "دفع آمن",
    "منتجات عالية الجودة",
  ],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Hebat",
    url: SITE_URL,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Google Search Console Verification */}
        <meta
          name="google-site-verification"
          content="9u5ismbnFFNwT5yBsgLnl8M6OyjhfgFxhPXFN2cYneg"
        />

        <meta property="og:site_name" content="Hebat" />

        {/* WebSite Schema */}
        <Script id="structured-data" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Hebat",
            alternateName: "Hebat Official",
            url: SITE_URL,
            potentialAction: {
              "@type": "SearchAction",
              target: `${SITE_URL}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          })}
        </Script>

        {/* Organization Schema */}
        <Script id="organization-schema" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Hebat",
            url: SITE_URL,
            logo: `${SITE_URL}/favicon.ico`,
          })}
        </Script>
      </head>

      <body>
        <Providers>{children}</Providers>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-L2PNGGS7JL"
          strategy="afterInteractive"
        />
        <Script id="ga-setup" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-L2PNGGS7JL', { page_path: window.location.pathname });
          `}
        </Script>
      </body>
    </html>
  )
}
