import "@/app/globals.css"
import { AuthProvider } from "@/context/AuthContext"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"

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
          <header className="sticky top-0 z-50 bg-black shadow-md">
            <Nav />
          </header>

          <main className="flex-grow">{children}</main>

          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
