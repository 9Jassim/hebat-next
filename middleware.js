import { NextResponse } from "next/server"

const ADMIN_PROTECTED = [
  "/admin/newproduct",
  "/admin/newsletter",
  "/admin/banners",
  "/admin/contacts",
  "/admin/homepage",
]

export function middleware(req) {
  const { pathname } = req.nextUrl

  // Redirect /ar/admin/* → /admin/* (admin has no Arabic version)
  if (pathname.startsWith("/ar/admin")) {
    const url = req.nextUrl.clone()
    url.pathname = pathname.replace(/^\/ar/, "")
    return NextResponse.redirect(url)
  }

  // Admin auth check (unchanged)
  if (pathname.startsWith("/admin")) {
    if (ADMIN_PROTECTED.some(p => pathname.startsWith(p))) {
      const token = req.cookies.get("auth_token")?.value
      if (!token) {
        const url = req.nextUrl.clone()
        url.pathname = "/admin"
        return NextResponse.redirect(url)
      }
    }
    return NextResponse.next()
  }

  // Redirect /en/... → /... (canonical — no en prefix in URL)
  if (pathname.startsWith("/en")) {
    const url = req.nextUrl.clone()
    url.pathname = pathname.replace(/^\/en/, "") || "/"
    return NextResponse.redirect(url, { status: 301 })
  }

  // Arabic paths: pass through as-is
  if (pathname.startsWith("/ar")) {
    return NextResponse.next()
  }

  // QR redirect routes: pass through as-is
  if (pathname.startsWith("/go/")) {
    return NextResponse.next()
  }

  // English paths: rewrite /foo → /en/foo (internal)
  const url = req.nextUrl.clone()
  url.pathname = `/en${pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)"],
}
