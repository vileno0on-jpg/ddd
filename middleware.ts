import { stackServerApp } from './lib/stack'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const user = await stackServerApp.getUser()
  const isSignedIn = !!user

  // Protect authenticated routes
  if (request.nextUrl.pathname.startsWith('/dashboard') ||
      request.nextUrl.pathname.startsWith('/admin') ||
      request.nextUrl.pathname.startsWith('/profile') ||
      request.nextUrl.pathname.startsWith('/api/user') ||
      request.nextUrl.pathname.startsWith('/api/admin') ||
      request.nextUrl.pathname.startsWith('/api/chat') ||
      request.nextUrl.pathname.startsWith('/api/quiz') ||
      request.nextUrl.pathname.startsWith('/api/modules')) {

    if (!isSignedIn) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Admin-only routes
    if (request.nextUrl.pathname.startsWith('/admin') ||
        request.nextUrl.pathname.startsWith('/api/admin')) {
      // For now, allow all authenticated users - you can add role checking here
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/profile/:path*',
    '/api/user/:path*',
    '/api/admin/:path*',
    '/api/chat/:path*',
    '/api/quiz/:path*',
    '/api/modules/:path*'
  ]
}
