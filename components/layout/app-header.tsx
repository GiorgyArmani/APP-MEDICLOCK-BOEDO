"use client"

import Link from "next/link"
import Image from "next/image"
import { NotificationBell } from "@/components/layout/notification-bell"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Badge } from "@/components/ui/badge"
import type { Doctor } from "@/lib/supabase/types"
import { useSidebar } from "@/contexts/sidebar-context"
import { useT } from "@/lib/i18n/language-provider"
import type { TPath } from "@/lib/i18n/dictionaries"
import { cn } from "@/lib/utils"

interface AppHeaderProps {
    doctor?: Doctor
}

const roleLabelKeys: Record<string, TPath> = {
    doctor: "roles.doctor",
    administrator: "roles.administrator",
    honorarios: "roles.honorarios",
}

export function AppHeader({ doctor }: AppHeaderProps) {
    const t = useT()
    const { isCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar()
    const dashboardLink = doctor?.role === "administrator"
        ? "/admin"
        : doctor?.role === "honorarios"
            ? "/honorarios"
            : "/dashboard"

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 h-16 bg-sidebar text-sidebar-foreground border-b border-sidebar-border z-50 transition-all duration-300"
            )}
        >
            <div className="h-full px-4 flex items-center justify-between">
                {/* App Name/Logo - Link to dashboard on desktop, Toggle sidebar on mobile */}
                <div className="flex items-center gap-3">
                    <Link
                        href={dashboardLink}
                        className="flex items-center gap-3 hover:opacity-80 transition-opacity hidden lg:flex"
                    >
                        <div className="bg-primary p-2 rounded-lg">
                            <Image
                                src="/logo.png"
                                alt="Medi Clock Logo"
                                width={24}
                                height={24}
                                className="h-6 w-6 text-white"
                            />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg">Medi Clock</h1>
                            <p className="text-xs text-sidebar-foreground/60 hidden sm:block">{t("nav.appTagline")}</p>
                        </div>
                    </Link>

                    {/* Mobile version (trigger) */}
                    <div
                        className="flex items-center gap-3 cursor-pointer lg:hidden"
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                    >
                        <div className="bg-primary p-2 rounded-lg">
                            <Image
                                src="/logo.png"
                                alt="Medi Clock Logo"
                                width={24}
                                height={24}
                                className="h-6 w-6 text-white"
                            />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg">Medi Clock</h1>
                            <p className="text-xs text-sidebar-foreground/60 hidden sm:block">{t("nav.appTagline")}</p>
                        </div>
                    </div>
                </div>

                {/* Right side: User Info and Notifications */}
                <div className="flex items-center gap-6">
                    {doctor && (
                        <>
                            <div className="hidden md:flex flex-col items-end">
                                <p className="text-sm font-medium leading-none mb-1">{doctor.full_name}</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-xs text-sidebar-foreground/60 truncate max-w-[150px]">{doctor.email}</p>
                                    <Badge variant="secondary" className="text-[10px] h-4 px-1.5 py-0 bg-sidebar-accent text-sidebar-foreground/80 border-sidebar-border">
                                        {roleLabelKeys[doctor.role] ? t(roleLabelKeys[doctor.role]) : doctor.role}
                                    </Badge>
                                </div>
                            </div>
                            <NotificationBell doctorId={doctor.id} recipientRole={doctor.role} />
                        </>
                    )}
                    <LanguageSwitcher className="text-sidebar-foreground/70 hover:text-sidebar-foreground" />
                </div>
            </div>
        </header>
    )
}
