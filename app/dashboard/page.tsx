import { redirect } from "next/navigation"
import { getCurrentDoctor } from "@/lib/actions/auth"
import { getDoctorShiftsByDateRange } from "@/lib/actions/shifts"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { ShiftsList } from "@/components/dashboard/shifts-list"
import { TodayShifts } from "@/components/dashboard/today-shifts"
import { ShiftsCalendar } from "@/components/dashboard/shifts-calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, List } from "lucide-react"
import type { Shift, Doctor } from "@/lib/supabase/types"
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, subMonths, addMonths } from "date-fns"

export default async function DashboardPage() {
  const currentDoctor = await getCurrentDoctor()

  if (!currentDoctor) {
    redirect("/login")
  }

  // TypeScript now knows currentDoctor is Doctor (not null) after the check above
  const doctor = currentDoctor as Doctor

  // Calculate window for the current dashboard view (current month +/- 1)
  const today = new Date()
  const windowFrom = startOfWeek(startOfMonth(subMonths(today, 1)), { weekStartsOn: 0 })
  const windowTo = endOfWeek(endOfMonth(addMonths(today, 1)), { weekStartsOn: 0 })

  const dateFrom = format(windowFrom, "yyyy-MM-dd")
  const dateTo = format(windowTo, "yyyy-MM-dd")

  // Fetch shifts for the range
  const fetchedShifts = await getDoctorShiftsByDateRange(dateFrom, dateTo)

  // Filter shifts for privacy:
  // 1. Own assigned shifts
  // 2. Free shifts (available for anyone to take)
  const visibleShifts = doctor.role === "administrator"
    ? fetchedShifts
    : fetchedShifts.filter((s: Shift) => {
      // Own shifts
      if (s.doctor_id === doctor.id) return true

      // Free shifts
      if (s.shift_type === "free" || s.status === "free" || s.status === "free_pending") {
        return true
      }

      return false
    })

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container mx-auto px-4 py-8 space-y-8 pt-20 lg:pt-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Bienvenido, Dr. {doctor.full_name.split(" ")[1] || doctor.full_name}
          </h1>
          <p className="text-slate-600">Gestiona tus guardias y horarios</p>
        </div>

        <TodayShifts shifts={visibleShifts} currentDoctor={doctor} />

        <StatsCards shifts={visibleShifts} />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
              <List className="h-5 w-5 text-slate-600" />
              Lista de Guardias
            </h2>
          </div>
          <ShiftsList shifts={visibleShifts} currentDoctor={doctor} />
        </div>
      </main>
    </div>
  )
}
