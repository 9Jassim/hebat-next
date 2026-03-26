"use client"

import { useEffect } from "react"

export default function LocaleApplier({ locale }) {
  useEffect(() => {
    const isAr = locale === "ar"
    document.documentElement.dir = isAr ? "rtl" : "ltr"
    document.documentElement.lang = isAr ? "ar" : "en"
  }, [locale])

  return null
}
