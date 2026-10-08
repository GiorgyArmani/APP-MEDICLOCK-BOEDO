"use client"

import { ReactNode } from "react"
import { AppHeader } from "@/components/layout/app-header"
import { useSidebar } from "@/contexts/sidebar-context"
import { cn } from "@/lib/utils"
import type { Doctor } from "@/lib/supabase/types"
import { ShiftViewModal } from "@/components/dashboard/shift-view-modal"
import { ShiftHighlighter } from "@/components/dashboard/shift-highlighter"

interface SidebarLayoutContentProps {
    doctor: Doctor
    children: ReactNode
}

export function SidebarLayoutContent({ doctor, children }: SidebarLayoutContentProps) {
    const { isCollapsed } = useSidebar()

    return (
        <div className="flex min-w-0 flex-1 flex-col">
            <AppHeader doctor={doctor} />
            <main
                className={cn(
                    "mt-16 min-h-[calc(100dvh-4rem)] flex-1 bg-[#f6f7f9] transition-[margin] duration-300 ease-out",
                    isCollapsed ? "lg:ml-[76px]" : "lg:ml-64",
                )}
            >
                {children}
            </main>
            <ShiftViewModal currentDoctor={doctor} />
            <ShiftHighlighter />
        </div>
    )
}
