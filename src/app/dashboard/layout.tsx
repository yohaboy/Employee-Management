import { redirect } from 'next/navigation'
import { getCurrentNode } from '@/lib/auth'
import { DashboardNav } from '@/components/dashboard/dashboard-nav'
import { UserInfo } from '@/components/dashboard/user-info'
import { ModeToggle } from '@/components/mode-toggle'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const currentNode = await getCurrentNode()

    if (!currentNode) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="border-b-2 border-border bg-card">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-black text-foreground uppercase tracking-tighter">Office System</h1>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Hierarchical Letter Platform</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <ModeToggle />
                            <UserInfo node={currentNode} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6">
                    <aside>
                        <DashboardNav />
                    </aside>
                    <main>{children}</main>
                </div>
            </div>
        </div>
    )
}
