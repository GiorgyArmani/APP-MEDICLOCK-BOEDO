import { useEffect, useState, useRef } from "react"
import { getWeekDays, parseShiftTime, getShiftStatusColor, getVisualShiftsForDate, getShiftAreaStyles, getShiftStatusIndicatorColor } from "@/lib/utils/calendar"
import type { Shift, Doctor } from "@/lib/supabase/types"
import { useLanguage } from "@/lib/i18n/language-provider"
import { intlLocales } from "@/lib/i18n/config"

interface WeekViewProps {
    currentDate: Date
    shifts: Shift[]
    onDayClick: (date: Date) => void
    onShiftClick: (shift: Shift) => void
    doctors?: Doctor[]
}

export function WeekView({ currentDate, shifts, onDayClick, onShiftClick, doctors }: WeekViewProps) {
    const { t, locale } = useLanguage()
    const weekDays = getWeekDays(currentDate)
    const hours = Array.from({ length: 24 }, (_, i) => i) // 0 to 23
    const [now, setNow] = useState(new Date())
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    // Refresh "now" every minute
    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 60000)
        return () => clearInterval(interval)
    }, [])

    // Auto-scroll to current time on mount (or reasonable 8:00 AM)
    useEffect(() => {
        if (scrollContainerRef.current) {
            const HOUR_HEIGHT = 60
            const currentHour = now.getHours()
            const scrollTarget = Math.max(0, (currentHour * HOUR_HEIGHT) - 180)
            scrollContainerRef.current.scrollTop = scrollTarget
        }
    }, []) // Only on mount

    // Determine if the current week includes today
    const isCurrentWeek = weekDays.some(d => d.toDateString() === now.toDateString())

    return (
        <div className="flex flex-col h-[600px] sm:h-[750px] border border-slate-200 rounded-xl sm:rounded-2xl bg-slate-50/30 overflow-hidden shadow-xl shadow-slate-200/20 backdrop-blur-sm">
            <div className="flex flex-col min-w-[700px] sm:min-w-[1000px] h-full bg-white overflow-x-auto">
                {/* Clean Header */}
                <div className="flex border-b border-slate-100 bg-white relative z-40">
                    <div className="w-12 sm:w-16 flex-shrink-0 border-r border-slate-100 bg-white" />
                    <div className="flex-1 grid grid-cols-7 divide-x divide-slate-100">
                        {weekDays.map((day, i) => {
                            const isToday = day.toDateString() === now.toDateString()
                            return (
                                <div key={i} className={`py-4 text-center transition-all ${isToday ? 'bg-blue-50/30' : ''}`}>
                                    <div className={`text-[10px] font-bold uppercase mb-1 tracking-widest ${isToday ? 'text-blue-600' : 'text-slate-400'}`}>
                                        {day.toLocaleDateString(intlLocales[locale], { weekday: 'short' }).replace('.', '').slice(0, 3)}
                                    </div>
                                    <div className={`text-xl font-bold w-10 h-10 flex items-center justify-center mx-auto rounded-full transition-all duration-300 ${isToday ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-600 hover:bg-slate-50'}`}>
                                        {day.getDate()}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div
                    ref={scrollContainerRef}
                    className="flex-1 overflow-y-auto relative scroll-smooth scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent"
                >
                    <div className="flex relative min-h-[1440px]">

                        {/* Minimalist Time Labels */}
                        <div className="w-12 sm:w-16 flex-shrink-0 bg-white border-r border-slate-100 relative z-20">
                            {hours.map((hour) => (
                                <div
                                    key={hour}
                                    className="absolute w-full text-right pr-3 text-[10px] text-slate-400 font-medium transform -translate-y-1/2"
                                    style={{ top: hour * 60 }}
                                >
                                    {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                                </div>
                            ))}
                        </div>

                        {/* Clean Grid */}
                        <div className="flex-1 grid grid-cols-7 divide-x divide-slate-50 relative">
                            <div className="absolute inset-0 z-0 pointer-events-none">
                                {hours.map((hour) => (
                                    <div
                                        key={`line-${hour}`}
                                        className="border-t border-slate-100 w-full absolute h-[60px]"
                                        style={{ top: hour * 60 }}
                                    >
                                        <div className="border-t border-slate-50/50 w-full mt-[30px]" />
                                    </div>
                                ))}
                            </div>

                            {/* Precise Current Time Indicator */}
                            {isCurrentWeek && (
                                <div
                                    className="absolute left-0 w-full z-30 pointer-events-none"
                                    style={{ top: `${(now.getHours() * 60) + (now.getMinutes() * (60 / 60))}px` }}
                                >
                                    <div className="absolute left-0 w-full border-t-2 border-blue-500 opacity-40" />
                                    <div className="absolute -left-1 -top-1 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white shadow-sm ring-2 ring-blue-100" />
                                </div>
                            )}

                            {weekDays.map((day, index) => {
                                const isToday = day.toDateString() === now.toDateString()
                                const rawSegments = getVisualShiftsForDate(day, shifts)

                                const clusters: (typeof rawSegments)[] = []
                                const sortedSegments = [...rawSegments].sort((a, b) => (a.start + a.startMinutes / 60) - (b.start + b.startMinutes / 60))

                                sortedSegments.forEach(seg => {
                                    const segStart = seg.start + seg.startMinutes / 60
                                    const lastCluster = clusters[clusters.length - 1]
                                    if (!lastCluster) {
                                        clusters.push([seg])
                                    } else {
                                        const maxEnd = Math.max(...lastCluster.map(s => s.end + s.endMinutes / 60))
                                        if (segStart < maxEnd) lastCluster.push(seg)
                                        else clusters.push([seg])
                                    }
                                })

                                const clustersWithLayout = clusters.map(cluster => {
                                    const columns: (typeof rawSegments)[number][] = []
                                    const shiftToColumn = new Map<string, number>()
                                    cluster.forEach(seg => {
                                        const segStart = seg.start + seg.startMinutes / 60
                                        let colIndex = 0
                                        while (true) {
                                            const prevInCol = columns[colIndex]
                                            if (!prevInCol || segStart >= (prevInCol.end + prevInCol.endMinutes / 60)) {
                                                columns[colIndex] = seg
                                                shiftToColumn.set(seg.shift.id + '-' + seg.start, colIndex)
                                                break
                                            }
                                            colIndex++
                                        }
                                    })
                                    return { cluster, totalCols: columns.length, shiftToColumn }
                                })

                                return (
                                    <div key={index} className={`relative h-full transition-colors ${isToday ? 'bg-blue-50/5' : ''}`} onClick={() => onDayClick(day)}>
                                        {clustersWithLayout.map(({ cluster, totalCols, shiftToColumn }) =>
                                            cluster.map((segment, segIdx) => {
                                                const { shift, start, end, startMinutes, endMinutes, isContinuation, isOvernightStart } = segment
                                                const colIndex = shiftToColumn.get(shift.id + '-' + start) || 0
                                                const top = (start * 60) + (startMinutes * (60 / 60))
                                                let duration = (end + endMinutes / 60) - (start + startMinutes / 60)
                                                if (duration < 0) duration = 0
                                                const height = duration * 60

                                                const areaColors: Record<string, string> = {
                                                    consultorio: 'border-purple-500',
                                                    internacion: 'border-blue-500',
                                                    refuerzo: 'border-orange-500',
                                                    piso: 'border-indigo-500'
                                                }
                                                const accentColor = areaColors[shift.shift_area] || 'border-slate-500'

                                                return (
                                                    <div
                                                        key={`${shift.id}-${start}-${segIdx}`}
                                                        className={`absolute overflow-hidden rounded-md border border-slate-200/60 bg-white shadow-sm hover:shadow-md hover:z-50 transition-all duration-200 cursor-pointer group
                                                            ${isContinuation ? 'rounded-t-none border-t-0' : ''}
                                                            ${isOvernightStart ? 'rounded-b-none border-b-0' : ''}
                                                        `}
                                                        style={{
                                                            top: `${top}px`,
                                                            height: `${Math.max(height, 30)}px`,
                                                            left: `${(colIndex * 100) / totalCols}%`,
                                                            width: `${100 / totalCols}%`,
                                                            zIndex: 10 + colIndex,
                                                            padding: '0' // We'll use inner elements
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            onShiftClick(shift)
                                                        }}
                                                    >
                                                        {/* Color Accent Bar */}
                                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentColor.replace('border-', 'bg-')}`} />

                                                        {/* Translucent Background Overlay */}
                                                        <div className={`absolute inset-0 opacity-[0.07] ${accentColor.replace('border-', 'bg-')}`} />

                                                        <div className="relative p-2 h-full flex flex-col justify-between overflow-hidden">
                                                            <div>
                                                                <div className="flex items-center justify-between gap-1 mb-1">
                                                                    <span className="text-[11px] font-bold text-slate-700 truncate">
                                                                        {isContinuation ? t("calendar.continues") : shift.shift_hours}
                                                                    </span>
                                                                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${getShiftStatusIndicatorColor(shift.status || 'new')}`} />
                                                                </div>
                                                                <div className="text-[10px] font-black uppercase tracking-tight text-slate-800/80 truncate mb-1">
                                                                    {shift.shift_area}
                                                                </div>
                                                                <div className="text-[10px] font-bold text-slate-600 truncate bg-slate-100/50 px-1 rounded inline-block max-w-full">
                                                                    {shift.doctor_id && doctors
                                                                        ? doctors.find(d => d.id === shift.doctor_id)?.full_name || t("calendar.doctor")
                                                                        : t("calendar.free")}
                                                                </div>
                                                            </div>

                                                            {height > 60 && (
                                                                <div className="text-[9px] font-medium text-slate-400 truncate pt-1 border-t border-slate-100/50 italic">
                                                                    {shift.shift_category}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
