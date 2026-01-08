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
            <SidebarInset className="bg-background/50">
                <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border/50 bg-background/80 backdrop-blur-xl px-8 sticky top-0 z-30 transition-all">
                    <div className="flex items-center gap-6 flex-1">
                        <SidebarTrigger className="-ml-2 h-9 w-9 rounded-xl hover:bg-primary/5 transition-colors" />
                        <Separator orientation="vertical" className="h-6 bg-border/50" />
                        <div className="relative w-full max-w-md hidden lg:block group">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                type="search"
                                placeholder="Search communications, users, or logs..."
                                className="w-full bg-muted/30 pl-10 border-none rounded-xl h-10 focus-visible:ring-2 focus-visible:ring-primary/10 transition-all placeholder:text-muted-foreground/50 placeholder:font-medium"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 p-1 rounded-xl">
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-lg bg-primary/5 hover:bg-primary/10 hover:shadow-sm transition-all relative">
                                <Bell className="h-6 w-6 text-muted-foreground" />
                                <span className="absolute top-2 right-2 h-1.5 w-1.5 bg-primary rounded-full ring-2 ring-background" />
                            </Button>
                            <ModeToggle />
                        </div>

                        <Separator orientation="vertical" className="h-6 bg-border/50 hidden sm:block" />
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
