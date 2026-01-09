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
            <SidebarInset className="bg-background flex flex-col min-h-screen">
                <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border bg-background px-4 md:px-6 sticky top-0 z-30 transition-all">
                    <div className="flex items-center gap-4 flex-1">
                        <SidebarTrigger className="-ml-1 h-8 w-8 rounded-md hover:bg-accent transition-colors" />
                        <Separator orientation="vertical" className="h-6" />
                        <div className="relative w-full max-w-md hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search..."
                                className="w-full bg-muted/50 pl-9 border-border rounded-md h-9 focus-visible:ring-1 focus-visible:ring-ring transition-all"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md relative">
                            <Bell className="h-5 w-5 text-muted-foreground" />
                            <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full ring-2 ring-background" />
                        </Button>
                        <ModeToggle />
                        <Separator orientation="vertical" className="h-6 hidden xs:block" />
                    </div>
                </header>
                <main className="flex-1 p-4 md:p-6">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}

