'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
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

function TreeNode({ node, currentNodeId, level = 0 }: { node: Node; currentNodeId: string; level?: number }) {
    const [isExpanded, setIsExpanded] = useState(true)
    const hasChildren = node.children && node.children.length > 0
    const isCurrentNode = node.id === currentNodeId

    return (
        <div className="space-y-2">
            <div
                className={`flex items-start gap-3 p-4 rounded-lg border transition-all ${isCurrentNode
                        ? 'border-blue-600 bg-blue-900/30'
                        : 'border-slate-700 bg-slate-900/30 hover:bg-slate-700/30'
                    }`}
                style={{ marginLeft: `${level * 24}px` }}
            >
                {hasChildren && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mt-1 text-slate-400 hover:text-white transition-colors"
                    >
                        {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                        ) : (
                            <ChevronRight className="w-4 h-4" />
                        )}
                    </button>
                )}
                {!hasChildren && <div className="w-4" />}

                <div className="p-2 rounded-lg bg-blue-600/20 flex-shrink-0">
                    <User className="w-5 h-5 text-blue-400" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-white">{node.name}</h4>
                        {isCurrentNode && (
                            <Badge className="bg-blue-600 text-white text-xs">You</Badge>
                        )}
                    </div>
                    <p className="text-sm text-slate-400">{node.position}</p>
                    <p className="text-xs text-slate-500">{node.email}</p>
                    <p className="text-xs text-slate-600 mt-1">
                        Joined {format(new Date(node.createdAt), 'PP')}
                    </p>
                </div>

                {hasChildren && (
                    <Badge variant="outline" className="border-slate-600 text-slate-400">
                        {node.children!.length} {node.children!.length === 1 ? 'report' : 'reports'}
                    </Badge>
                )}
            </div>

            {hasChildren && isExpanded && (
                <div className="space-y-2">
                    {node.children!.map((child) => (
                        <TreeNode
                            key={child.id}
                            node={child}
                            currentNodeId={currentNodeId}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export function NodeTreeView({ treeData, currentNodeId }: NodeTreeViewProps) {
    return (
        <div className="space-y-6">
            {treeData.parent && (
                <div>
                    <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                        <div className="h-px flex-1 bg-slate-700" />
                        <span>PARENT</span>
                        <div className="h-px flex-1 bg-slate-700" />
                    </h3>
                    <div className="flex items-start gap-3 p-4 rounded-lg border border-slate-700 bg-slate-900/30">
                        <div className="p-2 rounded-lg bg-purple-600/20 flex-shrink-0">
                            <User className="w-5 h-5 text-purple-400" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-medium text-white">{treeData.parent.name}</h4>
                            <p className="text-sm text-slate-400">{treeData.parent.position}</p>
                            <p className="text-xs text-slate-500">{treeData.parent.email}</p>
                        </div>
                        <Badge className="bg-purple-600 text-white">Manager</Badge>
                    </div>
                </div>
            )}

            <div>
                <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                    <div className="h-px flex-1 bg-slate-700" />
                    <span>YOUR HIERARCHY</span>
                    <div className="h-px flex-1 bg-slate-700" />
                </h3>
                <TreeNode node={treeData.node} currentNodeId={currentNodeId} />
            </div>
        </div>
    )
}
