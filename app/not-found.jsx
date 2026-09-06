import Link from "next/link"

export const metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
        fontFamily: "var(--font-poppins), system-ui, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "3rem", margin: 0 }}>404</h1>
      <p style={{ fontSize: "1.125rem", color: "#555", marginTop: "0.5rem" }}>
        Sorry, we couldn&apos;t find that page.
      </p>
      <Link
        href="/"
        style={{
          marginTop: "1.5rem",
          padding: "0.75rem 1.5rem",
          borderRadius: "9999px",
          background: "#111",
          color: "#fff",
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        Back to home
      </Link>
    </main>
  )
}
