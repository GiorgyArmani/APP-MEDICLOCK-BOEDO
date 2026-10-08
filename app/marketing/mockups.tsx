"use client"

/*
  Illustrative product mockups for the landing page.
  They are static recreations of the real screens (admin calendar, doctor
  dashboard, honorarios reports, chat, availability, geofence check-in),
  rendered with Tailwind so they stay crisp, localized and lightweight.
  Wrap them in an element with role="img" + aria-label from the page.
*/

import Image from "next/image"
import {
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileDown,
  MapPin,
  Plus,
  Send,
  Signal,
  Wifi,
  BatteryFull,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useT } from "@/lib/i18n/language-provider"

type Status = "confirmed" | "new" | "free" | "pending"
type Area = "ward" | "icu" | "er" | "peds"

const statusStyles: Record<Status, { chip: string; dot: string; border: string }> = {
  confirmed: { chip: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500", border: "border-l-emerald-500" },
  new: { chip: "bg-blue-50 text-blue-700", dot: "bg-blue-600", border: "border-l-blue-600" },
  free: { chip: "bg-cyan-50 text-cyan-800", dot: "bg-cyan-600", border: "border-l-cyan-600" },
  pending: { chip: "bg-amber-50 text-amber-800", dot: "bg-amber-500", border: "border-l-amber-500" },
}

function useMockLabels() {
  const t = useT()
  const status: Record<Status, string> = {
    confirmed: t("landing.mock.statusConfirmed"),
    new: t("landing.mock.statusNew"),
    free: t("landing.mock.statusFree"),
    pending: t("landing.mock.statusPending"),
  }
  const area: Record<Area, string> = {
    ward: t("landing.mock.areaWard"),
    icu: t("landing.mock.areaICU"),
    er: t("landing.mock.areaER"),
    peds: t("landing.mock.areaPeds"),
  }
  const days = t("landing.mock.days").split(",")
  return { t, status, area, days }
}

/* ───────────────────────── Frames ───────────────────────── */

export function BrowserFrame({
  children,
  url = "app.mediclock.click",
  className,
}: {
  children: React.ReactNode
  url?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_30px_60px_-20px_rgba(15,23,42,0.25)]",
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        </div>
        <div className="mx-auto w-full max-w-xs truncate rounded-md border border-slate-200 bg-white px-3 py-1 text-center text-[11px] text-slate-500">
          {url}
        </div>
        <div className="w-10" />
      </div>
      {children}
    </div>
  )
}

export function PhoneFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative w-[260px] rounded-[2.5rem] border-[9px] border-slate-900 bg-slate-900 shadow-[0_30px_60px_-15px_rgba(15,23,42,0.45)]",
        className,
      )}
    >
      <div className="absolute left-1/2 top-2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-slate-900" />
      <div className="overflow-hidden rounded-[2rem] bg-slate-50">
        <div className="flex items-center justify-between px-6 pb-1 pt-3 text-[10px] font-semibold text-slate-900">
          <span className="tabular-nums">19:58</span>
          <span className="flex items-center gap-1">
            <Signal className="h-3 w-3" />
            <Wifi className="h-3 w-3" />
            <BatteryFull className="h-3.5 w-3.5" />
          </span>
        </div>
        {children}
      </div>
    </div>
  )
}

function AppChrome({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between bg-sidebar px-4 py-3 text-sidebar-foreground">
      <div className="flex items-center gap-2.5">
        <Image src="/logo.svg" alt="" width={28} height={28} className="h-7 w-7" />
        <span className="text-xs font-semibold">{title}</span>
      </div>
      {right}
    </div>
  )
}

/* ───────────────────────── Admin: week calendar ───────────────────────── */

type WeekShift = { doc: string | null; area: Area; time: string; status: Status }

