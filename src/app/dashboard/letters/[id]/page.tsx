import { notFound, redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/db'
import { canViewLetter } from '@/lib/hierarchy'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, User, Calendar, FileText } from 'lucide-react'
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
    DRAFT: 'bg-slate-500',
    SENT: 'bg-blue-500',
    SIGNED: 'bg-green-500',
    RESPONDED: 'bg-purple-500',
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
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/letters">
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Letters
                    </Button>
                </Link>
            </div>

            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{letter.subject}</h2>
                    <div className="flex items-center gap-3">
                        <Badge className={`${statusColors[letter.status]} text-white`}>
                            {letter.status}
                        </Badge>
                        <span className="text-sm text-slate-400">
                            {format(new Date(letter.createdAt), 'PPpp')}
                        </span>
                    </div>
                </div>
                <div className="flex gap-2">
                    {letter.status !== 'DRAFT' && <DownloadPdfButton letter={letter} />}
                    {isSender && <LetterActions letter={letter} />}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Letter Content
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="prose prose-invert max-w-none">
                                <p className="text-slate-300 whitespace-pre-wrap">{letter.body}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {letter.signature && (
                        <Card className="border-green-700 bg-green-900/20 backdrop-blur">
                            <CardHeader>
                                <CardTitle className="text-green-400 flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Digital Signature
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-slate-400 mb-1">Signed by</p>
                                    <p className="text-white font-medium">{letter.signature.signedBy.name}</p>
                                    <p className="text-sm text-slate-400">{letter.signature.signedBy.position}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400 mb-1">Signed at</p>
                                    <p className="text-white">{format(new Date(letter.signature.signedAt), 'PPpp')}</p>
                                </div>
                                {letter.signature.response && (
                                    <div>
                                        <p className="text-sm text-slate-400 mb-1">Response</p>
                                        <p className="text-white whitespace-pre-wrap">{letter.signature.response}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {canSign && (
                        <Card className="border-blue-700 bg-blue-900/20 backdrop-blur">
                            <CardHeader>
                                <CardTitle className="text-blue-400">Sign This Letter</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <SignLetterForm letterId={letter.id} />
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="space-y-6">
                    <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <User className="w-5 h-5" />
                                From
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div>
                                <p className="font-medium text-white">{letter.sender.name}</p>
                                <p className="text-sm text-slate-400">{letter.sender.position}</p>
                                <p className="text-sm text-slate-500">{letter.sender.email}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <User className="w-5 h-5" />
                                To
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div>
                                <p className="font-medium text-white">{letter.receiver.name}</p>
                                <p className="text-sm text-slate-400">{letter.receiver.position}</p>
                                <p className="text-sm text-slate-500">{letter.receiver.email}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Created</p>
                                <p className="text-sm text-white">{format(new Date(letter.createdAt), 'PPp')}</p>
                            </div>
                            {letter.updatedAt.getTime() !== letter.createdAt.getTime() && (
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Last Updated</p>
                                    <p className="text-sm text-white">{format(new Date(letter.updatedAt), 'PPp')}</p>
                                </div>
                            )}
                            {letter.signature && (
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Signed</p>
                                    <p className="text-sm text-white">{format(new Date(letter.signature.signedAt), 'PPp')}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
