"use client"

import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import EditCategories from "@/components/EditCategories" // assuming you already have this component

export default function Nav() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [showCategories, setShowCategories] = useState(false)

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black shadow-md">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          {/* Left: logo & brand */}
          <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img
              src="https://hebat-products.s3.me-south-1.amazonaws.com/Hebat_Logo_Text_page-0001.jpg"
              className="h-12"
              alt="Hebat Logo"
            />
            <span className="text-yellow-500 self-center text-2xl font-semibold whitespace-nowrap">
              HEBAT
            </span>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-400 rounded-lg md:hidden hover:bg-gray-800 focus:outline-none"
            aria-controls="navbar-default"
            aria-expanded={open ? "true" : "false"}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>

          {/* Links */}
          <div
            className={`${open ? "block" : "hidden"} w-full md:block md:w-auto`}
            id="navbar-default"
          >
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-700 rounded-lg bg-black md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-black">
              <li>
                <Link
                  href="/"
                  className="block py-2 px-3 text-white rounded-sm hover:bg-yellow-500 md:hover:bg-transparent md:border-0 md:hover:text-yellow-500 md:p-0"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/products"
                  className="block py-2 px-3 text-white rounded-sm hover:bg-yellow-500 md:hover:bg-transparent md:border-0 md:hover:text-yellow-500 md:p-0"
                >
                  Products
                </Link>
              </li>

              {user && (
                <>
                  <li>
                    <Link
                      href="/newproduct"
                      className="block py-2 px-3 text-white rounded-sm hover:bg-yellow-500 md:hover:bg-transparent md:border-0 md:hover:text-yellow-500 md:p-0"
                    >
                      New Product
                    </Link>
                  </li>

                  {/* Categories opens popup */}
                  <li>
                    <button
                      onClick={() => setShowCategories(true)}
                      className="block py-2 px-3 text-left text-white rounded-sm hover:bg-yellow-500 md:hover:bg-transparent md:border-0 md:hover:text-yellow-500 md:p-0"
                    >
                      Categories
                    </button>
                  </li>

                  <li>
                    <button
                      onClick={logout}
                      className="block py-2 px-3 text-left text-white rounded-sm hover:bg-yellow-500 md:hover:bg-transparent md:border-0 md:hover:text-yellow-500 md:p-0"
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Categories Popup Modal */}
      {showCategories && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 p-6 relative">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Manage Categories</h2>
            <EditCategories />
            <button
              onClick={() => setShowCategories(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  )
}
