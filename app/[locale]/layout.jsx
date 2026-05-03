import { LanguageProvider } from "@/context/LanguageContext"
import Providers from "@/app/providers"
import LocaleApplier from "@/components/LocaleApplier"

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
  return (
    <>
      <LocaleApplier locale={params.locale} />
      <LanguageProvider locale={params.locale}>
        <Providers>{children}</Providers>
      </LanguageProvider>
    </>
  )
}
