import type { Shift, Doctor } from "@/lib/supabase/types"
import { parseShiftDateTime, parseUTCDate } from "./date-utils"

export interface ShiftExportData {
    doctorName: string
    shiftDate: string
    shiftTurn: string    // "Día" | "Noche"
    dayType: string      // "Semana" | "Fin de Semana"
    shiftArea: string
    shiftCategory: string
    shiftHours: string
    clockIn: string
    clockOut: string
    presentismo: string  // "A tiempo", "Tardanza", "Tardanza Severa", "-"
    status: string
    adminNotes: string
    doctorNotes: string
}

/**
 * Calculates presentismo (tardiness) based on clock_in time.
 */
export function getPresentismo(shift: Shift): string {
    if (!shift.clock_in) return "-"
    if (!shift.shift_hours || shift.shift_hours === "variable") return "A tiempo"

    const startHourStr = shift.shift_hours.split('-')[0]
    const startHour = parseInt(startHourStr, 10)

    if (isNaN(startHour)) return "A tiempo"

    const scheduledStart = parseShiftDateTime(shift.shift_date, startHourStr)
    const clockInTime = parseUTCDate(shift.clock_in)
    
    const diffMinutes = (clockInTime.getTime() - scheduledStart.getTime()) / (1000 * 60)

    if (diffMinutes <= 15) return "A tiempo"
    if (diffMinutes > 15 && diffMinutes < 30) return "Tardanza"
    if (diffMinutes >= 30) return "Tardanza Severa"
    
    return "-"
}

/**
 * Derives the shift turn (Día / Noche) from the shift_hours field.
 * Night shifts start at 20:00 (hours string starts with "20").
 */
export function getShiftTurn(hours: string): string {
    const trimmed = hours.trim().toLowerCase()
    if (trimmed.startsWith("20") || trimmed === "20-8" || trimmed === "20-08") {
        return "Noche"
    }
    return "Día"
}

/**
 * Derives whether a shift falls on a weekday or weekend from the shift_date string.
 */
export function getDayType(dateStr: string): string {
    const date = parseShiftDateTime(dateStr)
    const day = date.getDay() // 0 = Sunday, 6 = Saturday
    return day === 0 || day === 6 ? "Fin de Semana" : "Semana"
}

/**
 * Formats shift data for export
 */
export function formatShiftDataForExport(shifts: Shift[], doctors: Doctor[]): ShiftExportData[] {
    return shifts.map((shift) => {
        const doctor = shift.doctor_id ? doctors.find((d) => d.id === shift.doctor_id) : null

        return {
            doctorName: doctor?.full_name || "Sin asignar",
            shiftDate: formatDateForExport(shift.shift_date),
            shiftTurn: getShiftTurn(shift.shift_hours),
            dayType: getDayType(shift.shift_date),
            shiftArea: formatArea(shift.shift_area),
            shiftCategory: shift.shift_category,
            shiftHours: shift.shift_hours,
            clockIn: shift.clock_in ? formatTimeForExport(shift.clock_in) : "-",
            clockOut: shift.clock_out ? formatTimeForExport(shift.clock_out) : "-",
            presentismo: getPresentismo(shift),
            status: formatStatus(shift.status),
            adminNotes: shift.notes || "-",
            doctorNotes: shift.doctor_notes || "-",
        }
    })
}

/**
 * Generates CSV content from shift data
 */
export function generateCSV(data: ShiftExportData[]): string {
    const headers = [
        "Médico",
        "Fecha",
        "Turno",
        "Tipo de Día",
        "Área",
        "Categoría",
        "Horario",
        "Entrada",
        "Salida",
        "Presentismo",
        "Estado",
        "Notas Admin",
        "Notas Médico",
    ]

    const rows = data.map((row) => [
        row.doctorName,
        row.shiftDate,
        row.shiftTurn,
        row.dayType,
        row.shiftArea,
        row.shiftCategory,
        row.shiftHours,
        row.clockIn,
        row.clockOut,
        row.presentismo,
        row.status,
        row.adminNotes,
        row.doctorNotes,
    ])

    const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n")

    return csvContent
}

/**
 * Downloads CSV file
 */
