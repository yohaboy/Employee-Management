import { requireAuth } from '@/lib/auth'
import { getNodeTree, canViewLetter, getVisibleNodeIds } from '@/lib/hierarchy'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Mail, X, ArrowRight } from 'lucide-react'
import { NodeTreeView } from '@/components/nodes/node-tree-view'
import { db } from '@/lib/db'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Suspense } from 'react'

export default async function NodesPage({
    searchParams
}: {
    searchParams: Promise<{ nodeId?: string }>
}) {
    const { nodeId } = await searchParams
    const currentNode = await requireAuth()
    const treeData = await getNodeTree(currentNode.id)

    if (!treeData) {
        return (
            <div className="text-center py-12 text-slate-400">
                <p>Unable to load hierarchy data</p>
            </div>
        )
    }

    // Fetch details for selected node if exists
    let selectedNode = null
    let nodeLetters: any[] = []

    if (nodeId) {
        selectedNode = db.nodes.find(n => n.id === nodeId)
        if (selectedNode) {
            const visibleNodeIds = await getVisibleNodeIds(currentNode.id)

            // Filter letters for this node that the current user can see
            nodeLetters = db.letters
                .filter(l => (l.senderId === nodeId || l.receiverId === nodeId))
                .filter(l => visibleNodeIds.includes(l.senderId) || visibleNodeIds.includes(l.receiverId))
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .map(l => {
                    const sender = db.nodes.find(n => n.id === l.senderId)
                    const receiver = db.nodes.find(n => n.id === l.receiverId)
                    return {
                        ...l,
                        senderName: sender?.name,
                        receiverName: receiver?.name
                    }
                })
        }
    }

    return (
        <div key={nodeId || 'root'} className="space-y-6 animate-in fade-in duration-500 bg-dot-pattern min-h-[80vh] rounded-xl p-4">
            <Card className="border-none shadow-sm ring-1 ring-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Users className="size-5 text-primary" />
                        Organization Hierarchy
                    </CardTitle>
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                        Interactive View
                    </div>
                </CardHeader>
                <CardContent className="p-0 overflow-hidden">
                    <Suspense fallback={
                        <div className="h-[750px] w-full flex items-center justify-center bg-muted/10">
                            <div className="flex flex-col items-center gap-2">
                                <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                <p className="text-sm text-muted-foreground font-medium">Loading hierarchy...</p>
                            </div>
                        </div>
                    }>
                        <NodeTreeView treeData={treeData} currentNodeId={currentNode.id} />
                    </Suspense>
                </CardContent>
            </Card>

            {selectedNode && (
                <Card id="node-details-panel" className="border-none shadow-lg ring-1 ring-primary/20 animate-in slide-in-from-bottom-4 duration-300">
                    <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30">
                        <div className="flex items-center gap-4">
                            <div className="p-2 rounded-full bg-primary/10 text-primary">
                                <Users className="size-5" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-bold">{selectedNode.name}</CardTitle>
                                <p className="text-sm text-muted-foreground font-medium">{selectedNode.position}</p>
                            </div>
                        </div>
                        <Link href="/dashboard/nodes" scroll={false}>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <X className="size-5" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Contact Information</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between py-2 border-b border-dashed">
                                        <span className="text-sm text-muted-foreground">Email</span>
                                        <span className="text-sm font-medium">{selectedNode.email}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-dashed">
                                        <span className="text-sm text-muted-foreground">Joined</span>
                                        <span className="text-sm font-medium">{format(selectedNode.createdAt, 'PPP')}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Communication History</h3>
                                {nodeLetters.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-8 bg-muted/20 rounded-xl border border-dashed">
                                        <Mail className="size-8 text-muted-foreground/30 mb-2" />
                                        <p className="text-sm text-muted-foreground">No accessible letters found</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {nodeLetters.slice(0, 5).map((letter) => (
                                            <Link
                                                key={letter.id}
                                                href={`/dashboard/letters/${letter.id}`}
                                                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:border-primary/30 hover:shadow-sm transition-all group"
                                            >
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-sm font-bold truncate">{letter.subject}</span>
                                                    <span className="text-[10px] text-muted-foreground uppercase">
                                                        {letter.senderId === selectedNode.id ? `To: ${letter.receiverName}` : `From: ${letter.senderName}`}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Badge variant="outline" className="text-[10px] font-bold">
                                                        {letter.status}
                                                    </Badge>
                                                    <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                </div>
                                            </Link>
                                        ))}
                                        {nodeLetters.length > 5 && (
                                            <p className="text-center text-xs text-muted-foreground pt-2">
                                                Showing 5 of {nodeLetters.length} letters
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
