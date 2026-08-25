"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Share2, Copy, Check } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"

export default function ShareButtons({ product }) {
  const { t } = useLanguage()
  const pathname = usePathname()
  const [currentUrl, setCurrentUrl] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(`${window.location.origin}${pathname}`)
    }
  }, [pathname])

  const text = encodeURIComponent(`Check out this product: ${product.name}`)
  const url = encodeURIComponent(currentUrl)

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this product from Hebat!`,
          url: currentUrl,
        })
      } catch {}
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const btnClass =
    "w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-yellow-500/50 hover:bg-yellow-50 dark:hover:bg-yellow-500/10 transition-all duration-200"

  return (
    <div className="mt-5">
      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
        {t("shareVia")}
      </h2>
      <div className="flex items-center gap-2">
        {/* WhatsApp */}
        <a
          href={`https://wa.me/?text=${text}%20${url}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on WhatsApp"
          className={btnClass}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.527 5.845L.057 23.885l6.215-1.44A11.934 11.934 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 0 1-5.001-1.373l-.36-.214-3.687.855.87-3.593-.234-.37A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
          </svg>
        </a>

        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on Facebook"
          className={btnClass}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.696 4.533-4.696 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.887v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
          </svg>
        </a>

        {/* X / Twitter */}
        <a
          href={`https://twitter.com/intent/tweet?text=${text}&url=${url}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on X"
          className={btnClass}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            className="fill-gray-900 dark:fill-gray-100"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>

        {/* Copy link */}
        <button onClick={handleCopy} title="Copy link" className={btnClass}>
          {copied ? (
            <Check size={15} className="text-yellow-500" />
          ) : (
            <Copy size={15} className="text-gray-500 dark:text-gray-400" />
          )}
        </button>

        {/* Native share (mobile) */}
        {typeof navigator !== "undefined" && navigator.share && (
          <button onClick={handleNativeShare} title="Share" className={btnClass}>
            <Share2 size={15} className="text-yellow-500" />
          </button>
        )}
      </div>
    </div>
  )
}
