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
            <div className="text-center py-8 text-muted-foreground">
                <p>No activity yet</p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {logs.map((log: any) => (
                <div
                    key={log.id}
                    className="flex items-start gap-4 p-4 rounded-lg border bg-muted/30"
                >
                    <div className="p-2 rounded-full bg-primary/10 flex-shrink-0">
                        <Activity className="size-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">
                            {actionLabels[log.action] || log.action}
                        </p>
                        {log.details && (
                            <p className="text-xs text-muted-foreground truncate mt-0.5">{log.details}</p>
                        )}
                        <p className="text-[10px] text-muted-foreground mt-2">
                            {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}
