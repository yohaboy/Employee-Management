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
    DRAFT: 'bg-slate-500',
    SENT: 'bg-blue-500',
    SIGNED: 'bg-green-500',
    RESPONDED: 'bg-purple-500',
}

export function LettersTable({ letters, currentNodeId, type }: LettersTableProps) {
    if (letters.length === 0) {
        return (
            <div className="text-center py-12 text-slate-400">
                <p>No letters found</p>
            </div>
        )
    }

    return (
        <div className="rounded-lg border border-slate-700 overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-900/50 hover:bg-slate-900/50 border-slate-700">
                        <TableHead className="text-slate-300">Subject</TableHead>
                        <TableHead className="text-slate-300">
                            {type === 'received' ? 'From' : 'To'}
                        </TableHead>
                        <TableHead className="text-slate-300">Status</TableHead>
                        <TableHead className="text-slate-300">Date</TableHead>
                        <TableHead className="text-slate-300 text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {letters.map((letter) => {
                        const otherParty = type === 'received' ? letter.sender : letter.receiver

                        return (
                            <TableRow
                                key={letter.id}
                                className="border-slate-700 hover:bg-slate-700/30"
                            >
                                <TableCell className="font-medium text-white">
                                    {letter.subject}
                                </TableCell>
                                <TableCell className="text-slate-300">
                                    <div>
                                        <p className="font-medium">{otherParty.name}</p>
                                        <p className="text-xs text-slate-500">{otherParty.position}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge className={`${statusColors[letter.status]} text-white`}>
                                        {letter.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-slate-400 text-sm">
                                    {formatDistanceToNow(new Date(letter.createdAt), { addSuffix: true })}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Link href={`/dashboard/letters/${letter.id}`}>
                                        <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                                            <Eye className="w-4 h-4 mr-1" />
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
