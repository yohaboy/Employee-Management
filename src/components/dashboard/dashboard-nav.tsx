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
                            'flex items-center gap-3 px-4 py-3 rounded-none border-2 transition-all',
                            isActive
                                ? 'bg-primary text-primary-foreground border-primary shadow-brutal-sm'
                                : 'text-muted-foreground border-transparent hover:bg-muted hover:text-foreground hover:border-border'
                        )}
                    >
                        <Icon className="w-5 h-5" />
                        <span className="font-bold uppercase tracking-tight text-xs">{item.label}</span>
                    </Link>
                )
            })}

            <form action={logoutAction}>
                <Button
                    type="submit"
                    variant="ghost"
                    className="w-full justify-start gap-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-none px-4 py-3 h-auto border-2 border-transparent hover:border-destructive"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-bold uppercase tracking-tight text-xs">Logout</span>
                </Button>
            </form>
        </nav>
    )
}
