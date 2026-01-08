import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get('session_node_id')
    const nodeId = sessionCookie?.value

    const isLoggedIn = !!nodeId

    const isAuthPage = request.nextUrl.pathname === '/login'
    const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard')

    // Redirect logged-in users away from login page
    if (isAuthPage && isLoggedIn) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Redirect non-logged-in users to login page
    if (isDashboardPage && !isLoggedIn) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/login', '/dashboard/:path*'],
}
