"use client"

import Link from "next/link"
import { useState, Fragment } from "react"
import { useAuth } from "@/context/AuthContext"

export default function Nav() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-black border-gray-200">
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
          {/* simple hamburger */}
          <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
          </svg>
        </button>

        {/* Links */}
        <div className={`${open ? "block" : "hidden"} w-full md:block md:w-auto`} id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-700 rounded-lg bg-black md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-black">
            <li>
              <Link
                href="/"
                className="block py-2 px-3 text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-yellow-500 md:p-0"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                href="/products"
                className="block py-2 px-3 text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-yellow-500 md:p-0"
              >
                Products
              </Link>
            </li>

            {user && (
              <>
                <li>
                  <Link
                    href="/newproduct"
                    className="block py-2 px-3 text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-yellow-500 md:p-0"
                  >
                    New Product
                  </Link>
                </li>

                <li>
                  <Link
                    href="/categories"
                    className="block py-2 px-3 text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-yellow-500 md:p-0"
                  >
                    Categories
                  </Link>
                </li>

                <li>
                  <button
                    onClick={logout}
                    className="block py-2 px-3 text-left text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-yellow-500 md:p-0"
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
  )
}
