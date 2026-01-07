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
    senderId: string
    receiverId: string
    createdAt: Date
    updatedAt: Date
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
            password: '$2a$12$L/X.s/w.w/w.w/w.w/w.w/w.w/w.w/w.w/w.w/w.w/w.w/w.w/w.', // Mock hash
            name: 'Root Admin',
            position: 'CEO',
            parentId: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
    }
}

// Singleton instance
export const db = new InMemoryStore()
