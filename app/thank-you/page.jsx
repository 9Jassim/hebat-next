"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ThankYou() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => router.push("/"), 5000)
    return () => clearTimeout(timer)
  }, [router])
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900 px-6">
      {/* Card */}
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center border-t-4 border-yellow-500">
        <div className="flex justify-center mb-4">
          <svg
            className="w-16 h-16 text-yellow-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h1>
        <p className="text-gray-700 mb-6">
          Your message has been successfully sent. Our team will reach out to you as soon as
          possible.
        </p>

        <a
          href="/"
          className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all"
        >
          Back to Home
        </a>
      </div>

      {/* Subtle Footer */}
      <p className="text-sm text-gray-500 mt-6">
        © {new Date().getFullYear()} Hebat. All rights reserved.
      </p>
    </div>
  )
}
