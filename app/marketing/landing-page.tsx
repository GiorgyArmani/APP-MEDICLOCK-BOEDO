"use client"

import { useLayoutEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  ArrowUpRight,
  BellRing,
  CalendarClock,
  CalendarPlus,
  Check,
  ChevronLeft,
  ChevronRight,
  FileDown,
  FileSpreadsheet,
  Fingerprint,
  Languages,
  LayoutDashboard,
  MapPin,
  MessageSquare,
  Plus,
  Receipt,
  Repeat,
  ShieldCheck,
  Stethoscope,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useT } from "@/lib/i18n/language-provider"
import type { TPath } from "@/lib/i18n/dictionaries"
import { cn } from "@/lib/utils"
import { figtree } from "./fonts"
import {
  AdminWeekMock,
  BrowserFrame,
  DoctorPhoneMock,
  HonorariosReportMock,
  NotificationMock,
  PhoneAvailabilityScreen,
  PhoneChatScreen,
  PhoneCheckInScreen,
  PhoneFrame,
  PhoneShiftsScreen,
} from "./mockups"

const CONTACT_URL = "https://www.linkedin.com/in/jorge-luis-marquez-monsalve-9748a7135/"

function Logo() {
  const t = useT()
  return (
    <Link href="/" className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <Image src="/logo.svg" alt="" width={36} height={36} className="h-9 w-9 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="text-lg font-bold tracking-tight text-slate-900">MediClock</span>
        <span className="mt-0.5 text-[11px] font-medium text-slate-500">{t("landing.tagline")}</span>
      </span>
    </Link>
  )
}

function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-sm font-semibold uppercase tracking-wider text-primary", className)}>{children}</p>
}

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="max-w-3xl">
      {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
      <h2 className="text-3xl font-extrabold tracking-[-0.03em] text-slate-900 text-balance sm:text-[2.6rem] sm:leading-[1.1]">{title}</h2>
      {subtitle && <p className="mt-3 text-lg leading-relaxed text-slate-600 text-pretty">{subtitle}</p>}
    </div>
  )
}

/* ───────────────────────── Header ───────────────────────── */

