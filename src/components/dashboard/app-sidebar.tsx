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

export function AppSidebar({ user, unreadCount = 0 }: { user: any, unreadCount?: number }) {
    const pathname = usePathname()

    return (
        <Sidebar collapsible="icon" className="border-r border-border bg-sidebar">
            <SidebarHeader className="h-16 flex items-center px-6 border-b border-border">
                <div className="flex items-center gap-3">
                    <div className="flex aspect-square size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <Shield className="size-5" />
                    </div>
                    <div className="flex flex-col gap-0 leading-none group-data-[collapsible=icon]:hidden">
                        <span className="font-bold text-base tracking-tight">SECURE</span>
                        <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider -mt-0.5">Hierarchy</span>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent className="px-3 py-4">
                <SidebarGroup>
                    <SidebarMenu className="gap-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                            return (
                                <SidebarMenuItem key={item.label}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive}
                                        tooltip={item.label}
                                        className="h-10 px-3 rounded-md transition-colors hover:bg-accent group data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                                    >
                                        <Link href={item.href} className="flex items-center gap-3 justify-between w-full">
                                            <div className="flex items-center gap-3">
                                                <item.icon className={`size-4.5 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'}`} />
                                                <span className={`font-medium text-sm ${isActive ? 'text-primary-foreground' : 'text-foreground/80 group-hover:text-foreground'}`}>
                                                    {item.label}
                                                </span>
                                            </div>
                                            {item.label === 'Letters' && unreadCount > 0 && (
                                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-4 border-t border-border bg-muted/30">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="w-full rounded-md border border-border bg-background hover:bg-accent transition-colors p-2 h-12"
                                >
                                    <div className="flex aspect-square size-8 items-center justify-center rounded bg-primary/10 text-primary">
                                        <User className="size-4" />
                                    </div>
                                    <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden ml-3">
                                        <span className="truncate font-semibold text-foreground">{user.name}</span>
                                        <span className="truncate text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{user.position}</span>
                                    </div>
                                    <MoreHorizontal className="ml-auto size-4 group-data-[collapsible=icon]:hidden text-muted-foreground" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-64 rounded-lg p-1 shadow-lg border border-border bg-popover"
                                side="right"
                                align="end"
                                sideOffset={12}
                            >
                                <div className="px-2 py-1.5 mb-1 border-b border-border">
                                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Account</p>
                                    <p className="text-xs font-medium truncate mt-0.5">{user.email}</p>
                                </div>
                                <DropdownMenuItem asChild className="rounded-md cursor-pointer focus:bg-destructive/10 focus:text-destructive transition-colors">
                                    <form action={logoutAction} className="w-full">
                                        <button className="flex w-full items-center gap-3 py-1.5 px-2">
                                            <LogOut className="size-4" />
                                            <span className="font-medium text-sm">Sign out</span>
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

