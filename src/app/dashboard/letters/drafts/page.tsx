import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/db'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, FileText } from 'lucide-react'
import Link from 'next/link'
import { LettersTable } from '@/components/letters/letters-table'

export default async function DraftsPage() {
    const currentNode = await requireAuth()

    // Helper to map letter data
    const mapLetter = (l: any) => {
        const sender = db.nodes.find(n => n.id === l.senderId)
        const receiver = db.nodes.find(n => n.id === l.receiverId)
        const signature = db.signatures.find(s => s.letterId === l.id)

        return {
            ...l,
            sender: sender ? { id: sender.id, name: sender.name, position: sender.position } : { id: 'unknown', name: 'Unknown', position: 'Unknown' },
            receiver: receiver ? { id: receiver.id, name: receiver.name, position: receiver.position } : { id: 'unknown', name: 'Unknown', position: 'Unknown' },
            signature: signature || null,
            attachment: l.attachment || null
        }
    }

    const draftLetters = db.letters
        .filter(l => l.senderId === currentNode.id && l.status === 'DRAFT')
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .map(mapLetter)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Drafts</h2>
                    <p className="text-muted-foreground">Unsent messages</p>
                </div>
                <Link href="/dashboard/letters/new">
                    <Button>
                        <Plus className="size-4 mr-2" />
                        New Letter
                    </Button>
                </Link>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-6 text-muted-foreground">
                        <FileText className="size-4" />
                        <span className="text-sm font-medium uppercase tracking-wider">Draft Messages ({draftLetters.length})</span>
                    </div>
                    <LettersTable letters={draftLetters} currentNodeId={currentNode.id} type="sent" />
                </CardContent>
            </Card>
        </div>
    )
}
