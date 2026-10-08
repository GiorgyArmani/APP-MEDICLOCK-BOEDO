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
        <div>
            <main className="container mx-auto px-4 py-8 space-y-8">
                {/* Page Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Panel de Honorarios</h1>
                        <p className="mt-1.5 text-slate-600">Vista de todas las guardias para auditoría y reportes</p>
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
