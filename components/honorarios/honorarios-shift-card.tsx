"use client"

import type { Shift, Doctor } from "@/lib/supabase/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserAvatar } from "@/components/layout/user-avatar"
import { cn } from "@/lib/utils"
import { Calendar, CalendarDays, CalendarRange, Clock, MapPin, Moon, Sun } from "lucide-react"
import { SHIFT_TYPES } from "@/lib/constants/shift-types"
import { getShiftTurn, getDayType } from "@/lib/utils/export-utils"

interface HonorariosShiftCardProps {
    shift: Shift
    doctors: Doctor[]
}

export function HonorariosShiftCard({ shift, doctors }: HonorariosShiftCardProps) {
    const statusColors = {
        new: "bg-blue-100 text-blue-800 border-blue-200",
        free: "bg-cyan-100 text-cyan-800 border-cyan-200",
        confirmed: "bg-emerald-100 text-emerald-800 border-emerald-200",
        rejected: "bg-red-100 text-red-800 border-red-200",
        free_pending: "bg-amber-100 text-amber-800 border-amber-200",
    }

    const areaColors = {
        consultorio: "bg-white text-slate-700 border-slate-300",
        internacion: "bg-white text-slate-700 border-slate-300",
        refuerzo: "bg-white text-slate-700 border-slate-300",
        piso: "bg-white text-slate-700 border-slate-300",
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr + "T00:00:00")
        return date.toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    }

    const formatTime = (dateTimeStr: string | null) => {
        if (!dateTimeStr) return "-"
        return new Date(dateTimeStr).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
    }

    const shiftTypeInfo = SHIFT_TYPES.find((st) => st.value === shift.shift_category)
    const shiftLabel = shiftTypeInfo?.label || shift.shift_category

    const assignedDoctor = shift.doctor_id ? doctors.find((d) => d.id === shift.doctor_id) : null

    const turn = getShiftTurn(shift.shift_hours)
    const dayType = getDayType(shift.shift_date)
    const isNight = turn === "Noche"
    const isWeekend = dayType === "Fin de Semana"

    const statusAccent: Record<string, string> = {
        new: "border-l-blue-600",
        free: "border-l-cyan-600",
        confirmed: "border-l-emerald-500",
        rejected: "border-l-red-500",
        free_pending: "border-l-amber-500",
    }

    return (
        <Card className={cn("border-l-4 py-0 transition-shadow duration-200 hover:shadow-md", statusAccent[shift.status])}>
            <CardContent className="p-5 sm:p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="text-lg font-bold tracking-tight text-slate-900">{shiftLabel}</h3>
                            <Badge className={statusColors[shift.status as keyof typeof statusColors]}>
                                {shift.status === "new"
                                    ? "Nueva"
                                    : shift.status === "free"
                                        ? "Libre"
                                        : shift.status === "confirmed"
                                            ? "Confirmada"
                                            : shift.status === "rejected"
                                                ? "Rechazada"
                                                : "Pendiente +12h"}
                            </Badge>
                            <Badge variant="outline">
                                {shift.shift_type === "assigned" ? "Asignada" : "Libre"}
                            </Badge>
                            {(() => {
                                const today = new Date()
                                const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
                                return shift.shift_date === todayStr && (
                                    <Badge className="bg-emerald-600 text-white border-emerald-700 shadow-sm motion-safe:animate-pulse">
                                        HOY
                                    </Badge>
                                )
                            })()}
                        </div>
                        {assignedDoctor && (
                            <p className="mt-1 flex items-center gap-2 text-sm text-slate-700">
                                <UserAvatar name={assignedDoctor.full_name} className="h-6 w-6 text-[10px] ring-0" />
                                <span className="font-semibold">{assignedDoctor.full_name}</span>
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 rounded-xl bg-slate-50 p-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <Badge className={areaColors[shift.shift_area === "completo" ? "consultorio" : (shift.shift_area as keyof typeof areaColors)]}>
                            {shift.shift_area === "consultorio" || shift.shift_area === "completo"
                                ? "Consultorio"
                                : shift.shift_area === "internacion"
                                    ? "Internación"
                                    : shift.shift_area === "piso"
                                        ? "Piso"
                                        : "Refuerzo"}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span className="font-semibold tabular-nums text-slate-800">{shift.shift_hours}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 md:col-span-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="first-letter:uppercase">{formatDate(shift.shift_date)}</span>
                    </div>
                </div>

                {/* Turno + Tipo de Día badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <Badge
                        className={isNight
                            ? "gap-1 bg-slate-900 text-white border-slate-900"
                            : "gap-1 bg-amber-100 text-amber-800 border-amber-200"}
                    >
                        {isNight ? <Moon className="h-3 w-3" aria-hidden /> : <Sun className="h-3 w-3" aria-hidden />}
                        {isNight ? "Turno Noche" : "Turno Día"}
                    </Badge>
                    <Badge
                        className={isWeekend
                            ? "gap-1 bg-blue-100 text-blue-800 border-blue-200"
                            : "gap-1 bg-slate-100 text-slate-700 border-slate-200"}
                    >
                        {isWeekend ? <CalendarRange className="h-3 w-3" aria-hidden /> : <CalendarDays className="h-3 w-3" aria-hidden />}
                        {isWeekend ? "Fin de Semana" : "Semana"}
                    </Badge>
                </div>

                {/* Clock In/Out Times - Prominent Display */}
                <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-2 gap-4">
                    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                        <span className="font-semibold text-emerald-700 block uppercase text-xs mb-1">Entrada</span>
                        <span className="text-lg font-bold text-emerald-900">{formatTime(shift.clock_in)}</span>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
                        <span className="font-semibold text-blue-700 block uppercase text-xs mb-1">Salida</span>
                        <span className="text-lg font-bold text-blue-900">{formatTime(shift.clock_out)}</span>
                    </div>
                </div>

                {shift.notes && (
                    <div className="mt-4 rounded-xl border border-slate-200 p-3">
                        <p className="text-sm text-slate-700">
                            <span className="font-medium">Notas Admin:</span> {shift.notes}
                        </p>
                    </div>
                )}

                {shift.doctor_notes && (
                    <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
                        <p className="text-sm text-amber-900">
                            <span className="font-medium">Notas del Médico:</span> {shift.doctor_notes}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
