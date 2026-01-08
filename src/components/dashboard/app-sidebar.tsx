"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Home,
    Mail,
    Users,
    FileText,
    LogOut,
    ChevronRight,
    MoreHorizontal,
    Settings2,
    User,
    Calendar,
    Hash,
    Shield,
    Activity,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from "@/components/ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logoutAction } from "@/app/actions/auth"

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/letters", label: "Letters", icon: Mail },
    { href: "/dashboard/nodes", label: "Hierarchy", icon: Users },
    { href: "/dashboard/users", label: "Manage Users", icon: FileText },
    { href: "/dashboard/audit", label: "Audit Logs", icon: Activity },
    { href: "/dashboard/settings", label: "Settings", icon: Settings2 },
]

export function AppSidebar({ user }: { user: any }) {
    const pathname = usePathname()

    return (
        <Sidebar collapsible="icon" className="border-r border-border/50 bg-sidebar/50 backdrop-blur-xl">
            <SidebarHeader className="h-16 flex items-center px-6 border-b border-border/50">
                <div className="flex items-center gap-3">
                    <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:rotate-3">
                        <Shield className="size-5" />
                    </div>
                    <div className="flex flex-col gap-0 leading-none group-data-[collapsible=icon]:hidden">
                        <span className="font-black text-base tracking-tight">SECURE</span>
                        <span className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em] -mt-0.5">Hierarchy</span>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent className="px-3 py-6">
                <SidebarGroup>
                    <SidebarMenu className="gap-1.5">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                            return (
                                <SidebarMenuItem key={item.label}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive}
                                        tooltip={item.label}
                                        className="h-11 px-3 rounded-xl transition-all duration-200 hover:bg-primary/5 group data-[active=true]:bg-primary data-[active=true]:shadow-lg data-[active=true]:shadow-primary/20"
                                    >
                                        <Link href={item.href} className="flex items-center gap-3">
                                            <item.icon className={`size-4.5 transition-colors ${isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-primary'}`} />
                                            <span className={`font-bold text-sm tracking-tight ${isActive ? 'text-primary-foreground' : 'text-foreground/70 group-hover:text-foreground'}`}>
                                                {item.label}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-4 border-t border-border/50 bg-muted/5">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="w-full rounded-2xl border border-border/50 bg-background/50 hover:bg-background hover:shadow-md transition-all duration-300 p-2 h-14"
                                >
                                    <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-primary/5 text-primary border border-primary/10">
                                        <User className="size-5" />
                                    </div>
                                    <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden ml-3">
                                        <span className="truncate font-black text-foreground tracking-tight">{user.name}</span>
                                        <span className="truncate text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{user.position}</span>
                                    </div>
                                    <MoreHorizontal className="ml-auto size-4 group-data-[collapsible=icon]:hidden text-muted-foreground/50" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-64 rounded-2xl p-2 shadow-2xl border-border/50 backdrop-blur-xl"
                                side="right"
                                align="end"
                                sideOffset={12}
                            >
                                <div className="px-2 py-2 mb-2 border-b border-border/50">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Account</p>
                                    <p className="text-xs font-bold truncate mt-0.5">{user.email}</p>
                                </div>
                                <DropdownMenuItem asChild className="rounded-xl cursor-pointer focus:bg-destructive/5 focus:text-destructive transition-colors">
                                    <form action={logoutAction} className="w-full">
                                        <button className="flex w-full items-center gap-3 py-2 px-1">
                                            <div className="p-1.5 rounded-lg bg-destructive/10">
                                                <LogOut className="size-4 text-destructive" />
                                            </div>
                                            <span className="font-bold text-sm">Sign out</span>
                                        </button>
                                    </form>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