export function downloadCSV(csvContent: string, filename: string) {
    // Add UTF-8 BOM to ensure proper encoding recognition by Excel
    const BOM = "\uFEFF"
    const csvWithBOM = BOM + csvContent

    const blob = new Blob([csvWithBOM], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Clean up the URL object
    URL.revokeObjectURL(url)
}

/**
 * Generates a monthly summary report by doctor
 */
export interface DoctorMonthlySummary {
    doctorName: string
    totalShifts: number
    confirmedShifts: number
    dayShifts: number
    nightShifts: number
    weekendShifts: number
    totalHours: number
    tardanzas: number
    tardanzasSeveras: number
    shifts: ShiftExportData[]
}

export function generateMonthlySummary(
    shifts: Shift[],
    doctors: Doctor[]
): DoctorMonthlySummary[] {
    const doctorMap = new Map<string, DoctorMonthlySummary>()

    shifts.forEach((shift) => {
        if (!shift.doctor_id) return

        const doctor = doctors.find((d) => d.id === shift.doctor_id)
        if (!doctor) return

        if (!doctorMap.has(shift.doctor_id)) {
            doctorMap.set(shift.doctor_id, {
                doctorName: doctor.full_name,
                totalShifts: 0,
                confirmedShifts: 0,
                dayShifts: 0,
                nightShifts: 0,
                weekendShifts: 0,
                totalHours: 0,
                tardanzas: 0,
                tardanzasSeveras: 0,
                shifts: [],
            })
        }

        const summary = doctorMap.get(shift.doctor_id)!
        summary.totalShifts++

        if (shift.status === "confirmed") {
            summary.confirmedShifts++
        }

        const turn = getShiftTurn(shift.shift_hours)
        if (turn === "Noche") summary.nightShifts++
        else summary.dayShifts++

        const dayType = getDayType(shift.shift_date)
        if (dayType === "Fin de Semana") summary.weekendShifts++

        const presentismo = getPresentismo(shift)
        if (presentismo === "Tardanza") summary.tardanzas++
        if (presentismo === "Tardanza Severa") summary.tardanzasSeveras++

        // Calculate hours if clock in/out are available
        if (shift.clock_in && shift.clock_out) {
            const clockIn = new Date(shift.clock_in)
            const clockOut = new Date(shift.clock_out)
            const hours = (clockOut.getTime() - clockIn.getTime()) / (1000 * 60 * 60)
            summary.totalHours += hours
        }

        summary.shifts.push({
            doctorName: doctor.full_name,
            shiftDate: formatDateForExport(shift.shift_date),
            shiftTurn: turn,
            dayType: dayType,
            shiftArea: formatArea(shift.shift_area),
            shiftCategory: shift.shift_category,
            shiftHours: shift.shift_hours,
            clockIn: shift.clock_in ? formatTimeForExport(shift.clock_in) : "-",
            clockOut: shift.clock_out ? formatTimeForExport(shift.clock_out) : "-",
            presentismo: presentismo,
            status: formatStatus(shift.status),
            adminNotes: shift.notes || "-",
            doctorNotes: shift.doctor_notes || "-",
        })
    })

    return Array.from(doctorMap.values()).sort((a, b) =>
        a.doctorName.localeCompare(b.doctorName)
    )
}

/**
 * Generates CSV for monthly summary
 */
export function generateMonthlySummaryCSV(summaries: DoctorMonthlySummary[]): string {
    const headers = [
        "Médico",
        "Total Guardias",
        "Guardias Confirmadas",
        "Turno Día",
        "Turno Noche",
        "Fin de Semana",
        "Horas Totales",
        "Tardanzas",
        "Tard. Severas",
    ]

    const rows = summaries.map((summary) => [
        summary.doctorName,
        summary.totalShifts.toString(),
        summary.confirmedShifts.toString(),
        summary.dayShifts.toString(),
        summary.nightShifts.toString(),
        summary.weekendShifts.toString(),
        summary.totalHours.toFixed(2),
        summary.tardanzas.toString(),
        summary.tardanzasSeveras.toString(),
    ])

    const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n")

    return csvContent
}

/**
 * Generates PDF for detailed shift report using jspdf
 */
export async function generatePDF(data: ShiftExportData[], title: string, logoBase64?: string) {
    const { jsPDF } = await import("jspdf")
    const autoTable = (await import("jspdf-autotable")).default

    const doc = new jsPDF({ orientation: "landscape" })

    // Add Logo if provided
    if (logoBase64) {
        try {
            doc.addImage(logoBase64, "PNG", 240, 10, 35, 12)
        } catch (e) {
            console.error("Error adding logo to PDF:", e)
        }
    }

    // Title
    doc.setFontSize(20)
    doc.setTextColor(30, 41, 59) // slate-800
    doc.text(title, 14, 22)

    // Subheader
    doc.setFontSize(10)
    doc.setTextColor(100, 116, 139) // slate-500
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 30)

    // Table
    autoTable(doc, {
        startY: 40,
        head: [["Médico", "Fecha", "Turno", "Día", "Horario", "Entrada", "Salida", "Presentismo", "Estado"]],
        body: data.map(r => [
            r.doctorName,
            r.shiftDate,
            r.shiftTurn,
            r.dayType === "Fin de Semana" ? "Finde" : "Sem",
            r.shiftHours,
            r.clockIn,
            r.clockOut,
            r.presentismo,
            r.status
        ]),
        styles: { fontSize: 7, cellPadding: 2 },
        headStyles: { fillColor: [59, 130, 246], textColor: 255 }, // blue-500
        alternateRowStyles: { fillColor: [248, 250, 252] }, // slate-50
        columnStyles: {
            2: { cellWidth: 16 }, // Turno
            3: { cellWidth: 16 }, // Día
            7: { cellWidth: 24 }, // Presentismo
        }
    })

    doc.save(`${title.replace(/\s+/g, "_")}.pdf`)
}

