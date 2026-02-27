"use client"

import { useRouter } from "next/navigation"
import type { Shift, Doctor } from "@/lib/supabase/types"
import { ShiftsCalendar } from "@/components/dashboard/shifts-calendar"

interface HonorariosCalendarProps {
    shifts: Shift[]
    doctors: Doctor[]
    currentDoctor?: Doctor
    /** Year (e.g. 2026) for the initially displayed month */
    initialYear?: number
    /** Month (0-indexed, e.g. 3 = April) for the initially displayed month */
    initialMonth?: number
}

export function HonorariosCalendar({ shifts, doctors, currentDoctor, initialYear, initialMonth }: HonorariosCalendarProps) {
    const router = useRouter()

    // Build the initial date from the provided year/month (or default to today)
    const today = new Date()
    const initialDate = (initialYear !== undefined && initialMonth !== undefined)
        ? new Date(initialYear, initialMonth, 1)
        : today

    // When the user navigates to a new month, push a new URL so the server
    // re-fetches the correct date range (bypassing the 1000-row Supabase limit).
    const handleMonthNavigate = (date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        router.push(`/honorarios/calendar?year=${year}&month=${month}`)
    }

    return (
        <ShiftsCalendar
            shifts={shifts}
            doctors={doctors}
            currentDoctor={currentDoctor}
            initialDate={initialDate}
            onMonthNavigate={handleMonthNavigate}
            readOnly={true}
        />
    )
}
