import { redirect } from 'next/navigation'
import { getCurrentNode } from '@/lib/auth'
import { DashboardNav } from '@/components/dashboard/dashboard-nav'
import { UserInfo } from '@/components/dashboard/user-info'

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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Office Management System</h1>
                            <p className="text-sm text-slate-400">Hierarchical Letter Platform</p>
                        </div>
                        <UserInfo node={currentNode} />
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
