import { NextRequest, NextResponse } from "next/server"

// Protected routes - require authentication
const protectedPaths = ["/chat", "/profile", "/invitations"]
// Public-only routes - redirect to /chat if logged in
const authPaths = ["/login", "/register"]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("access_token")?.value
    || request.headers.get("authorization")?.replace("Bearer ", "")

  const isProtected = protectedPaths.some(p => pathname.startsWith(p))
  const isAuthPath = authPaths.some(p => pathname.startsWith(p))

  if (isProtected && !token) {
    const url = new URL("/login", request.url)
    url.searchParams.set("from", pathname)
    return NextResponse.redirect(url)
  }

  if (isAuthPath && token) {
    return NextResponse.redirect(new URL("/chat", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
}
