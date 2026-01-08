import { requireAuth } from '@/lib/auth'
import { getNodeTree } from '@/lib/hierarchy'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users } from 'lucide-react'
import { NodeTreeView } from '@/components/nodes/node-tree-view'

export default async function NodesPage() {
    const currentNode = await requireAuth()
    const treeData = await getNodeTree(currentNode.id)

    if (!treeData) {
        return (
            <div className="text-center py-12 text-slate-400">
                <p>Unable to load hierarchy data</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Organization Hierarchy</h2>
                <p className="text-muted-foreground">View your position in the organizational structure</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="size-5" />
                        Hierarchy Tree
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0 overflow-hidden">
                    <NodeTreeView treeData={treeData} currentNodeId={currentNode.id} />
                </CardContent>
            </Card>
        </div>
    )
}
