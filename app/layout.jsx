"use client"

import "@/app/globals.css"
import { useEffect } from "react"
import { AuthProvider } from "@/context/AuthContext"
import { Toaster } from "react-hot-toast"
import Footer from "@/components/Footer"
import Nav from "@/components/Nav"

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
  keywords: ["arabvape", "hebat", "morslon", "premium products"],
  metadataBase:
    process.env.NODE_ENV === "production"
      ? new URL("https://hebatofficial.com")
      : new URL("http://localhost:4000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Hebat",
  },
}

export default function RootLayout({ children }) {
  // 🧠 Dynamically calculate navbar height and set it as a CSS variable
  useEffect(() => {
    const updateNavHeight = () => {
      const nav = document.querySelector("nav")
      if (nav) {
        document.documentElement.style.setProperty("--nav-height", `${nav.offsetHeight}px`)
      }
    }

    updateNavHeight()
    window.addEventListener("resize", updateNavHeight)
    return () => window.removeEventListener("resize", updateNavHeight)
  }, [])

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
          </header>

          {/* ✅ Uses dynamic variable to stay below nav automatically */}
          <main
            style={{ paddingTop: "var(--nav-height)" }}
            className="flex-grow transition-all duration-300"
          >
            {children}
          </main>

          <Footer />
        </AuthProvider>

        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      </body>
    </html>
  )
}
