import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/db'
import { getDescendantIds } from '@/lib/hierarchy'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { NewLetterForm } from '@/components/letters/new-letter-form'

interface NewLetterPageProps {
    searchParams: Promise<{
        parentId?: string
        subject?: string
        recipientId?: string
    }>
}

export default async function NewLetterPage({ searchParams }: NewLetterPageProps) {
    const { parentId, subject, recipientId } = await searchParams
    const currentNode = await requireAuth()

    // Get parent and all descendants as potential recipients
    const descendantIds = await getDescendantIds(currentNode.id)
    const potentialRecipientIds = currentNode.parentId
        ? [currentNode.parentId, ...descendantIds]
        : descendantIds

    const potentialRecipients = db.nodes
        .filter(n => potentialRecipientIds.includes(n.id))
        .map(n => ({
            id: n.id,
            name: n.name,
            email: n.email,
            position: n.position,
        }))
        .sort((a, b) => a.name.localeCompare(b.name))

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/letters">
                    <Button variant="outline" size="sm" className="rounded-none border-2 border-foreground font-bold uppercase tracking-widest">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Letters
                    </Button>
                </Link>
            </div>

            <div>
                <h2 className="text-5xl font-black text-foreground uppercase tracking-tighter leading-none">
                    {parentId ? 'Compose Reply' : 'Compose New Letter'}
                </h2>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs mt-2">
                    {parentId ? 'Replying to a previous communication' : 'Send a secure letter to your parent or subordinates'}
                </p>
            </div>

            <Card className="max-w-4xl rounded-none border-2 border-foreground shadow-brutal overflow-hidden">
                <CardHeader className="bg-muted/50 border-b-2 border-foreground">
                    <CardTitle className="text-xl font-black uppercase tracking-tight">Letter Details</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    <NewLetterForm
                        recipients={potentialRecipients}
                        parentId={parentId}
                        defaultSubject={subject}
                        defaultRecipientId={recipientId}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
