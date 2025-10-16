import "@/app/globals.css"
import { AuthProvider } from "@/context/AuthContext"
import Footer from "@/components/Footer"
import dynamic from "next/dynamic"
import Nav from "@/components/Nav"
import CategoryBar from "@/components/CategoryBar"

// const Nav = dynamic(() => import("@/components/Nav"), { ssr: false })

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
