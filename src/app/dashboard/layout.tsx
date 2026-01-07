import { redirect } from 'next/navigation'
import { getCurrentNode } from '@/lib/auth'
import { AppSidebar } from '@/components/dashboard/app-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { ModeToggle } from '@/components/mode-toggle'
import { Separator } from '@/components/ui/separator'
import { Search, Bell, UserPlus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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
        <SidebarProvider>
            <AppSidebar user={currentNode} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-background/95 backdrop-blur px-6 sticky top-0 z-10">
                    <div className="flex items-center gap-4 flex-1">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="h-4" />
                        <div className="relative w-full max-w-md hidden md:block">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search..."
                                className="w-full bg-muted/50 pl-9 border-none focus-visible:ring-1 focus-visible:ring-primary"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full border-2 border-background" />
                        </Button>
                        <ModeToggle />
                        <Separator orientation="vertical" className="h-4 mx-1" />
                        <div className="flex -space-x-2 overflow-hidden">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-background bg-muted flex items-center justify-center text-[10px] font-medium">
                                    U{i}
                                </div>
                            ))}
                        </div>
                        <Button size="sm" className="ml-2 gap-2 rounded-full px-4">
                            <UserPlus className="h-4 w-4" />
                            <span>Invite</span>
                        </Button>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
