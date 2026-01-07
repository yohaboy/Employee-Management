import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/db'
import { getVisibleNodeIds } from '@/lib/hierarchy'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Inbox, Send } from 'lucide-react'
import Link from 'next/link'
import { LettersTable } from '@/components/letters/letters-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default async function LettersPage() {
    const currentNode = await requireAuth()
    const visibleNodeIds = await getVisibleNodeIds(currentNode.id)

    // Helper to map letter data
    const mapLetter = (l: any) => {
        const sender = db.nodes.find(n => n.id === l.senderId)
        const receiver = db.nodes.find(n => n.id === l.receiverId)
        const signature = db.signatures.find(s => s.letterId === l.id)

        return {
            ...l,
            sender: sender ? { id: sender.id, name: sender.name, position: sender.position } : { id: 'unknown', name: 'Unknown', position: 'Unknown' },
            receiver: receiver ? { id: receiver.id, name: receiver.name, position: receiver.position } : { id: 'unknown', name: 'Unknown', position: 'Unknown' },
            signature: signature || null
        }
    }

    // Get all letters visible to this node
    const receivedLetters = db.letters
        .filter(l => visibleNodeIds.includes(l.receiverId))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .map(mapLetter)

    const sentLetters = db.letters
        .filter(l => visibleNodeIds.includes(l.senderId))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .map(mapLetter)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Letters</h2>
                    <p className="text-muted-foreground">Manage your correspondence</p>
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
                    <Tabs defaultValue="received" className="w-full">
                        <TabsList className="grid w-full max-w-md grid-cols-2">
                            <TabsTrigger value="received">
                                <Inbox className="size-4 mr-2" />
                                Inbox ({receivedLetters.length})
                            </TabsTrigger>
                            <TabsTrigger value="sent">
                                <Send className="size-4 mr-2" />
                                Outbox ({sentLetters.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="received" className="mt-6">
                            <LettersTable letters={receivedLetters} currentNodeId={currentNode.id} type="received" />
                        </TabsContent>

                        <TabsContent value="sent" className="mt-6">
                            <LettersTable letters={sentLetters} currentNodeId={currentNode.id} type="sent" />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
