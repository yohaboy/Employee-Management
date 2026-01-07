import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { User } from 'lucide-react'
import { format } from 'date-fns'

interface UserData {
    id: string
    name: string
    email: string
    position: string
    createdAt: Date
    _count: {
        children: number
    }
}

interface UsersTableProps {
    users: UserData[]
}

export function UsersTable({ users }: UsersTableProps) {
    if (users.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <User className="size-12 mx-auto mb-4 opacity-50" />
                <p className="font-semibold">No direct reports yet</p>
                <p className="text-sm mt-1">Create your first user to get started</p>
            </div>
        )
    }

    return (
        <div className="rounded-md border overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead>Name</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Reports</TableHead>
                        <TableHead>Joined</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border">
                                        <User className="size-4 text-primary" />
                                    </div>
                                    <span>{user.name}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-sm">{user.position}</TableCell>
                            <TableCell className="text-muted-foreground text-sm">{user.email}</TableCell>
                            <TableCell>
                                <Badge variant="secondary">
                                    {user._count.children} {user._count.children === 1 ? 'report' : 'reports'}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                                {format(new Date(user.createdAt), 'PP')}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
