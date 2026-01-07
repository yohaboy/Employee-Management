import { getNodeAuditLogs } from '@/lib/audit'
import { formatDistanceToNow } from 'date-fns'
import { Activity } from 'lucide-react'

interface AuditLogListProps {
    nodeId: string
    limit?: number
}

const actionLabels: Record<string, string> = {
    NODE_CREATED: 'Created a new user',
    NODE_UPDATED: 'Updated user information',
    NODE_DELETED: 'Deleted a user',
    LETTER_CREATED: 'Created a letter',
    LETTER_UPDATED: 'Updated a letter',
    LETTER_DELETED: 'Deleted a letter',
    LETTER_SENT: 'Sent a letter',
    LETTER_SIGNED: 'Signed a letter',
    LETTER_RESPONDED: 'Responded to a letter',
    LOGIN_SUCCESS: 'Logged in',
    LOGIN_FAILED: 'Failed login attempt',
    LOGOUT: 'Logged out',
}

export async function AuditLogList({ nodeId, limit = 5 }: AuditLogListProps) {
    const logs = await getNodeAuditLogs(nodeId, limit)

    if (logs.length === 0) {
        return (
            <div className="text-center py-8 text-slate-400">
                <p>No activity yet</p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {logs.map((log: any) => (
                <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-slate-700 bg-slate-900/30"
                >
                    <div className="p-2 rounded-lg bg-blue-500/10 flex-shrink-0">
                        <Activity className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium">
                            {actionLabels[log.action] || log.action}
                        </p>
                        {log.details && (
                            <p className="text-xs text-slate-400 truncate">{log.details}</p>
                        )}
                        <p className="text-xs text-slate-500 mt-1">
                            {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}
