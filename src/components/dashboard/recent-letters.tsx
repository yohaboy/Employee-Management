import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Mail } from 'lucide-react'

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
    DRAFT: 'bg-slate-100 text-slate-700',
    SENT: 'bg-blue-100 text-blue-700',
    SIGNED: 'bg-emerald-100 text-emerald-700',
    RESPONDED: 'bg-purple-100 text-purple-700',
}

export function RecentLetters({ letters, currentNodeId }: RecentLettersProps) {
    if (letters.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm font-medium">No recent communications</p>
            </div>
        )
    }

    return (
        <div className="space-y-1">
            {letters.map((letter) => {
                const isSender = letter.senderId === currentNodeId
                const otherParty = isSender ? letter.receiver : letter.sender

                return (
                    <Link
                        key={letter.id}
                        href={`/dashboard/letters/${letter.id}`}
                        className="flex items-center justify-between py-4 hover:bg-muted/30 transition-colors group px-2 -mx-2 rounded-lg"
                    >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="size-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                                <Mail className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                                    {letter.subject}
                                </h4>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {isSender ? 'To' : 'From'}: <span className="font-semibold text-foreground/80">{otherParty.name}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 ml-4">
                            <Badge variant="outline" className={`${statusColors[letter.status]} border-none font-bold text-[10px] px-2 py-0.5 rounded-full`}>
                                {letter.status}
                            </Badge>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider hidden sm:block">
                                {formatDistanceToNow(new Date(letter.createdAt), { addSuffix: true })}
                            </span>
                            <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}
