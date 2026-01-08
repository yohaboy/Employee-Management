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

const actionColors: Record<string, string> = {
    NODE_CREATED: 'bg-emerald-500',
    NODE_UPDATED: 'bg-blue-500',
    NODE_DELETED: 'bg-rose-500',
    LETTER_CREATED: 'bg-amber-500',
    LETTER_SENT: 'bg-indigo-500',
    LETTER_SIGNED: 'bg-emerald-500',
    LETTER_RESPONDED: 'bg-purple-500',
    LOGIN_SUCCESS: 'bg-emerald-500',
    LOGIN_FAILED: 'bg-rose-500',
}

export async function AuditLogList({ nodeId, limit = 5, logs: providedLogs }: AuditLogListProps) {
    const logs = providedLogs || (nodeId ? await getNodeAuditLogs(nodeId, limit) : [])

    if (logs.length === 0) {
        return (
            <div className="text-center py-12 bg-muted/5 rounded-2xl border border-dashed border-border/50">
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">No activity recorded</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-border/50 before:via-border/20 before:to-transparent">
            {logs.map((log: any) => (
                <div
                    key={log.id}
                    className="flex items-start gap-5 relative group"
                >
                    <div className="relative flex-shrink-0 mt-1">
                        <div className={`size-6 rounded-full bg-background ring-4 ring-background flex items-center justify-center z-10 relative border border-border/50`}>
                            <div className={`size-1.5 rounded-full ${actionColors[log.action] || 'bg-primary'} shadow-[0_0_8px_rgba(0,0,0,0.1)]`} />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-black text-foreground tracking-tight">
                                {actionLabels[log.action] || log.action.replace(/_/g, ' ')}
                            </p>
                            <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-tighter whitespace-nowrap">
                                {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                            </span>
                        </div>
                        {log.details && (
                            <p className="text-[10px] text-muted-foreground/70 truncate mt-1 font-bold leading-relaxed">
                                {log.details}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}
