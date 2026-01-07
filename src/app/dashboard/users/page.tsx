import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Users } from 'lucide-react'
import { CreateUserDialog } from '@/components/users/create-user-dialog'
import { UsersTable } from '@/components/users/users-table'

export default async function UsersPage() {
    const currentNode = await requireAuth()

    // Get all direct children (users created by this node)
    const directChildren = db.nodes
        .filter(n => n.parentId === currentNode.id)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .map(n => ({
            id: n.id,
            name: n.name,
            email: n.email,
            position: n.position,
            createdAt: n.createdAt,
            _count: {
                children: db.nodes.filter(child => child.parentId === n.id).length
            }
        }))

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Manage Users</h2>
                    <p className="text-muted-foreground">Create and manage your direct reports</p>
                </div>
                <CreateUserDialog parentId={currentNode.id} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Users className="size-5" />
                        Direct Reports ({directChildren.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <UsersTable users={directChildren} />
                </CardContent>
            </Card>
        </div>
    )
}
