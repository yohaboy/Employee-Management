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
        if (action.includes('SIGNED')) return 'bg-blue-100 text-blue-700 border-blue-200'
        return 'bg-slate-100 text-slate-700 border-slate-200'
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Audit Logs</h2>
                    <p className="text-muted-foreground">Complete history of system actions and security events</p>
                </div>
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <Shield className="h-6 w-6" />
                </div>
            </div>

            <Card className="border-none shadow-sm ring-1 ring-border/50">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Activity className="size-5 text-muted-foreground" />
                        System Activity ({logs.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="w-[180px]">Timestamp</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Details</TableHead>
                                    <TableHead>IP Address</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                            No audit logs found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logs.map((log) => (
                                        <TableRow key={log.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell className="text-xs font-medium">
                                                {format(log.createdAt, 'MMM d, yyyy HH:mm:ss')}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold">{log.nodeName}</span>
                                                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{log.nodePosition}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getActionColor(log.action)}`}>
                                                    {log.action.replace(/_/g, ' ')}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground max-w-[300px] truncate">
                                                {log.details}
                                            </TableCell>
                                            <TableCell className="text-xs font-mono text-muted-foreground">
                                                {log.ipAddress || 'Internal'}
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
