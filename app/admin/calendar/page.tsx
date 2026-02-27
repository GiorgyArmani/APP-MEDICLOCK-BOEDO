import { redirect } from "next/navigation"
import { getCurrentDoctor } from "@/lib/actions/auth"
import { getShiftsByDateRange } from "@/lib/actions/shifts"
import { getDoctors } from "@/lib/actions/doctors"
import { AdminCalendar } from "@/components/admin/admin-calendar"
import { Calendar } from "lucide-react"
import { CreateShiftDialog } from "@/components/admin/create-shift-dialog"
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, subMonths, addMonths } from "date-fns"
import type { Doctor } from "@/lib/supabase/types"

interface AdminCalendarPageProps {
    searchParams: Promise<{ year?: string; month?: string }>
}

export default async function AdminCalendarPage({ searchParams }: AdminCalendarPageProps) {
    const currentDoctor = await getCurrentDoctor()

    if (!currentDoctor) redirect("/login")
    if (currentDoctor.role !== "administrator") redirect("/dashboard")

    // Resolve month/year from searchParams (default: current month)
    const params = await searchParams
    const today = new Date()
    const year = params.year ? parseInt(params.year) : today.getFullYear()
    const month = params.month ? parseInt(params.month) : today.getMonth() // 0-indexed

    // Build the target month date
    const targetMonth = new Date(year, month, 1)

    // Include prev/next month padding so calendar weeks that span month boundaries work correctly.
    // We fetch 3 months: prev, current, next — this ensures all visible grid cells are covered.
    const windowFrom = startOfWeek(startOfMonth(subMonths(targetMonth, 1)), { weekStartsOn: 0 })
    const windowTo = endOfWeek(endOfMonth(addMonths(targetMonth, 1)), { weekStartsOn: 0 })

    const dateFrom = format(windowFrom, "yyyy-MM-dd")
    const dateTo = format(windowTo, "yyyy-MM-dd")

    const [shifts, doctors] = await Promise.all([
        getShiftsByDateRange(dateFrom, dateTo),
        getDoctors(),
    ])

    return (
        <div className="min-h-screen bg-slate-50 pt-20 lg:pt-8 px-4 pb-8">
            <div className="container mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <Calendar className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Calendario de Guardias</h1>
                            <p className="text-sm text-slate-600">Visualización mensual, semanal y diaria de todas las guardias</p>
                        </div>
                    </div>
                    {/* Desktop Create Button */}
                    <div className="hidden lg:block">
                        <CreateShiftDialog doctors={doctors} />
                    </div>
                </div>

                <AdminCalendar shifts={shifts} doctors={doctors} currentDoctor={currentDoctor as Doctor} initialYear={year} initialMonth={month} />
            </div>
        </div>
    )
}
