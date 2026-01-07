'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Home, Mail, Users, FileText, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { logoutAction } from '@/app/actions/auth'

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/letters', label: 'Letters', icon: Mail },
    { href: '/dashboard/nodes', label: 'Hierarchy', icon: Users },
    { href: '/dashboard/users', label: 'Manage Users', icon: FileText },
]

export function DashboardNav() {
    const pathname = usePathname()

    return (
        <nav className="space-y-2">
            {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                            isActive
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                                : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                        )}
                    >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                    </Link>
                )
            })}

            <form action={logoutAction}>
                <Button
                    type="submit"
                    variant="ghost"
                    className="w-full justify-start gap-3 text-slate-300 hover:bg-red-600/20 hover:text-red-400"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </Button>
            </form>
        </nav>
    )
}
