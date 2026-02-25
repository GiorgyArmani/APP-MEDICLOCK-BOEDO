"use client"

import { useState, useMemo } from "react"
import type { Shift, Doctor } from "@/lib/supabase/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileSpreadsheet, Calendar as CalendarIcon } from "lucide-react"
import { toast } from "sonner"
import {
    formatShiftDataForExport,
    generateCSV,
    downloadCSV,
    generateMonthlySummary,
    generateMonthlySummaryCSV,
    generatePDF,
    generateMonthlySummaryPDF,
    getBase64ImageFromURL,
    getShiftTurn,
    getDayType,
} from "@/lib/utils/export-utils"
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useEffect } from "react"

interface ReportsGeneratorProps {
    shifts: Shift[]
    doctors: Doctor[]
}

export function ReportsGenerator({ shifts, doctors }: ReportsGeneratorProps) {
    const [isMounted, setIsMounted] = useState(false)
    const [selectedDoctorId, setSelectedDoctorId] = useState<string>("all")
    const [selectedArea, setSelectedArea] = useState<string>("all")
    const [selectedTurn, setSelectedTurn] = useState<string>("all")
    const [selectedDayType, setSelectedDayType] = useState<string>("all")
    const [reportType, setReportType] = useState<"detailed" | "summary">("detailed")
    const [dateFrom, setDateFrom] = useState<Date | undefined>(startOfMonth(new Date()))
    const [dateTo, setDateTo] = useState<Date | undefined>(endOfMonth(new Date()))

    useEffect(() => {
        setIsMounted(true)
    }, [])

    // Filter shifts based on selections
    const filteredShifts = useMemo(() => {
        return shifts.filter((shift) => {
            const matchesDoctor = selectedDoctorId === "all" || shift.doctor_id === selectedDoctorId
            const matchesArea = selectedArea === "all" || shift.shift_area === selectedArea || (selectedArea === "consultorio" && shift.shift_area === "completo")

            const turn = getShiftTurn(shift.shift_hours)
            const matchesTurn =
                selectedTurn === "all" ||
                (selectedTurn === "dia" && turn === "Día") ||
                (selectedTurn === "noche" && turn === "Noche")

            const dayType = getDayType(shift.shift_date)
            const matchesDayType =
                selectedDayType === "all" ||
                (selectedDayType === "semana" && dayType === "Semana") ||
                (selectedDayType === "finde" && dayType === "Fin de Semana")

            // Date filtering
            const shiftDate = new Date(shift.shift_date + "T00:00:00")
            const matchesDateFrom = !dateFrom || shiftDate >= dateFrom
            const matchesDateTo = !dateTo || shiftDate <= dateTo

            return matchesDoctor && matchesArea && matchesTurn && matchesDayType && matchesDateFrom && matchesDateTo
        })
    }, [shifts, selectedDoctorId, selectedArea, selectedTurn, selectedDayType, dateFrom, dateTo])

    const handleExport = async (exportFormat: "csv" | "pdf") => {
        if (filteredShifts.length === 0) {
            toast.error("No hay guardias para exportar con los filtros seleccionados")
            return
        }

        try {
            const dateRangeStr = `${dateFrom ? format(dateFrom, "dd-MM-yyyy") : "inicio"}_${dateTo ? format(dateTo, "dd-MM-yyyy") : "fin"}`
            const doctorNameRaw = selectedDoctorId === "all" ? "todos" : doctors.find((d) => d.id === selectedDoctorId)?.full_name || "doctor"
            const doctorNameFile = doctorNameRaw.replace(/\s+/g, "_")
            const title = reportType === "detailed"
                ? `Reporte Detallado de Guardias - ${doctorNameRaw}`
                : `Resumen Mensual de Honorarios - ${doctorNameRaw}`

            // Try to get logo base64
            let logoBase64 = ""
            try {
                logoBase64 = await getBase64ImageFromURL("/logo.png")
            } catch (e) {
                console.warn("Logo could not be loaded for PDF", e)
            }

            if (exportFormat === "csv") {
                if (reportType === "detailed") {
                    const exportData = formatShiftDataForExport(filteredShifts, doctors)
                    const csvContent = generateCSV(exportData)
                    const filename = `guardias_${doctorNameFile}_${dateRangeStr}.csv`
                    downloadCSV(csvContent, filename)
                } else {
                    const summaries = generateMonthlySummary(filteredShifts, doctors)
                    const csvContent = generateMonthlySummaryCSV(summaries)
                    const filename = `resumen_mensual_${dateRangeStr}.csv`
                    downloadCSV(csvContent, filename)
                }
                toast.success(`Reporte CSV exportado con éxito`)
            } else {
                if (reportType === "detailed") {
                    const exportData = formatShiftDataForExport(filteredShifts, doctors)
                    await generatePDF(exportData, title, logoBase64)
                } else {
                    const summaries = generateMonthlySummary(filteredShifts, doctors)
                    await generateMonthlySummaryPDF(summaries, title, logoBase64)
                }
                toast.success(`Reporte PDF exportado con éxito`)
            }
        } catch (error) {
            console.error("Error exporting:", error)
            toast.error("Error al generar el reporte")
        }
    }

    const setThisMonth = () => {
        setDateFrom(startOfMonth(new Date()))
        setDateTo(endOfMonth(new Date()))
    }

    const setLastMonth = () => {
        const lastMonth = subMonths(new Date(), 1)
        setDateFrom(startOfMonth(lastMonth))
        setDateTo(endOfMonth(lastMonth))
    }

    if (!isMounted) return <div className="h-[400px] w-full bg-slate-50/50 rounded-xl border border-slate-200/60 animate-pulse" />

    return (
        <Card className="border-slate-200/60 shadow-sm">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-900">Configuración del Reporte</CardTitle>
                <CardDescription>Selecciona los filtros y el tipo de reporte que deseas generar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Date Range Selection */}
                <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-700">Período</Label>
                    <div className="flex flex-wrap gap-2 mb-3">
                        <Button variant="outline" size="sm" onClick={setThisMonth}>
                            Este Mes
                        </Button>
                        <Button variant="outline" size="sm" onClick={setLastMonth}>
                            Mes Anterior
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs text-slate-600">Desde</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !dateFrom && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {dateFrom ? format(dateFrom, "PPP", { locale: es }) : "Seleccionar fecha"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={dateFrom}
                                        onSelect={setDateFrom}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-slate-600">Hasta</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !dateTo && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {dateTo ? format(dateTo, "PPP", { locale: es }) : "Seleccionar fecha"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={dateTo}
                                        onSelect={setDateTo}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>

                {/* Doctor Selection */}
                <div className="space-y-2">
                    <Label htmlFor="doctor-select" className="text-sm font-semibold text-slate-700">
                        Médico
                    </Label>
                    <Select value={selectedDoctorId} onValueChange={setSelectedDoctorId}>
                        <SelectTrigger id="doctor-select" className={cn(doctors.length === 0 && "border-red-300 bg-red-50")}>
                            <SelectValue placeholder={doctors.length === 0 ? "No se encontraron médicos" : "Seleccionar médico"} />
                        </SelectTrigger>
                        <SelectContent>
                            {doctors.length === 0 ? (
                                <SelectItem value="none" disabled>No hay médicos disponibles</SelectItem>
                            ) : (
                                <>
                                    <SelectItem value="all">Todos los médicos</SelectItem>
                                    {doctors
                                        .filter((d) => d.role !== "honorarios")
                                        .sort((a, b) => a.full_name.localeCompare(b.full_name))
                                        .map((doctor) => (
                                            <SelectItem key={doctor.id} value={doctor.id}>
                                                {doctor.full_name}
                                            </SelectItem>
                                        ))}
                                </>
                            )}
                        </SelectContent>
                    </Select>
                    {doctors.length === 0 && (
                        <p className="text-xs text-red-500 font-medium">No se cargaron médicos. Verifica los permisos de acceso.</p>
                    )}
                </div>

                {/* Area + Turn + Day Type filters in a responsive grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Area Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="area-select" className="text-sm font-semibold text-slate-700">
                            Área
                        </Label>
                        <Select value={selectedArea} onValueChange={setSelectedArea}>
                            <SelectTrigger id="area-select">
                                <SelectValue placeholder="Seleccionar área" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas las áreas</SelectItem>
                                <SelectItem value="consultorio">Consultorio</SelectItem>
                                <SelectItem value="internacion">Internación</SelectItem>
                                <SelectItem value="refuerzo">Refuerzo</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Turno Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="turn-select" className="text-sm font-semibold text-slate-700">
                            Turno
                        </Label>
                        <Select value={selectedTurn} onValueChange={setSelectedTurn}>
                            <SelectTrigger id="turn-select">
                                <SelectValue placeholder="Todos los turnos" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los turnos</SelectItem>
                                <SelectItem value="dia">🌞 Día</SelectItem>
                                <SelectItem value="noche">🌙 Noche</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Day Type Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="daytype-select" className="text-sm font-semibold text-slate-700">
                            Tipo de Día
                        </Label>
                        <Select value={selectedDayType} onValueChange={setSelectedDayType}>
                            <SelectTrigger id="daytype-select">
                                <SelectValue placeholder="Todos los días" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los días</SelectItem>
                                <SelectItem value="semana">📅 Semana</SelectItem>
                                <SelectItem value="finde">🎉 Fin de Semana</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Report Type Selection */}
                <div className="space-y-2">
                    <Label htmlFor="report-type" className="text-sm font-semibold text-slate-700">
                        Tipo de Reporte
                    </Label>
                    <Select value={reportType} onValueChange={(value) => setReportType(value as "detailed" | "summary")}>
                        <SelectTrigger id="report-type">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="detailed">Detallado (todas las guardias)</SelectItem>
                            <SelectItem value="summary">Resumen Mensual (por médico)</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-slate-500 mt-1">
                        {reportType === "detailed"
                            ? "Incluye todas las guardias con fecha, turno, tipo de día, horarios, entrada/salida, etc."
                            : "Resumen con total de guardias, desglose día/noche/finde y horas trabajadas por médico"}
                    </p>
                </div>

                {/* Preview Stats */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <p className="text-sm font-semibold text-slate-700 mb-3">Vista Previa</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                            <p className="text-xs text-slate-500">Guardias a exportar</p>
                            <p className="text-2xl font-bold text-slate-900">{filteredShifts.length}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Médicos involucrados</p>
                            <p className="text-2xl font-bold text-slate-900">
                                {new Set(filteredShifts.map((s) => s.doctor_id).filter(Boolean)).size}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">🌞 Turno Día</p>
                            <p className="text-2xl font-bold text-amber-600">
                                {filteredShifts.filter(s => getShiftTurn(s.shift_hours) === "Día").length}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">🌙 Turno Noche</p>
                            <p className="text-2xl font-bold text-indigo-600">
                                {filteredShifts.filter(s => getShiftTurn(s.shift_hours) === "Noche").length}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-200">
                        <div>
                            <p className="text-xs text-slate-500">📅 Guardias de Semana</p>
                            <p className="text-xl font-bold text-slate-700">
                                {filteredShifts.filter(s => getDayType(s.shift_date) === "Semana").length}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">🎉 Fin de Semana</p>
                            <p className="text-xl font-bold text-slate-700">
                                {filteredShifts.filter(s => getDayType(s.shift_date) === "Fin de Semana").length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Export Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button
                        onClick={() => handleExport("csv")}
                        disabled={filteredShifts.length === 0}
                        variant="outline"
                        className="w-full border-slate-200 hover:bg-slate-50 gap-2 h-12 text-base font-semibold"
                    >
                        <FileSpreadsheet className="h-5 w-5 text-green-600" />
                        Excel (CSV)
                    </Button>
                    <Button
                        onClick={() => handleExport("pdf")}
                        disabled={filteredShifts.length === 0}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2 h-12 text-base font-semibold"
                    >
                        <Download className="h-5 w-5" />
                        PDF Reporte
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
