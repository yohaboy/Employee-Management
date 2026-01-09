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
    DRAFT: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
    SENT: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    SIGNED: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    RESPONDED: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
}

export function RecentLetters({ letters, currentNodeId }: RecentLettersProps) {
    if (letters.length === 0) {
        return (
            <div className="text-center py-10 bg-muted/30 rounded-lg border border-dashed border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">No recent communications</p>
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
                        className="flex items-center justify-between py-4 hover:bg-muted/50 transition-colors group px-3 -mx-3 rounded-lg relative overflow-hidden"
                    >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="size-10 rounded bg-muted/50 border border-border flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                                <Mail className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm text-foreground tracking-tight truncate group-hover:text-primary transition-colors">
                                    {letter.subject}
                                </h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                        {isSender ? 'Recipient' : 'Sender'}
                                    </span>
                                    <span className="text-border text-[10px]">•</span>
                                    <p className="text-xs font-medium text-foreground/70 truncate">
                                        {otherParty.name}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 ml-4">
                            <div className="hidden md:flex flex-col items-end gap-1">
                                <Badge variant="outline" className={`${statusColors[letter.status]} border-none font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded`}>
                                    {letter.status}
                                </Badge>
                                <span className="text-[10px] font-medium text-muted-foreground/60">
                                    {formatDistanceToNow(new Date(letter.createdAt), { addSuffix: true })}
                                </span>
                            </div>
                            <div className="p-1.5 rounded bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}

