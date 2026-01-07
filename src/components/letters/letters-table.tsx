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
    SIGNED: 'bg-green-500/10 text-green-600 border-green-200',
    RESPONDED: 'bg-purple-500/10 text-purple-600 border-purple-200',
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
        <div className="rounded-md border overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead>Subject</TableHead>
                        <TableHead>
                            {type === 'received' ? 'From' : 'To'}
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {letters.map((letter) => {
                        const otherParty = type === 'received' ? letter.sender : letter.receiver

                        return (
                            <TableRow
                                key={letter.id}
                                className="hover:bg-muted/30 transition-colors"
                            >
                                <TableCell className="font-medium">
                                    {letter.subject}
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <p className="font-medium">{otherParty.name}</p>
                                        <p className="text-xs text-muted-foreground">{otherParty.position}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={statusColors[letter.status]}>
                                        {letter.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-xs">
                                    {formatDistanceToNow(new Date(letter.createdAt), { addSuffix: true })}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Link href={`/dashboard/letters/${letter.id}`}>
                                        <Button variant="outline" size="sm">
                                            <Eye className="size-3 mr-1" />
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
