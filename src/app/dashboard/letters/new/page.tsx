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
        <div className="space-y-8 pb-10">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/letters">
                    <Button variant="ghost" size="sm" className="rounded-lg font-medium text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Letters
                    </Button>
                </Link>
            </div>

            <div>
                <h2 className="text-3xl font-bold tracking-tight">
                    {parentId ? 'Compose Reply' : 'Compose New Letter'}
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                    {parentId ? 'Replying to a previous communication' : 'Send a secure letter to your parent or subordinates'}
                </p>
            </div>

            <Card className="w-full border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                <CardHeader className="bg-muted/10 border-b">
                    <CardTitle className="text-sm font-bold">Letter Details</CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-8">
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
