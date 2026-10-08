"use client"

import type { Shift } from "@/lib/supabase/types"
import { Calendar, CheckCircle2, Clock, Users } from "lucide-react"
import { useT } from "@/lib/i18n/language-provider"
import { cn } from "@/lib/utils"

interface StatsCardsProps {
  shifts: Shift[]
}

export function StatsCards({ shifts }: StatsCardsProps) {
  const t = useT()
  const stats = {
    total: shifts.length,
    new: shifts.filter((s) => s.status === "new").length,
    free: shifts.filter((s) => s.status === "free" || s.status === "free_pending").length,
    confirmed: shifts.filter((s) => s.status === "confirmed").length,
  }

  const cards = [
    { title: t("stats.total"), value: stats.total, icon: Calendar, tone: "bg-slate-100 text-slate-700" },
    { title: t("stats.new"), value: stats.new, icon: Clock, tone: "bg-blue-50 text-blue-700" },
    { title: t("stats.free"), value: stats.free, icon: Users, tone: "bg-cyan-50 text-cyan-700" },
    { title: t("stats.confirmed"), value: stats.confirmed, icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-700" },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.title}
            className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.06)] sm:p-5"
          >
            <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", card.tone)}>
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-3xl font-extrabold tracking-tight text-slate-900 tabular-nums">{card.value}</p>
              <p className="mt-0.5 text-sm font-medium text-slate-500">{card.title}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
