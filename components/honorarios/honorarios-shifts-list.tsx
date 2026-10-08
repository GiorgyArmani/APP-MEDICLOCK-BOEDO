"use client"

import { useState, useMemo } from "react"
import { startOfMonth, endOfMonth } from "date-fns"
import type { Shift, Doctor } from "@/lib/supabase/types"
import { HonorariosShiftCard } from "./honorarios-shift-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShiftsFilter } from "@/components/admin/shifts-filter"
import { Button } from "@/components/ui/button"
import { Download, Calendar as CalendarIcon, Users, Clock, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"
import { ShiftsCalendar } from "@/components/dashboard/shifts-calendar"
import { getShiftTurn, getDayType } from "@/lib/utils/export-utils"

interface HonorariosShiftsListProps {
    shifts: Shift[]
    doctors: Doctor[]
}

export function HonorariosShiftsList({ shifts, doctors }: HonorariosShiftsListProps) {
    const [isMounted, setIsMounted] = useState(false)
    const [filterDoctorId, setFilterDoctorId] = useState<string>("all")
    const [filterArea, setFilterArea] = useState<string>("all")
    const [filterShiftTurn, setFilterShiftTurn] = useState<string>("all")
    const [filterDayType, setFilterDayType] = useState<string>("all")
    const [dateFrom, setDateFrom] = useState<Date | undefined>(startOfMonth(new Date()))
    const [dateTo, setDateTo] = useState<Date | undefined>(endOfMonth(new Date()))

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const filteredShifts = useMemo(() => {
        return shifts.filter((shift) => {
            const matchesDoctor = filterDoctorId === "all" || shift.doctor_id === filterDoctorId
            const matchesArea = filterArea === "all" || shift.shift_area === filterArea

            // Turno filter
            const turn = getShiftTurn(shift.shift_hours)
            const matchesTurn =
                filterShiftTurn === "all" ||
                (filterShiftTurn === "dia" && turn === "Día") ||
                (filterShiftTurn === "noche" && turn === "Noche")

            // Day type filter
            const dayType = getDayType(shift.shift_date)
            const matchesDayType =
                filterDayType === "all" ||
                (filterDayType === "semana" && dayType === "Semana") ||
                (filterDayType === "finde" && dayType === "Fin de Semana")

            // Date filtering
            const shiftDate = new Date(shift.shift_date + "T00:00:00")
            const matchesDateFrom = !dateFrom || shiftDate >= dateFrom
            const matchesDateTo = !dateTo || shiftDate <= dateTo

            return matchesDoctor && matchesArea && matchesTurn && matchesDayType && matchesDateFrom && matchesDateTo
        })
    }, [shifts, filterDoctorId, filterArea, filterShiftTurn, filterDayType, dateFrom, dateTo])

    const newShifts = filteredShifts.filter((s) => s.status === "new")
    const freeShifts = filteredShifts.filter((s) => s.status === "free" || s.status === "free_pending")
    const confirmedShifts = filteredShifts.filter((s) => s.status === "confirmed")
    const confirmedCount = confirmedShifts.length
    const pendingCount = newShifts.length + freeShifts.length

    const clearFilters = () => {
        setFilterDoctorId("all")
        setFilterArea("all")
        setFilterShiftTurn("all")
        setFilterDayType("all")
        setDateFrom(undefined)
        setDateTo(undefined)
    }

    if (!isMounted) return null

    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {[
                    { title: "Total Filtrado", value: filteredShifts.length, hint: "Guardias encontradas", icon: CalendarIcon, tone: "bg-blue-50 text-blue-700" },
                    { title: "Pendientes", value: pendingCount, hint: "En el rango seleccionado", icon: Clock, tone: "bg-amber-50 text-amber-700" },
                    { title: "Confirmadas", value: confirmedCount, hint: "Listas para liquidar", icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-700" },
                    { title: "Médicos", value: new Set(filteredShifts.map((s) => s.doctor_id).filter(Boolean)).size, hint: "Personal en este período", icon: Users, tone: "bg-slate-100 text-slate-700" },
                ].map(({ title, value, hint, icon: Icon, tone }) => (
                    <div
                        key={title}
                        className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.06)] sm:p-5"
                    >
                        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
                            <Icon className="h-5 w-5" aria-hidden />
                        </span>
                        <div>
                            <p className="text-3xl font-extrabold leading-none tracking-tight text-slate-900 tabular-nums">{value}</p>
                            <p className="mt-1.5 text-sm font-semibold text-slate-700">{title}</p>
                            <p className="text-xs text-slate-500">{hint}</p>
                        </div>
                    </div>
                ))}
            </div>

            <ShiftsFilter
                doctors={doctors}
                filterDoctorId={filterDoctorId}
                setFilterDoctorId={setFilterDoctorId}
                filterArea={filterArea}
                setFilterArea={setFilterArea}
                filterShiftTurn={filterShiftTurn}
                setFilterShiftTurn={setFilterShiftTurn}
                filterDayType={filterDayType}
                setFilterDayType={setFilterDayType}
                dateFrom={dateFrom}
                setDateFrom={setDateFrom}
                dateTo={dateTo}
                setDateTo={setDateTo}
                onClear={clearFilters}
            />

            <Card className="overflow-hidden">
                <CardHeader className="bg-white border-b border-slate-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex flex-col gap-1">
                            <CardTitle className="text-xl font-bold text-slate-900">Gestión de Guardias</CardTitle>
                            <CardDescription>Consulta el calendario y lista detallada de guardias</CardDescription>
                        </div>
                        <Link href="/honorarios/reports">
                            <Button className="bg-primary hover:bg-primary/90 gap-2">
                                <Download className="h-4 w-4" />
                                Generar Reporte
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent className="p-0 sm:p-6">
                    <Tabs defaultValue="list" className="w-full">
                        <div className="px-4 pt-4 sm:px-0 sm:pt-0 mb-6 border-b border-slate-100 pb-4">
                            <TabsList className="grid w-full grid-cols-2 bg-slate-100/50 p-1 rounded-lg max-w-md">
                                <TabsTrigger value="list" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Vista de Lista</TabsTrigger>
                                <TabsTrigger value="calendar" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Calendario</TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="calendar" className="mt-0">
                            <ShiftsCalendar shifts={filteredShifts} doctors={doctors} readOnly={true} />
                        </TabsContent>

                        <TabsContent value="list" className="mt-0 space-y-6">
                            <Tabs defaultValue="all" className="w-full">
                                <div className="px-4 sm:px-0">
                                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-slate-100/50 p-1 rounded-lg">
                                        <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Todas ({filteredShifts.length})</TabsTrigger>
                                        <TabsTrigger value="new" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Nuevas ({newShifts.length})</TabsTrigger>
                                        <TabsTrigger value="free" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Libres ({freeShifts.length})</TabsTrigger>
                                        <TabsTrigger value="confirmed" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Confirmadas ({confirmedCount})</TabsTrigger>
                                    </TabsList>
                                </div>

                                <TabsContent value="all" className="space-y-4 mt-6">
                                    {filteredShifts.length === 0 ? (
                                        <p className="text-center text-slate-500 py-12 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">No hay guardias que coincidan con los filtros</p>
                                    ) : (
                                        filteredShifts.map((shift) => <HonorariosShiftCard key={shift.id} shift={shift} doctors={doctors} />)
                                    )}
                                </TabsContent>

                                <TabsContent value="new" className="space-y-4 mt-6">
                                    {newShifts.length === 0 ? (
                                        <p className="text-center text-slate-500 py-12 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">No hay guardias nuevas con estos filtros</p>
                                    ) : (
                                        newShifts.map((shift) => <HonorariosShiftCard key={shift.id} shift={shift} doctors={doctors} />)
                                    )}
                                </TabsContent>

                                <TabsContent value="free" className="space-y-4 mt-6">
                                    {freeShifts.length === 0 ? (
                                        <p className="text-center text-slate-500 py-12 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">No hay guardias libres con estos filtros</p>
                                    ) : (
                                        freeShifts.map((shift) => <HonorariosShiftCard key={shift.id} shift={shift} doctors={doctors} />)
                                    )}
                                </TabsContent>

                                <TabsContent value="confirmed" className="space-y-4 mt-6">
                                    {confirmedShifts.length === 0 ? (
                                        <p className="text-center text-slate-500 py-12 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">No hay guardias confirmadas con estos filtros</p>
                                    ) : (
                                        confirmedShifts.map((shift) => <HonorariosShiftCard key={shift.id} shift={shift} doctors={doctors} />)
                                    )}
                                </TabsContent>
                            </Tabs>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
