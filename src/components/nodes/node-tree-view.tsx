'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User } from 'lucide-react'
import { format } from 'date-fns'

interface Node {
    id: string
    name: string
    email: string
    position: string
    createdAt: Date
    children?: Node[]
}

interface NodeTreeViewProps {
    treeData: {
        node: Node
        parent: Node | null
    }
    currentNodeId: string
}

function NodeCard({ node, isCurrentNode, isParent }: { node: Node; isCurrentNode: boolean; isParent?: boolean }) {
    return (
        <div className={`relative z-10 flex flex-col items-center p-6 bg-card border-2 shadow-brutal w-72 transition-all ${isCurrentNode ? 'border-primary' : isParent ? 'border-black dark:border-white' : 'border-border'
            }`}>
            <div className={`p-3 rounded-none mb-4 border-2 border-black dark:border-white ${isCurrentNode ? 'bg-primary/10 text-primary' : isParent ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                <User className="w-8 h-8" />
            </div>

            <div className="text-center w-full">
                <h4 className="font-black text-foreground uppercase tracking-tighter text-lg truncate">{node.name}</h4>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest truncate mt-1">{node.position}</p>
                <p className="text-[10px] font-medium text-muted-foreground/70 truncate mt-2">{node.email}</p>
            </div>

            {isCurrentNode && (
                <Badge className="mt-4 bg-primary text-primary-foreground rounded-none font-black uppercase tracking-widest">You</Badge>
            )}
            {isParent && (
                <Badge className="mt-4 bg-black dark:bg-white text-white dark:text-black rounded-none font-black uppercase tracking-widest">Superior</Badge>
            )}
        </div>
    )
}

function TreeNode({ node, currentNodeId }: { node: Node; currentNodeId: string }) {
    const hasChildren = node.children && node.children.length > 0
    const isCurrentNode = node.id === currentNodeId

    return (
        <div className="flex flex-col items-center">
            <NodeCard node={node} isCurrentNode={isCurrentNode} />

            {hasChildren && (
                <>
                    {/* Vertical line from parent */}
                    <div className="w-1 h-12 bg-border" />

                    {/* Horizontal line covering all children */}
                    <div className="relative flex justify-center">
                        <div className="flex gap-12">
                            {node.children!.map((child, index) => (
                                <div key={child.id} className="flex flex-col items-center relative">
                                    {/* Vertical line to child */}
                                    <div className="w-1 h-12 bg-border" />

                                    {/* Horizontal connector logic for multiple children */}
                                    {node.children!.length > 1 && (
                                        <div className={`absolute top-0 h-1 bg-border ${index === 0 ? 'left-1/2 right-0 w-1/2' :
                                            index === node.children!.length - 1 ? 'left-0 right-1/2 w-1/2' : 'w-full'
                                            }`} />
                                    )}

                                    <TreeNode node={child} currentNodeId={currentNodeId} />
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export function NodeTreeView({ treeData, currentNodeId }: NodeTreeViewProps) {
    return (
        <div className="flex flex-col items-center p-12 overflow-x-auto min-w-full">
            {treeData.parent && (
                <div className="flex flex-col items-center">
                    <NodeCard node={treeData.parent} isCurrentNode={false} isParent={true} />
                    <div className="w-1 h-12 bg-border" />
                </div>
            )}

            <TreeNode node={treeData.node} currentNodeId={currentNodeId} />
        </div>
    )
}
