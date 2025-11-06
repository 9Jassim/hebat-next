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

import Providers from "./providers" // <-- separate client logic here

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Google tag (gtag.js)  */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-L2PNGGS7JL"></script>
      <script>
        {`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-L2PNGGS7JL');`}
      </script>
      {/* ✅ Google Search Console Verification */}
      <meta name="google-site-verification" content="9u5ismbnFFNwT5yBsgLnl8M6OyjhfgFxhPXFN2cYneg" />
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
