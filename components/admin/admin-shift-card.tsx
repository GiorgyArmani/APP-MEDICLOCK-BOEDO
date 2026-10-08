"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import type { Shift, Doctor } from "@/lib/supabase/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, MapPin, Edit, Trash2, UserCog, CheckCircle2, XCircle, Users, AlertCircle } from "lucide-react"
import { SHIFT_TYPES } from "@/lib/constants/shift-types"
import { EditShiftDialog } from "./edit-shift-dialog"
import { ReassignShiftDialog } from "./reassign-shift-dialog"
import { DeleteShiftDialog } from "./delete-shift-dialog"
import { updateShiftStatus, acceptFreeShift, clockIn, clockOut, saveDoctorNotes } from "@/lib/actions/shifts"
import { toast } from "sonner"
import { UserAvatar } from "@/components/layout/user-avatar"
import { cn } from "@/lib/utils"
import { useClockLocation } from "@/lib/geo/use-clock-location"

interface AdminShiftCardProps {
    shift: Shift
    doctors: Doctor[]
    currentDoctor?: Doctor
}

export function AdminShiftCard({ shift, doctors, currentDoctor }: AdminShiftCardProps) {
    const [isPending, startTransition] = useTransition()
    const [doctorNotes, setDoctorNotes] = useState(shift.doctor_notes || "")
    const router = useRouter()
    const { locate, errorMessage } = useClockLocation()
    const [editOpen, setEditOpen] = useState(false)
    const [reassignOpen, setReassignOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)

    const doctorId = currentDoctor?.id

    const handleStatusUpdate = async (status: "confirmed" | "rejected") => {
        if (!doctorId) return
        startTransition(async () => {
            const result = await updateShiftStatus(shift.id, status, doctorId)
            if (result.error) {
                toast.error(`Error: ${result.error}`)
            } else {
                toast.success(status === "confirmed" ? "Guardia confirmada" : "Guardia rechazada")
                router.refresh()
            }
        })
    }

    const handleAcceptFreeShift = async () => {
        if (!doctorId) return
        startTransition(async () => {
            const result = await acceptFreeShift(shift.id, doctorId)
            if (result.error) {
                toast.error(`Error: ${result.error}`)
            } else {
                toast.success("Guardia aceptada exitosamente")
                router.refresh()
            }
        })
    }

    const handleClockIn = async () => {
        if (!doctorId) return
        startTransition(async () => {
            const { coords, geoError } = await locate()
            const result = await clockIn(shift.id, doctorId, coords)
            if (result.error) {
                toast.error(`Error: ${errorMessage(result, geoError)}`)
            } else {
                toast.success(result.message || "Entrada registrada exitosamente")
                router.refresh()
            }
        })
    }

    const handleClockOut = async () => {
        if (!doctorId) return
        startTransition(async () => {
            const { coords, geoError } = await locate()
            const result = await clockOut(shift.id, doctorId, coords)
            if (result.error) {
                toast.error(`Error: ${errorMessage(result, geoError)}`)
            } else {
                toast.success("Salida registrada exitosamente")
                router.refresh()
            }
        })
    }

    const handleSaveNotes = async () => {
        if (!doctorId) return
        startTransition(async () => {
            const result = await saveDoctorNotes(shift.id, doctorId, doctorNotes)
            if (result.error) {
                toast.error(`Error: ${result.error}`)
            } else {
                toast.success("Notas guardadas correctamente")
                router.refresh()
            }
        })
    }

    const statusColors = {
        new: "bg-blue-100 text-blue-800 border-blue-200",
        free: "bg-cyan-100 text-cyan-800 border-cyan-200",
        confirmed: "bg-emerald-100 text-emerald-800 border-emerald-200",
        rejected: "bg-red-100 text-red-800 border-red-200",
        free_pending: "bg-amber-100 text-amber-800 border-amber-200",
    }

    const areaColors = {
        consultorio: "bg-white text-slate-700 border-slate-300",
        internacion: "bg-white text-slate-700 border-slate-300",
        refuerzo: "bg-white text-slate-700 border-slate-300",
        piso: "bg-white text-slate-700 border-slate-300",
    }

    const statusAccent: Record<string, string> = {
        new: "border-l-blue-600",
        free: "border-l-cyan-600",
        confirmed: "border-l-emerald-500",
        rejected: "border-l-red-500",
        free_pending: "border-l-amber-500",
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr + "T00:00:00")
        return date.toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    }

    const shiftTypeInfo = SHIFT_TYPES.find((st) => st.value === shift.shift_category)
    const shiftLabel = shiftTypeInfo?.label || shift.shift_category

    const assignedDoctor = shift.doctor_id ? doctors.find((d) => d.id === shift.doctor_id) : null
    const isAssignedToMe = shift.doctor_id === doctorId
    const canAcceptFreeShift = currentDoctor && (shift.status === "free" || shift.status === "free_pending")

    return (
        <>
            <Card className={cn("border-l-4 py-0 transition-shadow duration-200 hover:shadow-md", statusAccent[shift.status])}>
                <CardContent className="p-5 sm:p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <h3 className="text-lg font-bold tracking-tight text-slate-900">{shiftLabel}</h3>
                                <Badge className={statusColors[shift.status as keyof typeof statusColors]}>
                                    {shift.status === "new"
                                        ? "Nueva"
                                        : shift.status === "free"
                                            ? "Libre"
                                            : shift.status === "confirmed"
                                                ? "Confirmada"
                                                : shift.status === "rejected"
                                                    ? "Rechazada"
                                                    : "Pendiente +12h"}
                                </Badge>
                                <Badge variant="outline">
                                    {shift.shift_type === "assigned" ? "Asignada" : "Libre"}
                                </Badge>
                                {(() => {
                                    const today = new Date()
                                    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
                                    return shift.shift_date === todayStr && (
                                        <Badge className="bg-emerald-600 text-white border-emerald-700 shadow-sm motion-safe:animate-pulse">
                                            HOY
                                        </Badge>
                                    )
                                })()}
                            </div>
                            {assignedDoctor && (
                                <p className="mt-1 flex items-center gap-2 text-sm text-slate-700">
                                    <UserAvatar name={assignedDoctor.full_name} className="h-6 w-6 text-[10px] ring-0" />
                                    <span className="font-semibold">{assignedDoctor.full_name}</span>
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 rounded-xl bg-slate-50 p-3">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            <Badge className={areaColors[shift.shift_area === "completo" ? "consultorio" : (shift.shift_area as keyof typeof areaColors)]}>
                                {shift.shift_area === "consultorio" || shift.shift_area === "completo"
                                    ? "Consultorio"
                                    : shift.shift_area === "internacion"
                                        ? "Internación"
                                        : shift.shift_area === "piso"
                                            ? "Piso"
                                            : "Refuerzo"}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Clock className="h-4 w-4 text-slate-400" />
                            <span className="font-semibold tabular-nums text-slate-800">{shift.shift_hours}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 md:col-span-2">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <span className="first-letter:uppercase">{formatDate(shift.shift_date)}</span>
                        </div>
                    </div>

                    {(shift.clock_in || shift.clock_out) && (
                        <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl border border-slate-200 p-3 tabular-nums">
                            <div className="text-xs">
                                <span className="font-semibold text-emerald-700 block uppercase">Entrada</span>
                                {shift.clock_in ? new Date(shift.clock_in).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }) : "-"}
                            </div>
                            <div className="text-xs">
                                <span className="font-semibold text-blue-700 block uppercase">Salida</span>
                                {shift.clock_out ? new Date(shift.clock_out).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }) : "-"}
                            </div>
                        </div>
                    )}

                    {shift.notes && (
                        <div className="mb-4 rounded-xl border border-slate-200 p-3">
                            <p className="text-sm text-slate-700">
                                <span className="font-medium">Notas:</span> {shift.notes}
                            </p>
                        </div>
                    )}

                    {shift.doctor_notes && !isAssignedToMe && (
                        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
                            <p className="text-sm text-amber-900">
                                <span className="font-medium">Notas del Médico:</span> {shift.doctor_notes}
                            </p>
                        </div>
                    )}

                    {/* Personal Doctor Actions (If assigned to me) */}
                    {isAssignedToMe && (
                        <div className="space-y-4 mb-4 pt-4 border-t border-slate-100">
                            {shift.status === "new" && (
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => handleStatusUpdate("confirmed")}
                                        disabled={isPending}
                                        className="h-10 flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
                                        size="sm"
                                    >
                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                        Confirmar Mi Guardia
                                    </Button>
                                    <Button
                                        onClick={() => handleStatusUpdate("rejected")}
                                        disabled={isPending}
                                        variant="destructive"
                                        size="sm"
                                        className="h-10 flex-1 rounded-xl"
                                    >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Rechazar
                                    </Button>
                                </div>
                            )}

                            {shift.status === "confirmed" && (
                                <div className="space-y-3">
                                    {!shift.clock_in && (
                                        <Button
                                            onClick={handleClockIn}
                                            disabled={isPending}
                                            className="h-11 w-full rounded-xl bg-emerald-600 font-semibold text-white hover:bg-emerald-700"
                                        >
                                            <Clock className="h-4 w-4 mr-2" />
                                            Marcar Entrada (Check-In)
                                        </Button>
                                    )}

                                    {shift.clock_in && !shift.clock_out && (
                                        <Button
                                            onClick={handleClockOut}
                                            disabled={isPending}
                                            className="h-11 w-full rounded-xl font-semibold"
                                        >
                                            <Clock className="h-4 w-4 mr-2" />
                                            Marcar Salida (Check-Out)
                                        </Button>
                                    )}

                                    <div className="pt-2">
                                        <Label htmlFor={`notes-${shift.id}`} className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Mis Notas</Label>
                                        <Textarea
                                            id={`notes-${shift.id}`}
                                            placeholder="Notas sobre el turno..."
                                            value={doctorNotes}
                                            onChange={(e) => setDoctorNotes(e.target.value)}
                                            className="mb-2 bg-white text-sm"
                                            rows={2}
                                        />
                                        <Button
                                            onClick={handleSaveNotes}
                                            disabled={isPending}
                                            variant="secondary"
                                            size="sm"
                                            className="w-full text-xs"
                                        >
                                            Guardar Mis Notas
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Accept Free Shift Action */}
                    {canAcceptFreeShift && (
                        <div className="mb-4 pt-4 border-t border-slate-100">
                            <Button
                                onClick={handleAcceptFreeShift}
                                disabled={isPending}
                                className="h-11 w-full rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white"
                            >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Tomar Esta Guardia
                            </Button>
                        </div>
                    )}

                    {/* Admin Actions */}
                    <div className="flex gap-2 pt-4 border-t border-slate-200 flex-wrap">
                        <Button
                            onClick={() => setEditOpen(true)}
                            variant="outline"
                            size="sm"
                            className="h-9 flex-1 min-w-[80px] rounded-lg"
                        >
                            <Edit className="h-3.5 w-3.5 mr-1.5" />
                            Editar
                        </Button>
                        <Button
                            onClick={() => setReassignOpen(true)}
                            variant="outline"
                            size="sm"
                            className="h-9 flex-1 min-w-[80px] rounded-lg"
                        >
                            <UserCog className="h-3.5 w-3.5 mr-1.5" />
                            Reasignar
                        </Button>
                        <Button
                            onClick={() => setDeleteOpen(true)}
                            variant="outline"
                            size="sm"
                            className="h-9 flex-1 min-w-[80px] rounded-lg border-red-200 text-red-600 hover:bg-red-50"
                        >
                            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                            Eliminar
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <EditShiftDialog
                shift={shift}
                open={editOpen}
                onOpenChange={setEditOpen}
            />

            <ReassignShiftDialog
                shift={shift}
                doctors={doctors}
                open={reassignOpen}
                onOpenChange={setReassignOpen}
            />

            <DeleteShiftDialog
                shift={shift}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
            />
        </>
    )
}
