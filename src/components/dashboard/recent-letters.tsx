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
    DRAFT: 'bg-muted text-muted-foreground',
    SENT: 'bg-primary text-primary-foreground',
    SIGNED: 'bg-green-500 text-white',
    RESPONDED: 'bg-purple-500 text-white',
}

export function RecentLetters({ letters, currentNodeId }: RecentLettersProps) {
    if (letters.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <p>No letters yet</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {letters.map((letter) => {
                const isSender = letter.senderId === currentNodeId
                const otherParty = isSender ? letter.receiver : letter.sender

                return (
                    <Link
                        key={letter.id}
                        href={`/dashboard/letters/${letter.id}`}
                        className="block p-4 rounded-none border-2 border-border hover:border-primary hover:bg-primary/5 transition-all group active:translate-x-[1px] active:translate-y-[1px]"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-foreground truncate group-hover:text-primary transition-colors uppercase tracking-tight">
                                    {letter.subject}
                                </h4>
                                <p className="text-sm text-muted-foreground font-medium">
                                    {isSender ? 'TO' : 'FROM'}: {otherParty.name} <span className="text-xs opacity-70">({otherParty.position})</span>
                                </p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge className={`${statusColors[letter.status]} rounded-none font-bold text-[10px] uppercase tracking-widest px-2 py-0.5`}>
                                {letter.status}
                            </Badge>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                {formatDistanceToNow(new Date(letter.createdAt), { addSuffix: true })}
                            </span>
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}
