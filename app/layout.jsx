import "./globals.css"
import Providers from "./providers"
import Script from "next/script"
import { Poppins } from "next/font/google"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

const SITE_URL = process.env.NEXT_PUBLIC_URL?.startsWith("http")
  ? process.env.NEXT_PUBLIC_URL
  : "https://hebatofficial.com"

export const metadata = {
  metadataBase: new URL(SITE_URL),

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

  verification: {
    google: "9u5ismbnFFNwT5yBsgLnl8M6OyjhfgFxhPXFN2cYneg",
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },

  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Hebat",
    url: SITE_URL,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.className}>
      <body>
        {/* JSON-LD (safe here) */}
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

        <Script id="organization-schema" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Hebat",
            url: SITE_URL,
            logo: `${SITE_URL}/favicon.ico`,
          })}
        </Script>
        {children}
        {/* <Providers>

        </Providers> */}

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
