import { redirect } from "next/navigation"
import { getCurrentDoctor } from "@/lib/actions/auth"
import { getShiftsByDateRange, getDashboardStats } from "@/lib/actions/shifts"
import { getDoctors } from "@/lib/actions/doctors"
import { CreateShiftDialog } from "@/components/admin/create-shift-dialog"
import { AdminShiftsList } from "@/components/admin/admin-shifts-list"
import { AdminDashboardStats } from "@/components/admin/admin-dashboard-stats"
import { format, startOfMonth, endOfMonth } from "date-fns"
import type { Doctor } from "@/lib/supabase/types"

interface AdminPageProps {
  searchParams: Promise<{ from?: string; to?: string }>
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const currentDoctor = await getCurrentDoctor()

  if (!currentDoctor) redirect("/login")
  if (currentDoctor.role !== "administrator") redirect("/dashboard")

  // Resolve period from searchParams (default: current month)
  const params = await searchParams
  const today = new Date()
  const dateFrom = params.from ?? format(startOfMonth(today), "yyyy-MM-dd")
  const dateTo = params.to ?? format(endOfMonth(today), "yyyy-MM-dd")

  // Fetch in parallel: targeted stats (no 1000-row limit) + doctors + shifts list
  const [stats, doctors, shifts] = await Promise.all([
    getDashboardStats(dateFrom, dateTo),
    getDoctors(),
    getShiftsByDateRange(dateFrom, dateTo),
  ])

  // All-time total via a separate fast COUNT (already embedded in getDashboardStats with a broad range,
  // but we pass a wide range to get the true all-time figure)
  const allTimeStats = await getDashboardStats("2000-01-01", format(today, "yyyy-MM-dd"))

  return (
    <div className="min-h-screen bg-slate-50">
      {/* FAB for mobile */}
      <div className="fixed bottom-6 right-6 z-40 lg:hidden">
        <CreateShiftDialog doctors={doctors} variant="fab" />
      </div>

      <main className="container mx-auto px-4 py-8 space-y-8 pt-20 lg:pt-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Panel de Administración</h1>
            <p className="text-slate-500 font-medium">Gestión integral de guardias y personal médico</p>
          </div>
          <div className="hidden lg:block">
            <CreateShiftDialog doctors={doctors} />
          </div>
        </div>

        {/* New Analytics Dashboard */}
        <AdminDashboardStats
          stats={stats}
          dateFrom={dateFrom}
          dateTo={dateTo}
          totalAllTime={allTimeStats.totalShifts}
        />

        {/* Shifts List */}
        <div className="space-y-4">
          <AdminShiftsList shifts={shifts} doctors={doctors} currentDoctor={currentDoctor as Doctor} />
        </div>
      </main>
    </div>
  )
}
