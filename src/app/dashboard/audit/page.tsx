import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/db'
import { getVisibleNodeIds } from '@/lib/hierarchy'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { Activity, Shield } from 'lucide-react'

export default async function AuditPage() {
    const currentNode = await requireAuth()
    const visibleNodeIds = await getVisibleNodeIds(currentNode.id)

    const logs = db.auditLogs
        .filter(log => visibleNodeIds.includes(log.nodeId))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .map(log => {
            const node = db.nodes.find(n => n.id === log.nodeId)
            return {
                ...log,
                nodeName: node?.name || 'Unknown',
                nodePosition: node?.position || 'Unknown'
            }
        })

    const getActionColor = (action: string) => {
        if (action.includes('CREATED')) return 'bg-emerald-100 text-emerald-700 border-emerald-200'
        if (action.includes('DELETED')) return 'bg-rose-100 text-rose-700 border-rose-200'
        if (action.includes('FAILED')) return 'bg-amber-100 text-amber-700 border-amber-200'
        if (action.includes('SIGNED') || action.includes('RESPONDED')) return 'bg-blue-100 text-blue-700 border-blue-200'
        if (action.includes('SENT')) return 'bg-slate-100 text-slate-700 border-slate-200'
        return 'bg-muted text-muted-foreground'
    }

    return (
        <div className="space-y-8 pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Audit Logs</h2>
                    <p className="text-muted-foreground text-sm">Complete history of system actions and security events</p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <Shield className="h-6 w-6" />
                </div>
            </div>

            <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                <CardHeader className="border-b bg-muted/10">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Activity className="size-4 text-muted-foreground" />
                        System Activity Ledger ({logs.length} Entries)
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30 border-b">
                                    <TableHead className="text-xs font-semibold text-muted-foreground">Timestamp</TableHead>
                                    <TableHead className="text-xs font-semibold text-muted-foreground">Operator</TableHead>
                                    <TableHead className="text-xs font-semibold text-muted-foreground">Action Type</TableHead>
                                    <TableHead className="text-xs font-semibold text-muted-foreground">Transaction Details</TableHead>
                                    <TableHead className="text-xs font-semibold text-muted-foreground">Network Origin</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-20 text-muted-foreground font-medium text-sm">
                                            No audit logs found in the ledger
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logs.map((log) => (
                                        <TableRow key={log.id} className="hover:bg-muted/20 transition-colors border-b last:border-0">
                                            <TableCell className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">
                                                {format(log.createdAt, 'MMM d, yyyy HH:mm:ss')}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold">{log.nodeName}</span>
                                                    <span className="text-[10px] text-muted-foreground font-medium">{log.nodePosition}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={`rounded-full text-[10px] font-semibold px-2.5 py-0.5 ${getActionColor(log.action)}`}>
                                                    {log.action.replace(/_/g, ' ')}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-xs font-medium text-foreground/80 max-w-[300px] truncate">
                                                {log.details}
                                            </TableCell>
                                            <TableCell className="text-[10px] font-mono font-medium text-muted-foreground">
                                                {log.ipAddress || 'INTERNAL_SYSTEM'}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
