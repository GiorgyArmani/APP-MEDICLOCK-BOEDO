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
        <div>
            <main className="container mx-auto px-4 py-8 space-y-8">
                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Generador de Reportes</h1>
                    <p className="mt-1.5 text-slate-600">Exporta guardias por médico y período para procesamiento de honorarios</p>
                </div>

                {/* Reports Generator */}
                <ReportsGenerator shifts={shifts} doctors={doctors} />
            </main>
        </div>
    )
}
