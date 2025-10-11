"use client"
import { createContext, useContext, useState, useEffect } from "react"
import { CheckSession, LogOutUser } from "@/lib/auth"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // 🔁 Automatically check session on load
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await CheckSession()
        console.log("context :", session)
        if (session?.user) {
          setUser(session.user)
        } else {
          setUser(null)
        }
      } catch (err) {
        console.error("Session check failed:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchSession()
  }, [])

  // 🚪 Logout handler
  const logout = async () => {
    try {
      await LogOutUser() // backend clears cookie
      setUser(null)
    } catch (err) {
      console.error("Logout failed:", err)
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
