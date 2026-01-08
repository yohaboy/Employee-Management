import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { db } from './db'

const SESSION_COOKIE_NAME = 'session_node_id'

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
}

export async function createSession(nodeId: string): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, nodeId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    })
}

export async function getSession(): Promise<string | null> {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)
    return sessionCookie?.value ?? null
}

export async function destroySession(): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function getCurrentNode() {
    const nodeId = await getSession()
    if (!nodeId) return null

    const node = db.nodes.find(n => n.id === nodeId)

    if (!node) return null

    return {
        id: node.id,
        email: node.email,
        name: node.name,
        position: node.position,
        parentId: node.parentId,
        createdAt: node.createdAt,
        updatedAt: node.updatedAt,
    }
}

export async function requireAuth() {
    const node = await getCurrentNode()
    if (!node) {
        throw new Error('Unauthorized')
    }
    return node
}
