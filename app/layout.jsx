import "@/app/globals.css"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"

export const metadata = {
  title: "Hebat Next",
  description: "Fixed layout with sticky Nav and bottom Footer",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        {/* Sticky Nav at the top */}
        <header className="sticky top-0 z-50 bg-white shadow">
          <Nav />
        </header>

        {/* Main content expands */}
        <main className="flex-grow">{children}</main>

        {/* Footer sticks to bottom */}
        <Footer />
      </body>
    </html>
  )
}
