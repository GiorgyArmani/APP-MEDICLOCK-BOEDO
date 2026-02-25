"use client"

import { parseShiftTime, getShiftStatusColor, getVisualShiftsForDate, getShiftAreaStyles, getShiftStatusIndicatorColor } from "@/lib/utils/calendar"
import type { Shift } from "@/lib/supabase/types"

interface DayViewProps {
    currentDate: Date
    shifts: Shift[]
    onShiftClick: (shift: Shift) => void
}

export function DayView({ currentDate, shifts, onShiftClick }: DayViewProps) {
    const hours = Array.from({ length: 24 }, (_, i) => i) // 0 to 23

    // Filter shifts for the specific day and prepare segments
    const rawSegments = getVisualShiftsForDate(currentDate, shifts)

    // Layout Algorithm: Group and assign columns
    const segmentsWithLayout = useMemo(() => {
        // ... (layout algorithm lines 20-145)
        // 1. Sort by start time, then duration (longer first to optimize packing)
        const sorted = [...rawSegments].sort((a, b) => {
            const startA = a.start + a.startMinutes / 60
            const startB = b.start + b.startMinutes / 60
            if (Math.abs(startA - startB) > 0.01) return startA - startB
            const endA = a.end + a.endMinutes / 60
            const endB = b.end + b.endMinutes / 60
            return (endB - startB) - (endA - startA) // Longest first if same start
        })

        // 2. Resolve intersections
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

            if (!columns[colIndex]) {
                columns[colIndex] = []
            }
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
                const segEnd = seg.end + seg.endMinutes / 60

                let colIndex = 0
                while (true) {
                    const col = clusterCols[colIndex] || []
                    const hasOverlap = col.some(existing => {
                        const exStart = existing.start + existing.startMinutes / 60
                        const exEnd = existing.end + existing.endMinutes / 60
                        return (segStart < exEnd) && (segEnd > exStart)
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


    const HOUR_HEIGHT = 40

    return (
        <div className="flex flex-col h-[600px] border rounded-lg bg-white overflow-hidden">
            {/* Header */}
            <div className="flex border-b bg-slate-50 py-3 px-4">
                <div className="w-16 flex-shrink-0" />
                <div className="flex-1 text-center">
                    <h2 className="text-xl font-bold text-slate-800 capitalize">
                        {currentDate.toLocaleDateString("es-ES", { weekday: 'long', day: 'numeric', month: 'long' })}
                    </h2>
                    <p className="text-sm text-slate-500">
                        {rawSegments.length} {rawSegments.length === 1 ? 'guardia programada' : 'guardias programadas'}
                    </p>
                </div>
            </div>

            {/* Body: Time Grid */}
            <div className="flex-1 overflow-y-auto relative">
                <div className="flex relative min-h-[960px]">

                    {/* Time Labels */}
                    <div className="w-16 flex-shrink-0 bg-slate-50 border-r relative select-none">
                        {hours.map((hour) => (
                            <div
                                key={hour}
                                className="absolute w-full text-right pr-2 text-xs text-slate-400 -mt-2"
                                style={{ top: hour * HOUR_HEIGHT }} // 40px per hour
                            >
                                {hour}:00
                            </div>
                        ))}
                    </div>

                    {/* Grid Content */}
                    <div className="flex-1 relative">
                        {/* Horizontal Grid Lines */}
                        <div className="absolute inset-0 z-0 pointer-events-none">
                            {hours.map((hour) => (
                                <div
                                    key={`line-${hour}`}
                                    className="border-t border-slate-100 w-full absolute"
                                    style={{ top: hour * HOUR_HEIGHT }}
                                />
                            ))}
                        </div>

                        {/* Shifts */}
                        {segmentsWithLayout.map((segment, index) => {
                            const { shift, start, end, startMinutes, endMinutes, isContinuation, isOvernightStart, colIndex, totalCols } = segment

                            // Calculate position
                            const top = (start * HOUR_HEIGHT) + (startMinutes * (HOUR_HEIGHT / 60))

                            let durationHours = end - start
                            let durationMinutes = endMinutes - startMinutes
                            if (durationHours < 0) durationHours = 0 // Safety

                            const height = (durationHours * HOUR_HEIGHT) + (durationMinutes * (HOUR_HEIGHT / 60))

                            const widthPercent = 100 / totalCols
                            const leftPercent = colIndex * widthPercent

                            return (
                                <div
                                    key={`${shift.id}-${index}`}
                                    className={`absolute rounded-md p-2.5 border shadow-sm cursor-pointer hover:shadow-lg hover:z-50 transition-all flex flex-col justify-start overflow-hidden
                            ${getShiftAreaStyles(shift.shift_area)}
                            ${isContinuation ? 'rounded-t-none border-t-0 opacity-90' : ''}
                            ${isOvernightStart ? 'rounded-b-none border-b-0' : ''}
                        `}
                                    style={{
                                        top: `${top}px`,
                                        height: `${Math.max(height, 50)}px`,
                                        left: `${leftPercent}%`,
                                        width: `${widthPercent}%`,
                                        zIndex: 10 + colIndex
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onShiftClick(shift)
                                    }}
                                    title={`${shift.shift_hours} - ${shift.shift_category} (${shift.status})`}
                                >
                                    <div className="flex justify-between items-start gap-1">
                                        <div className="min-w-0 flex-1">
                                            <div className="font-bold text-xs sm:text-sm truncate leading-tight">
                                                {isContinuation ? 'Cont. ' : ''}{shift.shift_hours}
                                            </div>
                                            <div className="font-bold text-xs truncate leading-tight opacity-90">{shift.shift_category}</div>
                                        </div>
                                        <div className={`w-2 h-2 rounded-full shrink-0 mt-1 shadow-sm ${getShiftStatusIndicatorColor(shift.status || 'new')}`} />
                                    </div>
                                    <div className="mt-1 text-xs opacity-80 font-medium truncate uppercase tracking-wider">
                                        {shift.shift_area}
                                    </div>
                                    {shift.notes && totalCols < 4 && (
                                        <div className="mt-1 text-[10px] opacity-75 truncate max-w-full">
                                            {shift.notes}
                                        </div>
                                    )}
                                </div>
                            )
                        })}

                        {/* Empty State message if no shifts */}
                        {rawSegments.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-400 pointer-events-none">
                                <p>No hay guardias programadas para este día</p>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    )
}
// Helper hooks
import { useMemo } from "react"
