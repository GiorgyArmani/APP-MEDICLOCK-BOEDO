"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import type { DashboardStats } from "@/lib/actions/shifts"
import { TrendingUp, TrendingDown, Calendar, CheckCircle2, Clock, Users, LayoutGrid, Minus, CalendarRange, X } from "lucide-react"
import { format, startOfMonth, endOfMonth, subMonths, startOfYear } from "date-fns"
import { es } from "date-fns/locale"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarPicker } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import type { DateRange } from "react-day-picker"

// ─── Types ───────────────────────────────────────────────────────────────────

interface AdminDashboardStatsProps {
    stats: DashboardStats
    dateFrom: string
    dateTo: string
    totalAllTime: number
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pctChange(current: number, previous: number) {
    if (previous === 0) return current > 0 ? 100 : 0
    return Math.round(((current - previous) / previous) * 100)
}

function formatDateLabel(dateStr: string) {
    return format(new Date(dateStr + "T00:00:00"), "dd MMM", { locale: es })
}

// ─── KPI Card ────────────────────────────────────────────────────────────────

function KpiCard({
    title, value, subtitle, icon: Icon, color, pct,
}: {
    title: string; value: number; subtitle: string
    icon: React.ElementType; color: string; pct?: number
}) {
    const isPositive = pct !== undefined && pct > 0
    const isNegative = pct !== undefined && pct < 0
    const isNeutral = pct === undefined || pct === 0

    return (
        <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/60 shadow-sm p-5 group hover:shadow-md transition-shadow">
            <div className={`absolute inset-0 opacity-[0.04] group-hover:opacity-[0.07] transition-opacity bg-gradient-to-br ${color}`} />
            <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
                <div className={`p-2 rounded-xl bg-gradient-to-br ${color} bg-opacity-10 shadow-sm`}>
                    <Icon className="h-4 w-4 text-white" />
                </div>
            </div>
            <div className="flex items-end justify-between">
                <div>
                    <p className="text-4xl font-black text-slate-900 leading-none">{value.toLocaleString("es-AR")}</p>
                    <p className="text-xs text-slate-500 mt-1.5 font-medium">{subtitle}</p>
                </div>
                {pct !== undefined && (
                    <div className={`flex items-center gap-1 text-xs font-bold rounded-full px-2.5 py-1 ${isPositive ? "bg-emerald-50 text-emerald-700" : isNegative ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-500"}`}>
                        {isPositive ? <TrendingUp className="h-3 w-3" /> : isNegative ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                        {isNeutral ? "=" : `${isPositive ? "+" : ""}${pct}%`}
                    </div>
                )}
            </div>
        </div>
    )
}

// ─── Weekly Bar Chart — barras horizontales apiladas ─────────────────────────
// Azul sky = Confirmadas · Ámbar = Pendientes · Fondo celeste = Hoy

const BAR_CONFIRMED = "#0ea5e9"
const BAR_PENDING = "#fbbf24"
const LBL_W = 58      // px del área de etiquetas (izquierda)
const ROW_H = 26     // alto de cada barra
const ROW_G = 10     // gap entre filas
const AXIS_H = 22     // espacio para eje X (abajo)
const VW = 480    // viewBox width total (escalable)
const BAR_W = VW - LBL_W - 32  // ancho disponible para barras

function WeeklyBarChart({ data }: { data: DashboardStats["weeklyBreakdown"] }) {
    const maxVal = Math.max(...data.map((d) => d.total), 1)
    const today = format(new Date(), "yyyy-MM-dd")
    const totalH = data.length * (ROW_H + ROW_G) - ROW_G + AXIS_H + 10
    const ticks = [0, 0.25, 0.5, 0.75, 1].map((p) => Math.round(p * maxVal))

    return (
        <div className="space-y-3">
            {/* Legend */}
            <div className="flex flex-wrap items-center gap-5 text-xs">
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: BAR_CONFIRMED }} />
                    <span className="text-slate-600 font-semibold">Confirmadas</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: BAR_PENDING }} />
                    <span className="text-slate-600 font-semibold">Pendientes</span>
                </div>
                <div className="flex items-center gap-1.5 ml-auto">
                    <div className="w-3 h-3 rounded-sm bg-sky-100 border border-sky-300" />
                    <span className="text-slate-600 font-semibold">Hoy</span>
                </div>
            </div>

            {/* SVG chart */}
            <svg viewBox={`0 0 ${VW} ${totalH}`} className="w-full" preserveAspectRatio="xMinYMid meet">
                {/* Grid lines + X-axis labels */}
                {ticks.map((val) => {
                    const x = LBL_W + (val / maxVal) * BAR_W
                    return (
                        <g key={val}>
                            <line x1={x} y1={0} x2={x} y2={totalH - AXIS_H} stroke="#e2e8f0" strokeWidth={1} strokeDasharray="3 2" />
                            <text x={x} y={totalH - 4} textAnchor="middle" fontSize={9} fill="#94a3b8" fontWeight={500}>{val}</text>
                        </g>
                    )
                })}
                {/* Left baseline */}
                <line x1={LBL_W} y1={0} x2={LBL_W} y2={totalH - AXIS_H} stroke="#e2e8f0" strokeWidth={1} />

                {/* Rows */}
                {data.map((day, i) => {
                    const y = i * (ROW_H + ROW_G)
                    const isToday = day.date === today
                    const totalPx = day.total === 0 ? 0 : (day.total / maxVal) * BAR_W
                    const confPx = day.total === 0 ? 0 : (day.confirmed / day.total) * totalPx
                    const pendPx = totalPx - confPx
                    const r = 4

                    return (
                        <g key={day.date}>
                            {/* Today highlight */}
                            {isToday && (
                                <rect x={LBL_W - 2} y={y - 3} width={BAR_W + 34} height={ROW_H + 6} rx={6} fill="#e0f2fe" opacity={0.75} />
                            )}

                            {/* Day label */}
                            <text x={LBL_W - 8} y={y + ROW_H / 2 + 4}
                                textAnchor="end" fontSize={11}
                                fontWeight={isToday ? 800 : 500}
                                fill={isToday ? "#0284c7" : "#64748b"}>
                                {day.label}
                            </text>
                            {/* HOY badge */}
                            {isToday && (
                                <text x={LBL_W - 8} y={y + ROW_H / 2 + 15}
                                    textAnchor="end" fontSize={8} fontWeight={900}
                                    fill="#0284c7" letterSpacing={0.5}>
                                    HOY
                                </text>
                            )}

                            {/* Track background */}
                            <rect x={LBL_W} y={y} width={BAR_W} height={ROW_H} rx={r} fill="#f1f5f9" />

                            {/* Confirmed segment */}
                            {confPx > 0 && (
                                <rect x={LBL_W} y={y} width={confPx} height={ROW_H} rx={r} fill={BAR_CONFIRMED} />
                            )}
                            {/* Pending segment */}
                            {pendPx > 0 && (
                                <rect x={LBL_W + confPx} y={y} width={pendPx} height={ROW_H}
                                    rx={confPx > 0 ? 0 : r} fill={BAR_PENDING} />
                            )}
                            {/* Right rounded cap - pending */}
                            {pendPx > 0 && (
                                <rect x={LBL_W + confPx + pendPx - r * 2} y={y} width={r * 2} height={ROW_H} rx={r} fill={BAR_PENDING} />
                            )}
                            {/* Right rounded cap - confirmed only */}
                            {pendPx === 0 && confPx > 0 && (
                                <rect x={LBL_W + confPx - r * 2} y={y} width={r * 2} height={ROW_H} rx={r} fill={BAR_CONFIRMED} />
                            )}

                            {/* Zero placeholder */}
                            {day.total === 0 && (
                                <rect x={LBL_W + 2} y={y + ROW_H / 2 - 1} width={16} height={2} rx={1} fill="#cbd5e1" />
                            )}

                            {/* Total at end of bar */}
                            {day.total > 0 && (
                                <text x={LBL_W + totalPx + 7} y={y + ROW_H / 2 + 4} fontSize={10} fontWeight={700} fill="#475569">
                                    {day.total}
                                </text>
                            )}
                        </g>
                    )
                })}
            </svg>
        </div>
    )
}

