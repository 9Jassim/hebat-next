import "./globals.css"
import Script from "next/script"
import { Poppins, Cairo } from "next/font/google"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
})

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cairo",
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
    <html
      lang="en"
      dir="ltr"
      className={`${poppins.variable} ${cairo.variable}`}
    >
      <body>
        <Script id="structured-data" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Hebat",
            alternateName: ["Hebat Official", "هيبات", "هبات", "hbat"],
            url: SITE_URL,
          })}
        </Script>

        {children}

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
