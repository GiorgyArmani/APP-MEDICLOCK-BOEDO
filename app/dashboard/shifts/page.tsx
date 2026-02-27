import { redirect } from "next/navigation"
import { getCurrentDoctor } from "@/lib/actions/auth"
import { getDoctorShiftsByDateRange } from "@/lib/actions/shifts"
import { ShiftsList } from "@/components/dashboard/shifts-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, subMonths, addMonths } from "date-fns"
import type { Shift } from "@/lib/supabase/types"

export default async function ShiftsPage() {
    const doctor = await getCurrentDoctor()

    if (!doctor) {
        redirect("/login")
    }

    // Get a wider window for the list view (e.g. +/- 3 months)
    const today = new Date()
    const windowFrom = subMonths(startOfMonth(today), 3)
    const windowTo = addMonths(endOfMonth(today), 3)

    const dateFrom = format(windowFrom, "yyyy-MM-dd")
    const dateTo = format(windowTo, "yyyy-MM-dd")

    const visibleShifts = await getDoctorShiftsByDateRange(dateFrom, dateTo)

    // Filter to show assigned shifts and free shifts
    const myShifts = visibleShifts.filter((s: Shift) => s.doctor_id === doctor.id)

    // Filter accessible free shifts
    const freeShifts = visibleShifts.filter((s: Shift) =>
        s.shift_type === "free" || s.status === "free" || s.status === "free_pending"
    )

    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Mis Guardias</h1>
                <p className="text-slate-600">Gestiona tus guardias asignadas y disponibles</p>
            </div>

            <Tabs defaultValue="assigned" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="assigned">Mis Guardias ({myShifts.length})</TabsTrigger>
                    <TabsTrigger value="available">Disponibles ({freeShifts.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="assigned" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Guardias Asignadas</CardTitle>
                            <CardDescription>Guardias que te han sido asignadas</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {myShifts.length === 0 ? (
                                <p className="text-center text-slate-500 py-8">No tienes guardias asignadas</p>
                            ) : (
                                <ShiftsList shifts={myShifts} currentDoctor={doctor} />
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="available" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Guardias Disponibles</CardTitle>
                            <CardDescription>Guardias libres que puedes aceptar</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {freeShifts.length === 0 ? (
                                <p className="text-center text-slate-500 py-8">
                                    No hay guardias disponibles en este momento
                                </p>
                            ) : (
                                <ShiftsList shifts={freeShifts} currentDoctor={doctor} />
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
