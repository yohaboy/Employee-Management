import { notFound, redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/db'
import { canViewLetter } from '@/lib/hierarchy'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, User, Calendar, FileText, FileCheck, History as HistoryIcon, Mail, ChevronRight, Reply } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { SignLetterForm } from '@/components/letters/sign-letter-form'
import { DownloadPdfButton } from '@/components/letters/download-pdf-button'

interface LetterPageProps {
    params: Promise<{ id: string }>
}

const statusColors: Record<string, string> = {
    DRAFT: 'bg-slate-100 text-slate-700 border-slate-200',
    SENT: 'bg-blue-100 text-blue-700 border-blue-200',
    SIGNED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    RESPONDED: 'bg-purple-100 text-purple-700 border-purple-200',
}

export default async function LetterPage({ params }: LetterPageProps) {
    const { id } = await params
    const currentNode = await requireAuth()

    // Check if user can view this letter
    const canView = await canViewLetter(currentNode.id, id)
    if (!canView) {
        redirect('/dashboard/letters')
    }

    const rawLetter = db.letters.find(l => l.id === id)

    if (!rawLetter) {
        notFound()
    }

    // Fetch the entire thread
    const thread: any[] = []
    let currentParentId = rawLetter.parentId
    while (currentParentId) {
        const parent = db.letters.find(l => l.id === currentParentId)
        if (parent) {
            thread.unshift(parent)
            currentParentId = parent.parentId
        } else {
            currentParentId = null
        }
    }

    const replies = db.letters.filter(l => l.parentId === id)

    const sender = db.nodes.find(n => n.id === rawLetter.senderId)
    const receiver = db.nodes.find(n => n.id === rawLetter.receiverId)
    const signature = db.signatures.find(s => s.letterId === rawLetter.id)

    let signedBy = null
    if (signature) {
        signedBy = db.nodes.find(n => n.id === signature.signedById)
    }

    const letter = {
        ...rawLetter,
        sender: sender ? {
            id: sender.id,
            name: sender.name,
            email: sender.email,
            position: sender.position,
        } : { id: 'unknown', name: 'Unknown', email: 'unknown', position: 'Unknown' },
        receiver: receiver ? {
            id: receiver.id,
            name: receiver.name,
            email: receiver.email,
            position: receiver.position,
        } : { id: 'unknown', name: 'Unknown', email: 'unknown', position: 'Unknown' },
        signature: signature ? {
            ...signature,
            signedBy: signedBy ? {
                name: signedBy.name,
                position: signedBy.position,
            } : { name: 'Unknown', position: 'Unknown' }
        } : null
    }

    const isSender = letter.senderId === currentNode.id
    const isReceiver = letter.receiverId === currentNode.id
    const canSign = isReceiver && letter.status === 'SENT' && !letter.signature
    const canReply = (isSender || isReceiver) && letter.status !== 'DRAFT'

    return (
        <div className="space-y-8 pb-20 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/letters">
                    <Button variant="ghost" size="sm" className="rounded-lg font-medium text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Letters
                    </Button>
                </Link>
            </div>

            {/* Thread Navigation */}
            {thread.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <HistoryIcon className="size-3" />
                        Previous Communications in Thread
                    </h3>
                    <div className="grid gap-3">
                        {thread.map((prevLetter) => (
                            <Link key={prevLetter.id} href={`/dashboard/letters/${prevLetter.id}`}>
                                <Card className="p-4 hover:bg-muted/30 transition-all border-none shadow-sm ring-1 ring-border/50 group">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-full bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                <Mail className="size-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">{prevLetter.subject}</p>
                                                <p className="text-[10px] text-muted-foreground">{format(new Date(prevLetter.createdAt), 'PPP')}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`${statusColors[letter.status]} border rounded-full font-semibold text-[10px] px-2.5 py-0.5`}>
                            {letter.status}
                        </Badge>
                        <Badge variant="secondary" className="rounded-full font-semibold text-[10px] px-2.5 py-0.5">
                            {letter.category?.replace('_', ' ') || 'GENERAL'}
                        </Badge>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">{letter.subject}</h1>
                    <p className="text-sm text-muted-foreground font-medium">
                        Sent on {format(new Date(letter.createdAt), 'PPPP')} at {format(new Date(letter.createdAt), 'p')}
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <DownloadPdfButton letter={letter} />
                    {canReply && (
                        <Link href={`/dashboard/letters/new?parentId=${letter.id}&subject=Re: ${letter.subject}&recipientId=${isSender ? letter.receiverId : letter.senderId}`}>
                            <Button className="rounded-lg shadow-sm font-semibold">
                                <Reply className="size-4 mr-2" />
                                Reply to Letter
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Letter Content */}
                <Card className="lg:col-span-2 border-none shadow-sm ring-1 ring-border/50 overflow-hidden bg-background">
                    <CardHeader className="border-b bg-muted/5">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">From</p>
                                <p className="text-sm font-bold">{letter.sender.name}</p>
                                <p className="text-[10px] text-muted-foreground font-medium">{letter.sender.position}</p>
                            </div>
                            <div className="hidden md:block">
                                <ChevronRight className="size-4 text-muted-foreground/20" />
                            </div>
                            <div className="space-y-1 md:text-right">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">To</p>
                                <p className="text-sm font-bold">{letter.receiver.name}</p>
                                <p className="text-[10px] text-muted-foreground font-medium">{letter.receiver.position}</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 md:p-12">
                        <div
                            className="prose prose-sm sm:prose-base lg:prose-lg max-w-none dark:prose-invert"
                            dangerouslySetInnerHTML={{ __html: letter.body }}
                        />

                        {letter.signature && (
                            <div className="mt-16 pt-8 border-t border-dashed">
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                            <FileCheck className="size-5" />
                                            <span className="text-xs font-bold uppercase tracking-widest">Digital Signature Verified</span>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-3xl font-serif italic text-foreground/80 opacity-60 select-none">
                                                {letter.signature.signedBy.name}
                                            </p>
                                            <div className="h-px w-48 bg-foreground/10" />
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                Authenticated by {letter.signature.signedBy.name}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <p className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                                            HASH: {Buffer.from(letter.id).toString('hex').slice(0, 16).toUpperCase()}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground font-medium">
                                            {format(new Date(letter.signature.signedAt), 'PPpp')}
                                        </p>
                                    </div>
                                </div>

                                {letter.signature.response && (
                                    <div className="mt-8 p-6 rounded-xl bg-muted/30 border border-border/50 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Official Response</p>
                                        <p className="text-sm text-foreground/80 italic leading-relaxed">
                                            "{letter.signature.response}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Sidebar: Actions & Info */}
                <div className="space-y-6">
                    {canSign && (
                        <Card className="border-none shadow-sm ring-1 ring-emerald-500/20 bg-emerald-500/5 overflow-hidden">
                            <CardHeader className="bg-emerald-500/10 border-b border-emerald-500/10">
                                <CardTitle className="text-sm font-bold flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                                    <FileCheck className="size-4" />
                                    Action Required
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80 mb-6 font-medium">
                                    This letter requires your official digital signature and response.
                                </p>
                                <SignLetterForm letterId={id} />
                            </CardContent>
                        </Card>
                    )}

                    {replies.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                <Reply className="size-3" />
                                Related Replies ({replies.length})
                            </h3>
                            <div className="grid gap-3">
                                {replies.map((reply) => (
                                    <Link key={reply.id} href={`/dashboard/letters/${reply.id}`}>
                                        <Card className="p-4 hover:bg-muted/30 transition-all border-none shadow-sm ring-1 ring-border/50 group">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-full bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                        <Mail className="size-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold">{reply.subject}</p>
                                                        <p className="text-[10px] text-muted-foreground">{format(new Date(reply.createdAt), 'PPP')}</p>
                                                    </div>
                                                </div>
                                                <ChevronRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
                                            </div>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    <Card className="border-none shadow-sm ring-1 ring-border/50">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold">Letter Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Letter ID</span>
                                <span className="font-mono font-medium">{id.slice(0, 8)}...</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Security Level</span>
                                <span className="font-bold text-emerald-600">ENCRYPTED</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Category</span>
                                <span className="font-bold">{letter.category?.replace('_', ' ') || 'GENERAL'}</span>
                            </div>
                            <div className="pt-4 border-t space-y-3">
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Drafted</p>
                                    <p className="text-xs font-medium">{format(new Date(letter.createdAt), 'PPp')}</p>
                                </div>
                                {letter.updatedAt.getTime() !== letter.createdAt.getTime() && (
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Last Modified</p>
                                        <p className="text-xs font-medium">{format(new Date(letter.updatedAt), 'PPp')}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
