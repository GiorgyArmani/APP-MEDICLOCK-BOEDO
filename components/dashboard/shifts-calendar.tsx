"use client"

import { useState } from "react"
import type { Shift, Doctor } from "@/lib/supabase/types"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ShiftCard } from "./shift-card"
import { AdminShiftCard } from "@/components/admin/admin-shift-card"
import { ReadOnlyShiftCard } from "@/components/admin/read-only-shift-card"
import { CalendarHeader } from "./calendar/calendar-header"
import { MonthView } from "./calendar/month-view"
import { WeekView } from "./calendar/week-view"
import { DayView } from "./calendar/day-view"
import { ShiftsFilter } from "@/components/admin/shifts-filter"
import { useLanguage } from "@/lib/i18n/language-provider"
import { intlLocales } from "@/lib/i18n/config"

interface ShiftsCalendarProps {
  shifts: Shift[]
  doctors?: Doctor[] // Optional, only for admin view
  currentDoctor?: Doctor
  readOnly?: boolean
  /** Fecha inicial del calendario (default: hoy) */
  initialDate?: Date
  /** Callback cuando se navega entre meses (solo mode=month). Admin usa esto para hacer router.push */
  onMonthNavigate?: (date: Date) => void
}


export function ShiftsCalendar({ shifts, currentDoctor, readOnly = false, initialDate, onMonthNavigate, ...props }: ShiftsCalendarProps) {
  const { t, locale } = useLanguage()
  const [currentDate, setCurrentDate] = useState(initialDate ?? new Date())
  const [view, setView] = useState<"month" | "week" | "day">("month")


  // Filter State
  const [filterDoctorId, setFilterDoctorId] = useState<string>("all")
  const [filterArea, setFilterArea] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  // Dialog State
  const [selectedShifts, setSelectedShifts] = useState<Shift[]>([])
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Filtering Logic
  const filteredShifts = shifts.filter((shift) => {
    const matchesDoctor = filterDoctorId === "all" || shift.doctor_id === filterDoctorId
    const matchesArea = filterArea === "all" || shift.shift_area === filterArea
    const matchesStatus = filterStatus === "all" || shift.status === filterStatus
    return matchesDoctor && matchesArea && matchesStatus
  })

  // Handlers
  const handleDayClick = (dayShifts: Shift[], date: Date) => {
    if (view === "month") {
      setCurrentDate(date)
      setView("day")
      return
    }

    if (dayShifts.length > 0) {
      setSelectedShifts(dayShifts)
      setSelectedDoctorId(dayShifts[0]?.doctor_id || "")
      setIsDialogOpen(true)
    }
  }

  const handleShiftClick = (shift: Shift) => {
    setSelectedShifts([shift])
    setSelectedDoctorId(shift.doctor_id || "")
    setIsDialogOpen(true)
  }

  const handleWeekDayClick = (date: Date) => {
    setCurrentDate(date)
    setView("day")
  }

  const clearFilters = () => {
    setFilterDoctorId("all")
    setFilterArea("all")
    setFilterStatus("all")
  }

  const hasFilters = filterDoctorId !== "all" || filterArea !== "all" || filterStatus !== "all"

  return (
    <>
      <Card className="shadow-2xl shadow-slate-200/40 border-slate-200/60 sm:rounded-3xl min-h-[600px] sm:min-h-[850px] flex flex-col overflow-hidden bg-white">
        {/* Header Controller */}
        <CalendarHeader
          date={currentDate}
          view={view}
          onViewChange={setView}
          onDateChange={(newDate) => {
            setCurrentDate(newDate)
            // If admin provided a month-navigate callback AND we are in month view,
            // fire it so the server can re-fetch the correct date range.
            if (onMonthNavigate && view === "month") {
              onMonthNavigate(newDate)
            }
          }}
          onToday={() => {
            const today = new Date()
            setCurrentDate(today)
            if (onMonthNavigate && view === "month") {
              onMonthNavigate(today)
            }
          }}
        />


        <CardContent className="p-3 pt-6 sm:p-8 flex-1 space-y-6 sm:space-y-8">
          {/* Admin Filters Row */}
          {props.doctors && (
            <div className="bg-slate-50/30 p-1 rounded-2xl border border-slate-100/50">
              <ShiftsFilter
                doctors={props.doctors}
                filterDoctorId={filterDoctorId}
                setFilterDoctorId={setFilterDoctorId}
                filterArea={filterArea}
                setFilterArea={setFilterArea}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                onClear={clearFilters}
              />
            </div>
          )}

          {/* View Legend */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6">
            <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-100 shadow-sm lg:w-fit flex-1 sm:flex-none">
              <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 sm:mb-3 block">{t("calendar.workArea")}</span>
              <div className="flex flex-wrap gap-3 sm:gap-5">
                <StatusBadge color="bg-purple-500" label={t("shift.areaConsultorio")} dot={false} bar={true} />
                <StatusBadge color="bg-blue-500" label={t("shift.areaInternacion")} dot={false} bar={true} />
                <StatusBadge color="bg-orange-500" label={t("shift.areaRefuerzo")} dot={false} bar={true} />
                <StatusBadge color="bg-indigo-500" label={t("shift.areaPiso")} dot={false} bar={true} />
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-100 shadow-sm lg:w-fit flex-1 sm:flex-none">
              <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 sm:mb-3 block">{t("calendar.shiftStatus")}</span>
              <div className="flex flex-wrap gap-3 sm:gap-5">
                <StatusBadge color="bg-blue-400" label={t("shift.statusNew")} />
                <StatusBadge color="bg-amber-400" label={t("shift.statusFree")} />
                <StatusBadge color="bg-emerald-400" label={t("shift.statusConfirmed")} />
                <StatusBadge color="bg-rose-400" label={t("shift.statusRejected")} />
                <StatusBadge color="bg-orange-400" label={t("shift.statusPending")} />
              </div>
            </div>
          </div>

          {/* Content Swapper */}
          {view === "month" && (
            <MonthView
              currentDate={currentDate}
              shifts={filteredShifts}
              onDayClick={handleDayClick}
              doctors={props.doctors}
            />
          )}

          {view === "week" && (
            <WeekView
              currentDate={currentDate}
              shifts={filteredShifts}
              onDayClick={handleWeekDayClick}
              onShiftClick={handleShiftClick}
              doctors={props.doctors}
            />
          )}

          {view === "day" && (
            <DayView
              currentDate={currentDate}
              shifts={filteredShifts}
              onShiftClick={handleShiftClick}
              doctors={props.doctors}
            />
          )}

        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl capitalize">
              {selectedShifts.length > 0 &&
                new Date(selectedShifts[0].shift_date + "T00:00:00").toLocaleDateString(intlLocales[locale], {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              }
            </DialogTitle>
            <DialogDescription>
              {selectedShifts.length} {selectedShifts.length === 1 ? t("calendar.guardiaSingular") : t("calendar.guardiaPlural")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {selectedShifts.map((shift) => (
              readOnly && props.doctors ? (
                <ReadOnlyShiftCard key={shift.id} shift={shift} doctors={props.doctors} />
              ) : props.doctors ? (
                <AdminShiftCard key={shift.id} shift={shift} doctors={props.doctors} currentDoctor={currentDoctor} />
              ) : (
                <ShiftCard key={shift.id} shift={shift} doctorId={currentDoctor?.id || selectedDoctorId} />
              )
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function StatusBadge({ color, label, dot = true, bar = false }: { color: string; label: string; dot?: boolean; bar?: boolean }) {
  return (
    <div className="flex items-center gap-3 group cursor-default">
      {dot && <div className={`w-2.5 h-2.5 rounded-full ${color} shadow-sm ring-4 ring-transparent group-hover:ring-slate-50 transition-all`} />}
      {bar && <div className={`w-1.5 h-4 rounded-full ${color} shadow-sm`} />}
      <span className="text-[11px] font-bold text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-tight">{label}</span>
    </div>
  )
}
