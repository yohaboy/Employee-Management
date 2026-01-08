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
    DRAFT: 'bg-muted text-muted-foreground',
    SENT: 'bg-primary text-primary-foreground',
    SIGNED: 'bg-green-500 text-white',
    RESPONDED: 'bg-purple-500 text-white',
}

export function LettersTable({ letters, currentNodeId, type }: LettersTableProps) {
    if (letters.length === 0) {
        return (
            <div className="text-center py-20 bg-muted/10 border-2 border-dashed border-foreground/10">
                <p className="font-black uppercase tracking-widest text-muted-foreground">No letters found in this section</p>
            </div>
        )
    }

    return (
        <div className="border-2 border-foreground overflow-hidden shadow-brutal-sm">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted border-b-2 border-foreground">
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground">Subject</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground">Category</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground">
                            {type === 'received' ? 'From' : 'To'}
                        </TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground">Status</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground">Date</TableHead>
                        <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-foreground">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {letters.map((letter) => {
                        const otherParty = type === 'received' ? letter.sender : letter.receiver

                        return (
                            <TableRow
                                key={letter.id}
                                className="hover:bg-muted/30 transition-colors border-b-2 border-foreground/5 last:border-0"
                            >
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-base uppercase tracking-tight">{letter.subject}</span>
                                        {letter.parentId && (
                                            <span className="text-[9px] font-black bg-primary/10 text-primary px-1.5 py-0.5 w-fit uppercase tracking-widest">Reply</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-[10px] font-bold uppercase tracking-widest border border-foreground/20 px-2 py-1">
                                        {letter.category?.replace('_', ' ') || 'GENERAL'}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <p className="font-black uppercase tracking-tighter">{otherParty.name}</p>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{otherParty.position}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge className={`${statusColors[letter.status]} rounded-none font-black text-[10px] uppercase tracking-widest px-2 py-0.5`}>
                                        {letter.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                                    {formatDistanceToNow(new Date(letter.createdAt), { addSuffix: true })}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Link href={`/dashboard/letters/${letter.id}`}>
                                        <Button variant="outline" size="sm" className="rounded-none border-2 border-foreground font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all">
                                            <Eye className="size-3 mr-2" />
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
