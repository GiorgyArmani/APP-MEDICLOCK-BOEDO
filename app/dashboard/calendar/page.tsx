import { redirect } from "next/navigation"
import { getCurrentDoctor } from "@/lib/actions/auth"
import { getDoctorShiftsByDateRange } from "@/lib/actions/shifts"
import { DoctorCalendar } from "@/components/dashboard/doctor-calendar"
import { Calendar } from "lucide-react"
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, subMonths, addMonths } from "date-fns"
import type { Shift, Doctor } from "@/lib/supabase/types"

interface DoctorCalendarPageProps {
    searchParams: Promise<{ year?: string; month?: string }>
}

export default async function DoctorCalendarPage({ searchParams }: DoctorCalendarPageProps) {
    const currentDoctor = await getCurrentDoctor()

    if (!currentDoctor) {
        redirect("/login")
    }

    // Resolve month/year from searchParams (default: current month)
    const params = await searchParams
    const today = new Date()
    const year = params.year ? parseInt(params.year) : today.getFullYear()
    const month = params.month ? parseInt(params.month) : today.getMonth() // 0-indexed

    // Build the target month date
    const targetMonth = new Date(year, month, 1)

    // Include prev/next month padding so calendar weeks that span month boundaries work correctly.
    const windowFrom = startOfWeek(startOfMonth(subMonths(targetMonth, 1)), { weekStartsOn: 0 })
    const windowTo = endOfWeek(endOfMonth(addMonths(targetMonth, 1)), { weekStartsOn: 0 })

    const dateFrom = format(windowFrom, "yyyy-MM-dd")
    const dateTo = format(windowTo, "yyyy-MM-dd")

    const fetchedShifts = await getDoctorShiftsByDateRange(dateFrom, dateTo)

    // Filter shifts for privacy:
    // 1. Own assigned shifts
    // 2. Free shifts
    const visibleShifts = currentDoctor.role === "administrator"
        ? fetchedShifts
        : fetchedShifts.filter((s: Shift) => {
            // Own shifts
            if (s.doctor_id === currentDoctor.id) return true

            // Free shifts
            if (s.shift_type === "free" || s.status === "free" || s.status === "free_pending") {
                return true
            }

            return false
        })

    return (
        <div className="min-h-screen bg-slate-50 pt-20 lg:pt-8 px-4 pb-8">
            <div className="container mx-auto space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-lg">
                        <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Mi Calendario</h1>
                        <p className="text-sm text-slate-600">Visualiza tus guardias y las disponibles en formato calendario</p>
                    </div>
                </div>

                <DoctorCalendar
                    shifts={visibleShifts}
                    currentDoctor={currentDoctor as Doctor}
                    initialYear={year}
                    initialMonth={month}
                />
            </div>
        </div>
    )
}
