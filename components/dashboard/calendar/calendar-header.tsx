"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/lib/i18n/language-provider"
import { intlLocales } from "@/lib/i18n/config"

interface CalendarHeaderProps {
    date: Date
    view: "month" | "week" | "day"
    onViewChange: (view: "month" | "week" | "day") => void
    onDateChange: (date: Date) => void
    onToday: () => void
}

export function CalendarHeader({ date, view, onViewChange, onDateChange, onToday }: CalendarHeaderProps) {
    const { t, locale } = useLanguage()
    const intlLocale = intlLocales[locale]
    const navigate = (direction: number) => {
        const newDate = new Date(date)
        switch (view) {
            case "month":
                newDate.setMonth(date.getMonth() + direction)
                break
            case "week":
                newDate.setDate(date.getDate() + direction * 7)
                break
            case "day":
                newDate.setDate(date.getDate() + direction)
                break
        }
        onDateChange(newDate)
    }

    const formatDate = () => {
        const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long" }

        if (view === "day") {
            return date.toLocaleDateString(intlLocale, { ...options, day: "numeric", weekday: "long" })
        }

        if (view === "week") {
            // Logic for week range label could go here, for now keeping it simple: just month/year
            // or "Semana del X de Mes"
            const startOfWeek = new Date(date)
            startOfWeek.setDate(date.getDate() - date.getDay())
            const endOfWeek = new Date(startOfWeek)
            endOfWeek.setDate(startOfWeek.getDate() + 6)

            const startStr = startOfWeek.toLocaleDateString(intlLocale, { day: 'numeric', month: 'short' })
            const endStr = endOfWeek.toLocaleDateString(intlLocale, { day: 'numeric', month: 'short', year: 'numeric' })
            return `${startStr} - ${endStr}`
        }

        // Default Month View
        return date.toLocaleDateString(intlLocale, options)
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 p-4 sm:p-6 border-b border-slate-100 bg-white">
            <div className="flex flex-col items-center sm:items-start gap-1 w-full sm:w-auto">
                <div className="flex items-center gap-2 text-blue-600 mb-0.5 sm:mb-1">
                    <CalendarIcon className="h-4 w-4 hidden sm:block" />
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em]">{t("calendar.management")}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black capitalize text-slate-800 tracking-tight text-center sm:text-left">
                    {formatDate()}
                </h2>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <Select value={view} onValueChange={(v: "month" | "week" | "day") => onViewChange(v)}>
                    <SelectTrigger className="w-[110px] bg-slate-50/50 border-slate-200 rounded-xl font-bold text-xs h-9">
                        <SelectValue placeholder={t("calendar.view")} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                        <SelectItem value="month" className="text-xs font-bold">{t("calendar.viewMonth")}</SelectItem>
                        <SelectItem value="week" className="text-xs font-bold">{t("calendar.viewWeek")}</SelectItem>
                        <SelectItem value="day" className="text-xs font-bold">{t("calendar.viewDay")}</SelectItem>
                    </SelectContent>
                </Select>

                <div className="flex items-center bg-slate-100/50 p-1 rounded-xl border border-slate-200/50">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-8 w-8 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-600">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" className="px-5 font-black text-[10px] uppercase tracking-widest hover:bg-white hover:shadow-sm rounded-lg h-8 transition-all text-slate-700" onClick={onToday}>
                        {t("calendar.today")}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => navigate(1)} className="h-8 w-8 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-600">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
