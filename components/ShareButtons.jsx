"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Share2 } from "lucide-react"
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
      <div className="flex items-center gap-2 ml-0">
        {/* WhatsApp */}
        <a
          href={`https://wa.me/?text=${text}%20${url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center transition-transform hover:scale-110"
          title="Share on WhatsApp"
        >
          <Image
            src="/whatsapp-logo.svg"
            alt="Whatsapp"
            width={24}
            height={24}
            style={{
              filter:
                "invert(41%) sepia(98%) saturate(369%) hue-rotate(81deg) brightness(94%) contrast(90%)",
            }}
          />
        </a>

        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center transition-transform hover:scale-110"
          title="Share on Facebook"
        >
          <Image
            src="/facebook-logo.svg"
            alt="Facebook"
            width={24}
            height={24}
            style={{
              filter:
                "invert(33%) sepia(99%) saturate(1939%) hue-rotate(203deg) brightness(92%) contrast(95%)",
            }}
          />
        </a>

        {/* X (Twitter) */}
        <a
          href={`https://twitter.com/intent/tweet?text=${text}&url=${url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center transition-transform hover:scale-110"
          title="Share on X"
        >
          <Image
            src="/x-logo.svg"
            alt="X"
            width={24}
            height={24}
            style={{ filter: "invert(0%) brightness(0%)" }}
          />
        </a>

        {/* Native Share */}
        <button
          onClick={handleNativeShare}
          className="flex items-center justify-center transition-transform hover:scale-110"
          title="Share"
        >
          <Share2 size={24} color="#FACC15" />
        </button>
      </div>
    </div>
  )
}
