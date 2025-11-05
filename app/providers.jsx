"use client"

import "@/app/globals.css"
import { useEffect } from "react"
import { AuthProvider } from "@/context/AuthContext"
import { Toaster } from "react-hot-toast"
import Footer from "@/components/Footer"
import Nav from "@/components/Nav"

export default function Providers({ children }) {
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
    <AuthProvider>
      <header>
        <Nav />
      </header>

      <main
        style={{ paddingTop: "var(--nav-height)" }}
        className="flex-grow transition-all duration-300"
      >
        {children}
      </main>

      <Footer />
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
    </AuthProvider>
  )
}
