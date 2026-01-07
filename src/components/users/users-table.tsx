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
                <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="font-bold uppercase tracking-tight">No direct reports yet</p>
                <p className="text-xs mt-1 font-medium">Create your first user to get started</p>
            </div>
        )
    }

    return (
        <div className="rounded-none border-2 border-border overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50 border-b-2 border-border">
                        <TableHead className="text-foreground font-black uppercase tracking-widest text-xs">Name</TableHead>
                        <TableHead className="text-foreground font-black uppercase tracking-widest text-xs">Position</TableHead>
                        <TableHead className="text-foreground font-black uppercase tracking-widest text-xs">Email</TableHead>
                        <TableHead className="text-foreground font-black uppercase tracking-widest text-xs">Reports</TableHead>
                        <TableHead className="text-foreground font-black uppercase tracking-widest text-xs">Joined</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id} className="border-b-2 border-border hover:bg-muted/30 transition-colors">
                            <TableCell className="font-bold text-foreground">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-none border-2 border-black dark:border-white bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <User className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="uppercase tracking-tight">{user.name}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-foreground font-bold uppercase tracking-tight text-xs">{user.position}</TableCell>
                            <TableCell className="text-muted-foreground font-medium text-xs">{user.email}</TableCell>
                            <TableCell>
                                <Badge className="rounded-none border-2 border-border bg-muted text-muted-foreground font-bold uppercase tracking-widest text-[10px] px-2 py-0.5">
                                    {user._count.children} {user._count.children === 1 ? 'report' : 'reports'}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-xs font-bold uppercase tracking-tight">
                                {format(new Date(user.createdAt), 'PP')}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
