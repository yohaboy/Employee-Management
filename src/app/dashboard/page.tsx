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
            bg: 'bg-blue-100'
        },
        {
            title: 'Pending Signatures',
            value: pendingSignatures.toString(),
            description: 'Awaiting your digital signature',
            icon: FileCheck,
            color: 'text-amber-600',
            bg: 'bg-amber-100'
        },
        {
            title: 'Team Size',
            value: teamSize.toString(),
            description: 'Total subordinates in hierarchy',
            icon: Users,
            color: 'text-indigo-600',
            bg: 'bg-indigo-100'
        },
        {
            title: 'Security Alerts',
            value: '0',
            description: 'Failed login attempts/violations',
            icon: ShieldAlert,
            color: 'text-emerald-600',
            bg: 'bg-emerald-100'
        },
    ]

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Welcome back, {currentNode.name}
                    </h2>
                    <p className="text-muted-foreground text-sm font-medium flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] uppercase tracking-wider font-bold">
                            {currentNode.position}
                        </span>
                        <span className="text-border">•</span>
                        Secure Hierarchy Management System
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button asChild size="lg" className="rounded-xl px-6 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                        <Link href="/dashboard/letters/new">
                            <Send className="mr-2 h-4 w-4" /> New Letter
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Card key={stat.title} className="border-none shadow-sm ring-1 ring-border/50 hover:ring-primary/20 transition-all group overflow-hidden relative">
                            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-[0.03] group-hover:opacity-[0.05] transition-opacity ${stat.bg}`} />
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.1em]">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2.5 rounded-xl ${stat.bg} shadow-sm`}>
                                    <Icon className={`size-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black tracking-tight mb-1">{stat.value}</div>
                                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Recent Letters */}
                <Card className="lg:col-span-2 border-none shadow-xl shadow-foreground/[0.02] ring-1 ring-border/50 overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/5 px-8 py-6">
                        <div>
                            <CardTitle className="text-lg font-bold tracking-tight">Recent Communications</CardTitle>
                            <p className="text-xs text-muted-foreground mt-1 font-medium">Latest letters sent and received in your hierarchy</p>
                        </div>
                        <Button variant="outline" size="sm" asChild className="text-xs font-bold rounded-lg px-4">
                            <Link href="/dashboard/letters">View all <ChevronRight className="ml-1 h-3 w-3" /></Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="px-8 py-4">
                            <RecentLetters letters={recentLettersData} currentNodeId={currentNode.id} />
                        </div>
                    </CardContent>
                </Card>

                {/* Sidebar Content: Audit Logs */}
                <Card className="border-none shadow-xl shadow-foreground/[0.02] ring-1 ring-border/50 overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/5 px-8 py-6">
                        <div>
                            <CardTitle className="text-lg font-bold tracking-tight">System Activity</CardTitle>
                            <p className="text-xs text-muted-foreground mt-1 font-medium">Real-time audit trail of actions</p>
                        </div>
                        <div className="p-2 rounded-lg bg-muted/50">
                            <Activity className="size-4 text-muted-foreground" />
                        </div>
                    </CardHeader>
                    <CardContent className="px-8 py-6">
                        <AuditLogList logs={recentLogs} />
                        <Button variant="ghost" size="sm" className="w-full mt-8 text-[10px] font-bold h-10 rounded-xl border border-dashed border-border hover:bg-muted/50 hover:border-solid transition-all uppercase tracking-widest" asChild>
                            <Link href="/dashboard/audit">Full Audit Trail</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions / Status Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-1 border-none shadow-xl shadow-foreground/[0.02] ring-1 ring-border/50 overflow-hidden">
                    <CardHeader className="border-b border-border/50 bg-muted/5 px-8 py-6">
                        <CardTitle className="text-lg font-bold tracking-tight">Hierarchy Status</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1 font-medium">Your position in the organization</p>
                    </CardHeader>
                    <CardContent className="p-8 space-y-4">
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/20 border border-border/50 group hover:bg-muted/30 transition-all">
                            <div className="p-3 rounded-xl bg-background shadow-sm text-primary group-hover:scale-110 transition-transform">
                                <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Subordinates</p>
                                <p className="text-sm font-black">{db.nodes.filter(n => n.parentId === currentNode.id).length} Direct Reports</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/20 border border-border/50 group hover:bg-muted/30 transition-all">
                            <div className="p-3 rounded-xl bg-background shadow-sm text-primary group-hover:scale-110 transition-transform">
                                <Clock className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Last Active</p>
                                <p className="text-sm font-black">Just now</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2 border-none shadow-xl shadow-foreground/[0.02] ring-1 ring-border/50 overflow-hidden">
                    <CardHeader className="border-b border-border/50 bg-muted/5 px-8 py-6">
                        <CardTitle className="text-lg font-bold tracking-tight">Communication Volume</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1 font-medium">Letter activity over the last 12 months</p>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="h-48 flex items-end justify-between gap-3 px-2">
                            {[...Array(12)].map((_, i) => {
                                const month = i
                                const count = db.letters.filter(l => l.createdAt.getMonth() === month).length
                                const height = Math.max(8, (count / (db.letters.length || 1)) * 100)
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                                        <div className="relative w-full flex flex-col items-center justify-end h-full">
                                            <div
                                                className="w-full bg-primary/10 rounded-t-lg group-hover:bg-primary/20 transition-all duration-500 relative overflow-hidden"
                                                style={{ height: `${height}%` }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            {count > 0 && (
                                                <span className="absolute -top-6 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
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
