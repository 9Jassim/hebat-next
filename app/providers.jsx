"use client"

import "@/app/globals.css"
import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { AuthProvider } from "@/context/AuthContext"
import { ThemeProvider } from "@/context/ThemeContext"
import { Toaster } from "react-hot-toast"
import Footer from "@/components/Footer"
import Nav from "@/components/Nav"

export default function Providers({ children }) {
  const pathname = usePathname()

  // ✅ Disable browser scroll restoration (prevents fighting your scrollTo)
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual"
    }
  }, [])

  // ✅ Scroll to top on every navigation (pathname changes)
  useEffect(() => {
    // If you use hash links, keep this guard (optional)
    if (typeof window !== "undefined" && window.location.hash) return

    // Run after layout settles (sticky header / paddingTop changes)
    requestAnimationFrame(() => {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0

      // In case scrolling is happening inside a container:
      const main = document.querySelector("main")
      if (main) main.scrollTop = 0
    })
  }, [pathname])

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
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-[#fffdf5] dark:bg-[#111111] text-gray-900 dark:text-gray-100 transition-colors duration-300">
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
        </div>

        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      </AuthProvider>
    </ThemeProvider>
  )
}
