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

    if (!letter) {
        notFound()
    }

    const isSender = letter.senderId === currentNode.id
    const isReceiver = letter.receiverId === currentNode.id
    const canSign = isReceiver && letter.status === 'SENT' && !letter.signature

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/letters">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Letters
                    </Button>
                </Link>
            </div>

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-black text-foreground mb-3 uppercase tracking-tighter">{letter.subject}</h2>
                    <div className="flex items-center gap-4">
                        <Badge className={`${statusColors[letter.status]} rounded-none font-bold uppercase tracking-widest px-3 py-1`}>
                            {letter.status}
                        </Badge>
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            {format(new Date(letter.createdAt), 'PPpp')}
                        </span>
                    </div>
                </div>
                <div className="flex gap-3">
                    {letter.status !== 'DRAFT' && <DownloadPdfButton letter={letter} />}
                    {isSender && <LetterActions letter={letter} />}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                                <FileText className="w-6 h-6" />
                                Letter Content
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="text-foreground font-medium leading-relaxed whitespace-pre-wrap">{letter.body}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {letter.signature && (
                        <Card className="border-green-500 shadow-[4px_4px_0px_0px_rgba(34,197,94,1)]">
                            <CardHeader>
                                <CardTitle className="text-green-600 dark:text-green-400 font-black uppercase tracking-tight flex items-center gap-2">
                                    <FileCheck className="w-6 h-6" />
                                    Digital Signature
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Signed by</p>
                                        <p className="text-foreground font-bold text-lg">{letter.signature.signedBy.name}</p>
                                        <p className="text-sm text-muted-foreground font-medium">{letter.signature.signedBy.position}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Signed at</p>
                                        <p className="text-foreground font-bold">{format(new Date(letter.signature.signedAt), 'PPpp')}</p>
                                    </div>
                                </div>
                                {letter.signature.response && (
                                    <div className="pt-4 border-t-2 border-green-500/20">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Response</p>
                                        <p className="text-foreground font-medium whitespace-pre-wrap bg-green-500/5 p-4 border-l-4 border-green-500">{letter.signature.response}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {canSign && (
                        <Card className="border-primary shadow-brutal">
                            <CardHeader>
                                <CardTitle className="text-primary font-black uppercase tracking-tight">Sign This Letter</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <SignLetterForm letterId={letter.id} />
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                                <User className="w-5 h-5" />
                                From
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div>
                                <p className="font-bold text-foreground text-lg">{letter.sender.name}</p>
                                <p className="text-sm text-muted-foreground font-bold uppercase tracking-tight">{letter.sender.position}</p>
                                <p className="text-xs text-muted-foreground mt-2 font-medium">{letter.sender.email}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                                <User className="w-5 h-5" />
                                To
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div>
                                <p className="font-bold text-foreground text-lg">{letter.receiver.name}</p>
                                <p className="text-sm text-muted-foreground font-bold uppercase tracking-tight">{letter.receiver.position}</p>
                                <p className="text-xs text-muted-foreground mt-2 font-medium">{letter.receiver.email}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Created</p>
                                <p className="text-sm text-foreground font-bold">{format(new Date(letter.createdAt), 'PPp')}</p>
                            </div>
                            {letter.updatedAt.getTime() !== letter.createdAt.getTime() && (
                                <div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Last Updated</p>
                                    <p className="text-sm text-foreground font-bold">{format(new Date(letter.updatedAt), 'PPp')}</p>
                                </div>
                            )}
                            {letter.signature && (
                                <div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Signed</p>
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
