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
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-1">Welcome back, {currentNode.name}</h2>
                    <p className="text-muted-foreground text-sm">{currentNode.position} • Secure Hierarchy Management</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button asChild size="sm" className="rounded-lg px-4 font-semibold shadow-sm">
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
                        <Card key={stat.title} className="border-none shadow-sm ring-1 ring-border/50 hover:ring-primary/20 transition-all">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-lg ${stat.bg}`}>
                                    <Icon className={`size-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
                                <p className="text-[10px] text-muted-foreground mt-1 font-medium">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content: Recent Letters */}
                <Card className="lg:col-span-2 border-none shadow-sm ring-1 ring-border/50">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-sm font-bold">Recent Communications</CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">Latest letters sent and received in your hierarchy</p>
                        </div>
                        <Button variant="ghost" size="sm" asChild className="text-xs">
                            <Link href="/dashboard/letters">View all <ChevronRight className="ml-1 h-3 w-3" /></Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <RecentLetters letters={recentLettersData} currentNodeId={currentNode.id} />
                    </CardContent>
                </Card>

                {/* Sidebar Content: Audit Logs */}
                <Card className="border-none shadow-sm ring-1 ring-border/50">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-sm font-bold">System Activity</CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">Real-time audit trail of actions</p>
                        </div>
                        <Activity className="size-4 text-muted-foreground/30" />
                    </CardHeader>
                    <CardContent className="pt-0">
                        <AuditLogList logs={recentLogs} />
                        <Button variant="outline" size="sm" className="w-full mt-4 text-[10px] h-8 rounded-lg" asChild>
                            <Link href="/dashboard/audit">Full Audit Trail</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions / Status Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1 border-none shadow-sm ring-1 ring-border/50">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold">Hierarchy Status</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">Your position in the organization</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 border border-border/50">
                            <div className="p-2 rounded-full bg-primary/10 text-primary">
                                <Users className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-xs font-bold">Subordinates</p>
                                <p className="text-[10px] text-muted-foreground">{db.nodes.filter(n => n.parentId === currentNode.id).length} Direct Reports</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 border border-border/50">
                            <div className="p-2 rounded-full bg-primary/10 text-primary">
                                <Clock className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-xs font-bold">Last Active</p>
                                <p className="text-[10px] text-muted-foreground">Just now</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2 border-none shadow-sm ring-1 ring-border/50">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold">Letter Volume</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">Communication activity over time</p>
                    </CardHeader>
                    <CardContent className="h-40 flex items-end justify-between gap-2 px-2 pb-2">
                        {/* Simple data-driven bar chart */}
                        {[...Array(12)].map((_, i) => {
                            const month = i
                            const count = db.letters.filter(l => l.createdAt.getMonth() === month).length
                            const height = Math.max(10, (count / (db.letters.length || 1)) * 100)
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div
                                        className="w-full bg-primary/10 rounded-t-sm group-hover:bg-primary transition-all duration-300"
                                        style={{ height: `${height}%` }}
                                    />
                                    <span className="text-[10px] text-muted-foreground font-medium">
                                        {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
                                    </span>
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