const WEEK: WeekShift[][] = [
  [
    { doc: "Martínez", area: "ward", time: "20–08", status: "confirmed" },
    { doc: "López", area: "er", time: "08–20", status: "confirmed" },
  ],
  [{ doc: "Gómez", area: "icu", time: "08–20", status: "new" }],
  [
    { doc: "Ruiz", area: "peds", time: "08–14", status: "confirmed" },
    { doc: null, area: "er", time: "20–08", status: "free" },
  ],
  [{ doc: "Martínez", area: "ward", time: "20–08", status: "confirmed" }],
  [
    { doc: "Sosa", area: "icu", time: "08–20", status: "pending" },
    { doc: "López", area: "er", time: "14–20", status: "confirmed" },
  ],
  [
    { doc: null, area: "icu", time: "08–20", status: "free" },
    { doc: "Gómez", area: "ward", time: "20–08", status: "new" },
  ],
  [{ doc: "Ruiz", area: "peds", time: "08–20", status: "confirmed" }],
]

export function AdminWeekMock({ className }: { className?: string }) {
  const { t, status, area, days } = useMockLabels()

  const stats = [
    { label: t("landing.mock.statTotal"), value: 42, tone: "text-slate-900" },
    { label: t("landing.mock.statConfirmed"), value: 34, tone: "text-emerald-700" },
    { label: t("landing.mock.statPending"), value: 5, tone: "text-amber-700" },
    { label: t("landing.mock.statFree"), value: 3, tone: "text-cyan-800" },
  ]

  return (
    <div className={cn("bg-slate-50", className)}>
      <AppChrome
        title={t("landing.mock.coordination")}
        right={<div className="h-6 w-6 rounded-full bg-sidebar-accent ring-2 ring-white/10" />}
      />
      <div className="space-y-3 p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
            <CalendarDays className="h-4 w-4 text-primary" />
            {t("landing.mock.weekRange")}
          </div>
          <span className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1.5 text-[11px] font-semibold text-primary-foreground">
            <Plus className="h-3 w-3" />
            {t("landing.mock.newShift")}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {stats.map((s) => (
            <div key={s.label} className="rounded-lg border border-slate-200 bg-white px-2.5 py-2">
              <div className="truncate text-[10px] font-medium text-slate-500">{s.label}</div>
              <div className={cn("text-lg font-bold tabular-nums leading-tight", s.tone)}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-1.5 md:grid-cols-7">
          {WEEK.map((shifts, i) => (
            <div
              key={i}
              className={cn(
                "min-h-[150px] flex-col gap-1.5 rounded-lg border border-slate-200 bg-white p-1.5",
                i >= 4 ? "hidden md:flex" : "flex",
              )}
            >
              <div className="flex items-baseline justify-between px-0.5">
                <span className="text-[10px] font-semibold uppercase text-slate-500">{days[i]}</span>
                <span className="text-[11px] font-bold tabular-nums text-slate-900">{13 + i}</span>
              </div>
              {shifts.map((s, j) => (
                <div
                  key={j}
                  className={cn("rounded-md border border-l-[3px] border-slate-100 bg-white px-1.5 py-1 shadow-sm", statusStyles[s.status].border)}
                >
                  <div className="truncate text-[10px] font-semibold text-slate-900">
                    {s.doc ? `Dr. ${s.doc}` : status.free}
                  </div>
                  <div className="truncate text-[9px] text-slate-500">{area[s.area]}</div>
                  <div className="mt-0.5 flex items-center justify-between gap-1">
                    <span className="text-[9px] tabular-nums text-slate-600">{s.time}</span>
                    <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", statusStyles[s.status].dot)} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-x-3 gap-y-1 px-0.5">
          {(Object.keys(status) as Status[]).map((k) => (
            <span key={k} className="inline-flex items-center gap-1.5 text-[10px] text-slate-600">
              <span className={cn("h-2 w-2 rounded-full", statusStyles[k].dot)} />
              {status[k]}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────── Doctor: phone dashboard ───────────────────────── */

export function DoctorPhoneMock({ checkedIn = false }: { checkedIn?: boolean }) {
  const { t, status, area, days } = useMockLabels()

  return (
    <div className="space-y-3 px-4 pb-6 pt-2">
      <div>
        <p className="text-[11px] text-slate-500">{t("landing.mock.myShifts")}</p>
        <p className="text-base font-bold text-slate-900">{t("landing.mock.greeting")}</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-slate-200 bg-white p-2.5">
          <p className="text-[10px] text-slate-500">{t("landing.mock.monthShifts")}</p>
          <p className="text-lg font-bold tabular-nums text-slate-900">12</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-2.5">
          <p className="text-[10px] text-slate-500">{t("landing.mock.hours")}</p>
          <p className="text-lg font-bold tabular-nums text-slate-900">144</p>
        </div>
      </div>

      <div className="space-y-2.5 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            {t("landing.mock.nextShift")}
          </span>
          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
            {t("landing.mock.today")}
          </span>
        </div>
        <p className="text-sm font-bold text-slate-900">{t("landing.mock.nightWard")}</p>
        <div className="space-y-1 text-[11px] text-slate-600">
          <p className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" /> <span className="tabular-nums">20:00 – 08:00</span>
          </p>
          <p className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3" /> {t("landing.mock.siteName")}
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2 py-1.5 text-[10px] font-medium text-emerald-800">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          {t("landing.mock.insidePerimeter")} · {t("landing.mock.distance")}
        </div>
        {checkedIn ? (
          <div className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 py-2.5 text-xs font-semibold text-emerald-800">
            <Check className="h-4 w-4" /> {t("landing.mock.checkedIn")}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-600/25">
            <Clock className="h-4 w-4" /> {t("landing.mock.checkIn")}
          </div>
        )}
      </div>

      {[
        { day: `${days[5]} 18`, a: "icu" as Area, time: "08–20", s: "new" as Status },
        { day: `${days[1]} 21`, a: "ward" as Area, time: "20–08", s: "confirmed" as Status },
      ].map((row) => (
        <div key={row.day} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
          <div>
            <p className="text-[11px] font-semibold text-slate-900">{area[row.a]}</p>
            <p className="text-[10px] tabular-nums text-slate-500">
              {row.day} · {row.time}
            </p>
          </div>
          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", statusStyles[row.s].chip)}>
            {status[row.s]}
          </span>
        </div>
      ))}
    </div>
  )
}

/* ───────────────────────── Notification ───────────────────────── */

export function NotificationMock({ className }: { className?: string }) {
  const { t } = useMockLabels()
  return (
    <div className={cn("w-[260px] rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-900/10", className)}>
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-cyan-50 p-2 text-cyan-700">
          <Bell className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-slate-900">{t("landing.mock.notifTitle")}</p>
          <p className="text-[11px] tabular-nums text-slate-500">{t("landing.mock.notifBody")}</p>
        </div>
      </div>
      <div className="mt-2.5 flex justify-end">
        <span className="rounded-lg bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground">
          {t("landing.mock.accept")}
        </span>
      </div>
    </div>
  )
}

/* ───────────────────────── Honorarios: report ───────────────────────── */

const REPORT = [
  { doc: "Martínez", shifts: 12, hours: 144, audited: true },
  { doc: "López", shifts: 10, hours: 120, audited: true },
  { doc: "Gómez", shifts: 8, hours: 96, audited: false },
  { doc: "Ruiz", shifts: 9, hours: 78, audited: true },
  { doc: "Sosa", shifts: 6, hours: 72, audited: false },
]

export function HonorariosReportMock({ className }: { className?: string }) {
  const { t } = useMockLabels()
  const max = Math.max(...REPORT.map((r) => r.hours))
  const total = REPORT.reduce((sum, r) => sum + r.hours, 0)
  const cols = "grid-cols-[1.3fr_0.6fr_1.4fr_0.9fr]"

  return (
    <div className={cn("bg-white", className)}>
      <AppChrome
        title={t("landing.mock.reportTitle")}
        right={<div className="h-6 w-6 rounded-full bg-sidebar-accent ring-2 ring-white/10" />}
      />
      <div className="space-y-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
            {[t("landing.mock.filterDoctor"), t("landing.mock.filterArea")].map((f) => (
              <span key={f} className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] text-slate-700">
                {f} <ChevronDown className="h-3 w-3 text-slate-400" />
              </span>
            ))}
            <span className="ml-auto inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-[11px] font-semibold text-primary-foreground">
              <FileDown className="h-3.5 w-3.5" /> {t("landing.mock.exportPdf")}
            </span>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200">
          <div className={cn("grid gap-2 bg-slate-50 px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500", cols)}>
            <span>{t("landing.mock.colDoctor")}</span>
            <span className="text-right">{t("landing.mock.colShifts")}</span>
            <span>{t("landing.mock.colHours")}</span>
            <span>{t("landing.mock.colStatus")}</span>
          </div>
          {REPORT.map((r) => (
            <div
              key={r.doc}
              className={cn("grid items-center gap-2 border-t border-slate-100 px-3 py-2 text-[11px]", cols)}
            >
              <span className="truncate font-medium text-slate-900">Dr. {r.doc}</span>
              <span className="text-right tabular-nums text-slate-700">{r.shifts}</span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <span className="block h-full rounded-full bg-primary" style={{ width: `${(r.hours / max) * 100}%` }} />
                </span>
                <span className="w-7 text-right tabular-nums text-slate-700">{r.hours}</span>
              </span>
              <span
                className={cn(
                  "w-fit whitespace-nowrap rounded-full px-1.5 py-0.5 text-[9px] font-semibold",
                  r.audited ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800",
                )}
              >
                {r.audited ? t("landing.mock.audited") : t("landing.mock.inReview")}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-500">{t("landing.mock.totalHours")}</span>
          <span className="text-base font-bold tabular-nums text-slate-900">{total} h</span>
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────── Chat ───────────────────────── */

export function ChatMock({ className }: { className?: string }) {
  const { t } = useMockLabels()
  const messages = [
    { mine: false, text: t("landing.mock.msg1"), time: "09:12" },
    { mine: true, text: t("landing.mock.msg2"), time: "09:14" },
    { mine: false, text: t("landing.mock.msg3"), time: "09:15" },
  ]
  return (
    <div className={cn("flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white", className)}>
      <div className="flex items-center gap-2.5 border-b border-slate-100 px-3.5 py-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sidebar text-[11px] font-bold text-white">C</div>
        <div>
          <p className="text-xs font-semibold text-slate-900">{t("landing.mock.chatTitle")}</p>
          <p className="flex items-center gap-1 text-[10px] text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {t("landing.mock.chatOnline")}
          </p>
        </div>
      </div>
      <div className="flex-1 space-y-2 bg-slate-50 p-3.5">
        {messages.map((m, i) => (
          <div key={i} className={cn("flex", m.mine ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-3 py-2 text-[11px] leading-snug",
                m.mine ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm border border-slate-200 bg-white text-slate-800",
              )}
            >
              {m.text}
              <span className={cn("ml-2 text-[9px] tabular-nums", m.mine ? "text-blue-100" : "text-slate-400")}>{m.time}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 border-t border-slate-100 px-3.5 py-2.5">
        <span className="flex-1 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] text-slate-500">{t("landing.mock.typeMessage")}</span>
        <span className="rounded-full bg-primary p-1.5 text-primary-foreground">
          <Send className="h-3 w-3" />
        </span>
      </div>
    </div>
  )
}

/* ───────────────────────── Availability ───────────────────────── */

const SLOTS = ["08–14", "14–20", "20–08"]
// [slot][day] availability
const AVAIL = [
  [1, 1, 0, 1, 1, 0, 0],
  [1, 0, 0, 1, 1, 1, 0],
  [0, 1, 1, 0, 0, 1, 1],
]

export function AvailabilityMock({ className }: { className?: string }) {
  const { t, days } = useMockLabels()
  return (
    <div className={cn("rounded-2xl border border-slate-200 bg-white p-3.5", className)}>
      <div className="grid grid-cols-[2.6rem_repeat(7,1fr)] gap-1">
        <span />
        {days.map((d) => (
          <span key={d} className="text-center text-[10px] font-semibold text-slate-500">
            {d}
          </span>
        ))}
        {SLOTS.map((slot, si) => (
          <div key={slot} className="contents">
            <span className="self-center text-[9px] tabular-nums text-slate-500">{slot}</span>
            {AVAIL[si].map((on, di) => (
              <span
                key={di}
                className={cn(
                  "flex h-6 items-center justify-center rounded-md",
                  on ? "bg-primary text-primary-foreground" : "border border-dashed border-slate-200 bg-slate-50",
                )}
              >
                {on ? <Check className="h-3 w-3" /> : null}
              </span>
            ))}
          </div>
        ))}
      </div>
      <p className="mt-2.5 flex items-center gap-1.5 text-[10px] text-slate-600">
        <span className="flex h-3 w-3 items-center justify-center rounded-sm bg-primary">
          <Check className="h-2 w-2 text-white" />
        </span>
        {t("landing.mock.available")}
      </p>
    </div>
  )
}

/* ───────────────────────── Geofence map ───────────────────────── */

export function GeofenceMock({ className, overlay = true }: { className?: string; overlay?: boolean }) {
  const { t } = useMockLabels()
  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-slate-200 bg-[#eef2f7]", className)}>
      <svg viewBox="0 0 400 260" className="block h-full w-full" preserveAspectRatio="xMidYMid slice">
        {/* blocks */}
        <g fill="#e2e8f0">
          <rect x="10" y="10" width="110" height="70" rx="6" />
          <rect x="140" y="10" width="120" height="70" rx="6" />
          <rect x="280" y="10" width="110" height="70" rx="6" />
          <rect x="10" y="100" width="110" height="60" rx="6" />
          <rect x="280" y="100" width="110" height="60" rx="6" />
          <rect x="10" y="180" width="110" height="70" rx="6" />
          <rect x="140" y="180" width="120" height="70" rx="6" />
          <rect x="280" y="180" width="110" height="70" rx="6" />
        </g>
        <rect x="140" y="100" width="120" height="60" rx="6" fill="#dbeafe" />
        {/* perimeter */}
        <circle cx="200" cy="130" r="92" fill="rgba(37,99,235,0.10)" stroke="#2563eb" strokeWidth="2" strokeDasharray="6 6" />
        {/* hospital pin */}
        <g transform="translate(200 130)">
          <rect x="-14" y="-14" width="28" height="28" rx="8" fill="#2563eb" />
          <path d="M-2 -8h4v6h6v4h-6v6h-4v-6h-6v-4h6z" fill="#fff" />
        </g>
        {/* user */}
        <g transform="translate(248 168)">
          <circle r="16" fill="rgba(5,150,105,0.18)" className="motion-safe:animate-ping" style={{ transformOrigin: "center", transformBox: "fill-box" }} />
          <circle r="7" fill="#059669" stroke="#fff" strokeWidth="3" />
        </g>
      </svg>
      <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-1.5 text-[11px] font-semibold text-slate-900 shadow-sm">
        <MapPin className="h-3.5 w-3.5 text-primary" /> {t("landing.mock.siteName")}
        <span className="font-normal text-slate-500">· {t("landing.mock.radius")}</span>
      </div>
      {overlay && (
      <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2 shadow-sm">
        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-semibold text-slate-900">{t("landing.mock.insidePerimeter")}</p>
          <p className="truncate text-[10px] text-slate-500">
            {t("landing.mock.you")} · {t("landing.mock.distance")}
          </p>
        </div>
        <span className="shrink-0 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white">
          {t("landing.mock.checkIn")}
        </span>
      </div>
      )}
    </div>
  )
}

/* ───────────────────────── Full phone screens (feature tour) ───────────────────────── */

function PhoneHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="px-4 pb-3 pt-2">
      {subtitle && <p className="text-[11px] text-slate-500">{subtitle}</p>}
      <p className="text-base font-bold text-slate-900">{title}</p>
    </div>
  )
}

export function PhoneShiftsScreen() {
  const { t, status, area, days } = useMockLabels()
  const rows: { day: string; a: Area; time: string; s: Status }[] = [
    { day: `${days[0]} 13`, a: "ward", time: "20:00 – 08:00", s: "confirmed" },
    { day: `${days[3]} 16`, a: "ward", time: "20:00 – 08:00", s: "confirmed" },
    { day: `${days[5]} 18`, a: "icu", time: "08:00 – 20:00", s: "new" },
    { day: `${days[1]} 21`, a: "er", time: "14:00 – 20:00", s: "pending" },
  ]
  return (
    <div className="min-h-[560px] space-y-3 pb-6">
      <PhoneHeader title={t("landing.mock.myShifts")} subtitle={t("landing.mock.greeting")} />
      <div className="px-4">
        <NotificationMock className="w-full shadow-md" />
      </div>
      <div className="mx-4 grid grid-cols-2 rounded-lg bg-slate-200/70 p-0.5 text-center text-[11px] font-semibold">
        <span className="rounded-md bg-white py-1.5 text-slate-900 shadow-sm">{t("landing.mock.tabUpcoming")}</span>
        <span className="py-1.5 text-slate-500">{t("landing.mock.tabFree")}</span>
      </div>
      <div className="space-y-2 px-4">
        {rows.map((r) => (
          <div
            key={r.day}
            className={cn("flex items-center justify-between rounded-xl border border-l-[3px] border-slate-200 bg-white px-3 py-2.5", statusStyles[r.s].border)}
          >
            <div>
              <p className="text-xs font-semibold text-slate-900">{area[r.a]}</p>
              <p className="text-[10px] tabular-nums text-slate-500">
                {r.day} · {r.time}
              </p>
            </div>
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", statusStyles[r.s].chip)}>{status[r.s]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function PhoneCheckInScreen() {
  const { t } = useMockLabels()
  return (
    <div className="min-h-[560px] pb-6">
      <GeofenceMock overlay={false} className="h-[250px] rounded-none border-0" />
      <div className="-mt-5 px-4">
        <div className="relative space-y-2.5 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{t("landing.mock.nextShift")}</span>
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">{t("landing.mock.today")}</span>
          </div>
          <p className="text-sm font-bold text-slate-900">{t("landing.mock.nightWard")}</p>
          <div className="space-y-1 text-[11px] text-slate-600">
            <p className="flex items-center gap-1.5">
              <Clock className="h-3 w-3" /> <span className="tabular-nums">20:00 – 08:00</span>
            </p>
            <p className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3" /> {t("landing.mock.siteName")} · {t("landing.mock.radius")}
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2 py-1.5 text-[10px] font-medium text-emerald-800">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            {t("landing.mock.insidePerimeter")} · {t("landing.mock.distance")}
          </div>
          <div className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-3 text-xs font-semibold text-white shadow-md shadow-emerald-600/25">
            <Clock className="h-4 w-4" /> {t("landing.mock.checkIn")}
          </div>
        </div>
      </div>
    </div>
  )
}

export function PhoneAvailabilityScreen() {
  const { t } = useMockLabels()
  return (
    <div className="min-h-[560px] space-y-3 pb-6">
      <PhoneHeader title={t("landing.mock.availabilityTitle")} subtitle={t("landing.mock.availabilityHint")} />
      <div className="px-3">
        <AvailabilityMock />
      </div>
      <div className="px-4">
        <div className="rounded-xl bg-primary py-2.5 text-center text-xs font-semibold text-primary-foreground">
          {t("landing.mock.saveAvailability")}
        </div>
      </div>
    </div>
  )
}

export function PhoneChatScreen() {
  return <ChatMock className="h-[560px] rounded-none border-0" />
}
