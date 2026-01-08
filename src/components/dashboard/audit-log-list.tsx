import { getNodeAuditLogs } from '@/lib/audit'
import { formatDistanceToNow } from 'date-fns'
import { Activity } from 'lucide-react'

interface AuditLogListProps {
    nodeId?: string
    limit?: number
    logs?: any[]
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

export async function AuditLogList({ nodeId, limit = 5, logs: providedLogs }: AuditLogListProps) {
    const logs = providedLogs || (nodeId ? await getNodeAuditLogs(nodeId, limit) : [])

    if (logs.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <p>No activity yet</p>
            </div>
        )
    }

    return (
        <div className="space-y-6 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-px before:bg-border/50">
            {logs.map((log: any) => (
                <div
                    key={log.id}
                    className="flex items-start gap-4 relative"
                >
                    <div className="p-2 rounded-full bg-background ring-4 ring-background flex-shrink-0 z-10">
                        <div className="size-2 rounded-full bg-primary" />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                        <p className="text-xs font-bold text-foreground">
                            {actionLabels[log.action] || log.action}
                        </p>
                        {log.details && (
                            <p className="text-[10px] text-muted-foreground truncate mt-0.5 font-medium">{log.details}</p>
                        )}
                        <p className="text-[10px] text-muted-foreground/60 mt-1 font-medium">
                            {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}
