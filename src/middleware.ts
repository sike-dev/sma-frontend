import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl

  // Define public routes that don't require authentication
  const publicRoutes = [
    '/auth/login',
    '/auth/signup',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/api/health',
  ]

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // Get the auth token from cookies
  const token = request.cookies.get('auth-storage')?.value

  // If it's a public route, allow access
  if (isPublicRoute) {
    // If user is already authenticated and trying to access auth pages, redirect to dashboard
    if (token && pathname.startsWith('/auth/')) {
      try {
        const authData = JSON.parse(token)
        if (authData.state?.isAuthenticated) {
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
      } catch (error) {
        // Invalid token, continue to auth page
      }
    }
    return NextResponse.next()
  }

  // For protected routes, check if user is authenticated
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  try {
    const authData = JSON.parse(token)
    if (!authData.state?.isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  } catch (error) {
    // Invalid token, redirect to login
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}