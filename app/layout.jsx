import Script from "next/script"
import Providers from "./providers"
import "./globals.css"

export const metadata = {
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
  metadataBase:
    process.env.NODE_ENV === "production"
      ? new URL(process.env.NEXT_PUBLIC_URL)
      : new URL("http://localhost:4000"),
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Hebat",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* ✅ Google Search Console Verification */}
        <meta
          name="google-site-verification"
          content="9u5ismbnFFNwT5yBsgLnl8M6OyjhfgFxhPXFN2cYneg"
        />

        {/* ✅ Site name for Google and Social */}
        <meta property="og:site_name" content="Hebat" />

        {/* ✅ Structured Data for Google (WebSite schema) */}
        <Script id="structured-data" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Hebat",
            alternateName: "Hebat Official",
            url: `${process.env.NEXT_PUBLIC_URL}`,
            potentialAction: {
              "@type": "SearchAction",
              target: `${process.env.NEXT_PUBLIC_URL}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          })}
        </Script>

        {/* ✅ Organization schema for stronger brand identity */}
        <Script id="organization-schema" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Hebat",
            url: `${process.env.NEXT_PUBLIC_URL}`,
            logo: `${process.env.NEXT_PUBLIC_URL}/favicon.ico`,
          })}
        </Script>
      </head>

      <body>
        <Providers>{children}</Providers>

        {/* ✅ Google Analytics (afterInteractive = safe) */}
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
