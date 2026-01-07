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
                <h2 className="text-3xl font-bold text-white mb-2">Organization Hierarchy</h2>
                <p className="text-slate-400">View your position in the organizational structure</p>
            </div>

            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Hierarchy Tree
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <NodeTreeView treeData={treeData} currentNodeId={currentNode.id} />
                </CardContent>
            </Card>
        </div>
    )
}
