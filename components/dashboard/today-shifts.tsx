"use client"

import type { Shift, Doctor } from "@/lib/supabase/types"
import { ShiftCard } from "@/components/dashboard/shift-card"
import { useT } from "@/lib/i18n/language-provider"

interface TodayShiftsProps {
    shifts: Shift[]
    currentDoctor: Doctor
}

export function TodayShifts({ shifts, currentDoctor }: TodayShiftsProps) {
    const t = useT()
    // Get today's date in YYYY-MM-DD format (local time)
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")
    const todayStr = `${year}-${month}-${day}`

    // Filter shifts for today that are assigned to the current doctor
    const todayShifts = shifts.filter(
        (s) => s.shift_date === todayStr && s.doctor_id === currentDoctor.id
    )

    if (todayShifts.length === 0) return null

    return (
        <section className="rounded-3xl border border-emerald-200 bg-gradient-to-b from-emerald-50/80 to-white p-4 sm:p-6">
            <div className="mb-4 flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 motion-safe:animate-ping" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                <h2 className="text-lg font-bold text-slate-900">{t("todayShifts.title")}</h2>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                    {t("todayShifts.inProgress")}
                </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {todayShifts.map((shift) => (
                    <ShiftCard key={shift.id} shift={shift} doctorId={currentDoctor.id} />
                ))}
            </div>
        </section>
    )
}
