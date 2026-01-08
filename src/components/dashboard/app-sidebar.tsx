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
    { href: "#", label: "Settings", icon: Settings2 },
]

export function AppSidebar({ user }: { user: any }) {
    const pathname = usePathname()

    return (
        <Sidebar collapsible="icon" className="border-r bg-sidebar">
            <SidebarHeader className="h-16 flex items-center px-6 border-b">
                <div className="flex items-center gap-3">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                        <Shield className="size-4" />
                    </div>
                    <div className="flex flex-col gap-0 leading-none group-data-[collapsible=icon]:hidden">
                        <span className="font-bold text-sm tracking-tight">SecureHierarchy</span>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Enterprise</span>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent className="px-2 py-4">
                <SidebarGroup>
                    <SidebarMenu>
                        {navItems.map((item) => (
                            <SidebarMenuItem key={item.label}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
                                    tooltip={item.label}
                                    className="h-10 px-3 rounded-lg transition-all hover:bg-sidebar-accent group"
                                >
                                    <Link href={item.href} className="flex items-center gap-3">
                                        <item.icon className="size-4.5 text-muted-foreground group-data-[active=true]:text-primary transition-colors" />
                                        <span className="font-medium text-sm">{item.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-4 border-t">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="w-full rounded-xl border bg-card hover:bg-sidebar-accent transition-all duration-200"
                                >
                                    <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <User className="size-5" />
                                    </div>
                                    <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden ml-2">
                                        <span className="truncate font-bold text-foreground">{user.name}</span>
                                        <span className="truncate text-[10px] text-muted-foreground font-medium">{user.email}</span>
                                    </div>
                                    <MoreHorizontal className="ml-auto size-4 group-data-[collapsible=icon]:hidden text-muted-foreground" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-56 rounded-xl p-2"
                                side="right"
                                align="end"
                                sideOffset={12}
                            >
                                <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                                    <form action={logoutAction} className="w-full">
                                        <button className="flex w-full items-center gap-2 py-1">
                                            <LogOut className="size-4 text-destructive" />
                                            <span className="font-medium">Log out</span>
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