// ─── Donut Chart (SVG puro) ──────────────────────────────────────────────────

const AREA_CONFIG = {
    consultorio: { label: "Consultorio", color: "#7c3aed" },
    internacion: { label: "Internación", color: "#0ea5e9" },
    refuerzo: { label: "Refuerzo", color: "#f97316" },
    piso: { label: "Piso", color: "#6366f1" },
}

function DonutChart({ byArea }: { byArea: DashboardStats["byArea"] }) {
    const entries = Object.entries(byArea) as [keyof typeof AREA_CONFIG, number][]
    const total = entries.reduce((s, [, v]) => s + v, 0)
    // viewBox fixed at 200×200 — SVG scales to 100% container width
    const R = 80; const cx = 100; const cy = 100; const strokeW = 24
    let offset = 0
    const circumference = 2 * Math.PI * R
    const arcs = entries.map(([key, val]) => {
        const pct = total === 0 ? 0 : val / total
        const arc = { key, val, pct, offset, strokeDash: pct * circumference }
        offset += pct * circumference
        return arc
    })

    return (
        <div className="flex flex-col items-center gap-5">
            {/* Donut — escala al ancho disponible */}
            <svg viewBox="0 0 200 200" className="w-full max-w-[260px]">
                <circle cx={cx} cy={cy} r={R} fill="none" stroke="#f1f5f9" strokeWidth={strokeW} />
                {total === 0
                    ? <circle cx={cx} cy={cy} r={R} fill="none" stroke="#e2e8f0" strokeWidth={strokeW} />
                    : arcs.map(({ key, strokeDash, offset: off }) => (
                        <circle key={key} cx={cx} cy={cy} r={R} fill="none"
                            stroke={AREA_CONFIG[key].color} strokeWidth={strokeW}
                            strokeDasharray={`${strokeDash} ${circumference - strokeDash}`}
                            strokeDashoffset={circumference * 0.25 - off}
                            strokeLinecap="butt"
                            style={{ transition: "stroke-dasharray 0.5s ease" }}
                        />
                    ))
                }
                <text x={cx} y={cy - 10} textAnchor="middle" fontSize={30} fontWeight={900} fill="#0f172a">{total.toLocaleString("es-AR")}</text>
                <text x={cx} y={cy + 16} textAnchor="middle" fontSize={13} fontWeight={500} fill="#64748b">guardias</text>
            </svg>

            {/* Leyenda debajo en 2 columnas */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 w-full">
                {entries.map(([key, val]) => {
                    const pct = total === 0 ? 0 : Math.round((val / total) * 100)
                    const cfg = AREA_CONFIG[key]
                    return (
                        <div key={key} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.color }} />
                            <span className="text-xs text-slate-600 flex-1 font-medium truncate">{cfg.label}</span>
                            <span className="text-xs font-bold text-slate-900">{val}</span>
                            <span className="text-[10px] font-semibold rounded-full px-1.5 py-0.5" style={{ backgroundColor: cfg.color + "1a", color: cfg.color }}>{pct}%</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

// ─── Period Presets ───────────────────────────────────────────────────────────

const PERIODS = [
    {
        label: "Esta semana",
        get: () => {
            const d = new Date(); d.setDate(d.getDate() - d.getDay())
            return { from: format(d, "yyyy-MM-dd"), to: format(new Date(), "yyyy-MM-dd") }
        }
    },
    { label: "Este mes", get: () => ({ from: format(startOfMonth(new Date()), "yyyy-MM-dd"), to: format(endOfMonth(new Date()), "yyyy-MM-dd") }) },
    { label: "Mes anterior", get: () => ({ from: format(startOfMonth(subMonths(new Date(), 1)), "yyyy-MM-dd"), to: format(endOfMonth(subMonths(new Date(), 1)), "yyyy-MM-dd") }) },
    { label: "Últimos 3 meses", get: () => ({ from: format(startOfMonth(subMonths(new Date(), 2)), "yyyy-MM-dd"), to: format(endOfMonth(new Date()), "yyyy-MM-dd") }) },
    { label: "Este año", get: () => ({ from: format(startOfYear(new Date()), "yyyy-MM-dd"), to: format(endOfMonth(new Date()), "yyyy-MM-dd") }) },
]

// ─── Date Range Picker ────────────────────────────────────────────────────────

function DateRangePicker({
    dateFrom, dateTo, onApply, isPending,
}: {
    dateFrom: string; dateTo: string
    onApply: (from: string, to: string) => void; isPending: boolean
}) {
    const [open, setOpen] = useState(false)
    const [range, setRange] = useState<DateRange | undefined>({
        from: new Date(dateFrom + "T00:00:00"),
        to: new Date(dateTo + "T00:00:00"),
    })

    const handleApply = () => {
        if (range?.from && range?.to) {
            onApply(format(range.from, "yyyy-MM-dd"), format(range.to, "yyyy-MM-dd"))
            setOpen(false)
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button disabled={isPending} className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border border-dashed border-slate-300 bg-white text-slate-600 hover:border-sky-400 hover:text-sky-600 transition-all">
                    <CalendarRange className="h-3.5 w-3.5" />
                    Rango personalizado
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 shadow-xl border border-slate-200 rounded-2xl overflow-hidden" align="end">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <div className="flex items-center gap-2">
                        <CalendarRange className="h-4 w-4 text-sky-600" />
                        <span className="text-sm font-bold text-slate-700">Seleccionar período</span>
                    </div>
                    <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <div className="px-4 py-2 bg-white border-b border-slate-100 flex items-center gap-3 text-xs">
                    <div className="flex-1 text-center">
                        <p className="text-slate-400 font-medium uppercase tracking-wider mb-0.5">Desde</p>
                        <p className="font-bold text-slate-900">{range?.from ? format(range.from, "dd MMM yyyy", { locale: es }) : "—"}</p>
                    </div>
                    <div className="text-slate-300">→</div>
                    <div className="flex-1 text-center">
                        <p className="text-slate-400 font-medium uppercase tracking-wider mb-0.5">Hasta</p>
                        <p className="font-bold text-slate-900">{range?.to ? format(range.to, "dd MMM yyyy", { locale: es }) : "—"}</p>
                    </div>
                </div>
                <CalendarPicker
                    mode="range" selected={range} onSelect={setRange}
                    numberOfMonths={2} locale={es} className="p-3"
                    classNames={{
                        day_selected: "bg-sky-600 text-white hover:bg-sky-700",
                        day_range_middle: "bg-sky-100 text-sky-900 rounded-none",
                        day_range_start: "bg-sky-600 text-white rounded-l-full",
                        day_range_end: "bg-sky-600 text-white rounded-r-full",
                        day_today: "font-bold border border-sky-300",
                    }}
                />
                <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-2">
                    <button onClick={() => setRange(undefined)} className="text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors">Limpiar</button>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setOpen(false)} className="text-xs h-8">Cancelar</Button>
                        <Button size="sm" onClick={handleApply} disabled={!range?.from || !range?.to} className="text-xs h-8 bg-sky-600 hover:bg-sky-700 text-white">Aplicar</Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AdminDashboardStats({ stats, dateFrom, dateTo, totalAllTime }: AdminDashboardStatsProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [activePeriod, setActivePeriod] = useState<string | null>(null)

    const changePeriod = (from: string, to: string, label?: string) => {
        setActivePeriod(label ?? null)
        startTransition(() => { router.push(`/admin?from=${from}&to=${to}`) })
    }

    const pctTotal = pctChange(stats.totalShifts, stats.prevTotalShifts)
    const pctConfirmed = pctChange(stats.confirmedShifts, stats.prevConfirmedShifts)
    const periodLabel = `${formatDateLabel(dateFrom)} — ${formatDateLabel(dateTo)}`

    return (
        <div className="space-y-6">
            {/* ── Period Selector ── */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-4">
                <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                        <Calendar className="h-4 w-4 text-sky-600 flex-shrink-0" />
                        <span className="text-sm font-bold text-slate-700 truncate">{periodLabel}</span>
                        {isPending && <div className="w-3.5 h-3.5 border-2 border-sky-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />}
                    </div>
                    <div className="hidden lg:block w-px h-6 bg-slate-200" />
                    <div className="flex flex-wrap gap-2 flex-1">
                        {PERIODS.map(({ label, get }) => (
                            <button key={label}
                                onClick={() => { const { from, to } = get(); changePeriod(from, to, label) }}
                                disabled={isPending}
                                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all whitespace-nowrap ${activePeriod === label
                                    ? "bg-sky-600 text-white border-sky-600 shadow-sm"
                                    : "bg-slate-50 text-slate-600 border-slate-200 hover:border-sky-400 hover:text-sky-600 hover:bg-white"
                                    }`}>
                                {label}
                            </button>
                        ))}
                    </div>
                    <div className="flex-shrink-0">
                        <DateRangePicker dateFrom={dateFrom} dateTo={dateTo} onApply={(from, to) => changePeriod(from, to)} isPending={isPending} />
                    </div>
                </div>
            </div>

            {/* ── KPI Cards ── */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <KpiCard title="Total Guardias" value={stats.totalShifts} subtitle="En el período seleccionado" icon={Calendar} color="from-sky-500 to-sky-600" pct={pctTotal} />
                <KpiCard title="Confirmadas" value={stats.confirmedShifts} subtitle="Listas para ejecución" icon={CheckCircle2} color="from-emerald-500 to-emerald-600" pct={pctConfirmed} />
                <KpiCard title="Pendientes" value={stats.pendingShifts} subtitle="Requieren confirmación" icon={Clock} color="from-amber-500 to-amber-600" />
                <KpiCard title="Médicos" value={stats.totalDoctors} subtitle="Personal en el sistema" icon={Users} color="from-violet-500 to-violet-600" />
            </div>

            {/* ── Charts Row ── */}
            <div className="grid gap-6 lg:grid-cols-5">
                {/* Horizontal bar chart — 3/5 */}
                <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
                    <div className="mb-5">
                        <h3 className="font-bold text-slate-900">Guardias esta semana</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Últimos 7 días · por día</p>
                    </div>
                    <WeeklyBarChart data={stats.weeklyBreakdown} />
                </div>

                {/* Donut — 2/5 */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
                    <div className="mb-5">
                        <h3 className="font-bold text-slate-900">Guardias por área</h3>
                        <p className="text-xs text-slate-400 mt-0.5">En el período · distribución</p>
                    </div>
                    <DonutChart byArea={stats.byArea} />
                </div>
            </div>

            {/* ── Weekly Summary Table ── */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                    <LayoutGrid className="h-4 w-4 text-slate-400" />
                    <h3 className="font-bold text-slate-900 text-sm">Resumen semanal detallado</h3>
                    <span className="ml-auto text-xs text-slate-400 font-medium">Últimos 7 días</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50/70">
                                <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Día</th>
                                <th className="text-center px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Total</th>
                                <th className="text-center px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Confirmadas</th>
                                <th className="text-center px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Pendientes</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Progreso</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {stats.weeklyBreakdown.map((day) => {
                                const pct = day.total === 0 ? 0 : Math.round((day.confirmed / day.total) * 100)
                                const todayStr = format(new Date(), "yyyy-MM-dd")
                                const isToday = day.date === todayStr
                                return (
                                    <tr key={day.date} className={isToday ? "bg-sky-50/50" : "hover:bg-slate-50/50 transition-colors"}>
                                        <td className="px-6 py-3 font-semibold text-slate-700">
                                            {day.label}
                                            {isToday && <span className="ml-2 text-[10px] font-bold bg-sky-100 text-sky-600 rounded-full px-2 py-0.5">HOY</span>}
                                        </td>
                                        <td className="text-center px-4 py-3 font-black text-slate-900">{day.total}</td>
                                        <td className="text-center px-4 py-3 font-semibold text-emerald-700">{day.confirmed}</td>
                                        <td className="text-center px-4 py-3 font-semibold text-amber-600">{day.pending}</td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                                    <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                                                </div>
                                                <span className="text-xs font-bold text-slate-500 w-8 text-right">{pct}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── All-time pill ── */}
            <div className="text-center">
                <span className="inline-flex items-center gap-2 text-xs text-slate-400 bg-slate-50 border border-slate-100 rounded-full px-4 py-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Total histórico en el sistema:
                    <span className="font-black text-slate-700">{totalAllTime.toLocaleString("es-AR")}</span>
                    guardias
                </span>
            </div>
        </div>
    )
}
