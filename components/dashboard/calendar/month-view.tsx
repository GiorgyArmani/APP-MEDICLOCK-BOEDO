"use client"

import { generateCalendarDays, getShiftStatusColor, getShiftAreaColor, getShiftStatusIndicatorColor } from "@/lib/utils/calendar"
import type { Shift, Doctor } from "@/lib/supabase/types"
import { useT } from "@/lib/i18n/language-provider"

interface MonthViewProps {
    currentDate: Date
    shifts: Shift[]
    onDayClick: (shifts: Shift[], date: Date) => void
    doctors?: Doctor[]
}

export function MonthView({ currentDate, shifts, onDayClick, doctors }: MonthViewProps) {
    const t = useT()
    const days = generateCalendarDays(currentDate.getFullYear(), currentDate.getMonth())
    const dayNames = [t("calendar.dayShort0"), t("calendar.dayShort1"), t("calendar.dayShort2"), t("calendar.dayShort3"), t("calendar.dayShort4"), t("calendar.dayShort5"), t("calendar.dayShort6")]

    const getShiftsForDay = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0]
        return shifts.filter(s => s.shift_date === dateStr)
    }

    return (
        <div className="flex flex-col border border-slate-200 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/20 bg-white">
            {/* Day Headers */}
            <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
                {dayNames.map((day) => (
                    <div key={day} className="py-2 sm:py-4 text-center text-[8px] sm:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] text-slate-400">
                        {day}
                    </div>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 border-l border-t border-transparent">
                {days.map((dayObj, index) => {
                    const dayShifts = getShiftsForDay(dayObj.date)
                    const hasShifts = dayShifts.length > 0
                    const hasPendingShifts = dayShifts.some((s) => s.status === "new" || s.status === "free_pending")
                    const isToday = dayObj.isToday

                    return (
                        <div
                            key={index}
                            onClick={() => onDayClick(dayShifts, dayObj.date)}
                            className={`min-h-[80px] sm:min-h-[140px] p-1 sm:p-3 transition-all relative group overflow-hidden
                                ${hasShifts ? "cursor-pointer hover:bg-slate-50/50" : "bg-white"} 
                                ${!dayObj.isCurrentMonth ? "bg-slate-50/30 opacity-40 italic" : ""}
                                ${isToday ? "bg-blue-50/30" : ""}
                            `}
                        >
                            <div className="flex flex-col h-full relative z-10">
                                <div className="flex justify-center sm:justify-between items-start mb-1 sm:mb-2">
                                    <span
                                        className={`text-xs sm:text-sm font-black w-5 h-5 sm:w-7 sm:h-7 flex items-center justify-center rounded-full transition-all
                                            ${isToday ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "text-slate-500 group-hover:text-slate-800"}
                                        `}
                                    >
                                        {dayObj.date.getDate()}
                                    </span>
                                    {hasPendingShifts && (
                                        <div className="hidden sm:block w-2 h-2 rounded-full bg-orange-500 shadow-sm ring-4 ring-orange-100 animate-pulse" />
                                    )}
                                </div>

                                {hasShifts && (
                                    <div className="flex-1 space-y-0.5 sm:space-y-1 overflow-hidden pb-1">
                                        {dayShifts.slice(0, 4).map((shift) => {
                                            const solidColors: Record<string, string> = {
                                                consultorio: 'bg-purple-500 text-white',
                                                internacion: 'bg-blue-500 text-white',
                                                refuerzo: 'bg-orange-500 text-white',
                                                piso: 'bg-indigo-500 text-white'
                                            }
                                            const pillStyle = solidColors[shift.shift_area?.toLowerCase()] || 'bg-slate-500 text-white'

                                            return (
                                                <div
                                                    key={shift.id}
                                                    className={`relative text-[8px] sm:text-[9px] px-1 sm:px-1.5 py-0.5 sm:py-1 rounded-[3px] shadow-sm flex items-center gap-1 font-semibold truncate hover:opacity-90 transition-opacity ${pillStyle}`}
                                                    title={`${shift.shift_hours} - ${shift.doctor_id && doctors ? doctors.find(d => d.id === shift.doctor_id)?.full_name : t("calendar.free")}`}
                                                >
                                                    <div className={`hidden sm:block w-1.5 h-1.5 rounded-full shrink-0 ${getShiftStatusIndicatorColor(shift.status || 'new')} border border-white/30`} />
                                                    <span className="truncate flex-1 leading-tight tracking-tight text-center sm:text-left">{shift.shift_hours}</span>
                                                </div>
                                            )
                                        })}
                                        {dayShifts.length > 4 && (
                                            <div className="text-[7px] sm:text-[9px] text-slate-400 font-black px-1 pt-0.5 tracking-tight text-center sm:text-left truncate">
                                                +{dayShifts.length - 4} <span className="hidden sm:inline">{t("calendar.more")}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
