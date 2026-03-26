import { LanguageProvider } from "@/context/LanguageContext"
import Providers from "@/app/providers"
import LocaleApplier from "@/components/LocaleApplier"

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
