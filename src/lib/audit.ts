import { db, AuditAction } from './db'
import { v4 as uuidv4 } from 'uuid'

interface CreateAuditLogParams {
    nodeId: string
    action: AuditAction
    details?: string
    letterId?: string
    ipAddress?: string
    userAgent?: string
}

export async function createAuditLog(params: CreateAuditLogParams) {
    const newLog = {
        id: uuidv4(),
        nodeId: params.nodeId,
        action: params.action,
        details: params.details || null,
        letterId: params.letterId || null,
        ipAddress: params.ipAddress || null,
        userAgent: params.userAgent || null,
        createdAt: new Date(),
    }
    db.auditLogs.push(newLog)
    return newLog
}

export async function getNodeAuditLogs(nodeId: string, limit: number = 50) {
    const logs = db.auditLogs
        .filter(log => log.nodeId === nodeId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, limit)

    // Join with letters to get subject
    return logs.map(log => {
        const letter = log.letterId ? db.letters.find(l => l.id === log.letterId) : null
        return {
            ...log,
            letter: letter ? { id: letter.id, subject: letter.subject } : null
        }
    })
}
