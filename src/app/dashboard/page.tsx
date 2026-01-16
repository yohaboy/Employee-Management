import { getCurrentNode } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { getVisibleNodeIds, getDescendantIds } from '@/lib/hierarchy'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Send, FileCheck, Users, Activity, Clock, ShieldAlert, Calendar as CalendarIcon, ChevronRight } from 'lucide-react'
import { RecentLetters } from '@/components/dashboard/recent-letters'
import { AuditLogList } from '@/components/dashboard/audit-log-list'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function DashboardPage() {
    const currentNode = await getCurrentNode()

    if (!currentNode) {
        redirect('/login')
    }

    const visibleNodeIds = await getVisibleNodeIds(currentNode.id)
    const descendantIds = await getDescendantIds(currentNode.id)

    // Real Statistics
    const receivedLetters = db.letters.filter(l => l.receiverId === currentNode.id)
    const sentLetters = db.letters.filter(l => l.senderId === currentNode.id)

    const pendingSignatures = receivedLetters.filter(l => l.status === 'SENT').length
    const totalLetters = receivedLetters.length + sentLetters.length
    const teamSize = descendantIds.length
    const recentLogs = db.auditLogs
        .filter(log => visibleNodeIds.includes(log.nodeId))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5)

    // Get recent letters for the table
    const recentLettersData = db.letters
        .filter(l => visibleNodeIds.includes(l.senderId) || visibleNodeIds.includes(l.receiverId))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5)
        .map(l => {
            const sender = db.nodes.find(n => n.id === l.senderId)
            const receiver = db.nodes.find(n => n.id === l.receiverId)
            const signature = db.signatures.find(s => s.letterId === l.id)

            return {
                ...l,
                sender: sender ? { name: sender.name, position: sender.position } : { name: 'Unknown', position: 'Unknown' },
                receiver: receiver ? { name: receiver.name, position: receiver.position } : { name: 'Unknown', position: 'Unknown' },
                signature: signature || null
            }
        })

    const stats = [
        {
            title: 'Total Letters',
            value: totalLetters.toString(),
            description: `${sentLetters.length} sent, ${receivedLetters.length} received`,
            icon: Mail,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            title: 'Pending Signatures',
            value: pendingSignatures.toString(),
            description: 'Awaiting your signature',
            icon: FileCheck,
            color: 'text-amber-600',
            bg: 'bg-amber-50'
        },
        {
            title: 'Team Size',
            value: teamSize.toString(),
            description: 'Subordinates in hierarchy',
            icon: Users,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50'
        },
        {
            title: 'Sick Leave Balance',
            value: `${currentNode.sickLeaveBalance} Days`,
            description: `Out of ${currentNode.yearlySickLeaveAllowance} yearly`,
            icon: Activity,
            color: 'text-rose-600',
            bg: 'bg-rose-50'
        },
        {
            title: 'Security Alerts',
            value: '0',
            description: 'No violations detected',
            icon: ShieldAlert,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50'
        },
    ]

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                        Welcome back, {currentNode.name}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-[11px] font-semibold uppercase tracking-wider">
                        <span className="px-2 py-0.5 rounded bg-muted border border-border">
                            {currentNode.position}
                        </span>
                        <span className="hidden sm:inline text-border">•</span>
                        <span className="hidden sm:inline">Secure Hierarchy Management</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button asChild size="sm" className="w-full md:w-auto font-bold uppercase tracking-wider text-[11px] h-10 px-6">
                        <Link href="/dashboard/letters/new">
                            <Send className="mr-2 h-4 w-4" /> New Document
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Card key={stat.title} className="border border-border shadow-sm hover:border-primary/30 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded ${stat.bg}`}>
                                    <Icon className={`size-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold tracking-tight mb-0.5">{stat.value}</div>
                                <p className="text-[11px] text-muted-foreground font-medium">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content: Recent Letters */}
                <Card className="lg:col-span-2 border border-border shadow-sm overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
                        <div>
                            <CardTitle className="text-base font-bold tracking-tight">Recent Communications</CardTitle>
                            <p className="text-xs text-muted-foreground mt-0.5 font-medium">Latest letters in your hierarchy</p>
                        </div>
                        <Button variant="outline" size="sm" asChild className="text-[11px] font-bold rounded h-8 px-3">
                            <Link href="/dashboard/letters">View all <ChevronRight className="ml-1 h-3 w-3" /></Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="px-6 py-2">
                            <RecentLetters letters={recentLettersData} currentNodeId={currentNode.id} />
                        </div>
                    </CardContent>
                </Card>

                {/* Sidebar Content: Audit Logs */}
                <Card className="border border-border shadow-sm overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
                        <div>
                            <CardTitle className="text-base font-bold tracking-tight">System Activity</CardTitle>
                            <p className="text-xs text-muted-foreground mt-0.5 font-medium">Real-time audit trail</p>
                        </div>
                        <Activity className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="px-6 py-4">
                        <AuditLogList logs={recentLogs} />
                        <Button variant="ghost" size="sm" className="w-full mt-6 text-[11px] font-bold h-9 rounded border border-dashed border-border hover:bg-muted/50 hover:border-solid transition-all uppercase tracking-wider" asChild>
                            <Link href="/dashboard/audit">Full Audit Trail</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions / Status Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1 border border-border shadow-sm overflow-hidden">
                    <CardHeader className="border-b border-border bg-muted/30 px-6 py-4">
                        <CardTitle className="text-base font-bold tracking-tight">Hierarchy Status</CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5 font-medium">Your organizational position</p>
                    </CardHeader>
                    <CardContent className="p-6 space-y-3">
                        <div className="flex items-center gap-4 p-3 rounded border border-border bg-muted/20 group hover:bg-muted/30 transition-colors">
                            <div className="p-2 rounded bg-background border border-border text-primary">
                                <Users className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Subordinates</p>
                                <p className="text-sm font-semibold">{db.nodes.filter(n => n.parentId === currentNode.id).length} Direct Reports</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-3 rounded border border-border bg-muted/20 group hover:bg-muted/30 transition-colors">
                            <div className="p-2 rounded bg-background border border-border text-primary">
                                <Clock className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Last Active</p>
                                <p className="text-sm font-semibold">Just now</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2 border border-border shadow-sm overflow-hidden">
                    <CardHeader className="border-b border-border bg-muted/30 px-6 py-4">
                        <CardTitle className="text-base font-bold tracking-tight">Communication Volume</CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5 font-medium">Letter activity by month</p>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="h-40 flex items-end justify-between gap-2 px-2">
                            {[...Array(12)].map((_, i) => {
                                const month = i
                                const count = db.letters.filter(l => l.createdAt.getMonth() === month).length
                                const height = Math.max(8, (count / (db.letters.length || 1)) * 100)
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                        <div className="relative w-full flex flex-col items-center justify-end h-full">
                                            <div
                                                className="w-full bg-primary/10 rounded-t group-hover:bg-primary/20 transition-colors relative"
                                                style={{ height: `${height}%` }}
                                            />
                                            {count > 0 && (
                                                <span className="absolute -top-5 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {count}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

