import { LanguageProvider } from "@/context/LanguageContext"
import Providers from "@/app/providers"

export default function AdminLayout({ children }) {
  return (
    <LanguageProvider locale="en">
      <Providers>{children}</Providers>
    </LanguageProvider>
  )
}
