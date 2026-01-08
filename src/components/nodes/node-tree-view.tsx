'use client'

import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, ZoomIn, ZoomOut, Maximize, Move } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
        <div className={`relative z-10 flex flex-col items-center p-6 bg-card border rounded-xl shadow-sm w-72 transition-all ${isCurrentNode ? 'ring-2 ring-primary' : isParent ? 'border-primary/50' : 'border-border'
            }`}>
            <div className={`p-3 rounded-full mb-4 ${isCurrentNode ? 'bg-primary/10 text-primary' : isParent ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                <User className="size-6" />
            </div>

            <div className="text-center w-full">
                <h4 className="font-semibold text-foreground text-lg truncate">{node.name}</h4>
                <p className="text-sm text-muted-foreground truncate mt-1">{node.position}</p>
                <p className="text-xs text-muted-foreground/70 truncate mt-2">{node.email}</p>
            </div>

            {isCurrentNode && (
                <Badge className="mt-4">You</Badge>
            )}
            {isParent && (
                <Badge variant="secondary" className="mt-4">Superior</Badge>
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
                    <div className="w-0.5 h-12 bg-muted-foreground/30" />

                    {/* Horizontal line covering all children */}
                    <div className="relative flex justify-center">
                        <div className="flex gap-12">
                            {node.children!.map((child, index) => (
                                <div key={child.id} className="flex flex-col items-center relative">
                                    {/* Vertical line to child */}
                                    <div className="w-0.5 h-12 bg-muted-foreground/30" />

                                    {/* Horizontal connector logic for multiple children */}
                                    {node.children!.length > 1 && (
                                        <div className={`absolute top-0 h-0.5 bg-muted-foreground/30 ${index === 0 ? 'left-1/2 right-0 w-1/2' :
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
    const [scale, setScale] = useState(1)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const containerRef = useRef<HTMLDivElement>(null)

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 2))
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.3))
    const handleReset = () => {
        setScale(1)
        setPosition({ x: 0, y: 0 })
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return // Only left click
        setIsDragging(true)
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return
        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        })
    }

    const handleMouseUp = () => setIsDragging(false)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const handleWheelRaw = (e: WheelEvent) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault()
                const delta = e.deltaY > 0 ? -0.1 : 0.1
                setScale(prev => Math.max(Math.min(prev + delta, 2), 0.3))
            }
        }

        container.addEventListener('wheel', handleWheelRaw, { passive: false })
        return () => container.removeEventListener('wheel', handleWheelRaw)
    }, [])

    return (
        <div className="relative w-full h-[750px] border rounded-xl bg-background overflow-hidden select-none cursor-grab active:cursor-grabbing shadow-inner group"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            ref={containerRef}
            style={{
                backgroundImage: `radial-gradient(circle, var(--grid-color) 1px, transparent 1px)`,
                backgroundSize: `${24 * scale}px ${24 * scale}px`,
                backgroundPosition: `${position.x}px ${position.y}px`,
            }}
        >
            {/* Controls */}
            <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
                <div className="flex flex-col bg-card border rounded-lg shadow-lg p-1">
                    <Button variant="ghost" size="icon" onClick={handleZoomIn} className="h-8 w-8 rounded-md hover:bg-muted" title="Zoom In">
                        <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleZoomOut} className="h-8 w-8 rounded-md hover:bg-muted" title="Zoom Out">
                        <ZoomOut className="h-4 w-4" />
                    </Button>
                    <div className="h-px bg-border mx-1 my-1" />
                    <Button variant="ghost" size="icon" onClick={handleReset} className="h-8 w-8 rounded-md hover:bg-muted" title="Reset View">
                        <Maximize className="h-4 w-4" />
                    </Button>
                </div>
                <div className="bg-card border rounded-lg shadow-md px-2 py-1.5 text-[10px] font-bold text-muted-foreground flex items-center gap-2 backdrop-blur-sm">
                    <Move className="h-3.5 w-3.5" /> DRAG TO PAN
                </div>
            </div>

            {/* Tree Container */}
            <div
                className="absolute inset-0 flex items-center justify-center p-24 transition-transform duration-75 ease-out origin-center"
                style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                }}
            >
                <div className="flex flex-col items-center">
                    {treeData.parent && (
                        <div className="flex flex-col items-center">
                            <NodeCard node={treeData.parent} isCurrentNode={false} isParent={true} />
                            <div className="w-0.5 h-12 bg-muted-foreground/30" />
                        </div>
                    )}

                    <TreeNode node={treeData.node} currentNodeId={currentNodeId} />
                </div>
            </div>
        </div>
    )
}
