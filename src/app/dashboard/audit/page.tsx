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
        if (action.includes('CREATED')) return 'bg-emerald-500 text-white'
        if (action.includes('DELETED')) return 'bg-rose-500 text-white'
        if (action.includes('FAILED')) return 'bg-amber-500 text-white'
        if (action.includes('SIGNED') || action.includes('RESPONDED')) return 'bg-blue-500 text-white'
        if (action.includes('SENT')) return 'bg-primary text-primary-foreground'
        return 'bg-muted text-muted-foreground'
    }

    return (
        <div className="space-y-8 pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-5xl font-black text-foreground uppercase tracking-tighter leading-none">Audit Logs</h2>
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs mt-2">Complete history of system actions and security events</p>
                </div>
                <div className="p-4 border-2 border-foreground bg-primary text-primary-foreground shadow-brutal-sm">
                    <Shield className="h-8 w-8" />
                </div>
            </div>

            <Card className="rounded-none border-2 border-foreground shadow-brutal overflow-hidden">
                <CardHeader className="bg-muted/50 border-b-2 border-foreground">
                    <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                        <Activity className="size-6" />
                        System Activity Ledger ({logs.length} Entries)
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted border-b-2 border-foreground">
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground">Timestamp</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground">Operator</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground">Action Type</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground">Transaction Details</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground">Network Origin</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-20 text-muted-foreground font-black uppercase tracking-widest">
                                            No audit logs found in the ledger
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logs.map((log) => (
                                        <TableRow key={log.id} className="hover:bg-muted/30 transition-colors border-b border-foreground/5 last:border-0">
                                            <TableCell className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                                                {format(log.createdAt, 'MMM d, yyyy HH:mm:ss')}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black uppercase tracking-tighter">{log.nodeName}</span>
                                                    <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">{log.nodePosition}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`rounded-none text-[9px] font-black uppercase tracking-widest px-2 py-0.5 ${getActionColor(log.action)}`}>
                                                    {log.action.replace(/_/g, ' ')}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-xs font-bold text-foreground/80 max-w-[300px] truncate">
                                                {log.details}
                                            </TableCell>
                                            <TableCell className="text-[10px] font-mono font-bold text-muted-foreground">
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
