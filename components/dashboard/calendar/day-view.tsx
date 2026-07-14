"use client"

import { parseShiftTime, getShiftStatusColor, getVisualShiftsForDate, getShiftAreaStyles, getShiftStatusIndicatorColor } from "@/lib/utils/calendar"
import type { Shift, Doctor } from "@/lib/supabase/types"
import { useLanguage } from "@/lib/i18n/language-provider"
import { intlLocales } from "@/lib/i18n/config"

interface DayViewProps {
    currentDate: Date
    shifts: Shift[]
    onShiftClick: (shift: Shift) => void
    doctors?: Doctor[]
}

export function DayView({ currentDate, shifts, onShiftClick, doctors }: DayViewProps) {
    const { t, locale } = useLanguage()
    const hours = Array.from({ length: 24 }, (_, i) => i) // 0 to 23
    const [now, setNow] = useState(new Date())

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 60000)
        return () => clearInterval(interval)
    }, [])

    const rawSegments = getVisualShiftsForDate(currentDate, shifts)

    const segmentsWithLayout = useMemo(() => {
        const sorted = [...rawSegments].sort((a, b) => {
            const startA = a.start + a.startMinutes / 60
            const startB = b.start + b.startMinutes / 60
            if (Math.abs(startA - startB) > 0.01) return startA - startB
            const endA = a.end + a.endMinutes / 60
            const endB = b.end + b.endMinutes / 60
            return (endB - startB) - (endA - startA)
        })

        const columns: (typeof rawSegments)[] = []
        const positionedSegments = sorted.map(segment => {
            const segStart = segment.start + segment.startMinutes / 60
            const segEnd = segment.end + segment.endMinutes / 60
            let colIndex = 0
            for (let i = 0; i < columns.length; i++) {
                const column = columns[i]
                const hasOverlap = column.some(existing => {
                    const exStart = existing.start + existing.startMinutes / 60
                    const exEnd = existing.end + existing.endMinutes / 60
                    return (segStart < exEnd) && (segEnd > exStart)
                })
                if (!hasOverlap) {
                    colIndex = i
                    break
                }
                colIndex = i + 1
            }
            if (!columns[colIndex]) columns[colIndex] = []
            columns[colIndex].push(segment)
            return { ...segment, colIndex }
        })

        const clusters: { start: number, end: number, segments: typeof positionedSegments }[] = []
        positionedSegments.sort((a, b) => (a.start + a.startMinutes / 60) - (b.start + b.startMinutes / 60))

        for (const seg of positionedSegments) {
            const segStart = seg.start + seg.startMinutes / 60
            const segEnd = seg.end + seg.endMinutes / 60
            const cluster = clusters.find(c => segStart < c.end)
            if (cluster) {
                cluster.segments.push(seg)
                cluster.end = Math.max(cluster.end, segEnd)
            } else {
                clusters.push({ start: segStart, end: segEnd, segments: [seg] })
            }
        }

        const finalSegments: any[] = []
        clusters.forEach(cluster => {
            const clusterCols: any[][] = []
            const placements: { segment: any, colIndex: number }[] = []
            cluster.segments.forEach(seg => {
                const segStart = seg.start + seg.startMinutes / 60
                let colIndex = 0
                while (true) {
                    const col = clusterCols[colIndex] || []
                    const hasOverlap = col.some(existing => {
                        const exStart = existing.start + existing.startMinutes / 60
                        const exEnd = existing.end + existing.endMinutes / 60
                        return (segStart < exEnd) && (segStart + (seg.end - seg.start) + (seg.endMinutes - seg.startMinutes) / 60 > exStart)
                    })
                    if (!hasOverlap) {
                        if (!clusterCols[colIndex]) clusterCols[colIndex] = []
                        clusterCols[colIndex].push(seg)
                        placements.push({ segment: seg, colIndex })
                        break
                    }
                    colIndex++
                }
            })
            const total = clusterCols.length
            placements.forEach(p => {
                finalSegments.push({
                    ...p.segment,
                    colIndex: p.colIndex,
                    totalCols: total
                })
            })
        })
        return finalSegments
    }, [rawSegments])

    const HOUR_HEIGHT = 60
    const isToday = currentDate.toDateString() === now.toDateString()

    return (
        <div className="flex flex-col h-[600px] sm:h-[750px] border border-slate-200 rounded-xl sm:rounded-2xl bg-white overflow-hidden shadow-xl shadow-slate-200/20">
            {/* Header */}
            <div className="flex flex-col border-b border-slate-100 bg-white/80 backdrop-blur-md px-4 py-4 sm:px-8 sm:py-6">
                <h2 className="text-xl sm:text-3xl font-bold text-slate-800 capitalize mb-1">
                    {currentDate.toLocaleDateString(intlLocales[locale], { weekday: 'long', day: 'numeric', month: 'long' })}
                </h2>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        {rawSegments.length} {rawSegments.length === 1 ? t("calendar.guardiaSingular") : t("calendar.guardiaPlural")}
                    </span>
                    <span className="text-sm text-slate-400 font-medium">{t("calendar.scheduledToday")}</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto relative scroll-smooth scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                <div className="flex relative min-h-[1440px]">
                    {/* Time Labels */}
                    <div className="w-20 flex-shrink-0 bg-white border-r border-slate-100 relative z-20">
                        {hours.map((hour) => (
                            <div
                                key={hour}
                                className="absolute w-full text-right pr-4 text-[11px] text-slate-400 font-bold transform -translate-y-1/2"
                                style={{ top: hour * HOUR_HEIGHT }}
                            >
                                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                            </div>
                        ))}
                    </div>

                    {/* Grid Content */}
                    <div className="flex-1 relative">
                        <div className="absolute inset-0 z-0 pointer-events-none">
                            {hours.map((hour) => (
                                <div
                                    key={`line-${hour}`}
                                    className="border-t border-slate-100 w-full absolute h-[60px]"
                                    style={{ top: hour * HOUR_HEIGHT }}
                                >
                                    <div className="border-t border-slate-50/50 w-full mt-[30px]" />
                                </div>
                            ))}
                        </div>

                        {/* Current Time Indicator */}
                        {isToday && (
                            <div
                                className="absolute left-0 w-full z-30 pointer-events-none"
                                style={{ top: `${(now.getHours() * HOUR_HEIGHT) + (now.getMinutes() * (HOUR_HEIGHT / 60))}px` }}
                            >
                                <div className="absolute left-0 w-full border-t-2 border-blue-500 opacity-40" />
                                <div className="absolute -left-1 -top-1 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white shadow-sm ring-2 ring-blue-100" />
                            </div>
                        )}

                        {/* Shifts */}
                        {segmentsWithLayout.map((segment, index) => {
                            const { shift, start, end, startMinutes, endMinutes, isContinuation, isOvernightStart, colIndex, totalCols } = segment
                            const top = (start * HOUR_HEIGHT) + (startMinutes * (HOUR_HEIGHT / 60))
                            let durationHours = (end + endMinutes / 60) - (start + startMinutes / 60)
                            const height = durationHours * HOUR_HEIGHT

                            const areaColors: Record<string, string> = {
                                consultorio: 'border-purple-500',
                                internacion: 'border-blue-500',
                                refuerzo: 'border-orange-500',
                                piso: 'border-indigo-500'
                            }
                            const accentColor = areaColors[shift.shift_area] || 'border-slate-500'

                            return (
                                <div
                                    key={`${shift.id}-${index}`}
                                    className={`absolute overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm hover:shadow-xl hover:z-50 transition-all duration-300 cursor-pointer group
                                        ${isContinuation ? 'rounded-t-none border-t-0' : ''}
                                        ${isOvernightStart ? 'rounded-b-none border-b-0' : ''}
                                    `}
                                    style={{
                                        top: `${top}px`,
                                        height: `${Math.max(height, 50)}px`,
                                        left: `${(colIndex * 100) / totalCols}%`,
                                        width: `${100 / totalCols}%`,
                                        zIndex: 10 + colIndex
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onShiftClick(shift)
                                    }}
                                >
                                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${accentColor.replace('border-', 'bg-')}`} />
                                    <div className={`absolute inset-0 opacity-[0.08] ${accentColor.replace('border-', 'bg-')}`} />

                                    <div className="relative p-4 h-full flex flex-col justify-between overflow-hidden">
                                        <div>
                                            <div className="flex items-center justify-between gap-2 mb-2">
                                                <span className="text-sm font-black text-slate-800">
                                                    {isContinuation ? t("calendar.continues") : shift.shift_hours}
                                                </span>
                                                <div className={`w-3 h-3 rounded-full shrink-0 border-2 border-white shadow-sm ${getShiftStatusIndicatorColor(shift.status || 'new')}`} />
                                            </div>
                                            <div className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">
                                                {shift.shift_area}
                                            </div>
                                            <div className="text-xs font-bold text-slate-700 bg-slate-100/80 px-2 py-1 rounded inline-block max-w-full">
                                                {shift.doctor_id && doctors
                                                    ? doctors.find(d => d.id === shift.doctor_id)?.full_name || t("calendar.doctor")
                                                    : t("calendar.free")}
                                            </div>
                                        </div>

                                        {(height > 80 || totalCols < 2) && (
                                            <div className="flex items-center gap-2 pt-2 border-t border-slate-100/50">
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                                    {shift.shift_category}
                                                </div>
                                                {shift.notes && (
                                                    <span className="text-[10px] text-slate-400 italic truncate flex-1">— {shift.notes}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}

                        {rawSegments.length === 0 && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 pointer-events-none">
                                <span className="text-5xl mb-4 text-slate-100">📅</span>
                                <p className="font-bold text-lg">{t("calendar.noShiftsDay")}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

import { useMemo, useState, useEffect, useRef } from "react"
