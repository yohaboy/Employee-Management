import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/db'
import { getDescendantIds } from '@/lib/hierarchy'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { NewLetterForm } from '@/components/letters/new-letter-form'

export default async function NewLetterPage() {
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
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/letters">
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Letters
                    </Button>
                </Link>
            </div>

            <div>
                <h2 className="text-3xl font-bold text-white">Compose New Letter</h2>
                <p className="text-slate-400">Send a secure letter to your parent or subordinates</p>
            </div>

            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur max-w-3xl">
                <CardHeader>
                    <CardTitle className="text-white">Letter Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <NewLetterForm recipients={potentialRecipients} />
                </CardContent>
            </Card>
        </div>
    )
}
