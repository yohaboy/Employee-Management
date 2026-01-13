'use client'

import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, ZoomIn, ZoomOut, Maximize, Move, Mail, Info, MoreVertical, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SendLetterDialog } from '@/components/letters/send-letter-dialog'

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

function NodeCard({
    node,
    isCurrentNode,
    isParent,
    onSendLetter,
    onSeeDetail
}: {
    node: Node;
    isCurrentNode: boolean;
    isParent?: boolean;
    onSendLetter: (node: Node) => void;
    onSeeDetail: (nodeId: string) => void;
}) {
    return (
        <div className={`group/card relative z-10 flex flex-col items-center p-6 bg-card border rounded-xl shadow-sm w-72 transition-all hover:shadow-md hover:border-primary/30 ${isCurrentNode ? 'ring-2 ring-primary' : isParent ? 'border-primary/50' : 'border-border'
            }`}>

            <div className="absolute top-3 right-3 opacity-0 group-hover/card:opacity-100 transition-opacity">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <MoreVertical className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onSendLetter(node)} className="cursor-pointer">
                            <Send className="mr-2 h-4 w-4" />
                            <span>Send Letter</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onSeeDetail(node.id)} className="cursor-pointer">
                            <Info className="mr-2 h-4 w-4" />
                            <span>See Detail</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className={`p-3 rounded-full mb-4 ${isCurrentNode ? 'bg-primary/10 text-primary' : isParent ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                <User className="size-6" />
            </div>

            <div className="text-center w-full">
                <h4 className="font-semibold text-foreground text-lg truncate">{node.name}</h4>
                <p className="text-sm text-muted-foreground truncate mt-1">{node.position}</p>
                <p className="text-xs text-muted-foreground/70 truncate mt-2">{node.email}</p>
            </div>

            <div className="flex gap-2 mt-4">
                {isCurrentNode && (
                    <Badge>You</Badge>
                )}
                {isParent && (
                    <Badge variant="secondary">Superior</Badge>
                )}
            </div>
        </div>
    )
}

function TreeNode({
    node,
    currentNodeId,
    onSendLetter,
    onSeeDetail
}: {
    node: Node;
    currentNodeId: string;
    onSendLetter: (node: Node) => void;
    onSeeDetail: (nodeId: string) => void;
}) {
    const hasChildren = node.children && node.children.length > 0
    const isCurrentNode = node.id === currentNodeId

    return (
        <div className="flex flex-col items-center">
            <NodeCard
                node={node}
                isCurrentNode={isCurrentNode}
                onSendLetter={onSendLetter}
                onSeeDetail={onSeeDetail}
            />

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

                                    <TreeNode
                                        node={child}
                                        currentNodeId={currentNodeId}
                                        onSendLetter={onSendLetter}
                                        onSeeDetail={onSeeDetail}
                                    />
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
    const router = useRouter()
    const searchParams = useSearchParams()
    const [scale, setScale] = useState(0.7) // Default zoomed out
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [sendLetterRecipient, setSendLetterRecipient] = useState<Node | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 2))
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.3))
    const handleReset = () => {
        setScale(0.7)
        setPosition({ x: 0, y: 0 })
    }

    const handleSeeDetail = (nodeId: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('nodeId', nodeId)
        router.push(`/dashboard/nodes?${params.toString()}`, { scroll: false })
    }

    // Scroll to details when nodeId changes
    useEffect(() => {
        if (searchParams.get('nodeId')) {
            const element = document.getElementById('node-details-panel')
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
        }
    }, [searchParams])

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
        <>
            <div className="relative w-full h-[750px] border rounded-xl bg-background overflow-hidden select-none cursor-grab active:cursor-grabbing shadow-inner group"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                ref={containerRef}
                style={{
                    backgroundImage: `radial-gradient(circle, var(--grid-color) 1.5px, transparent 1.5px)`,
                    backgroundSize: `${32 * scale}px ${32 * scale}px`,
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
                    className={`absolute inset-0 flex items-center justify-center p-24 origin-center ${!isDragging ? 'transition-transform duration-200 ease-out' : ''}`}
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    }}
                >
                    <div className="flex flex-col items-center">
                        {treeData.parent && (
                            <div className="flex flex-col items-center">
                                <NodeCard
                                    node={treeData.parent}
                                    isCurrentNode={false}
                                    isParent={true}
                                    onSendLetter={setSendLetterRecipient}
                                    onSeeDetail={handleSeeDetail}
                                />
                                <div className="w-0.5 h-12 bg-muted-foreground/30" />
                            </div>
                        )}

                        <TreeNode
                            node={treeData.node}
                            currentNodeId={currentNodeId}
                            onSendLetter={setSendLetterRecipient}
                            onSeeDetail={handleSeeDetail}
                        />
                    </div>
                </div>
            </div>

            {sendLetterRecipient && (
                <SendLetterDialog
                    recipient={sendLetterRecipient}
                    open={!!sendLetterRecipient}
                    onOpenChange={(open) => !open && setSendLetterRecipient(null)}
                />
            )}
        </>
    )
}
