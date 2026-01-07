import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { db } from '@/lib/db'

export function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get('session_node_id')
    const nodeId = sessionCookie?.value

    // Verify if the node exists in the DB
    const nodeExists = nodeId ? db.nodes.some(n => n.id === nodeId) : false
    const isLoggedIn = !!nodeId && nodeExists

    const isAuthPage = request.nextUrl.pathname === '/login'
    const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard')

    // Redirect logged-in users away from login page
    if (isAuthPage && isLoggedIn) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Redirect non-logged-in users to login page
    if (isDashboardPage && !isLoggedIn) {
        const response = NextResponse.redirect(new URL('/login', request.url))
        // Clear the invalid cookie if it exists
        if (nodeId && !nodeExists) {
            response.cookies.delete('session_node_id')
        }
        return response
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/login', '/dashboard/:path*'],
}
