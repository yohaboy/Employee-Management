import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Eye, Paperclip } from 'lucide-react'
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
    if (letters.length === 0) {
        return (
            <div className="text-center py-20 bg-muted/30 border border-dashed border-border rounded-lg">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">No communications found</p>
            </div>
        )
    }

    return (
        <div className="border border-border rounded-lg overflow-hidden bg-background">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
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
                    {letters.map((letter) => {
                        const otherParty = type === 'received' ? letter.sender : letter.receiver

                        return (
                            <TableRow
                                key={letter.id}
                                className="hover:bg-muted/30 transition-colors border-b border-border last:border-0 group"
                            >
                                <TableCell className="px-4 md:px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-sm tracking-tight group-hover:text-primary transition-colors truncate max-w-[150px] md:max-w-none">{letter.subject}</span>
                                            {letter.attachment && <Paperclip className="size-3 text-muted-foreground" />}
                                        </div>
                                        {letter.parentId && (
                                            <span className="text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded w-fit uppercase tracking-wide">Reply</span>
                                        )}
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
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}

