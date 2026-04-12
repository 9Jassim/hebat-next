"use client"

import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext({ dark: false, toggle: () => {} })

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    if (stored === "dark" || (!stored && prefersDark)) {
      setDark(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggle = () => {
    setDark(prev => {
      const next = !prev
      if (next) {
        document.documentElement.classList.add("dark")
        localStorage.setItem("theme", "dark")
      } else {
        document.documentElement.classList.remove("dark")
        localStorage.setItem("theme", "light")
      }
      return next
    })
  }

  return <ThemeContext.Provider value={{ dark, toggle }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
