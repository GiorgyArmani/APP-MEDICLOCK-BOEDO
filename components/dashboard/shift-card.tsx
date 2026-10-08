"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { updateShiftStatus, acceptFreeShift, clockIn, clockOut, saveDoctorNotes } from "@/lib/actions/shifts"
import { cancelShift } from "@/lib/actions/cancel-shift"
import { SHIFT_TYPES } from "@/lib/constants/shift-types"
import type { Shift } from "@/lib/supabase/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, CheckCircle2, XCircle, Users, AlertCircle, MapPin } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/language-provider"
import { intlLocales } from "@/lib/i18n/config"
import { useClockLocation } from "@/lib/geo/use-clock-location"
import { GEOFENCE_ENABLED } from "@/lib/geo/config"

interface ShiftCardProps {
  shift: Shift
  doctorId: string
}

export function ShiftCard({ shift, doctorId }: ShiftCardProps) {
  const { t, locale } = useLanguage()
  const [isPending, startTransition] = useTransition()
  const [doctorNotes, setDoctorNotes] = useState(shift.doctor_notes || "")
  const router = useRouter()
  const { locate, errorMessage } = useClockLocation()

  const handleStatusUpdate = async (status: "confirmed" | "rejected") => {
    startTransition(async () => {
      const result = await updateShiftStatus(shift.id, status, doctorId)
      if (result.error) {
        toast.error(`Error: ${result.error}`)
      } else {
        toast.success(status === "confirmed" ? t("shift.toastConfirmed") : t("shift.toastRejected"))
        router.refresh()
      }
    })
  }

  const handleRejectToFree = async () => {
    startTransition(async () => {
      const result = await updateShiftStatus(shift.id, "free")
      if (result.error) {
        toast.error(`Error: ${result.error}`)
      } else {
        toast.success(t("shift.toastReleased"))
        router.refresh()
      }
    })
  }

  const handleAcceptFreeShift = async () => {
    startTransition(async () => {
      const result = await acceptFreeShift(shift.id, doctorId)
      if (result.error) {
        toast.error(`Error: ${result.error}`)
      } else {
        toast.success(t("shift.toastAccepted"))
        router.refresh()
      }
    })
  }

  const handleCancelShift = async () => {
    startTransition(async () => {
      const result = await cancelShift(shift.id)
      if (result.error) {
        toast.error(`Error: ${result.error}`)
      } else {
        toast.success(t("shift.toastCancelled"))
        router.refresh()
      }
    })
  }

  const handleClockIn = async () => {
    startTransition(async () => {
      const { coords, geoError } = await locate()
      const result = await clockIn(shift.id, doctorId, coords)
      if (result.error) {
        toast.error(`Error: ${errorMessage(result, geoError)}`)
      } else {
        toast.success(result.message || t("shift.toastClockIn"))
        router.refresh()
      }
    })
  }

  const handleClockOut = async () => {
    startTransition(async () => {
      const { coords, geoError } = await locate()
      const result = await clockOut(shift.id, doctorId, coords)
      if (result.error) {
        toast.error(`Error: ${errorMessage(result, geoError)}`)
      } else {
        toast.success(t("shift.toastClockOut"))
        router.refresh()
      }
    })
  }

  const handleSaveNotes = async () => {
    startTransition(async () => {
      const result = await saveDoctorNotes(shift.id, doctorId, doctorNotes)
      if (result.error) {
        toast.error(`Error: ${result.error}`)
      } else {
        toast.success(t("shift.toastNotesSaved"))
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

  const typeColors = {
    assigned: "bg-slate-100 text-slate-700 border-slate-200",
    free: "bg-cyan-100 text-cyan-800 border-cyan-200",
  }

  const areaColors = {
    consultorio: "bg-white text-slate-700 border-slate-300",
    internacion: "bg-white text-slate-700 border-slate-300",
    refuerzo: "bg-white text-slate-700 border-slate-300",
    piso: "bg-white text-slate-700 border-slate-300",
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00")
    return date.toLocaleDateString(intlLocales[locale], { weekday: "long", year: "numeric", month: "long", day: "numeric" })
  }

  const shiftTypeInfo = SHIFT_TYPES.find((st) => st.value === shift.shift_category)
  const shiftLabel = shiftTypeInfo?.label || shift.shift_category

  const statusAccent: Record<string, string> = {
    new: "border-l-blue-600",
    free: "border-l-cyan-600",
    confirmed: "border-l-emerald-500",
    rejected: "border-l-red-500",
    free_pending: "border-l-amber-500",
  }

  const canAcceptFreeShift = (shift.status === "free" || shift.status === "free_pending")
  const isAssignedToMe = shift.doctor_id === doctorId

  return (
    <Card
      id={`shift-${shift.id}`}
      className={cn(
        "border-l-4 py-0 transition-shadow duration-200 hover:shadow-md",
        statusAccent[shift.status]
      )}
    >
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h3 className="text-lg font-bold tracking-tight text-slate-900">{shiftLabel}</h3>
              <Badge className={statusColors[shift.status]}>
                {shift.status === "new"
                  ? t("shift.statusNew")
                  : shift.status === "free"
                    ? t("shift.statusFree")
                    : shift.status === "confirmed"
                      ? t("shift.statusConfirmed")
                      : shift.status === "rejected"
                        ? t("shift.statusRejected")
                        : t("shift.statusPending")}
              </Badge>
              <Badge className={typeColors[shift.shift_type]}>
                {shift.shift_type === "free" && <Users className="h-3 w-3 mr-1" />}
                {shift.shift_type === "assigned" ? t("shift.typeAssigned") : t("shift.typeFree")}
              </Badge>
              {shift.status === "free_pending" && (
                <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {t("shift.badge12h")}
                </Badge>
              )}
              {(() => {
                const today = new Date()
                const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
                return shift.shift_date === todayStr && (
                  <Badge className="bg-emerald-600 text-white border-emerald-700 shadow-sm motion-safe:animate-pulse">
                    {t("shift.today")}
                  </Badge>
                )
              })()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 rounded-xl bg-slate-50 p-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="h-4 w-4 text-slate-400" />
            <Badge className={areaColors[shift.shift_area === "completo" ? "consultorio" : (shift.shift_area as keyof typeof areaColors)]}>
              {shift.shift_area === "consultorio" || shift.shift_area === "completo"
                ? t("shift.areaConsultorio")
                : shift.shift_area === "internacion"
                  ? t("shift.areaInternacion")
                  : shift.shift_area === "piso"
                    ? t("shift.areaPiso")
                    : t("shift.areaRefuerzo")}
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

        {shift.notes && (
          <div className="mb-4 rounded-xl border border-slate-200 p-3">
            <p className="text-sm text-slate-700">
              <span className="font-medium">{t("shift.notesLabel")}</span> {shift.notes}
            </p>
          </div>
        )}

        {shift.status === "new" && shift.shift_type === "assigned" && isAssignedToMe && (
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <Button
              onClick={() => handleStatusUpdate("confirmed")}
              disabled={isPending}
              className="h-11 flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {t("shift.confirm")}
            </Button>
            <Button onClick={handleRejectToFree} disabled={isPending} variant="destructive" className="h-11 flex-1 rounded-xl">
              <XCircle className="h-4 w-4 mr-2" />
              {t("shift.rejectRelease")}
            </Button>
          </div>
        )}

        {shift.status === "confirmed" && isAssignedToMe && (
          <div className="flex flex-col gap-3 pt-4 border-t border-slate-200">
            {(() => {
              const now = new Date()
              const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
              const [y, m, d] = shift.shift_date.split("-").map(Number)
              const shiftDate = new Date(y, m - 1, d)
              
              const diffTime = Math.abs(shiftDate.getTime() - today.getTime())
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
              const isAllowed = diffDays <= 1

              if (!shift.clock_in) {
                return (
                  <div className="space-y-2">
                    {!isAllowed && (
                      <p className="text-xs text-slate-500 text-center flex items-center justify-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {t("shift.checkinNear")}
                      </p>
                    )}
                    <Button
                      onClick={handleClockIn}
                      disabled={isPending || !isAllowed}
                      className="h-12 w-full rounded-xl bg-emerald-600 text-base font-semibold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      {t("shift.checkin")}
                    </Button>
                    {GEOFENCE_ENABLED && (
                      <p className="text-xs text-slate-500 text-center flex items-center justify-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {t("geo.notice")}
                      </p>
                    )}
                  </div>
                )
              }

              if (shift.clock_in && !shift.clock_out) {
                return (
                  <div className="space-y-2">
                    {!isAllowed && (
                      <p className="text-xs text-slate-500 text-center flex items-center justify-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {t("shift.checkoutNear")}
                      </p>
                    )}
                    <div className="rounded-xl bg-emerald-50 p-2.5 text-center text-sm font-semibold text-emerald-800">
                      {t("shift.clockInLabel")} {new Date(shift.clock_in).toLocaleTimeString(intlLocales[locale], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <Button
                      onClick={handleClockOut}
                      disabled={isPending || !isAllowed}
                      className="h-12 w-full rounded-xl text-base font-semibold"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      {t("shift.checkout")}
                    </Button>
                  </div>
                )
              }
              return null
            })()}

            {shift.clock_in && shift.clock_out && (
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3 text-center text-sm font-semibold tabular-nums">
                <div className="text-emerald-700">
                  <span className="block text-xs font-semibold uppercase">{t("shift.entrada")}</span>
                  {new Date(shift.clock_in).toLocaleTimeString(intlLocales[locale], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="text-blue-700">
                  <span className="block text-xs font-semibold uppercase">{t("shift.salida")}</span>
                  {new Date(shift.clock_out).toLocaleTimeString(intlLocales[locale], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            )}

            <div className="pt-2 pb-2">
              <Label htmlFor={`notes-${shift.id}`} className="text-sm font-medium mb-2 block">{t("shift.myNotes")}</Label>
              <Textarea
                id={`notes-${shift.id}`}
                placeholder={t("shift.notesPlaceholder")}
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                className="mb-2 bg-white"
              />
              <Button
                onClick={handleSaveNotes}
                disabled={isPending}
                variant="secondary"
                size="sm"
                className="w-full"
              >
                {t("shift.saveNotes")}
              </Button>
            </div>

            <Button
              onClick={handleCancelShift}
              disabled={isPending}
              variant="outline"
              className="h-11 w-full rounded-xl border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              <XCircle className="h-4 w-4 mr-2" />
              {t("shift.cancelShift")}
            </Button>
          </div>
        )}

        {canAcceptFreeShift && (
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <Button
              onClick={handleAcceptFreeShift}
              disabled={isPending}
              className="h-11 flex-1 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {t("shift.acceptShift")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
