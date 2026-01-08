import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Eye } from 'lucide-react'
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
            <div className="text-center py-24 bg-muted/5 border border-dashed border-border/50 rounded-2xl">
                <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">No communications found</p>
            </div>
        )
    }

    return (
        <div className="border border-border/50 rounded-2xl overflow-hidden shadow-2xl shadow-foreground/[0.02] bg-background">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/10 border-b border-border/50 hover:bg-muted/10">
                        <TableHead className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] h-14 px-4 md:px-6">Subject</TableHead>
                        <TableHead className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] h-14 px-6 hidden lg:table-cell">Category</TableHead>
                        <TableHead className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] h-14 px-4 md:px-6">
                            {type === 'received' ? 'Sender' : 'Recipient'}
                        </TableHead>
                        <TableHead className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] h-14 px-6 hidden sm:table-cell">Status</TableHead>
                        <TableHead className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] h-14 px-6 hidden md:table-cell">Date</TableHead>
                        <TableHead className="text-right text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] h-14 px-4 md:px-6">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {letters.map((letter) => {
                        const otherParty = type === 'received' ? letter.sender : letter.receiver

                        return (
                            <TableRow
                                key={letter.id}
                                className="hover:bg-muted/20 transition-all border-b border-border/50 last:border-0 group"
                            >
                                <TableCell className="px-4 md:px-6 py-4 md:py-5">
                                    <div className="flex flex-col gap-1.5">
                                        <span className="font-black text-sm tracking-tight group-hover:text-primary transition-colors truncate max-w-[150px] md:max-w-none">{letter.subject}</span>
                                        {letter.parentId && (
                                            <span className="text-[9px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-md w-fit uppercase tracking-widest">Reply</span>
                                        )}
                                        <div className="sm:hidden mt-1">
                                            <Badge variant="outline" className={`${statusColors[letter.status]} border-none font-black text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-md shadow-sm`}>
                                                {letter.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-5 hidden lg:table-cell">
                                    <span className="text-[9px] font-black text-muted-foreground/60 border border-border/50 px-2.5 py-1 rounded-md bg-muted/30 uppercase tracking-widest">
                                        {letter.category?.replace('_', ' ') || 'GENERAL'}
                                    </span>
                                </TableCell>
                                <TableCell className="px-4 md:px-6 py-4 md:py-5">
                                    <div className="flex items-center gap-2 md:gap-3">
                                        <div className="size-7 md:size-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground font-black text-[9px] md:text-[10px] group-hover:bg-primary/5 group-hover:text-primary transition-all hidden xs:flex">
                                            {otherParty.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs md:text-sm font-black tracking-tight truncate">{otherParty.name}</p>
                                            <p className="text-[9px] md:text-[10px] text-muted-foreground font-bold uppercase tracking-wider truncate hidden md:block">{otherParty.position}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-5 hidden sm:table-cell">
                                    <Badge variant="outline" className={`${statusColors[letter.status]} border-none font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-md shadow-sm`}>
                                        {letter.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="px-6 py-5 text-muted-foreground/60 text-[10px] font-black uppercase tracking-tighter hidden md:table-cell">
                                    {formatDistanceToNow(new Date(letter.createdAt), { addSuffix: true })}
                                </TableCell>
                                <TableCell className="px-4 md:px-6 py-4 md:py-5 text-right">
                                    <Link href={`/dashboard/letters/${letter.id}`}>
                                        <Button variant="ghost" size="sm" className="rounded-xl h-8 md:h-9 px-3 md:px-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 hover:text-primary transition-all group/btn">
                                            <Eye className="size-3 md:size-3.5 mr-1.5 md:mr-2 group-hover/btn:scale-110 transition-transform" />
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
