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
            <div className="text-center py-12 bg-muted/5 rounded-2xl border border-dashed border-border/50">
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">No recent communications</p>
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
                        className="flex items-center justify-between py-5 hover:bg-muted/30 transition-all group px-4 -mx-4 rounded-2xl relative overflow-hidden"
                    >
                        <div className="flex items-center gap-5 flex-1 min-w-0">
                            <div className="size-12 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all duration-300">
                                <Mail className="size-5 text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-black text-[15px] text-foreground tracking-tight truncate group-hover:text-primary transition-colors">
                                    {letter.subject}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                        {isSender ? 'Recipient' : 'Sender'}
                                    </span>
                                    <span className="text-border text-[10px]">•</span>
                                    <p className="text-xs font-bold text-foreground/70 truncate">
                                        {otherParty.name}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-8 ml-4">
                            <div className="hidden md:flex flex-col items-end gap-1">
                                <Badge variant="outline" className={`${statusColors[letter.status]} border-none font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-md shadow-sm`}>
                                    {letter.status}
                                </Badge>
                                <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-tighter">
                                    {formatDistanceToNow(new Date(letter.createdAt), { addSuffix: true })}
                                </span>
                            </div>
                            <div className="p-2 rounded-lg bg-muted/30 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}
