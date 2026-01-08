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
    DRAFT: 'bg-slate-100 text-slate-700 border-slate-200',
    SENT: 'bg-blue-100 text-blue-700 border-blue-200',
    SIGNED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    RESPONDED: 'bg-purple-100 text-purple-700 border-purple-200',
}

export function LettersTable({ letters, currentNodeId, type }: LettersTableProps) {
    if (letters.length === 0) {
        return (
            <div className="text-center py-20 bg-muted/10 border border-dashed rounded-xl">
                <p className="text-sm font-medium text-muted-foreground">No letters found in this section</p>
            </div>
        )
    }

    return (
        <div className="border rounded-xl overflow-hidden shadow-sm bg-background">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/30 border-b">
                        <TableHead className="text-xs font-semibold text-muted-foreground">Subject</TableHead>
                        <TableHead className="text-xs font-semibold text-muted-foreground">Category</TableHead>
                        <TableHead className="text-xs font-semibold text-muted-foreground">
                            {type === 'received' ? 'From' : 'To'}
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-muted-foreground">Status</TableHead>
                        <TableHead className="text-xs font-semibold text-muted-foreground">Date</TableHead>
                        <TableHead className="text-right text-xs font-semibold text-muted-foreground">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {letters.map((letter) => {
                        const otherParty = type === 'received' ? letter.sender : letter.receiver

                        return (
                            <TableRow
                                key={letter.id}
                                className="hover:bg-muted/20 transition-colors border-b last:border-0"
                            >
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <span className="font-semibold text-sm">{letter.subject}</span>
                                        {letter.parentId && (
                                            <span className="text-[10px] font-medium bg-primary/5 text-primary px-2 py-0.5 rounded-full w-fit">Reply</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-[10px] font-medium text-muted-foreground border px-2 py-1 rounded-md bg-muted/10">
                                        {letter.category?.replace('_', ' ') || 'GENERAL'}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <p className="text-sm font-semibold">{otherParty.name}</p>
                                        <p className="text-[10px] text-muted-foreground font-medium">{otherParty.position}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={`${statusColors[letter.status]} border rounded-full font-semibold text-[10px] px-2.5 py-0.5`}>
                                        {letter.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-[10px] font-medium">
                                    {formatDistanceToNow(new Date(letter.createdAt), { addSuffix: true })}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Link href={`/dashboard/letters/${letter.id}`}>
                                        <Button variant="ghost" size="sm" className="rounded-lg h-8 text-xs font-medium hover:bg-muted">
                                            <Eye className="size-3.5 mr-2" />
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
