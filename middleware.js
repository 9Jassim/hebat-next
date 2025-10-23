import { NextResponse } from "next/server"

export function middleware(req) {
  const { pathname } = req.nextUrl

  // ✅ Define only the paths that truly require authentication
  const protectedPaths = ["/newproduct", "/newsletter"]

  // ✅ If path is protected, check token
  if (protectedPaths.some(p => pathname.startsWith(p))) {
    const token = req.cookies.get("auth_token")?.value
    if (!token) {
      const url = req.nextUrl.clone()
      url.pathname = "/admin" // redirect to login page
      return NextResponse.redirect(url)
    }
  }

  // ✅ Allow /admin (login page) even without token
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/new-product/:path*"],
}
