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
            <div className="text-center py-12 text-slate-400">
                <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No direct reports yet</p>
                <p className="text-sm mt-1">Create your first user to get started</p>
            </div>
        )
    }

    return (
        <div className="rounded-lg border border-slate-700 overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-900/50 hover:bg-slate-900/50 border-slate-700">
                        <TableHead className="text-slate-300">Name</TableHead>
                        <TableHead className="text-slate-300">Position</TableHead>
                        <TableHead className="text-slate-300">Email</TableHead>
                        <TableHead className="text-slate-300">Reports</TableHead>
                        <TableHead className="text-slate-300">Joined</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id} className="border-slate-700 hover:bg-slate-700/30">
                            <TableCell className="font-medium text-white">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                                        <User className="w-4 h-4 text-blue-400" />
                                    </div>
                                    {user.name}
                                </div>
                            </TableCell>
                            <TableCell className="text-slate-300">{user.position}</TableCell>
                            <TableCell className="text-slate-400">{user.email}</TableCell>
                            <TableCell>
                                <Badge variant="outline" className="border-slate-600 text-slate-400">
                                    {user._count.children} {user._count.children === 1 ? 'report' : 'reports'}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-slate-400 text-sm">
                                {format(new Date(user.createdAt), 'PP')}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
