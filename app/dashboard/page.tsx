import { redirect } from "next/navigation"
import { getCurrentDoctor } from "@/lib/actions/auth"
import { getDoctorShiftsByDateRange } from "@/lib/actions/shifts"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { ShiftsList } from "@/components/dashboard/shifts-list"
import { TodayShifts } from "@/components/dashboard/today-shifts"
import Link from "next/link"
import { CalendarClock, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { T } from "@/components/i18n/t"
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
    <main className="container mx-auto space-y-8 px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            <T k="dashboardHome.greeting" vars={{ name: doctor.full_name.split(" ")[1] || doctor.full_name }} />
          </h1>
          <p className="mt-1.5 text-slate-600"><T k="dashboardHome.subtitle" /></p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="h-10 rounded-xl bg-white">
            <Link href="/dashboard/calendar">
              <CalendarDays className="h-4 w-4" aria-hidden />
              <T k="nav.calendar" />
            </Link>
          </Button>
          <Button asChild className="h-10 rounded-xl">
            <Link href="/dashboard/availability">
              <CalendarClock className="h-4 w-4" aria-hidden />
              <T k="nav.availability" />
            </Link>
          </Button>
        </div>
      </div>

      <TodayShifts shifts={visibleShifts} currentDoctor={doctor} />

      <StatsCards shifts={visibleShifts} />

      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          <T k="dashboardHome.shiftsListHeading" />
        </h2>
        <ShiftsList shifts={visibleShifts} currentDoctor={doctor} />
      </section>
    </main>
  )
}
