import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'

interface Letter {
    id: string
    subject: string
    status: string
    createdAt: Date
    senderId: string
    receiverId: string
    sender: {
        name: string
        position: string
    }
    receiver: {
        name: string
        position: string
    }
    signature: any
}

interface RecentLettersProps {
    letters: Letter[]
    currentNodeId: string
}

const statusColors: Record<string, string> = {
    DRAFT: 'bg-slate-500',
    SENT: 'bg-blue-500',
    SIGNED: 'bg-green-500',
    RESPONDED: 'bg-purple-500',
}

export function RecentLetters({ letters, currentNodeId }: RecentLettersProps) {
    if (letters.length === 0) {
        return (
            <div className="text-center py-8 text-slate-400">
                <p>No letters yet</p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {letters.map((letter) => {
                const isSender = letter.senderId === currentNodeId
                const otherParty = isSender ? letter.receiver : letter.sender

                return (
                    <Link
                        key={letter.id}
                        href={`/dashboard/letters/${letter.id}`}
                        className="block p-4 rounded-lg border border-slate-700 hover:border-slate-600 hover:bg-slate-700/30 transition-all group"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-white truncate group-hover:text-blue-400 transition-colors">
                                    {letter.subject}
                                </h4>
                                <p className="text-sm text-slate-400">
                                    {isSender ? 'To' : 'From'}: {otherParty.name} ({otherParty.position})
                                </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors flex-shrink-0 ml-2" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className={`${statusColors[letter.status]} text-white text-xs`}>
                                {letter.status}
                            </Badge>
                            <span className="text-xs text-slate-500">
                                {formatDistanceToNow(new Date(letter.createdAt), { addSuffix: true })}
                            </span>
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}
