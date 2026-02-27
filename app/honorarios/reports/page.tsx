import { redirect } from "next/navigation"
import { getCurrentDoctor } from "@/lib/actions/auth"
import { getShiftsByDateRange, getDoctorsForHonorarios } from "@/lib/actions/shifts"
import { ReportsGenerator } from "@/components/honorarios/reports-generator"
import { format, startOfMonth, endOfMonth } from "date-fns"

interface ReportsPageProps {
    searchParams: Promise<{ from?: string; to?: string }>
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
    const currentDoctor = await getCurrentDoctor()

    // Redirect if not authenticated or not honorarios
    if (!currentDoctor) {
        redirect("/login")
    }

    if (currentDoctor.role !== "honorarios") {
        redirect(currentDoctor.role === "administrator" ? "/admin" : "/dashboard")
    }

    // Resolve dates from searchParams or default to current month
    const params = await searchParams
    const dateFrom = params.from || format(startOfMonth(new Date()), "yyyy-MM-dd")
    const dateTo = params.to || format(endOfMonth(new Date()), "yyyy-MM-dd")

    // Fetch data using the specific date range
    const [shifts, doctors] = await Promise.all([
        getShiftsByDateRange(dateFrom, dateTo),
        getDoctorsForHonorarios()
    ])

    return (
        <div className="min-h-screen bg-slate-50">
            <main className="container mx-auto px-4 py-8 space-y-8 pt-20 lg:pt-8">
                {/* Page Header */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Generador de Reportes</h1>
                    <p className="text-slate-500 font-medium mt-1">Exporta guardias por médico y período para procesamiento de honorarios</p>
                </div>

                {/* Reports Generator */}
                <ReportsGenerator shifts={shifts} doctors={doctors} />
            </main>
        </div>
    )
}
