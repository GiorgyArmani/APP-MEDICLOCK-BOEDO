"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "@/lib/actions/auth"
import type { Doctor } from "@/lib/supabase/types"
import { Button } from "@/components/ui/button"
import { Calendar, LayoutDashboard, Clock, Users, LogOut, Menu, FileText, MessageSquare } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useSidebar } from "@/contexts/sidebar-context"
import { useT } from "@/lib/i18n/language-provider"

interface AppSidebarProps {
    doctor: Doctor
}

export function AppSidebar({ doctor }: AppSidebarProps) {
    const pathname = usePathname()
    const t = useT()
    const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar()
    const isAdmin = doctor.role === "administrator"
    const isHonorarios = doctor.role === "honorarios"

    const navItems = isAdmin
        ? [
            { href: "/admin", label: t("nav.dashboard"), icon: LayoutDashboard },
            { href: "/admin/calendar", label: t("nav.calendar"), icon: Calendar },
            { href: "/admin/my-shifts", label: t("nav.myShifts"), icon: Clock },
            { href: "/admin/doctors", label: t("nav.doctors"), icon: Users },
            { href: "/admin/messages", label: t("nav.messages"), icon: MessageSquare },
        ]
        : isHonorarios
            ? [
                { href: "/honorarios", label: t("nav.dashboard"), icon: LayoutDashboard },
                { href: "/honorarios/calendar", label: t("nav.calendar"), icon: Calendar },
                { href: "/honorarios/reports", label: t("nav.reports"), icon: FileText },
            ]
            : [
                { href: "/dashboard", label: t("nav.dashboard"), icon: LayoutDashboard },
                { href: "/dashboard/calendar", label: t("nav.calendar"), icon: Calendar },
                { href: "/dashboard/shifts", label: t("nav.shifts"), icon: Users },
                { href: "/dashboard/availability", label: t("nav.availability"), icon: Clock },
                { href: "/dashboard/messages", label: t("nav.messages"), icon: MessageSquare },
            ]

    const handleLogout = async () => {
        await signOut()
    }

    return (
        <>

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-16 h-[calc(100%-4rem)] bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 z-40 border-r border-sidebar-border",
                    isCollapsed ? "w-20" : "w-64",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                    isActive
                                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                                    isCollapsed && "justify-center"
                                )}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <Icon className="h-5 w-5" />
                                {!isCollapsed && <span className="font-medium">{item.label}</span>}
                            </Link>
                        )
                    })}
                </nav>

                {/* Collapse Toggle Button (Desktop only) */}
                <div className="hidden lg:block p-4 border-t border-sidebar-border">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full gap-3 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                            isCollapsed ? "justify-center" : "justify-start"
                        )}
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        title={isCollapsed ? t("nav.expand") : t("nav.collapse")}
                    >
                        {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                        {!isCollapsed && <span>{t("nav.collapse")}</span>}
                    </Button>
                </div>

                {/* Logout */}
                <div className="p-4 border-t border-sidebar-border">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full gap-3 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                            isCollapsed ? "justify-center" : "justify-start"
                        )}
                        onClick={handleLogout}
                        title={isCollapsed ? t("nav.logout") : undefined}
                    >
                        <LogOut className="h-5 w-5" />
                        {!isCollapsed && <span>{t("nav.logout")}</span>}
                    </Button>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}
        </>
    )
}
