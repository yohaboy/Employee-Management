import { requireAuth } from '@/lib/auth'
import { db, Node, Letter } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Thermometer, Users, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function SickLeaveStatsPage() {
    const currentNode = await requireAuth()

    // Get direct children
    const children = db.nodes.filter(n => n.parentId === currentNode.id)

    if (children.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Users className="size-12 text-muted-foreground opacity-20" />
                <h2 className="text-xl font-black uppercase tracking-tight">No Direct Reports</h2>
                <p className="text-muted-foreground text-center max-w-md">
                    You don't have any direct reports to view statistics for.
                </p>
            </div>
        )
    }

    // Get all sick leave requests for these children
    const childIds = children.map(c => c.id)
    const sickLeaveRequests = db.letters.filter(l =>
        l.requestType === 'SICK_LEAVE' &&
        childIds.includes(l.senderId) &&
        l.receiverId === currentNode.id
    ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h2 className="text-4xl font-black tracking-tighter uppercase">Team Sick Leave</h2>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Detailed statistics and requests</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {children.map(child => {
                    const childRequests = sickLeaveRequests.filter(r => r.senderId === child.id)
                    const approvedDays = childRequests
                        .filter(r => r.status === 'SIGNED' || r.status === 'RESPONDED')
                        .reduce((acc, r) => acc + (r.daysCount || 0), 0)

                    const usagePercentage = (approvedDays / child.yearlySickLeaveAllowance) * 100

                    return (
                        <Card key={child.id} className="rounded-none border-2 border-border shadow-brutal hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal-lg transition-all">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg font-black uppercase truncate">{child.name}</CardTitle>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{child.position}</p>
                                    </div>
                                    <Badge variant="outline" className="rounded-none border-2 font-black text-[10px]">
                                        {child.sickLeaveBalance} LEFT
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span>Usage</span>
                                        <span>{approvedDays} / {child.yearlySickLeaveAllowance} Days</span>
                                    </div>
                                    <Progress value={usagePercentage} className="h-3 rounded-none border-2 border-border bg-muted" />
                                </div>

                                <div className="pt-4 border-t-2 border-dashed border-border">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Recent Requests</h4>
                                    {childRequests.length === 0 ? (
                                        <p className="text-xs text-muted-foreground italic">No requests found</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {childRequests.slice(0, 2).map(req => (
                                                <div key={req.id} className="flex items-center justify-between p-2 bg-muted/30 border border-border text-[10px] font-bold">
                                                    <div className="flex flex-col">
                                                        <span>{req.startDate}</span>
                                                        <span className="opacity-60">{req.daysCount} days</span>
                                                    </div>
                                                    <Badge className={cn(
                                                        "rounded-none text-[8px] font-black uppercase",
                                                        req.status === 'SIGNED' || req.status === 'RESPONDED' ? "bg-green-500" :
                                                            req.status === 'SENT' ? "bg-amber-500" : "bg-slate-500"
                                                    )}>
                                                        {req.status}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                    <Clock className="size-5 text-primary" />
                    Pending Approvals
                </h3>
                <div className="grid gap-4">
                    {sickLeaveRequests.filter(r => r.status === 'SENT').length === 0 ? (
                        <div className="p-12 text-center bg-muted/20 border-2 border-dashed border-border">
                            <CheckCircle2 className="size-8 text-muted-foreground/30 mx-auto mb-2" />
                            <p className="text-sm font-bold text-muted-foreground uppercase">All caught up!</p>
                        </div>
                    ) : (
                        sickLeaveRequests.filter(r => r.status === 'SENT').map(req => {
                            const sender = children.find(c => c.id === req.senderId)
                            return (
                                <div key={req.id} className="flex items-center justify-between p-6 bg-card border-2 border-border shadow-brutal">
                                    <div className="flex items-center gap-6">
                                        <div className="p-3 bg-amber-100 text-amber-600 border-2 border-amber-600">
                                            <AlertCircle className="size-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-black uppercase">{sender?.name}</h4>
                                            <p className="text-xs font-bold text-muted-foreground uppercase">{req.startDate} to {req.endDate} ({req.daysCount} days)</p>
                                        </div>
                                    </div>
                                    <Link href={`/dashboard/letters/${req.id}`}>
                                        <Button className="rounded-none border-2 border-primary font-black uppercase text-xs hover:shadow-brutal transition-all">
                                            Review Request
                                        </Button>
                                    </Link>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}

