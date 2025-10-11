import "@/app/globals.css"
import { AuthProvider } from "@/context/AuthContext"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"

export const metadata = {
  title: "Hebat Next",
  description: "Hebat site with global auth and cookie login",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        <AuthProvider>
          <header className="sticky top-0 z-50 bg-black shadow-md">
            <Nav />
          </header>

          <main className="flex-grow">{children}</main>

          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
