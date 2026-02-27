import { redirect } from "next/navigation"
import { getCurrentDoctor } from "@/lib/actions/auth"
import { getShiftsByDateRange, getDoctorsForHonorarios } from "@/lib/actions/shifts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, Clock, CheckCircle2 } from "lucide-react"
import type { Shift, Doctor } from "@/lib/supabase/types"
import { HonorariosShiftsList } from "@/components/honorarios/honorarios-shifts-list"
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, subMonths, addMonths } from "date-fns"

export default async function HonorariosPage() {
    const currentDoctor = await getCurrentDoctor()

    // Redirect if not authenticated or not honorarios
    if (!currentDoctor) {
        redirect("/login")
    }

    if (currentDoctor.role !== "honorarios") {
        redirect(currentDoctor.role === "administrator" ? "/admin" : "/dashboard")
    }

    // Calculate window for the current dashboard view (current month +/- 1)
    const today = new Date()
    const windowFrom = startOfWeek(startOfMonth(subMonths(today, 1)), { weekStartsOn: 0 })
    const windowTo = endOfWeek(endOfMonth(addMonths(today, 1)), { weekStartsOn: 0 })

    // Fetch data using the same pattern as calendar for accuracy
    const [shifts, doctors] = await Promise.all([
        getShiftsByDateRange(format(windowFrom, "yyyy-MM-dd"), format(windowTo, "yyyy-MM-dd")),
        getDoctorsForHonorarios()
    ])

    const pendingShifts = shifts.filter((s: Shift) => s.status === "new" || s.status === "free").length
    const confirmedShifts = shifts.filter((s: Shift) => s.status === "confirmed").length

    return (
        <div className="min-h-screen bg-slate-50">
            <main className="container mx-auto px-4 py-8 space-y-8 pt-20 lg:pt-8">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Panel de Honorarios</h1>
                        <p className="text-slate-500 font-medium">Vista de todas las guardias para auditoría y reportes</p>
                    </div>
                </div>

                {/* Shifts List Section (Includes dynamic stats & filters) */}
                <div className="space-y-4">
                    <HonorariosShiftsList shifts={shifts} doctors={doctors} />
                </div>
            </main>
        </div>
    )
}
