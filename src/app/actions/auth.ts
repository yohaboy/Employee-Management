'use server'

import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { createSession, destroySession, hashPassword, verifyPassword } from '@/lib/auth'
import { loginSchema, createNodeSchema } from '@/lib/validations'
import { createAuditLog } from '@/lib/audit'
import { headers } from 'next/headers'
import { v4 as uuidv4 } from 'uuid'

export async function loginAction(_prevState: any, formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const validation = loginSchema.safeParse({ email, password })
    if (!validation.success) {
        return { error: validation.error.issues[0].message }
    }

    const node = db.nodes.find(n => n.email === email)

    if (!node) {
        return { error: 'Invalid email or password' }
    }

    const isValid = await verifyPassword(password, node.password)
    if (!isValid) {
        // Log failed login attempt
        const headersList = await headers()
        await createAuditLog({
            nodeId: node.id,
            action: 'LOGIN_FAILED',
            details: `Failed login attempt for ${email}`,
            ipAddress: headersList.get('x-forwarded-for') || undefined,
            userAgent: headersList.get('user-agent') || undefined,
        })
        return { error: 'Invalid email or password' }
    }

    await createSession(node.id)

    // Log successful login
    const headersList = await headers()
    await createAuditLog({
        nodeId: node.id,
        action: 'LOGIN_SUCCESS',
        details: `Successful login for ${email}`,
        ipAddress: headersList.get('x-forwarded-for') || undefined,
        userAgent: headersList.get('user-agent') || undefined,
    })

    redirect('/dashboard')
}

export async function logoutAction() {
    await destroySession()
    redirect('/login')
}

export async function createNodeAction(_prevState: any, formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string
    const position = formData.get('position') as string
    const parentId = formData.get('parentId') as string

    const validation = createNodeSchema.safeParse({ email, password, name, position })
    if (!validation.success) {
        return { error: validation.error.issues[0].message }
    }

    // Check if email already exists
    const existingNode = db.nodes.find(n => n.email === email)

    if (existingNode) {
        return { error: 'Email already exists' }
    }

    // Verify parent exists
    const parent = db.nodes.find(n => n.id === parentId)

    if (!parent) {
        return { error: 'Parent node not found' }
    }

    const hashedPassword = await hashPassword(password)

    const newNode = {
        id: uuidv4(),
        email,
        password: hashedPassword,
        name,
        position,
        parentId,
        createdAt: new Date(),
        updatedAt: new Date(),
    }

    db.nodes.push(newNode)

    // Log node creation
    const headersList = await headers()
    await createAuditLog({
        nodeId: parentId,
        action: 'NODE_CREATED',
        details: `Created new node: ${name} (${email})`,
        ipAddress: headersList.get('x-forwarded-for') || undefined,
        userAgent: headersList.get('user-agent') || undefined,
    })

    return { success: true, nodeId: newNode.id }
}
