import { notFound, redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/db'
import { canViewLetter } from '@/lib/hierarchy'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, User, Calendar, FileText, FileCheck, History as HistoryIcon, Mail, ChevronRight, Reply, Shield } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { SignLetterForm } from '@/components/letters/sign-letter-form'
import { DownloadPdfButton } from '@/components/letters/download-pdf-button'

interface LetterPageProps {
    params: Promise<{ id: string }>
}

const statusColors: Record<string, string> = {
    DRAFT: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
    SENT: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    SIGNED: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    RESPONDED: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
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
        <div className="space-y-8 md:space-y-10 pb-20 animate-in fade-in duration-700">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/letters">
                    <Button variant="ghost" size="sm" className="rounded-xl font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back
                    </Button>
                </Link>
            </div>

            {/* Thread Navigation */}
            {thread.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2 pl-1">
                        <HistoryIcon className="size-3" />
                        Thread History
                    </h3>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                        {thread.map((prevLetter) => (
                            <Link key={prevLetter.id} href={`/dashboard/letters/${prevLetter.id}`}>
                                <div className="px-3 md:px-4 py-2 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 hover:border-primary/20 transition-all flex items-center gap-2 md:gap-3 group">
                                    <div className="p-1.5 rounded-lg bg-background shadow-sm text-muted-foreground group-hover:text-primary transition-colors">
                                        <Mail className="size-3.5" />
                                    </div>
                                    <span className="text-[11px] md:text-xs font-bold truncate max-w-[120px] md:max-w-[150px]">{prevLetter.subject}</span>
                                    <ChevronRight className="size-3 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-8 border-b border-border/50 pb-8">
                <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className={`${statusColors[letter.status]} border-none rounded-md font-black text-[9px] uppercase tracking-widest px-2.5 py-1 shadow-sm`}>
                            {letter.status}
                        </Badge>
                        <Badge variant="secondary" className="rounded-md font-black text-[9px] uppercase tracking-widest px-2.5 py-1 bg-muted/50 text-muted-foreground border-none">
                            {letter.category?.replace('_', ' ') || 'GENERAL'}
                        </Badge>
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-tight">{letter.subject}</h1>
                    <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-muted-foreground font-bold">
                        <div className="p-2 rounded-lg bg-muted/30">
                            <Calendar className="size-4" />
                        </div>
                        <span>{format(new Date(letter.createdAt), 'PPPP')}</span>
                        <span className="hidden sm:inline text-border">•</span>
                        <span>{format(new Date(letter.createdAt), 'p')}</span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                    <DownloadPdfButton letter={letter} />
                    {canReply && (
                        <Button asChild className="rounded-xl shadow-xl shadow-primary/10 font-black uppercase tracking-widest text-[10px] h-11 px-6 hover:scale-[1.02] active:scale-[0.98] transition-all">
                            <Link href={`/dashboard/letters/new?parentId=${letter.id}&subject=Re: ${letter.subject}&recipientId=${isSender ? letter.receiverId : letter.senderId}`}>
                                <Reply className="size-4 mr-2" />
                                Reply
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
                {/* Main Letter Content */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-none shadow-2xl shadow-foreground/[0.02] ring-1 ring-border/50 overflow-hidden bg-background relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary/5 to-primary/20" />
                        <CardHeader className="border-b border-border/50 bg-muted/5 px-6 md:px-10 py-6 md:py-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 relative">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">From</p>
                                    <div className="flex items-center gap-3">
                                        <div className="size-9 md:size-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary font-black text-xs">
                                            {letter.sender.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black tracking-tight">{letter.sender.name}</p>
                                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{letter.sender.position}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2 md:text-right">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">To</p>
                                    <div className="flex items-center gap-3 md:flex-row-reverse">
                                        <div className="size-9 md:size-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground font-black text-xs">
                                            {letter.receiver.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black tracking-tight">{letter.receiver.name}</p>
                                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{letter.receiver.position}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
                                    <div className="p-2 rounded-full bg-background border border-border/50 shadow-sm">
                                        <ChevronRight className="size-4 text-muted-foreground/30" />
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 md:p-12 lg:p-16">
                            <div
                                className="prose prose-slate dark:prose-invert max-w-none text-foreground leading-relaxed selection:bg-primary/10"
                                dangerouslySetInnerHTML={{ __html: letter.body }}
                            />

                            {letter.signature && (
                                <div className="mt-16 md:mt-20 pt-10 md:pt-12 border-t border-dashed border-border/50 relative">
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 bg-background text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] whitespace-nowrap">
                                        Authentication
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-10">
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-4 py-2 rounded-xl w-fit">
                                                <FileCheck className="size-4" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Digital Signature Verified</span>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-3xl md:text-4xl font-serif italic text-foreground/70 opacity-80 select-none tracking-tight">
                                                    {letter.signature.signedBy.name}
                                                </p>
                                                <div className="h-0.5 w-48 md:w-64 bg-gradient-to-r from-foreground/20 to-transparent" />
                                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                                                    Authenticated by {letter.signature.signedBy.name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="md:text-right space-y-2">
                                            <div className="inline-block px-3 py-1.5 rounded-lg bg-muted/50 border border-border/50">
                                                <p className="text-[9px] font-mono font-black text-muted-foreground tracking-tighter">
                                                    CERT_ID: {Buffer.from(letter.id).toString('hex').slice(0, 16).toUpperCase()}
                                                </p>
                                            </div>
                                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                                                {format(new Date(letter.signature.signedAt), 'PPpp')}
                                            </p>
                                        </div>
                                    </div>

                                    {letter.signature.response && (
                                        <div className="mt-10 md:mt-12 p-6 md:p-8 rounded-2xl bg-muted/20 border border-border/50 relative overflow-hidden group hover:bg-muted/30 transition-all">
                                            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/10 group-hover:bg-primary/20 transition-all" />
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">Official Response / Remarks</p>
                                            <p className="text-sm md:text-base text-foreground/90 italic leading-relaxed font-medium">
                                                "{letter.signature.response}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {replies.length > 0 && (
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2 pl-1">
                                <Reply className="size-3" />
                                Related Replies ({replies.length})
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {replies.map((reply) => (
                                    <Link key={reply.id} href={`/dashboard/letters/${reply.id}`}>
                                        <Card className="p-5 hover:bg-muted/30 transition-all border-none shadow-sm ring-1 ring-border/50 group hover:ring-primary/20">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2.5 rounded-xl bg-primary/5 text-primary group-hover:scale-110 transition-transform">
                                                        <Mail className="size-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black tracking-tight group-hover:text-primary transition-colors">{reply.subject}</p>
                                                        <p className="text-[10px] text-muted-foreground font-bold uppercase mt-0.5">{format(new Date(reply.createdAt), 'PPP')}</p>
                                                    </div>
                                                </div>
                                                <ChevronRight className="size-4 text-muted-foreground/30 group-hover:text-primary transition-all" />
                                            </div>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar: Actions & Info */}
                <div className="space-y-8">
                    {canSign && (
                        <Card className="border-none shadow-2xl shadow-emerald-500/10 ring-1 ring-emerald-500/20 bg-emerald-500/[0.02] overflow-hidden">
                            <CardHeader className="bg-emerald-500/5 border-b border-emerald-500/10 px-6 py-5">
                                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                                    <div className="p-1.5 rounded-lg bg-emerald-500/10">
                                        <FileCheck className="size-4" />
                                    </div>
                                    Action Required
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <p className="text-xs text-emerald-700/70 dark:text-emerald-400/70 mb-8 font-bold leading-relaxed">
                                    This document requires your official digital signature and an optional response to be considered valid.
                                </p>
                                <SignLetterForm letterId={id} />
                            </CardContent>
                        </Card>
                    )}

                    <Card className="border-none shadow-xl shadow-foreground/[0.02] ring-1 ring-border/50 overflow-hidden">
                        <CardHeader className="border-b border-border/50 bg-muted/5 px-6 py-5">
                            <CardTitle className="text-xs font-black uppercase tracking-[0.2em]">Metadata & Security</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-5">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Document ID</span>
                                <span className="font-mono text-[10px] font-black bg-muted px-2 py-1 rounded-md">{id.slice(0, 12).toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Security</span>
                                <div className="flex items-center gap-1.5 text-emerald-600 font-black text-[9px] uppercase tracking-widest bg-emerald-500/5 px-2 py-1 rounded-md border border-emerald-500/10">
                                    <Shield className="size-3" />
                                    Encrypted
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Category</span>
                                <span className="font-black text-[10px] uppercase tracking-widest">{letter.category?.replace('_', ' ') || 'GENERAL'}</span>
                            </div>
                            <div className="pt-5 border-t border-border/50 space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-muted/50 text-muted-foreground">
                                        <FileText className="size-3.5" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Drafted</p>
                                        <p className="text-[11px] font-bold">{format(new Date(letter.createdAt), 'PPp')}</p>
                                    </div>
                                </div>
                                {letter.updatedAt.getTime() !== letter.createdAt.getTime() && (
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-muted/50 text-muted-foreground">
                                            <HistoryIcon className="size-3.5" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Last Modified</p>
                                            <p className="text-[11px] font-bold">{format(new Date(letter.updatedAt), 'PPp')}</p>
                                        </div>
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
