import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/db'
import { getVisibleNodeIds, getDescendantIds } from '@/lib/hierarchy'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Send, FileCheck, Users, Activity } from 'lucide-react'
import { RecentLetters } from '@/components/dashboard/recent-letters'
import { AuditLogList } from '@/components/dashboard/audit-log-list'

export default async function DashboardPage() {
    const currentNode = await requireAuth()
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
            title: 'Received Letters',
            value: receivedCount,
            icon: Mail,
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10',
        },
        {
            title: 'Sent Letters',
            value: sentCount,
            icon: Send,
            color: 'text-green-500',
            bgColor: 'bg-green-500/10',
        },
        {
            title: 'Signed Letters',
            value: signedCount,
            icon: FileCheck,
            color: 'text-purple-500',
            bgColor: 'bg-purple-500/10',
        },
        {
            title: 'Direct Reports',
            value: childrenCount,
            icon: Users,
            color: 'text-orange-500',
            bgColor: 'bg-orange-500/10',
        },
    ]

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-4xl font-black text-foreground mb-2 uppercase tracking-tighter">Welcome back, {currentNode.name}</h2>
                <p className="text-muted-foreground font-medium">Here's what's happening in your workspace</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-none border-2 border-black dark:border-white ${stat.bgColor}`}>
                                    <Icon className={`w-4 h-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-black text-foreground">{stat.value}</div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                            <Mail className="w-6 h-6" />
                            Recent Letters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RecentLetters letters={recentLetters} currentNodeId={currentNode.id} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                            <Activity className="w-6 h-6" />
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AuditLogList nodeId={currentNode.id} limit={5} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
