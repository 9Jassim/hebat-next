import "@/app/globals.css"
import { AuthProvider } from "@/context/AuthContext"
import Footer from "@/components/Footer"
import Nav from "@/components/Nav"
import CategoryBar from "@/components/CategoryBar"

export const metadata = {
  title: {
    default: "Hebat | Premium Products",
    template: "%s | Hebat",
  },
  description:
    "Discover Hebat — your trusted source for premium products and accessories in the Middle East.",
  icons: {
    icon: "/favicon.ico", // default favicon
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  keywords: ["arabvape", "hebat", "morslon", "premium products"],
  metadataBase: new URL("https://hebat.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Hebat",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          integrity="sha512-T2N4eKbsBfHfXzMsn1Td7lzIMIKuMMbLdbQ6QThXlHl38Zfs2HQI5yokUqM2YQfl4MJk2ZBGfHZMG6cxWz0qYw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        <AuthProvider>
          <header>
            <Nav />
            <CategoryBar />
          </header>

          <main className="pt-[135px] flex-grow">{children}</main>

          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
