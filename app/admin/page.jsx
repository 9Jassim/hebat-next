"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogInUser } from "@/lib/auth"
import { useRef } from "react"
import { useAuth } from "@/context/AuthContext"

export default function Admin() {
  const router = useRouter()
  const { setUser } = useAuth()

  // Properly define refs for form fields
  const emailRef = useRef(null)
  const passwordRef = useRef(null)

  const handleSubmit = async e => {
    e.preventDefault()

    const email = emailRef.current?.value
    const password = passwordRef.current?.value

    // Call your login function
    const payload = await LogInUser({ email, password })

    if (payload) {
      setUser(payload)
      router.push("/products")
    } else {
      if (passwordRef.current) passwordRef.current.value = ""
      alert("Invalid email or password")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-yellow-500 rounded-lg shadow p-6 space-y-4">
        <h1 className="text-xl font-bold text-gray-900 text-center">Sign in</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
              Your email
            </label>
            <input
              ref={emailRef}
              type="email"
              name="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5"
              placeholder="name@company.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
              Password
            </label>
            <input
              ref={passwordRef}
              type="password"
              name="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full text-white bg-black hover:bg-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
}
