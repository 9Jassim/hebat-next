"use client"
import toast from "react-hot-toast"
import { useState } from "react"
import Link from "next/link"
import Client from "@/lib/api"

export default function Footer() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState("")

  // Handle newsletter subscription (FormSubmit or your backend)
  const handleSubscribe = async e => {
    e.preventDefault()
    setStatus("loading")

    try {
      const res = await Client.post("/newsletter", { email }, { withCredentials: true })

      if (res.status === 200 || res.status === 201) {
        toast.success("✅ You’ve successfully subscribed to our newsletter!")
        setEmail("")
        setStatus("success")
      } else {
        toast.error("Something went wrong. Please try again.")
        setStatus("error")
      }
    } catch (err) {
      console.error("❌ Newsletter subscribe error:", err.response?.data || err.message)
      toast.error(err.response?.data?.message || "Subscription failed. Try again later.")
      setStatus("error")
    } finally {
      setTimeout(() => setStatus(""), 4000)
    }
  }

  return (
    <footer className="bg-black border-t border-gray-800 text-white mt-10">
      <div className="w-full max-w-screen-xl mx-auto p-6 md:py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* LEFT — Contact Info + Socials */}
        <div className="flex flex-col items-center sm:items-start space-y-3">
          <p className="text-sm text-center sm:text-left">
            <span className="font-semibold uppercase">WhatsApp:</span> +973 33176767, +973 33115656
            <br />
            <span className="font-semibold uppercase">Email:</span> support@morslon.com
          </p>

          {/* Social Icons */}
          <div className="flex space-x-4 mt-2">
            <a
              href="https://www.instagram.com/morslon.bh"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-500 transition"
              aria-label="Instagram"
            >
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.6 2.2a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
                  clipRule="evenodd"
                />
              </svg>
            </a>

            <a
              href="https://www.youtube.com/@morslon_bh"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-500 transition"
              aria-label="YouTube"
            >
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M21.7 8.037a4.26 4.26 0 0 0-.789-1.964 2.84 2.84 0 0 0-1.984-.839c-2.767-.2-6.926-.2-6.926-.2s-4.157 0-6.928.2a2.836 2.836 0 0 0-1.983.839 4.225 4.225 0 0 0-.79 1.965A30.146 30.146 0 0 0 2.1 11.243v1.5a30.12 30.12 0 0 0 .2 3.206c.094.712.364 1.39.784 1.972.604.536 1.38.837 2.187.848 1.583.151 6.731.2 6.731.2s4.161 0 6.928-.2a2.844 2.844 0 0 0 1.985-.84 4.27 4.27 0 0 0 .787-1.965 30.12 30.12 0 0 0 .2-3.206v-1.516a30.672 30.672 0 0 0-.202-3.206ZM10.008 14.591v-5.62l5.4 2.819-5.4 2.801Z"
                  clipRule="evenodd"
                />
              </svg>
            </a>

            <a
              href="https://www.tiktok.com/@morslon.bh"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-500 transition"
              aria-label="TikTok"
            >
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12.438 2.017C13.53 2 14.613 2.008 15.696 2c.067 1.275.525 2.575 1.459 3.475c.933.925 2.25 1.35 3.533 1.492v3.358c-1.2-.042-2.408-.292-3.5-.808c-.475-.217-.917-.492-1.35-.775c-.008 2.433.008 4.866-.017 7.291a6.36 6.36 0 0 1-1.125 3.283c-1.091 1.6-2.983 2.642-4.924 2.675c-1.192.067-2.384-.258-3.4-.858c-1.684-.992-2.867-2.808-3.042-4.758a16 16 0 0 1-.008-1.242c.15-1.583.933-3.1 2.15-4.133c1.383-1.2 3.316-1.775 5.125-1.433c.016 1.233-.034 2.466-.034 3.7c-.825-.267-1.791-.192-2.516.308a2.9 2.9 0 0 0-1.134 1.458c-.175.425-.125.892-.116 1.342c.2 1.366 1.516 2.516 2.916 2.392c.934-.009 1.825-.55 2.309-1.342c.158-.275.333-.559.341-.884c.084-1.491.05-2.975.059-4.466c.008-3.358-.009-6.708.016-10.058" />
              </svg>
            </a>

            <a
              href="https://www.snapchat.com/add/morslon.bh"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-500 transition relative top-[3px]"
              aria-label="Snapchat"
            >
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M21.406 14.745c-.166-.45-.484-.689-.844-.882-.043-.024-.084-.044-.124-.063-.085-.043-.168-.085-.252-.13-.9-.478-1.604-1.083-2.095-1.797a4.259 4.259 0 0 1-.36-.635.43.43 0 0 1-.01-.248.45.45 0 0 1 .118-.138c.15-.1.303-.202.407-.27.187-.12.333-.215.429-.283.357-.25.607-.516.762-.813.25-.5.273-1.082.066-1.636-.242-.635-.842-1.03-1.567-1.03a2.112 2.112 0 0 0-.574.078 13.627 13.627 0 0 0-.041-1.336C16.875 3.2 16.29 2.36 15.65 1.63a5.029 5.029 0 0 0-1.29-1.038C13.197.21 12.13 0 10.999 0c-1.13 0-2.195.21-3.36.592a5.04 5.04 0 0 0-1.29 1.038C5.707 2.36 5.123 3.2 5.002 4.524a13.616 13.616 0 0 0-.04 1.336 2.12 2.12 0 0 0-.574-.078c-.725 0-1.325.395-1.567 1.03-.207.554-.185 1.137.066 1.637.155.297.405.562.762.812.096.068.242.163.43.283.104.068.257.17.406.27a.45.45 0 0 1 .118.139.43.43 0 0 1-.01.247 4.244 4.244 0 0 1-.36.636c-.491.714-1.195 1.319-2.095 1.796-.083.045-.167.087-.252.13a2.015 2.015 0 0 0-.124.063c-.36.193-.678.432-.844.883-.152.411-.052.877.247 1.272.14.184.306.338.487.452.333.209.693.357 1.072.458.142.037.284.07.427.1a.728.728 0 0 1 .263.118c.15.133.129.33.326.62.093.132.212.246.35.336.391.273.832.29 1.3.309.422.016.903.034 1.45.216.228.076.468.224.744.395.663.41 1.578.973 3.104.973 1.527 0 2.444-.563 3.105-.974.275-.17.516-.318.743-.394.547-.182 1.027-.2 1.45-.216.468-.019.909-.036 1.3-.309a1.1 1.1 0 0 0 .35-.336c.197-.29.176-.487.326-.62a.73.73 0 0 1 .263-.118c.143-.03.285-.063.427-.1a3.513 3.513 0 0 0 1.072-.458 1.605 1.605 0 0 0 .486-.452c.3-.395.4-.86.248-1.272Z" />
              </svg>
            </a>
          </div>
        </div>

        {/* MIDDLE — About / Contact */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <Link href="/about" className="hover:text-yellow-500 text-sm font-medium">
            About Us
          </Link>
          <Link href="/contact" className="hover:text-yellow-500 text-sm font-medium">
            Contact Us
          </Link>
        </div>

        {/* RIGHT — Newsletter */}
        <div className="flex flex-col items-center sm:items-end space-y-3">
          <h3 className="text-sm font-semibold uppercase text-yellow-500">
            Subscribe to our Newsletter
          </h3>
          <form onSubmit={handleSubscribe} className="flex w-full max-w-xs space-x-2">
            <input
              type="email"
              required
              placeholder="Your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1 px-3 py-2 rounded-md text-gray-900 text-sm border border-gray-300 focus:ring-yellow-500 focus:border-yellow-500"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-md font-medium text-sm transition disabled:opacity-50"
            >
              {status === "loading" ? "..." : "Subscribe"}
            </button>
          </form>
          {/* {status === "success" && (
            <p className="text-green-400 text-xs">✅ You’ve been subscribed!</p>
          )}
          {status === "error" && (
            <p className="text-red-400 text-xs">❌ Something went wrong. Try again.</p>
          )} */}
        </div>
      </div>

      {/* Bottom Line */}
      <hr className="border-gray-800" />
      <p className="text-center text-sm text-gray-400 py-4">
        © {new Date().getFullYear()} <span className="text-yellow-500 font-semibold">Hebat</span>.
        All Rights Reserved.
      </p>
    </footer>
  )
}
