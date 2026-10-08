"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"
import { NotificationBell } from "@/components/layout/notification-bell"
import { LanguageSwitcher } from "@/components/language-switcher"
import { UserAvatar, roleLabelKey } from "@/components/layout/user-avatar"
import type { Doctor } from "@/lib/supabase/types"
import { useSidebar } from "@/contexts/sidebar-context"
import { useLanguage } from "@/lib/i18n/language-provider"
import { intlLocales } from "@/lib/i18n/config"
import { cn } from "@/lib/utils"

interface AppHeaderProps {
    doctor?: Doctor
}

export function AppHeader({ doctor }: AppHeaderProps) {
    const { t, locale } = useLanguage()
    const { isCollapsed, setIsMobileOpen } = useSidebar()
    const homeHref = doctor?.role === "administrator" ? "/admin" : doctor?.role === "honorarios" ? "/honorarios" : "/dashboard"

    // Rendered after mount so server and client never disagree on the date.
    const [today, setToday] = useState("")
    useEffect(() => {
        setToday(
            new Date().toLocaleDateString(intlLocales[locale], {
                weekday: "long",
                day: "numeric",
                month: "long",
                timeZone: "America/Argentina/Buenos_Aires",
            }),
        )
    }, [locale])

    return (
        <header
            className={cn(
                "fixed right-0 top-0 z-30 h-16 border-b border-slate-200/80 bg-white/85 backdrop-blur-lg transition-[left] duration-300 ease-out",
                "left-0",
                isCollapsed ? "lg:left-[76px]" : "lg:left-64",
            )}
        >
            <div className="flex h-full items-center gap-3 px-4 sm:px-6">
                <button
                    type="button"
                    onClick={() => setIsMobileOpen(true)}
                    aria-label={t("nav.openMenu")}
                    className="-ml-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
                >
                    <Menu className="h-5 w-5" aria-hidden />
                </button>

                <Link href={homeHref} className="flex items-center gap-2 lg:hidden">
                    <Image src="/logo.svg" alt="" width={32} height={32} className="h-8 w-8" />
                    <span className="text-base font-bold tracking-tight text-slate-900">MediClock</span>
                </Link>

                <p className="hidden text-sm font-medium text-slate-500 first-letter:uppercase lg:block">{today}</p>

                <div className="ml-auto flex items-center gap-1 sm:gap-2">
                    <LanguageSwitcher className="h-10 text-slate-600 hover:text-slate-900" />
                    {doctor && (
                        <>
                            <NotificationBell doctorId={doctor.id} recipientRole={doctor.role} />
                            <div className="ml-1 hidden items-center gap-3 border-l border-slate-200 pl-4 md:flex">
                                <div className="text-right leading-tight">
                                    <p className="max-w-[180px] truncate text-sm font-semibold text-slate-900">{doctor.full_name}</p>
                                    <p className="text-xs text-slate-500">{t(roleLabelKey(doctor.role))}</p>
                                </div>
                                <UserAvatar name={doctor.full_name} className="h-9 w-9 ring-slate-100" />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
