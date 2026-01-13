'use client'

import * as React from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Eye, Paperclip, ChevronDown, ChevronRight, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Letter {
    id: string
    subject: string
    status: string
    category?: string
    parentId?: string | null
    createdAt: Date
    senderId: string
    receiverId: string
    sender: {
        id: string
        name: string
        position: string
    }
    receiver: {
        id: string
        name: string
        position: string
    }
    signature: any
    attachment?: string | null
}

interface LettersTableProps {
    letters: Letter[]
    currentNodeId: string
    type: 'received' | 'sent'
}

const statusColors: Record<string, string> = {
    DRAFT: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
    SENT: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    SIGNED: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    RESPONDED: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
}

export function LettersTable({ letters, currentNodeId, type }: LettersTableProps) {
    const [expandedThreads, setExpandedThreads] = React.useState<string[]>([])

    if (letters.length === 0) {
        return (
            <div className="text-center py-20 bg-muted/30 border border-dashed border-border rounded-lg">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">No communications found</p>
            </div>
        )
    }

    const toggleThread = (id: string) => {
        setExpandedThreads(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        )
    }

    // Group letters by thread (root parent ID)
    // For this mock, we'll just group by subject or parentId if available
    // A better way is to find the root parent, but for now let's group by parentId
    const threads: Record<string, Letter[]> = {}
    const rootLetters: Letter[] = []

    letters.forEach(letter => {
        if (!letter.parentId) {
            rootLetters.push(letter)
        } else {
            if (!threads[letter.parentId]) {
                threads[letter.parentId] = []
            }
            threads[letter.parentId].push(letter)
        }
    })

    // If a letter has a parent but the parent isn't in our 'letters' list, 
    // we should treat it as a root for this view
    const orphanedReplies = letters.filter(l => l.parentId && !letters.find(rl => rl.id === l.parentId))
    orphanedReplies.forEach(l => {
        if (!rootLetters.find(rl => rl.id === l.id)) {
            rootLetters.push(l)
        }
    })

    // Sort root letters by date
    rootLetters.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    return (
        <div className="border border-border rounded-lg overflow-hidden bg-background">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
                        <TableHead className="w-[40px]"></TableHead>
                        <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider h-12 px-4 md:px-6">Subject</TableHead>
                        <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider h-12 px-6 hidden lg:table-cell">Category</TableHead>
                        <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider h-12 px-4 md:px-6">
                            {type === 'received' ? 'Sender' : 'Recipient'}
                        </TableHead>
                        <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider h-12 px-6 hidden sm:table-cell">Status</TableHead>
                        <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider h-12 px-6 hidden md:table-cell">Date</TableHead>
                        <TableHead className="text-right text-[11px] font-bold text-muted-foreground uppercase tracking-wider h-12 px-4 md:px-6">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rootLetters.map((letter) => {
                        const otherParty = type === 'received' ? letter.sender : letter.receiver
                        const threadReplies = threads[letter.id] || []
                        const isExpanded = expandedThreads.includes(letter.id)
                        const hasReplies = threadReplies.length > 0

                        return (
                            <React.Fragment key={letter.id}>
                                <TableRow
                                    className={`hover:bg-muted/30 transition-colors border-b border-border last:border-0 group ${isExpanded ? 'bg-muted/20' : ''}`}
                                >
                                    <TableCell className="pl-4 pr-0">
                                        {hasReplies && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-6 rounded-md hover:bg-primary/10 hover:text-primary"
                                                onClick={() => toggleThread(letter.id)}
                                            >
                                                {isExpanded ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
                                            </Button>
                                        )}
                                    </TableCell>
                                    <TableCell className="px-4 md:px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-sm tracking-tight group-hover:text-primary transition-colors truncate max-w-[150px] md:max-w-none">{letter.subject}</span>
                                                {letter.attachment && <Paperclip className="size-3 text-muted-foreground" />}
                                                {hasReplies && (
                                                    <Badge variant="secondary" className="h-4 px-1 text-[9px] font-black bg-primary/10 text-primary border-none">
                                                        {threadReplies.length + 1}
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="sm:hidden mt-1">
                                                <Badge variant="outline" className={`${statusColors[letter.status]} border-none font-bold text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded`}>
                                                    {letter.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 hidden lg:table-cell">
                                        <span className="text-[10px] font-semibold text-muted-foreground/80 border border-border px-2 py-0.5 rounded bg-muted/50 uppercase tracking-wider">
                                            {letter.category?.replace('_', ' ') || 'GENERAL'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-4 md:px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded bg-muted flex items-center justify-center text-muted-foreground font-bold text-[10px] group-hover:bg-primary/10 group-hover:text-primary transition-colors hidden xs:flex">
                                                {otherParty.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold tracking-tight truncate">{otherParty.name}</p>
                                                <p className="text-[11px] text-muted-foreground font-medium truncate hidden md:block">{otherParty.position}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 hidden sm:table-cell">
                                        <Badge variant="outline" className={`${statusColors[letter.status]} border-none font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded`}>
                                            {letter.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-muted-foreground/80 text-[11px] font-medium hidden md:table-cell">
                                        {formatDistanceToNow(new Date(letter.createdAt), { addSuffix: true })}
                                    </TableCell>
                                    <TableCell className="px-4 md:px-6 py-4 text-right">
                                        <Link href={`/dashboard/letters/${letter.id}`}>
                                            <Button variant="ghost" size="sm" className="h-8 px-3 text-[11px] font-bold uppercase tracking-wider hover:bg-primary/10 hover:text-primary transition-colors">
                                                <Eye className="size-3.5 mr-1.5" />
                                                Open
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>

                                {isExpanded && threadReplies.map((reply) => {
                                    const replyOtherParty = type === 'received' ? reply.sender : reply.receiver
                                    return (
                                        <TableRow key={reply.id} className="bg-muted/5 border-b border-border/50 hover:bg-muted/10 transition-colors">
                                            <TableCell className="pl-10 pr-0">
                                                <MessageSquare className="size-3 text-muted-foreground/50" />
                                            </TableCell>
                                            <TableCell className="px-4 md:px-6 py-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-medium text-muted-foreground italic">Re: {reply.subject}</span>
                                                    {reply.attachment && <Paperclip className="size-3 text-muted-foreground/50" />}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-3 hidden lg:table-cell"></TableCell>
                                            <TableCell className="px-4 md:px-6 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="size-6 rounded bg-muted/50 flex items-center justify-center text-muted-foreground font-bold text-[8px]">
                                                        {replyOtherParty.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <span className="text-xs font-medium">{replyOtherParty.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-3 hidden sm:table-cell">
                                                <Badge variant="outline" className={`${statusColors[reply.status]} border-none font-bold text-[8px] uppercase tracking-wider px-1.5 py-0 rounded`}>
                                                    {reply.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-6 py-3 text-muted-foreground/60 text-[10px] font-medium hidden md:table-cell">
                                                {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                                            </TableCell>
                                            <TableCell className="px-4 md:px-6 py-3 text-right">
                                                <Link href={`/dashboard/letters/${reply.id}`}>
                                                    <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] font-bold uppercase tracking-wider hover:bg-primary/5">
                                                        Open
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </React.Fragment>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
