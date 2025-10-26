"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { MessageSquare, Share2 } from "lucide-react"
import Image from "next/image"

export default function ShareButtons({ product }) {
  const pathname = usePathname()
  const [currentUrl, setCurrentUrl] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(`${window.location.origin}${pathname}`)
    }
  }, [pathname])

  const text = encodeURIComponent(`Check out this product: ${product.name}`)
  const url = encodeURIComponent(currentUrl)

  // ✅ Native mobile share
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this product from Hebat!`,
          url: currentUrl,
        })
      } catch (err) {
        console.error("Share failed:", err)
      }
    } else {
      alert("Sharing is not supported on this device.")
    }
  }

  return (
    <div className="mt-5">
      <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">Share Via</h2>
      <div className="flex gap-4 items-center">
        {/* WhatsApp */}
        <a
          href={`https://wa.me/?text=${text}%20${url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 flex items-center justify-center bg-green-500 rounded-full hover:bg-green-600 transition-colors"
          title="Share on WhatsApp"
        >
          <MessageSquare size={20} color="white" />
        </a>

        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 flex items-center justify-center bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
          title="Share on Facebook"
        >
          <Image
            src="/facebook-logo.svg"
            alt="Facebook"
            width={18}
            height={18}
            className="invert"
          />
        </a>

        {/* X (Twitter new logo) */}
        <a
          href={`https://twitter.com/intent/tweet?text=${text}&url=${url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 flex items-center justify-center bg-black rounded-full hover:bg-gray-900 transition-colors"
          title="Share on X"
        >
          <Image src="/x-logo.svg" alt="X" width={18} height={18} className="invert" />
        </a>

        {/* Native Share */}
        <button
          onClick={handleNativeShare}
          className="w-10 h-10 flex items-center justify-center bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors"
          title="Share"
        >
          <Share2 size={20} color="white" />
        </button>
      </div>
    </div>
  )
}
