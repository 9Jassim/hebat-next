"use client"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { CheckSession, LogOutUser } from "@/lib/auth"

const AuthContext = createContext({ user: null, setUser: () => {}, logout: async () => {} })

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchSession = async () => {
      const session = await CheckSession()
      setUser(session?.user || null)
    }
    fetchSession()
  }, [])

  const logout = useCallback(async () => {
    await LogOutUser()
    setUser(null)
    if (typeof window !== "undefined") window.location.reload()
  }, [])

  return <AuthContext.Provider value={{ user, setUser, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