/**
 * Generates PDF for monthly summary using jspdf
 */
export async function generateMonthlySummaryPDF(summaries: DoctorMonthlySummary[], title: string, logoBase64?: string) {
    const { jsPDF } = await import("jspdf")
    const autoTable = (await import("jspdf-autotable")).default

    const doc = new jsPDF()

    // Add Logo if provided
    if (logoBase64) {
        try {
            doc.addImage(logoBase64, "PNG", 160, 10, 35, 12)
        } catch (e) {
            console.error("Error adding logo to PDF:", e)
        }
    }

    // Title
    doc.setFontSize(22)
    doc.setTextColor(30, 41, 59)
    doc.text(title, 14, 22)

    // Subheader
    doc.setFontSize(10)
    doc.setTextColor(100, 116, 139)
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 30)

    // Table
    autoTable(doc, {
        startY: 40,
        head: [["Médico", "Total", "Conf.", "Turno Día", "Noche", "Finde", "Horas", "Tard..", "Tard Sev."]],
        body: summaries.map(s => [
            s.doctorName,
            s.totalShifts.toString(),
            s.confirmedShifts.toString(),
            s.dayShifts.toString(),
            s.nightShifts.toString(),
            s.weekendShifts.toString(),
            s.totalHours.toFixed(2),
            s.tardanzas.toString(),
            s.tardanzasSeveras.toString()
        ]),
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [37, 99, 235], textColor: 255 }, // blue-600
        alternateRowStyles: { fillColor: [248, 250, 252] },
    })

    doc.save(`${title.replace(/\s+/g, "_")}.pdf`)
}

// Helper functions
function formatDateForExport(dateStr: string): string {
    const date = parseShiftDateTime(dateStr)
    return date.toLocaleDateString("es-ES", { year: "numeric", month: "2-digit", day: "2-digit" })
}

function formatTimeForExport(dateTimeStr: string): string {
    return new Date(dateTimeStr).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
}

function formatArea(area: string): string {
    const areaMap: Record<string, string> = {
        consultorio: "Consultorio",
        internacion: "Internación",
        refuerzo: "Refuerzo",
        piso: "Piso",
        completo: "Consultorio",
    }
    return areaMap[area] || area
}

function formatStatus(status: string): string {
    const statusMap: Record<string, string> = {
        new: "Nueva",
        free: "Libre",
        confirmed: "Confirmada",
        rejected: "Rechazada",
        free_pending: "Pendiente +12h",
    }
    return statusMap[status] || status
}

/**
 * Converts an image URL to a base64 string
 */
export async function getBase64ImageFromURL(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined') {
            resolve("")
            return
        }
        const img = new Image()
        img.setAttribute("crossOrigin", "anonymous")
        img.onload = () => {
            const canvas = document.createElement("canvas")
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext("2d")
            ctx?.drawImage(img, 0, 0)
            const dataURL = canvas.toDataURL("image/png")
            resolve(dataURL)
        }
        img.onerror = (error) => {
            reject(error)
        }
        img.src = url
    })
}
