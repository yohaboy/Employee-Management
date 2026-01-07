import { getCurrentNode } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { getVisibleNodeIds, getDescendantIds } from '@/lib/hierarchy'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Send, FileCheck, Users, Activity, DollarSign, CreditCard, Calendar as CalendarIcon } from 'lucide-react'
import { RecentLetters } from '@/components/dashboard/recent-letters'
import { AuditLogList } from '@/components/dashboard/audit-log-list'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
    const currentNode = await getCurrentNode()

    if (!currentNode) {
        redirect('/login')
    }
    const visibleNodeIds = await getVisibleNodeIds(currentNode.id)
    const descendantIds = await getDescendantIds(currentNode.id)

    // Get statistics
    const receivedCount = db.letters.filter(l =>
        l.receiverId === currentNode.id &&
        ['SENT', 'SIGNED', 'RESPONDED'].includes(l.status)
    ).length

    const sentCount = db.letters.filter(l => l.senderId === currentNode.id).length

    const signedCount = db.letters.filter(l =>
        l.receiverId === currentNode.id &&
        ['SIGNED', 'RESPONDED'].includes(l.status)
    ).length

    const childrenCount = db.nodes.filter(n => n.parentId === currentNode.id).length

    // Get recent letters (sent or received by visible nodes)
    const recentLetters = db.letters
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
            title: 'Total Revenue',
            value: '$45,231.89',
            trend: '+20.1% from last month',
            icon: DollarSign,
        },
        {
            title: 'Subscriptions',
            value: '+2350',
            trend: '+180.1% from last month',
            icon: Users,
        },
        {
            title: 'Sales',
            value: '+12,234',
            trend: '+19% from last month',
            icon: CreditCard,
        },
        {
            title: 'Active Now',
            value: '+573',
            trend: '+201 from last hour',
            icon: Activity,
        },
    ]

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-1">Dashboard</h2>
                    <div className="flex items-center gap-2">
                        <Tabs defaultValue="overview" className="w-auto">
                            <TabsList className="bg-transparent p-0 h-auto gap-1">
                                {['Overview', 'Analytics', 'Reports', 'Notifications'].map((tab) => (
                                    <TabsTrigger
                                        key={tab}
                                        value={tab.toLowerCase()}
                                        className="rounded-full px-4 py-1.5 text-xs font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-border transition-all"
                                    >
                                        {tab}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-1.5 text-xs font-medium shadow-sm">
                        <CalendarIcon className="size-3.5 text-muted-foreground" />
                        <span>Oct 17, 2024 - Nov 6, 2024</span>
                    </div>
                    <Button size="sm" className="rounded-lg px-4 font-semibold">
                        Download
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Card key={stat.title} className="border-none shadow-sm ring-1 ring-border/50">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    {stat.title}
                                </CardTitle>
                                <Icon className="size-4 text-muted-foreground/50" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
                                <p className="text-[10px] text-muted-foreground mt-1 font-medium">
                                    {stat.trend}
                                </p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-none shadow-sm ring-1 ring-border/50">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-sm font-bold">Overview</CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">Monthly revenue performance</p>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
                            <span>$6000</span>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="flex items-end justify-between h-48 gap-2 px-2">
                            {[40, 60, 30, 45, 90, 55, 65, 75, 35, 40, 80, 50].map((height, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div
                                        className="w-full bg-primary/10 rounded-t-sm group-hover:bg-primary transition-all duration-300"
                                        style={{ height: `${height}%` }}
                                    />
                                    <span className="text-[10px] text-muted-foreground font-medium">
                                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm ring-1 ring-border/50">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-sm font-bold">Leads-to-clients</CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">Conversion funnel performance</p>
                        </div>
                        <Button variant="outline" size="sm" className="h-7 text-[10px] rounded-full px-3">Visit all</Button>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4">
                        {[
                            { label: 'Lead', value: 83, count: 286 },
                            { label: 'Qualified', value: 83, count: 286 },
                            { label: 'Proposal', value: 45, count: 286 },
                            { label: 'Negotiation', value: 65, count: 286 },
                        ].map((item) => (
                            <div key={item.label} className="space-y-2">
                                <div className="flex items-center justify-between text-[10px] font-bold">
                                    <span className="text-muted-foreground uppercase tracking-wider">{item.label}</span>
                                    <span>{item.count} ({item.value}%)</span>
                                </div>
                                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full"
                                        style={{ width: `${item.value}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-none shadow-sm ring-1 ring-border/50">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-bold">Recent project</CardTitle>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="h-8 text-[10px] rounded-lg">Filter Projects...</Button>
                            <Button variant="outline" size="sm" className="h-8 text-[10px] rounded-lg">Status</Button>
                            <Button variant="outline" size="sm" className="h-8 text-[10px] rounded-lg">Priority</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <RecentLetters letters={recentLetters} currentNodeId={currentNode.id} />
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm ring-1 ring-border/50">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold">To-do lists</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">Manage your todays works here.</p>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4">
                        {[
                            { label: 'Strictly Necessary', desc: 'These cookies are essential in order to use the website and use its features.' },
                            { label: 'Functional Cookies', desc: 'These cookies allow the website to provide personalized functionality.' },
                            { label: 'Performance Cookies', desc: 'These cookies help to improve the performance of the website.' },
                        ].map((item) => (
                            <div key={item.label} className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold">{item.label}</p>
                                    <p className="text-[10px] text-muted-foreground leading-relaxed">{item.desc}</p>
                                </div>
                                <div className="h-5 w-9 bg-primary rounded-full p-0.5 flex items-center justify-end">
                                    <div className="h-4 w-4 bg-white rounded-full shadow-sm" />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
