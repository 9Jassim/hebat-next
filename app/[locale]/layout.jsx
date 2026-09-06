import { notFound } from "next/navigation"
import { LanguageProvider } from "@/context/LanguageContext"
import Providers from "@/app/providers"
import LocaleApplier from "@/components/LocaleApplier"

const VALID_LOCALES = ["en", "ar"]

export async function generateMetadata({ params }) {
  const isAr = params.locale === "ar"
  return {
    title: {
      template: isAr ? "%s | هيبات" : "%s | Hebat",
      default: isAr ? "هيبات" : "Hebat",
    },
  }
}

export default function LocaleLayout({ children, params }) {
  if (!VALID_LOCALES.includes(params.locale)) {
    notFound()
  }

  return (
    <>
      <LocaleApplier locale={params.locale} />
      <LanguageProvider locale={params.locale}>
        <Providers>{children}</Providers>
      </LanguageProvider>
    </>
  )
}
