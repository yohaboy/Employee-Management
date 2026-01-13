import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/db'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Inbox } from 'lucide-react'
import Link from 'next/link'
import { LettersTable } from '@/components/letters/letters-table'

export default async function InboxPage() {
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

    // Get all letters visible to this node
    const receivedLetters = db.letters
        .filter(l => l.receiverId === currentNode.id && l.status !== 'DRAFT')
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .map(mapLetter)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Inbox</h2>
                    <p className="text-muted-foreground">Messages received from other nodes</p>
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
                        <Inbox className="size-4" />
                        <span className="text-sm font-medium uppercase tracking-wider">Received Messages ({receivedLetters.length})</span>
                    </div>
                    <LettersTable letters={receivedLetters} currentNodeId={currentNode.id} type="received" />
                </CardContent>
            </Card>
        </div>
    )
}
