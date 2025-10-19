"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogInUser } from "@/lib/auth"
import { useRef, useState } from "react"
import { useAuth } from "@/context/AuthContext"

export default function Admin() {
  const router = useRouter()
  const { setUser } = useAuth()
  const [loading, setLoading] = useState(false)

  const emailRef = useRef(null)
  const passwordRef = useRef(null)

  const handleSubmit = async e => {
    e.preventDefault()
    const email = emailRef.current?.value
    const password = passwordRef.current?.value

    setLoading(true)
    try {
      const payload = await LogInUser({ email, password })

      if (payload) {
        setUser(payload)
        router.push("/products")
      } else {
        if (passwordRef.current) passwordRef.current.value = ""
        alert("Invalid email or password")
      }
    } catch (error) {
      console.error("Login failed:", error)
      alert("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="flex flex-col items-center px-4 py-16 min-h-[70vh]">
      <div className="w-full max-w-md bg-yellow-500 rounded-2xl shadow-2xl p-8 space-y-6 border border-yellow-400">
        {/* Title */}
        <div className="flex flex-col items-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-900">
              Email
            </label>
            <input
              ref={emailRef}
              type="email"
              id="email"
              placeholder="admin@hebat.com"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-900">
              Password
            </label>
            <input
              ref={passwordRef}
              type="password"
              id="password"
              placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-gray-800 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-200"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link href="/" className="text-sm font-medium text-gray-900 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </section>
  )
}