function Header() {
  const t = useT()
  const links = [
    { href: "#como-funciona", label: t("landing.nav.howItWorks") },
    { href: "#funciones", label: t("landing.nav.features") },
    { href: "#roles", label: t("landing.nav.roles") },
  ]
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav aria-label={t("landing.nav.menu")} className="ml-6 hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <LanguageSwitcher className="h-10" />
          <Button asChild variant="ghost" className="hidden h-10 font-semibold text-slate-700 sm:inline-flex">
            <Link href="/login">{t("landing.nav.login")}</Link>
          </Button>
          <Button asChild className="h-10 font-semibold">
            <Link href={CONTACT_URL} target="_blank" rel="noopener noreferrer">
              <span className="sm:hidden">{t("landing.nav.login")}</span>
              <span className="hidden sm:inline">{t("landing.nav.cta")}</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

/* ───────────────────────── Hero ───────────────────────── */

function Hero() {
  const t = useT()
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_75%_10%,rgba(37,99,235,0.10),transparent_70%),radial-gradient(40%_40%_at_10%_90%,rgba(5,150,105,0.07),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="text-center lg:col-span-5 lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800">
            <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
            {t("landing.hero.badge")}
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 text-balance sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
            {t("landing.hero.titleA")} <span className="text-primary">{t("landing.hero.titleHighlight")}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-600 text-pretty lg:mx-0">
            {t("landing.hero.subtitle")}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Button asChild size="lg" className="h-12 px-6 text-base font-semibold shadow-lg shadow-blue-600/20">
              <Link href={CONTACT_URL} target="_blank" rel="noopener noreferrer">
                {t("landing.hero.ctaPrimary")}
                <ArrowUpRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base font-semibold">
              <a href="#como-funciona">
                {t("landing.hero.ctaSecondary")}
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
              </a>
            </Button>
          </div>
          <ul className="mt-8 flex flex-col items-center gap-x-5 gap-y-2 text-sm text-slate-600 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
            {[t("landing.hero.trust1"), t("landing.hero.trust2"), t("landing.hero.trust3")].map((item) => (
              <li key={item} className="flex items-center gap-2 whitespace-nowrap">
                <Check className="h-4 w-4 text-emerald-600" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative lg:col-span-7" role="img" aria-label={t("landing.hero.mockupAlt")}>
          <BrowserFrame className="hidden md:block md:mr-48 lg:mr-48">
            <AdminWeekMock />
          </BrowserFrame>
          <div className="relative mx-auto w-fit md:absolute md:-bottom-16 md:-right-2 md:mx-0">
            <PhoneFrame className="w-[230px]">
              <DoctorPhoneMock />
            </PhoneFrame>
          </div>
          <NotificationMock className="absolute -left-2 top-1/2 hidden md:block lg:-left-10 lg:top-auto lg:-bottom-6" />
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── Before / After ───────────────────────── */

function Problems() {
  const t = useT()
  const items: { icon: typeof FileSpreadsheet; before: TPath; after: TPath }[] = [
    { icon: FileSpreadsheet, before: "landing.problems.p1Before", after: "landing.problems.p1After" },
    { icon: MessageSquare, before: "landing.problems.p2Before", after: "landing.problems.p2After" },
    { icon: Fingerprint, before: "landing.problems.p3Before", after: "landing.problems.p3After" },
    { icon: Receipt, before: "landing.problems.p4Before", after: "landing.problems.p4After" },
  ]
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={t("landing.problems.eyebrow")} title={t("landing.problems.title")} />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, before, after }) => (
            <div key={before} className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-primary">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <p className="mt-5 flex items-start gap-2 text-sm text-slate-500">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" aria-hidden />
                <span>
                  <span className="sr-only">{t("landing.problems.before")}: </span>
                  <span className="line-through decoration-slate-300">{t(before)}</span>
                </span>
              </p>
              <p className="mt-3 flex items-start gap-2 font-semibold text-slate-900">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                <span>
                  <span className="sr-only">{t("landing.problems.after")}: </span>
                  {t(after)}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── How it works (hub diagram) ───────────────────────── */

function HubNode({ icon: Icon, tone, title, body, className }: {
  icon: typeof LayoutDashboard
  tone: string
  title: string
  body: string
  className?: string
}) {
  return (
    <div className={cn("rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.06)]", className)}>
      <div className={cn("flex h-11 w-11 items-center justify-center rounded-full", tone)}>
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-1.5 leading-relaxed text-slate-600">{body}</p>
    </div>
  )
}

function HubPill() {
  const t = useT()
  return (
    <span className="relative z-10 inline-flex items-center gap-2 rounded-full bg-slate-900 py-1.5 pl-1.5 pr-4 text-sm font-semibold text-white shadow-lg shadow-slate-900/20">
      <Image src="/logo.svg" alt="" width={28} height={28} className="h-7 w-7 rounded-full" />
      {t("landing.hub.center")}
    </span>
  )
}

function HowItWorks() {
  const t = useT()
  const dash = "border-dashed border-primary/70"
  return (
    <section id="como-funciona" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t("landing.hub.title")} subtitle={t("landing.hub.subtitle")} />

        {/* Desktop: hub with dashed connectors */}
        <div className="mx-auto mt-14 hidden max-w-3xl md:block">
          <HubNode
            icon={LayoutDashboard}
            tone="bg-blue-50 text-primary"
            title={t("landing.hub.adminTitle")}
            body={t("landing.hub.adminBody")}
            className="mx-auto max-w-md text-center [&>div:first-child]:mx-auto"
          />
          <div className="relative h-24" aria-hidden>
            <span className={cn("absolute left-1/2 top-0 h-1/2 border-l-2", dash)} />
            <span className={cn("absolute left-1/4 right-1/4 top-1/2 h-1/2 rounded-t-xl border-x-2 border-t-2", dash)} />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <HubPill />
            </span>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <HubNode icon={Stethoscope} tone="bg-emerald-50 text-emerald-700" title={t("landing.hub.doctorTitle")} body={t("landing.hub.doctorBody")} />
            <HubNode icon={Receipt} tone="bg-amber-50 text-amber-700" title={t("landing.hub.payTitle")} body={t("landing.hub.payBody")} />
          </div>
        </div>

        {/* Mobile: vertical flow */}
        <div className="mt-10 flex flex-col items-center md:hidden">
          <HubNode icon={LayoutDashboard} tone="bg-blue-50 text-primary" title={t("landing.hub.adminTitle")} body={t("landing.hub.adminBody")} className="w-full" />
          <span className={cn("h-6 border-l-2", dash)} aria-hidden />
          <HubPill />
          <span className={cn("h-6 border-l-2", dash)} aria-hidden />
          <HubNode icon={Stethoscope} tone="bg-emerald-50 text-emerald-700" title={t("landing.hub.doctorTitle")} body={t("landing.hub.doctorBody")} className="w-full" />
          <span className={cn("h-6 border-l-2", dash)} aria-hidden />
          <HubNode icon={Receipt} tone="bg-amber-50 text-amber-700" title={t("landing.hub.payTitle")} body={t("landing.hub.payBody")} className="w-full" />
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── Feature tour (stepper + device) ───────────────────────── */

type TourStep = {
  icon: typeof LayoutDashboard
  title: TPath
  body: TPath
  role: TPath
  device: "phone" | "browser"
  screen: React.ReactNode
}

const TOUR: TourStep[] = [
  { icon: CalendarPlus, title: "landing.tour.s1Title", body: "landing.tour.s1Body", role: "landing.roles.adminTitle", device: "browser", screen: <AdminWeekMock /> },
  { icon: BellRing, title: "landing.tour.s2Title", body: "landing.tour.s2Body", role: "landing.roles.doctorTitle", device: "phone", screen: <PhoneShiftsScreen /> },
  { icon: MapPin, title: "landing.tour.s3Title", body: "landing.tour.s3Body", role: "landing.roles.doctorTitle", device: "phone", screen: <PhoneCheckInScreen /> },
  { icon: CalendarClock, title: "landing.tour.s4Title", body: "landing.tour.s4Body", role: "landing.roles.doctorTitle", device: "phone", screen: <PhoneAvailabilityScreen /> },
  { icon: MessageSquare, title: "landing.tour.s5Title", body: "landing.tour.s5Body", role: "landing.roles.doctorTitle", device: "phone", screen: <PhoneChatScreen /> },
  { icon: FileDown, title: "landing.tour.s6Title", body: "landing.tour.s6Body", role: "landing.roles.honorariosTitle", device: "browser", screen: <HonorariosReportMock /> },
]

/**
 * Renders children at a fixed design width and scales them down to fit the
 * available width, so desktop mockups keep their layout inside narrow panels.
 */
function ScaleToFit({ width, children }: { width: number; children: React.ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ scale: 1, height: 0 })

  useLayoutEffect(() => {
    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return
    const update = () => {
      const scale = Math.min(1, outer.clientWidth / width)
      setSize({ scale, height: inner.offsetHeight * scale })
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(outer)
    observer.observe(inner)
    return () => observer.disconnect()
  }, [width])

  return (
    <div ref={outerRef} className="w-full" style={{ height: size.height || undefined }}>
      <div ref={innerRef} style={{ width, transform: `scale(${size.scale})`, transformOrigin: "top left" }}>
        {children}
      </div>
    </div>
  )
}

function FeatureTour() {
  const t = useT()
  const [active, setActive] = useState(0)
  const step = TOUR[active]
  const total = TOUR.length

  return (
    <section id="funciones" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t("landing.tour.title")} />

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[5fr_7fr] lg:gap-12">
          <ol className="space-y-1.5">
            {TOUR.map((s, i) => {
              const isActive = i === active
              return (
                <li key={s.title}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-expanded={isActive}
                    aria-controls="tour-device"
                    className={cn(
                      "w-full cursor-pointer rounded-2xl p-3 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isActive ? "bg-white shadow-[0_4px_20px_-6px_rgba(15,23,42,0.15)]" : "hover:bg-slate-100",
                    )}
                  >
                    <span className="flex items-center gap-3.5">
                      <span
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-200",
                          isActive ? "bg-primary text-primary-foreground" : "border border-slate-200 bg-white text-slate-500",
                        )}
                      >
                        <s.icon className="h-[18px] w-[18px]" aria-hidden />
                      </span>
                      <span className={cn("text-lg font-bold transition-colors", isActive ? "text-slate-900" : "text-slate-500")}>
                        {t(s.title)}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
                        isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                      )}
                    >
                      <span className="overflow-hidden">
                        <span className="block pl-[54px] pr-2 pt-2 pb-1">
                          <span className="mb-2 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                            {t(s.role)}
                          </span>
                          <span className="block leading-relaxed text-slate-600">{t(s.body)}</span>
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>

          <div
            id="tour-device"
            className="relative order-first h-[440px] overflow-hidden rounded-3xl bg-[#e8edfb] sm:h-[600px] lg:order-none"
          >
            <div
              key={active}
              role="img"
              aria-label={t(step.title)}
              className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-500"
            >
              {step.device === "phone" ? (
                <PhoneFrame className="absolute left-1/2 top-8 w-[260px] -translate-x-1/2 sm:top-12 sm:w-[300px]">{step.screen}</PhoneFrame>
              ) : (
                // Leave room at the bottom for the pagination pill.
                <div className="absolute inset-x-0 top-0 bottom-20 flex items-center px-5 sm:px-8">
                  <ScaleToFit width={620}>
                    <BrowserFrame>{step.screen}</BrowserFrame>
                  </ScaleToFit>
                </div>
              )}
            </div>

            <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 rounded-full bg-white p-1.5 shadow-lg shadow-slate-900/10">
              <button
                type="button"
                onClick={() => setActive((a) => Math.max(0, a - 1))}
                disabled={active === 0}
                aria-label={t("landing.tour.prev")}
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-slate-900 text-white transition-colors duration-200 hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-transparent disabled:text-slate-400"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </button>
              <span className="min-w-[3ch] text-center text-sm font-bold tabular-nums text-slate-900" aria-live="polite">
                {active + 1} / {total}
              </span>
              <button
                type="button"
                onClick={() => setActive((a) => Math.min(total - 1, a + 1))}
                disabled={active === total - 1}
                aria-label={t("landing.tour.next")}
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-slate-900 text-white transition-colors duration-200 hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-transparent disabled:text-slate-400"
              >
                <ChevronRight className="h-5 w-5" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── Roles (cards) ───────────────────────── */

function Roles() {
  const t = useT()
  const light = [
    {
      title: "landing.roles.adminTitle",
      lead: "landing.roles.adminLead",
      features: ["landing.roles.adminF1", "landing.roles.adminF2", "landing.roles.adminF3", "landing.roles.adminF4"],
      cta: "landing.roles.adminCta",
      href: CONTACT_URL,
      external: true,
      icon: LayoutDashboard,
    },
    {
      title: "landing.roles.honorariosTitle",
      lead: "landing.roles.honorariosLead",
      features: ["landing.roles.honorariosF1", "landing.roles.honorariosF2", "landing.roles.honorariosF3", "landing.roles.honorariosF4"],
      cta: "landing.roles.honorariosCta",
      href: "/signup/honorarios",
      external: false,
      icon: Receipt,
    },
  ] as const

  const lightCard = (c: (typeof light)[number]) => (
    <article key={c.title} className="flex flex-col rounded-3xl border border-slate-200/80 bg-white p-7 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
      <c.icon className="h-6 w-6 text-primary" aria-hidden />
      <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">{t(c.title)}</h3>
      <p className="mt-1 text-slate-500">{t(c.lead)}</p>
      <ul className="mt-5 flex-1 space-y-3">
        {c.features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-slate-700">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
            {t(f)}
          </li>
        ))}
      </ul>
      <Button asChild variant="secondary" className="mt-7 h-12 rounded-xl bg-slate-100 text-base font-semibold text-slate-900 hover:bg-slate-200">
        <Link href={c.href} {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {t(c.cta)}
        </Link>
      </Button>
    </article>
  )

  return (
    <section id="roles" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t("landing.roles.title")} subtitle={t("landing.roles.subtitle")} />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {lightCard(light[0])}

          <article className="relative flex flex-col overflow-hidden rounded-3xl bg-slate-900 p-7 text-white shadow-xl shadow-slate-900/20">
            <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/50 blur-3xl" />
            <Stethoscope className="relative h-6 w-6 text-blue-300" aria-hidden />
            <h3 className="relative mt-4 text-2xl font-extrabold tracking-tight">{t("landing.roles.doctorTitle")}</h3>
            <p className="relative mt-1 text-slate-300">{t("landing.roles.doctorLead")}</p>
            <ul className="relative mt-5 flex-1 space-y-3">
              {(["landing.roles.doctorF1", "landing.roles.doctorF2", "landing.roles.doctorF3", "landing.roles.doctorF4"] as const).map((f) => (
                <li key={f} className="flex items-start gap-3 text-slate-100">
                  <Plus className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" aria-hidden />
                  {t(f)}
                </li>
              ))}
            </ul>
            <Button asChild className="relative mt-7 h-12 rounded-xl text-base font-semibold">
              <Link href="/login">
                {t("landing.roles.doctorCta")}
                <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Link
              href="/signup"
              className="relative mt-3 rounded text-center text-sm text-slate-300 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t("landing.roles.doctorNote")}
            </Link>
          </article>

          {lightCard(light[1])}
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── Extra features ───────────────────────── */

function Features() {
  const t = useT()
  const items: { icon: typeof Repeat; title: TPath; body: TPath }[] = [
    { icon: Repeat, title: "landing.features.recurTitle", body: "landing.features.recurBody" },
    { icon: BellRing, title: "landing.features.notifTitle", body: "landing.features.notifBody" },
    { icon: ShieldCheck, title: "landing.features.securityTitle", body: "landing.features.securityBody" },
    { icon: Languages, title: "landing.features.langTitle", body: "landing.features.langBody" },
  ]
  return (
    <section className="pb-20 sm:pb-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">{t("landing.features.title")}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, body }) => (
            <article key={title} className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
              <Icon className="h-5 w-5 text-primary" aria-hidden />
              <h3 className="mt-4 font-bold text-slate-900">{t(title)}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{t(body)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── CTA + footer ───────────────────────── */

function FinalCta() {
  const t = useT()
  return (
    <section className="px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-sidebar px-6 py-16 text-center sm:px-12 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_0%,rgba(37,99,235,0.35),transparent_70%)]"
        />
        <div className="relative">
          <CalendarPlus className="mx-auto h-10 w-10 text-blue-300" aria-hidden />
          <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl">
            {t("landing.cta.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-slate-300">{t("landing.cta.body")}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 bg-white px-6 text-base font-semibold text-slate-900 hover:bg-slate-100">
              <Link href={CONTACT_URL} target="_blank" rel="noopener noreferrer">
                {t("landing.cta.button")}
                <ArrowUpRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-white/25 bg-transparent px-6 text-base font-semibold text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/login">{t("landing.cta.secondary")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const t = useT()
  const linkClass = "text-slate-600 transition-colors duration-200 hover:text-slate-900"
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[2fr_1fr_1fr] lg:px-8">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-slate-600">{t("landing.footer.tagline")}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{t("landing.footer.product")}</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li><a href="#como-funciona" className={linkClass}>{t("landing.nav.howItWorks")}</a></li>
            <li><a href="#roles" className={linkClass}>{t("landing.nav.roles")}</a></li>
            <li><a href="#funciones" className={linkClass}>{t("landing.nav.features")}</a></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{t("landing.footer.company")}</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link href={CONTACT_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {t("landing.footer.contact")}
              </Link>
            </li>
            <li><Link href="/login" className={linkClass}>{t("landing.nav.login")}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200">
        <p className="mx-auto max-w-7xl px-4 py-6 text-sm text-slate-500 sm:px-6 lg:px-8">{t("landing.footer.rights")}</p>
      </div>
    </footer>
  )
}

export function LandingPage() {
  const t = useT()
  return (
    <div className={cn(figtree.className, "flex min-h-dvh flex-col overflow-x-clip bg-[#f6f7f9] text-slate-900 antialiased")}>
      <a
        href="#contenido"
        className="sr-only z-50 rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {t("landing.skipToContent")}
      </a>
      <Header />
      <main id="contenido" className="flex-1">
        <Hero />
        <Problems />
        <HowItWorks />
        <FeatureTour />
        <Roles />
        <Features />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}
