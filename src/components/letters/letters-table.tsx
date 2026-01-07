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
            <div className="text-center py-12 text-muted-foreground">
                <p>No letters found</p>
            </div>
        )
    }

    return (
        <div className="rounded-none border-2 border-border overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50 border-b-2 border-border">
                        <TableHead className="text-foreground font-black uppercase tracking-widest text-xs">Subject</TableHead>
                        <TableHead className="text-foreground font-black uppercase tracking-widest text-xs">
                            {type === 'received' ? 'From' : 'To'}
                        </TableHead>
                        <TableHead className="text-foreground font-black uppercase tracking-widest text-xs">Status</TableHead>
                        <TableHead className="text-foreground font-black uppercase tracking-widest text-xs">Date</TableHead>
                        <TableHead className="text-foreground font-black uppercase tracking-widest text-xs text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {letters.map((letter) => {
                        const otherParty = type === 'received' ? letter.sender : letter.receiver

                        return (
                            <TableRow
                                key={letter.id}
                                className="border-b-2 border-border hover:bg-muted/30 transition-colors"
                            >
                                <TableCell className="font-bold text-foreground uppercase tracking-tight">
                                    {letter.subject}
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <p className="font-bold text-foreground">{otherParty.name}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{otherParty.position}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge className={`${statusColors[letter.status]} rounded-none font-bold text-[10px] uppercase tracking-widest px-2 py-0.5`}>
                                        {letter.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-xs font-bold uppercase tracking-tight">
                                    {formatDistanceToNow(new Date(letter.createdAt), { addSuffix: true })}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Link href={`/dashboard/letters/${letter.id}`}>
                                        <Button variant="outline" size="sm" className="font-bold uppercase tracking-widest text-[10px]">
                                            <Eye className="w-3 h-3 mr-1" />
                                            View
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
