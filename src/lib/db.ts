import { AuditAction, LetterStatus } from '@prisma/client'

// Mock types matching Prisma schema
export interface Node {
    id: string
    email: string
    password: string
    name: string
    position: string
    parentId: string | null
    createdAt: Date
    updatedAt: Date
}

export interface Letter {
    id: string
    subject: string
    body: string
    status: LetterStatus
    category: 'RESPONSE_REQUIRED' | 'NO_RESPONSE_REQUIRED'
    parentId: string | null
    senderId: string
    receiverId: string
    createdAt: Date
    updatedAt: Date
    attachment?: string
    signedBySender?: boolean
}

export interface Signature {
    id: string
    response: string | null
    signedAt: Date
    letterId: string
    signedById: string
}

export interface AuditLog {
    id: string
    action: AuditAction
    details: string | null
    ipAddress: string | null
    userAgent: string | null
    nodeId: string
    letterId: string | null
    createdAt: Date
}

class InMemoryStore {
    nodes: Node[] = []
    letters: Letter[] = []
    signatures: Signature[] = []
    auditLogs: AuditLog[] = []

    constructor() {
        // Add a root admin node
        this.nodes.push({
            id: 'root-node',
            email: 'admin@company.com',
            password: '$2b$12$knWF6dVFoJgm9jMQhXHnDOe.glXIGrrqFTrGm6gU/MxAzPbiQUxci', // Real hash for 'admin123'
            name: 'Root Admin',
            position: 'CEO',
            parentId: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
    }
}

// Singleton instance with HMR support
const globalForDb = globalThis as unknown as { db: InMemoryStore }
export const db = globalForDb.db || new InMemoryStore()

if (process.env.NODE_ENV !== 'production') globalForDb.db = db
