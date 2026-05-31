import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      const url = new URL('/admin/login', request.url)
      return NextResponse.redirect(url)
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret_temporario_123')
      await jwtVerify(token, secret)
      return NextResponse.next()
    } catch {
      const url = new URL('/admin/login', request.url)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
