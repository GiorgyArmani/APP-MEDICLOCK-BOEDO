"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { signOut } from "@/lib/actions/auth"
import type { Doctor } from "@/lib/supabase/types"
import {
    Calendar,
    CalendarClock,
    ChevronsLeft,
    ChevronsRight,
    Clock,
    FileText,
    LayoutDashboard,
    LogOut,
    MapPin,
    MessageSquare,
    Stethoscope,
    Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/contexts/sidebar-context"
import { useT } from "@/lib/i18n/language-provider"
import { GEOFENCE_ENABLED } from "@/lib/geo/config"
import { UserAvatar, roleLabelKey } from "@/components/layout/user-avatar"

interface AppSidebarProps {
    doctor: Doctor
}

export function AppSidebar({ doctor }: AppSidebarProps) {
    const pathname = usePathname()
    const t = useT()
    const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar()
    const isAdmin = doctor.role === "administrator"
    const isHonorarios = doctor.role === "honorarios"
    const homeHref = isAdmin ? "/admin" : isHonorarios ? "/honorarios" : "/dashboard"

    const navItems = isAdmin
        ? [
            { href: "/admin", label: t("nav.dashboard"), icon: LayoutDashboard },
            { href: "/admin/calendar", label: t("nav.calendar"), icon: Calendar },
            { href: "/admin/my-shifts", label: t("nav.myShifts"), icon: Clock },
            { href: "/admin/doctors", label: t("nav.doctors"), icon: Users },
            { href: "/admin/messages", label: t("nav.messages"), icon: MessageSquare },
            ...(GEOFENCE_ENABLED ? [{ href: "/admin/locations", label: t("nav.locations"), icon: MapPin }] : []),
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
                { href: "/dashboard/shifts", label: t("nav.shifts"), icon: Stethoscope },
                { href: "/dashboard/availability", label: t("nav.availability"), icon: CalendarClock },
                { href: "/dashboard/messages", label: t("nav.messages"), icon: MessageSquare },
            ]

    // A role's home ("/admin") must not stay active on its sub-pages ("/admin/calendar").
    const isActive = (href: string) =>
        href === homeHref ? pathname === href : pathname === href || pathname.startsWith(href + "/")

    const collapsed = isCollapsed && !isMobileOpen

    return (
        <>
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar text-sidebar-foreground transition-[width,transform] duration-300 ease-out",
                    collapsed ? "lg:w-[76px]" : "lg:w-64",
                    "w-72",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                )}
            >
                {/* Brand */}
                <Link
                    href={homeHref}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                        "flex h-16 shrink-0 items-center gap-3 border-b border-white/5 px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sidebar-ring",
                        collapsed && "lg:justify-center lg:px-0",
                    )}
                >
                    <Image src="/logo.svg" alt="MediClock" width={36} height={36} className="h-9 w-9 shrink-0 drop-shadow-lg" />
                    <span className={cn("flex flex-col leading-none", collapsed && "lg:hidden")}>
                        <span className="text-base font-bold tracking-tight">MediClock</span>
                        <span className="mt-1 text-[11px] text-slate-400">{t("nav.appTagline")}</span>
                    </span>
                </Link>

                {/* Navigation */}
                <nav aria-label={t("nav.menuLabel")} className="flex-1 overflow-y-auto px-3 py-5">
                    <p className={cn("mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500", collapsed && "lg:sr-only")}>
                        {t("nav.menuLabel")}
                    </p>
                    <ul className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const active = isActive(item.href)
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={() => setIsMobileOpen(false)}
                                        aria-current={active ? "page" : undefined}
                                        title={collapsed ? item.label : undefined}
                                        className={cn(
                                            "flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                                            active
                                                ? "bg-primary text-white shadow-lg shadow-blue-950/40"
                                                : "text-slate-300 hover:bg-white/5 hover:text-white",
                                            collapsed && "lg:justify-center lg:px-0",
                                        )}
                                    >
                                        <Icon className="h-5 w-5 shrink-0" aria-hidden />
                                        <span className={cn(collapsed && "lg:sr-only")}>{item.label}</span>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>

                {/* Account */}
                <div className="border-t border-white/5 p-3">
                    <div className={cn("flex items-center gap-3 rounded-xl bg-white/[0.04] p-2.5", collapsed && "lg:justify-center lg:bg-transparent lg:p-0 lg:py-1")}>
                        <UserAvatar name={doctor.full_name} className="h-9 w-9" />
                        <div className={cn("min-w-0 flex-1", collapsed && "lg:hidden")}>
                            <p className="truncate text-sm font-semibold">{doctor.full_name}</p>
                            <p className="truncate text-xs text-slate-400">{t(roleLabelKey(doctor.role))}</p>
                        </div>
                    </div>
                    <div className={cn("mt-2 flex gap-1", collapsed && "lg:flex-col")}>
                        <button
                            type="button"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            title={isCollapsed ? t("nav.expand") : t("nav.collapse")}
                            aria-label={isCollapsed ? t("nav.expand") : t("nav.collapse")}
                            className="hidden h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring lg:flex"
                        >
                            {isCollapsed ? <ChevronsRight className="h-4 w-4" aria-hidden /> : <ChevronsLeft className="h-4 w-4" aria-hidden />}
                            <span className={cn(collapsed && "lg:sr-only")}>{t("nav.collapse")}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => signOut()}
                            title={t("nav.logout")}
                            aria-label={t("nav.logout")}
                            className="flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg text-sm text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
                        >
                            <LogOut className="h-4 w-4" aria-hidden />
                            <span className={cn(collapsed && "lg:sr-only")}>{t("nav.logout")}</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile overlay */}
            {isMobileOpen && (
                <div
                    aria-hidden
                    className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[2px] lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}
        </>
    )
}
