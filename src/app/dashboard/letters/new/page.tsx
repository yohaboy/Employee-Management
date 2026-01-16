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
        <div className="flex flex-col min-h-[calc(100vh-120px)] lg:h-[calc(100vh-120px)] animate-in fade-in duration-700">
            <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/letters">
                        <Button variant="ghost" size="sm" className="rounded-xl font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-black tracking-tight">
                            {parentId ? 'Compose Reply' : 'New Document'}
                        </h2>
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <NewLetterForm
                    recipients={potentialRecipients}
                    parentId={parentId}
                    defaultSubject={subject}
                    defaultRecipientId={recipientId}
                />
            </div>
        </div>
    )
}
