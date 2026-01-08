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
        if (action.includes('CREATED')) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none'
        if (action.includes('DELETED')) return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-none'
        if (action.includes('FAILED')) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-none'
        if (action.includes('SIGNED') || action.includes('RESPONDED')) return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-none'
        if (action.includes('SENT')) return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-none'
        return 'bg-muted text-muted-foreground border-none'
    }

    return (
        <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h2 className="text-4xl font-black tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Audit Ledger</h2>
                    <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest opacity-60">Complete history of system actions and security events</p>
                </div>
                <div className="p-4 rounded-2xl bg-primary/5 text-primary border border-primary/10 shadow-xl shadow-primary/5">
                    <Shield className="h-6 w-6" />
                </div>
            </div>

            <Card className="border-none shadow-2xl shadow-foreground/[0.02] ring-1 ring-border/50 overflow-hidden bg-background">
                <CardHeader className="border-b border-border/50 bg-muted/5 px-8 py-6">
                    <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                        <Activity className="size-4 text-primary" />
                        System Activity Ledger ({logs.length} Entries)
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/10 border-b border-border/50 hover:bg-muted/10">
                                    <TableHead className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] h-14 px-8">Timestamp</TableHead>
                                    <TableHead className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] h-14 px-8">Operator</TableHead>
                                    <TableHead className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] h-14 px-8">Action Type</TableHead>
                                    <TableHead className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] h-14 px-8">Transaction Details</TableHead>
                                    <TableHead className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] h-14 px-8">Network Origin</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-24">
                                            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">No audit logs found in the ledger</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logs.map((log) => (
                                        <TableRow key={log.id} className="hover:bg-muted/20 transition-all border-b border-border/50 last:border-0 group">
                                            <TableCell className="px-8 py-5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-tighter whitespace-nowrap">
                                                {format(log.createdAt, 'MMM d, yyyy HH:mm:ss')}
                                            </TableCell>
                                            <TableCell className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground font-black text-[10px] group-hover:bg-primary/5 group-hover:text-primary transition-all">
                                                        {log.nodeName.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black tracking-tight">{log.nodeName}</p>
                                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{log.nodePosition}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-8 py-5">
                                                <Badge variant="outline" className={`rounded-md text-[9px] font-black uppercase tracking-widest px-2.5 py-1 shadow-sm ${getActionColor(log.action)}`}>
                                                    {log.action.replace(/_/g, ' ')}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-8 py-5 text-xs font-bold text-foreground/70 max-w-[300px] truncate leading-relaxed">
                                                {log.details}
                                            </TableCell>
                                            <TableCell className="px-8 py-5">
                                                <span className="text-[9px] font-mono font-black text-muted-foreground/40 bg-muted/50 px-2 py-1 rounded-md border border-border/50">
                                                    {log.ipAddress || 'INTERNAL_SYSTEM'}
                                                </span>
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
