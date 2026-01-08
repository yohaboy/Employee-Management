import { notFound, redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/db'
import { canViewLetter } from '@/lib/hierarchy'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, User, Calendar, FileText, FileCheck } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { LetterActions } from '@/components/letters/letter-actions'
import { SignLetterForm } from '@/components/letters/sign-letter-form'
import { DownloadPdfButton } from '@/components/letters/download-pdf-button'

interface LetterPageProps {
    params: Promise<{ id: string }>
}

const statusColors: Record<string, string> = {
    DRAFT: 'bg-muted text-muted-foreground',
    SENT: 'bg-primary text-primary-foreground',
    SIGNED: 'bg-green-500 text-white',
    RESPONDED: 'bg-purple-500 text-white',
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
        <div className="space-y-8 pb-20">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/letters">
                    <Button variant="outline" size="sm" className="rounded-none border-2 border-foreground font-bold uppercase tracking-widest">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Letters
                    </Button>
                </Link>
            </div>

            {/* Thread Navigation */}
            {thread.length > 0 && (
                <div className="space-y-4">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Previous Letters in Thread</p>
                    <div className="flex flex-col gap-2">
                        {thread.map((l, i) => (
                            <Link key={l.id} href={`/dashboard/letters/${l.id}`}>
                                <div className="p-3 bg-muted/50 border-2 border-foreground/10 hover:border-foreground transition-all flex justify-between items-center group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1 h-8 bg-foreground/20 group-hover:bg-primary transition-colors" />
                                        <div>
                                            <p className="text-sm font-bold">{l.subject}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold">{format(new Date(l.createdAt), 'PP')}</p>
                                        </div>
                                    </div>
                                    <Badge className="rounded-none text-[10px] font-black uppercase tracking-widest">View</Badge>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Badge className={`${statusColors[letter.status]} rounded-none font-black uppercase tracking-widest px-3 py-1`}>
                            {letter.status}
                        </Badge>
                        <Badge variant="outline" className="rounded-none font-black uppercase tracking-widest px-3 py-1 border-2 border-foreground">
                            {letter.category?.replace('_', ' ') || 'GENERAL'}
                        </Badge>
                    </div>
                    <h2 className="text-5xl font-black text-foreground mb-3 uppercase tracking-tighter leading-none">{letter.subject}</h2>
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            Sent {format(new Date(letter.createdAt), 'PPpp')}
                        </span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                    {letter.status !== 'DRAFT' && <DownloadPdfButton letter={letter} />}
                    {isSender && <LetterActions letter={letter} />}
                    {canReply && (
                        <Link href={`/dashboard/letters/new?parentId=${letter.id}&subject=Re: ${letter.subject}&recipientId=${isSender ? letter.receiverId : letter.senderId}`}>
                            <Button className="rounded-none border-2 border-foreground font-black uppercase tracking-widest shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                                Reply to Letter
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card className="rounded-none border-2 border-foreground shadow-brutal overflow-hidden">
                        <CardHeader className="bg-muted/50 border-b-2 border-foreground">
                            <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                                <FileText className="w-6 h-6" />
                                Document Content
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="bg-muted/10 p-8 md:p-12 min-h-[500px]">
                                <div className="bg-background border border-foreground/10 shadow-2xl p-8 md:p-16 prose dark:prose-invert max-w-none min-h-[600px]">
                                    <div
                                        dangerouslySetInnerHTML={{ __html: letter.body }}
                                        className="text-foreground font-medium leading-relaxed"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {letter.signature && (
                        <Card className="rounded-none border-2 border-green-500 shadow-[8px_8px_0px_0px_rgba(34,197,94,1)] overflow-hidden">
                            <CardHeader className="bg-green-500/10 border-b-2 border-green-500">
                                <CardTitle className="text-green-600 dark:text-green-400 font-black uppercase tracking-tight flex items-center gap-2">
                                    <FileCheck className="w-6 h-6" />
                                    Digital Signature Verified
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="flex flex-col md:flex-row justify-between gap-8">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Signatory</p>
                                            <p className="text-foreground font-black text-2xl uppercase tracking-tighter">{letter.signature.signedBy.name}</p>
                                            <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">{letter.signature.signedBy.position}</p>
                                        </div>
                                        <div className="pt-4 border-t-2 border-green-500/10">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Verification Hash</p>
                                            <code className="text-[10px] bg-muted px-2 py-1 rounded font-mono break-all">
                                                {Buffer.from(letter.id + letter.signature.signedAt).toString('hex').slice(0, 32)}
                                            </code>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-green-500/30 bg-green-500/5 min-w-[200px]">
                                        <div className="text-4xl font-serif italic text-green-600/50 select-none mb-2">
                                            {letter.signature.signedBy.name}
                                        </div>
                                        <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Digitally Signed</p>
                                        <p className="text-[10px] text-green-600/70 font-bold">{format(new Date(letter.signature.signedAt), 'PPpp')}</p>
                                    </div>
                                </div>
                                {letter.signature.response && (
                                    <div className="pt-8 border-t-2 border-green-500/20">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">Official Response</p>
                                        <div className="text-foreground font-medium whitespace-pre-wrap bg-green-500/5 p-6 border-l-4 border-green-500 italic text-lg">
                                            "{letter.signature.response}"
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {canSign && (
                        <Card className="rounded-none border-2 border-primary shadow-brutal overflow-hidden">
                            <CardHeader className="bg-primary/10 border-b-2 border-primary">
                                <CardTitle className="text-primary font-black uppercase tracking-tight">Sign and Authenticate</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <SignLetterForm letterId={letter.id} />
                            </CardContent>
                        </Card>
                    )}

                    {/* Replies Section */}
                    {replies.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-2xl font-black uppercase tracking-tighter">Replies</h3>
                            <div className="space-y-4">
                                {replies.map(reply => (
                                    <Link key={reply.id} href={`/dashboard/letters/${reply.id}`}>
                                        <Card className="rounded-none border-2 border-foreground/20 hover:border-foreground transition-all group">
                                            <CardContent className="p-4 flex justify-between items-center">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-1 h-10 bg-foreground/10 group-hover:bg-primary transition-colors" />
                                                    <div>
                                                        <p className="font-bold text-lg">{reply.subject}</p>
                                                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
                                                            {format(new Date(reply.createdAt), 'PPpp')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge className="rounded-none font-black uppercase tracking-widest">View Reply</Badge>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-8">
                    <Card className="rounded-none border-2 border-foreground shadow-brutal-sm">
                        <CardHeader className="bg-muted/30 border-b-2 border-foreground">
                            <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Sender
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div>
                                <p className="font-black text-foreground text-xl uppercase tracking-tighter">{letter.sender.name}</p>
                                <p className="text-xs text-muted-foreground font-black uppercase tracking-widest mt-1">{letter.sender.position}</p>
                                <p className="text-[10px] text-muted-foreground mt-4 font-bold uppercase tracking-widest border-t border-foreground/10 pt-4">{letter.sender.email}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none border-2 border-foreground shadow-brutal-sm">
                        <CardHeader className="bg-muted/30 border-b-2 border-foreground">
                            <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Recipient
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div>
                                <p className="font-black text-foreground text-xl uppercase tracking-tighter">{letter.receiver.name}</p>
                                <p className="text-xs text-muted-foreground font-black uppercase tracking-widest mt-1">{letter.receiver.position}</p>
                                <p className="text-[10px] text-muted-foreground mt-4 font-bold uppercase tracking-widest border-t border-foreground/10 pt-4">{letter.receiver.email}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none border-2 border-foreground shadow-brutal-sm">
                        <CardHeader className="bg-muted/30 border-b-2 border-foreground">
                            <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Document Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Drafted</p>
                                <p className="text-sm text-foreground font-bold">{format(new Date(letter.createdAt), 'PPp')}</p>
                            </div>
                            {letter.updatedAt.getTime() !== letter.createdAt.getTime() && (
                                <div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Last Modified</p>
                                    <p className="text-sm text-foreground font-bold">{format(new Date(letter.updatedAt), 'PPp')}</p>
                                </div>
                            )}
                            {letter.signature && (
                                <div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Authenticated</p>
                                    <p className="text-sm text-foreground font-bold">{format(new Date(letter.signature.signedAt), 'PPp')}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
