"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
    Calendar,
    Clock,
    Shield,
    Smartphone,
    Users,
    CheckCircle2,
    Plus,
    ArrowUpRight,
    Zap,
    Activity,
    Globe,
    Stethoscope,
    ChevronRight,
    Filter,
    FileDown,
    MessageSquare,
    Bell,
    Search,
    Send,
    MoreVertical,
    ChevronLeft,
    LayoutDashboard
} from "lucide-react"

export function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans selection:bg-[#2563eb]/30 overflow-x-hidden">

            {/* ── HEADER ── */}
            <header className="px-4 sm:px-6 lg:px-12 h-16 sm:h-20 flex items-center border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-xl z-50">
                <Link className="flex items-center gap-3 group" href="#">
                    <div className="relative h-9 w-9 sm:h-12 sm:w-12 overflow-hidden rounded-2xl shadow-xl shadow-blue-500/10 group-hover:scale-110 transition-transform bg-[#2563eb] p-1 sm:p-1.5 border border-white/20 shrink-0">
                        <Image src="/logo.png" alt="MediClock Logo" fill className="object-contain p-1" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg sm:text-2xl font-black tracking-tighter text-slate-900 leading-none">Medi Clock</span>
                        <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Gestión de Guardias</span>
                    </div>
                </Link>

                <nav className="ml-auto flex gap-4 sm:gap-6 lg:gap-10 items-center font-black">
                    <Link className="text-[11px] uppercase tracking-[0.2em] text-slate-500 hover:text-[#2563eb] transition-colors hidden lg:block" href="#admin">Para Coordinadores</Link>
                    <Link className="text-[11px] uppercase tracking-[0.2em] text-slate-500 hover:text-[#2563eb] transition-colors hidden lg:block" href="#medicos">Para Médicos</Link>
                    <Link className="text-[11px] uppercase tracking-[0.2em] text-slate-500 hover:text-[#2563eb] transition-colors hidden lg:block" href="#mensajeria">Mensajes</Link>
                    <Button asChild className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-black rounded-full px-5 sm:px-10 h-10 sm:h-14 shadow-2xl shadow-blue-500/30 transition-all transform hover:-translate-y-1 active:translate-y-0 text-xs sm:text-sm">
                        <Link href="/login">Ingresar</Link>
                    </Button>
                </nav>
            </header>

            <main className="flex-1">

                {/* ── HERO ── */}
                <section className="relative w-full py-16 sm:py-28 lg:py-52 overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.08),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.05),transparent_40%)]">
                    <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
                        <div className="flex flex-col items-center space-y-8 sm:space-y-14">
                            <div className="inline-flex items-center gap-2 sm:gap-3 rounded-full bg-blue-50 border border-blue-100 px-4 sm:px-6 py-2 sm:py-3 text-[9px] sm:text-[10px] font-black text-[#2563eb] uppercase tracking-[0.3em] sm:tracking-[0.4em] animate-in fade-in zoom-in duration-1000">
                                <Activity className="h-3 w-3 sm:h-4 sm:w-4" /> REVOLUCIONANDO LA GESTIÓN CLÍNICA
                            </div>

                            <h1 className="text-5xl font-black tracking-tighter sm:text-7xl md:text-8xl lg:text-[10rem] text-slate-900 leading-[1.05] sm:leading-[1.1] uppercase italic">
                                CERO ERRORES. <br />
                                <span className="bg-gradient-to-r from-[#2563eb] to-[#0891b2] bg-clip-text text-transparent italic">MÁXIMA EFICIENCIA.</span>
                            </h1>

                            <p className="mx-auto max-w-[700px] text-slate-500 text-lg sm:text-2xl md:text-3xl font-black leading-tight px-2">
                                La solución definitiva para coordinar equipos médicos, reducir ausentismo y automatizar liquidaciones.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-6 sm:mt-12 w-full sm:w-auto px-4 sm:px-0">
                                <Button asChild className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xl sm:text-3xl font-black h-20 sm:h-28 px-10 sm:px-24 rounded-[2rem] sm:rounded-[3rem] group transition-all shadow-[0_20px_40px_rgba(37,99,235,0.3)] hover:shadow-[0_30px_60px_rgba(37,99,235,0.4)] transform hover:-translate-y-2 active:translate-y-0 border-b-[6px] sm:border-b-[10px] border-blue-900 w-full sm:w-auto">
                                    <Link href="https://www.linkedin.com/in/jorge-luis-marquez-monsalve-9748a7135/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                                        BETA CERRADA — CONTACTAR <ArrowUpRight className="ml-2 h-8 w-8 sm:h-12 sm:w-12 transition-transform group-hover:translate-x-2 group-hover:-translate-y-2" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] sm:w-[1400px] h-[800px] sm:h-[1400px] bg-blue-50/50 rounded-full blur-[120px] sm:blur-[240px] -z-10"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:24px_24px] sm:bg-[size:40px_40px] -z-10"></div>
                </section>

                {/* ── ADMIN SECTION ── */}
                <section id="admin" className="w-full pb-16 sm:pb-40">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">

                            {/* Text */}
                            <div className="lg:w-1/3 space-y-8 sm:space-y-12 text-center lg:text-left">
                                <div className="bg-[#2563eb] p-4 sm:p-5 rounded-[2rem] w-fit shadow-2xl shadow-blue-500/20 mx-auto lg:mx-0">
                                    <LayoutDashboard className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                                </div>
                                <div className="space-y-4 sm:space-y-6">
                                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 uppercase italic leading-[1.1]">PODER PARA <br /> <span className="text-[#2563eb]">COORDINADORES.</span></h2>
                                    <p className="text-slate-500 text-lg sm:text-xl lg:text-2xl font-bold leading-relaxed">
                                        Supervisá toda tu operación en un solo panel. Liquidaciones instantáneas, métricas de asistencia y control total del equipo.
                                    </p>
                                </div>
                                <div className="space-y-3 sm:space-y-4">
                                    {["Reportes de Honorarios Pro", "Auditoría de Guardias", "Control Coordinador"].map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 text-slate-900 font-bold uppercase tracking-widest text-xs italic justify-center lg:justify-start">
                                            <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-[#2563eb] shrink-0" /> {item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Admin Mockup — hidden on small mobile, shown from md up */}
                            <div className="lg:w-2/3 w-full hidden sm:block">
                                <div className="bg-white rounded-[2.5rem] sm:rounded-[4rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] border border-slate-100 overflow-hidden transform lg:rotate-1 hover:rotate-0 transition-transform duration-1000">
                                    {/* Simplified header */}
                                    <div className="flex items-center justify-between px-6 sm:px-10 py-4 sm:py-5 bg-[#0a0d14] border-b border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-xl bg-[#2563eb] flex items-center justify-center">
                                                <Image src="/logo.png" alt="" width={18} height={18} />
                                            </div>
                                            <span className="text-xs font-black text-white uppercase tracking-wider">Panel de Honorarios</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-slate-700" />
                                            <span className="text-[10px] text-slate-500 font-bold hidden sm:block">Coordinador</span>
                                        </div>
                                    </div>

                                    {/* Stats grid */}
                                    <div className="p-5 sm:p-8 bg-slate-50/50 space-y-5 sm:space-y-6">
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
                                            {[
                                                { label: "TOTAL", value: "315", icon: Calendar, color: "text-[#2563eb]", bg: "bg-blue-50" },
                                                { label: "PENDIENTES", value: "15", icon: Clock, color: "text-orange-500", bg: "bg-orange-50" },
                                                { label: "CONFIRMADAS", value: "300", icon: CheckCircle2, color: "text-[#00ba88]", bg: "bg-emerald-50" },
                                                { label: "MÉDICOS", value: "28", icon: Users, color: "text-purple-500", bg: "bg-purple-50" }
                                            ].map((stat, i) => (
                                                <div key={i} className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-3">
                                                    <div className="flex justify-between items-start">
                                                        <span className="text-[8px] sm:text-[9px] font-black text-slate-400 tracking-[0.15em] sm:tracking-[0.2em]">{stat.label}</span>
                                                        <div className={cn("p-2 rounded-xl", stat.bg)}>
                                                            <stat.icon className={cn("h-3 w-3 sm:h-4 sm:w-4", stat.color)} />
                                                        </div>
                                                    </div>
                                                    <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Filter Mockup */}
                                        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-sm flex items-end gap-4">
                                            <div className="flex-1 grid grid-cols-3 gap-3 sm:gap-5">
                                                {["Médico", "Área", "Periodo"].map((f, i) => (
                                                    <div key={i} className="space-y-1.5">
                                                        <label className="text-[8px] sm:text-[9px] font-black text-slate-400 tracking-widest uppercase ml-1">{f}</label>
                                                        <div className="h-10 sm:h-12 bg-slate-50 rounded-xl border border-slate-100 px-3 sm:px-4 flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-slate-600">
                                                            {f === "Periodo" ? "ESTE MES" : "Todos..."}
                                                            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 rotate-90 text-slate-300" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="bg-[#2563eb] text-white p-2.5 sm:p-3.5 rounded-xl shadow-lg shadow-blue-500/20 cursor-pointer shrink-0">
                                                <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
                                            </div>
                                            <div className="bg-white border border-slate-100 p-2.5 sm:p-3.5 rounded-xl shadow-sm text-slate-400 cursor-pointer shrink-0">
                                                <FileDown className="h-4 w-4 sm:h-5 sm:w-5" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile-only simplified feature list */}
                            <div className="sm:hidden w-full grid grid-cols-2 gap-3">
                                {[
                                    { icon: Calendar, label: "315 Guardias", sub: "Total mes" },
                                    { icon: CheckCircle2, label: "300 Confirmadas", sub: "Listas para liquidar" },
                                    { icon: Filter, label: "Filtros Pro", sub: "Por área y turno" },
                                    { icon: FileDown, label: "Exportar", sub: "CSV y PDF" },
                                ].map((item, i) => (
                                    <div key={i} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col gap-2">
                                        <div className="p-2 bg-blue-50 rounded-xl w-fit">
                                            <item.icon className="h-5 w-5 text-[#2563eb]" />
                                        </div>
                                        <p className="text-sm font-black text-slate-900">{item.label}</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{item.sub}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── MEDICAL SECTION ── */}
                <section id="medicos" className="w-full bg-[#f8fafc]/50 py-16 sm:py-40 border-y border-slate-100 relative">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">

                            {/* Doctor Mockup — hidden on small mobile */}
                            <div className="lg:w-2/3 w-full order-2 lg:order-1 hidden sm:block">
                                <div className="bg-white rounded-[2.5rem] sm:rounded-[4rem] shadow-[0_40px_80px_-20px_rgba(37,99,235,0.1)] border border-slate-100 overflow-hidden p-6 sm:p-10 space-y-6 sm:space-y-8 transform lg:-rotate-1 hover:rotate-0 transition-transform duration-1000">
                                    <div className="space-y-1.5">
                                        <h3 className="text-2xl sm:text-3xl font-black tracking-tighter text-slate-900 italic uppercase leading-[1.1]">BIENVENIDO, <br /> <span className="text-[#2563eb]">ESTIMADO MÉDICO</span></h3>
                                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Gestioná tus guardias en tiempo real</p>
                                    </div>

                                    {/* Doctor Stats */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
                                        {[
                                            { label: "TOTAL", value: "1", icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
                                            { label: "NUEVAS", value: "0", icon: Clock, color: "text-orange-500", bg: "bg-orange-50" },
                                            { label: "DISPONIBLES", value: "0", icon: Stethoscope, color: "text-[#0891b2]", bg: "bg-cyan-50" },
                                            { label: "CONFIRMADAS", value: "1", icon: CheckCircle2, color: "text-[#00ba88]", bg: "bg-emerald-50" }
                                        ].map((stat, i) => (
                                            <div key={i} className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <div className={cn("p-2 rounded-xl", stat.bg)}>
                                                        <stat.icon className={cn("h-3 w-3 sm:h-4 sm:w-4", stat.color)} />
                                                    </div>
                                                    <span className="text-xl sm:text-2xl font-black text-slate-900">{stat.value}</span>
                                                </div>
                                                <div className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Shift Card */}
                                    <div className="bg-white rounded-[2rem] sm:rounded-[3rem] border border-slate-100 shadow-xl p-6 sm:p-8 space-y-5">
                                        <div className="flex items-start justify-between">
                                            <h4 className="text-xl sm:text-2xl font-black italic uppercase text-slate-900 leading-none">Noche Internación</h4>
                                            <div className="bg-[#e0fdf4] text-[#00ba88] px-3 py-1 rounded-full text-[10px] font-black uppercase shrink-0">Confirmada</div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <Clock className="h-3.5 w-3.5 shrink-0" />
                                                <span className="text-xs font-bold uppercase tracking-widest">20:00 - 08:00</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <Calendar className="h-3.5 w-3.5 shrink-0" />
                                                <span className="text-xs font-bold uppercase tracking-widest">viernes, 27 de marzo de 2026</span>
                                            </div>
                                        </div>
                                        <div className="bg-[#00ba88] hover:bg-[#00a377] text-white rounded-full py-4 sm:py-5 flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20 font-black text-base sm:text-lg uppercase transition-all cursor-pointer">
                                            <Clock className="h-5 w-5" /> Marcar Entrada (Check-In)
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Text Content */}
                            <div className="lg:w-1/3 space-y-8 sm:space-y-12 order-1 lg:order-2 text-center lg:text-left">
                                <div className="bg-[#00ba88] p-4 sm:p-5 rounded-[2rem] w-fit shadow-2xl shadow-emerald-500/20 mx-auto lg:mx-0">
                                    <Stethoscope className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                                </div>
                                <div className="space-y-4 sm:space-y-6">
                                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">DISEÑADO PARA <br /> <span className="text-[#00ba88]">MÉDICOS.</span></h2>
                                    <p className="text-slate-500 text-lg sm:text-2xl font-bold leading-relaxed">
                                        Un sistema que trabaja para el médico. Facilidad de uso, notificaciones instantáneas y control total de tu disponibilidad.
                                    </p>
                                </div>
                                <div className="space-y-3 sm:space-y-4">
                                    {["Check-In Biométrico Fácil", "Gestión de Disponibilidad", "Alertas de Guardias Libres"].map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 text-slate-900 font-bold uppercase tracking-widest text-xs italic justify-center lg:justify-start">
                                            <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-[#00ba88] shrink-0" /> {item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Mobile-only simplified cards */}
                            <div className="sm:hidden w-full order-2 grid grid-cols-2 gap-3">
                                {[
                                    { icon: Clock, label: "Check-In fácil", sub: "Un toque" },
                                    { icon: Bell, label: "Alertas", sub: "Guardias libres" },
                                    { icon: Calendar, label: "Mis guardias", sub: "Vista completa" },
                                    { icon: CheckCircle2, label: "Confirmación", sub: "Instantánea" },
                                ].map((item, i) => (
                                    <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col gap-2">
                                        <div className="p-2 bg-emerald-50 rounded-xl w-fit">
                                            <item.icon className="h-5 w-5 text-[#00ba88]" />
                                        </div>
                                        <p className="text-sm font-black text-slate-900">{item.label}</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{item.sub}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── MESSAGING SECTION ── */}
                <section id="mensajeria" className="w-full py-16 sm:py-40">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">

                            {/* Text */}
                            <div className="lg:col-span-4 space-y-8 sm:space-y-12 text-center lg:text-left">
                                <div className="bg-slate-900 p-4 sm:p-5 rounded-[2rem] w-fit shadow-2xl shadow-slate-900/20 mx-auto lg:mx-0">
                                    <MessageSquare className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                                </div>
                                <div className="space-y-4 sm:space-y-6">
                                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 uppercase italic leading-[1.1]">CHATEÁ EN <br /> <span className="text-blue-600">TIEMPO REAL.</span></h2>
                                    <p className="text-slate-500 text-lg sm:text-2xl font-bold leading-relaxed">
                                        Reemplazamos los grupos de WhatsApp con una herramienta profesional auditable y organizada por clínica.
                                    </p>
                                </div>
                            </div>

                            {/* Messaging Mockup — hidden on small mobile */}
                            <div className="lg:col-span-8 w-full hidden sm:block">
                                <div className="bg-white rounded-[2.5rem] sm:rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.12)] border border-slate-100 overflow-hidden flex transform lg:rotate-1 hover:rotate-0 transition-transform duration-1000" style={{ height: "400px" }}>
                                    {/* Sidebar */}
                                    <aside className="w-56 sm:w-72 border-r border-slate-100 bg-white flex flex-col shrink-0">
                                        <div className="p-5 sm:p-8 border-b border-slate-50 flex items-center gap-2 sm:gap-3">
                                            <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-slate-900" />
                                            <h4 className="text-base sm:text-xl font-black uppercase italic tracking-tighter">Mensajes</h4>
                                        </div>
                                        <div className="p-4 sm:p-6">
                                            <div className="h-10 sm:h-12 bg-slate-50 rounded-2xl flex items-center px-3 sm:px-4 gap-2 sm:gap-3 border border-slate-50">
                                                <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400" />
                                                <span className="text-[10px] sm:text-[11px] font-bold text-slate-400">Buscar médico...</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 overflow-y-auto px-3 sm:px-4 space-y-1 pb-4">
                                            {[
                                                { name: "M. González", active: true },
                                                { name: "A. López" },
                                                { name: "C. Ramírez" },
                                            ].map((p, i) => (
                                                <div key={i} className={cn("flex items-center gap-3 p-3 sm:p-4 rounded-[1.5rem] transition-all cursor-pointer", p.active ? "bg-[#2563eb] shadow-xl shadow-blue-500/30 text-white" : "hover:bg-slate-50")}>
                                                    <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0", p.active ? "bg-white/20" : "bg-blue-50 text-blue-600")}>
                                                        {p.name[0]}
                                                    </div>
                                                    <span className={cn("text-[11px] font-black uppercase leading-tight", p.active ? "text-white" : "text-slate-600")}>{p.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </aside>

                                    {/* Chat Window */}
                                    <main className="flex-1 bg-white flex flex-col min-w-0">
                                        <header className="h-16 sm:h-20 bg-[#0a0d14] flex items-center justify-between px-5 sm:px-8 text-white">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center font-black text-xs shrink-0">M</div>
                                                <div>
                                                    <p className="text-xs font-black uppercase tracking-tight">M. González</p>
                                                    <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Coordinación</span>
                                                </div>
                                            </div>
                                            <MoreVertical className="h-4 w-4 text-slate-500" />
                                        </header>
                                        <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-16 text-center gap-3">
                                            <div className="h-12 w-12 sm:h-16 sm:w-16 bg-slate-50 rounded-full flex items-center justify-center">
                                                <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-slate-200" />
                                            </div>
                                            <p className="text-xs sm:text-sm font-black text-slate-900 uppercase italic">Sin mensajes aún</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Iniciá la conversación</p>
                                        </div>
                                        <footer className="p-4 sm:p-6 border-t border-slate-100">
                                            <div className="h-12 sm:h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center px-4 sm:px-6 justify-between">
                                                <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest">Escribí un mensaje...</span>
                                                <Send className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                                            </div>
                                        </footer>
                                    </main>
                                </div>
                            </div>

                            {/* Mobile-only messaging cards */}
                            <div className="sm:hidden w-full grid grid-cols-2 gap-3">
                                {[
                                    { icon: MessageSquare, label: "Chat en tiempo real", sub: "Auditable" },
                                    { icon: Bell, label: "Notificaciones", sub: "Instantáneas" },
                                    { icon: Search, label: "Buscar médicos", sub: "Fácil y rápido" },
                                    { icon: Shield, label: "Seguro", sub: "Por institución" },
                                ].map((item, i) => (
                                    <div key={i} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col gap-2">
                                        <div className="p-2 bg-slate-900/10 rounded-xl w-fit">
                                            <item.icon className="h-5 w-5 text-slate-900" />
                                        </div>
                                        <p className="text-sm font-black text-slate-900">{item.label}</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{item.sub}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── FINAL CTA ── */}
                <section id="final" className="w-full py-24 sm:py-40 lg:py-72 bg-[#0a0d14] relative overflow-hidden text-center">
                    <div className="container mx-auto px-4 md:px-6 relative z-10 space-y-12 sm:space-y-24">
                        <h2 className="text-5xl sm:text-7xl md:text-[9rem] lg:text-[12rem] font-black tracking-tighter text-white uppercase italic leading-[1.05] sm:leading-[1.1]">
                            LLEVÁ TU CLÍNICA <br /> <span className="bg-gradient-to-r from-blue-500 to-[#00ba88] bg-clip-text text-transparent">AL FUTURO.</span>
                        </h2>
                        <div className="flex flex-col items-center space-y-10 sm:space-y-16">
                            <p className="max-w-[700px] text-slate-400 text-xl sm:text-3xl lg:text-5xl font-black italic leading-tight px-2">
                                Unite a las instituciones que ya están operando con Medi Clock.
                            </p>
                            <div className="relative group w-full sm:w-auto px-4 sm:px-0">
                                <div className="absolute -inset-2 sm:-inset-3 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-[2.5rem] sm:rounded-[3.5rem] blur-xl opacity-40 group-hover:opacity-100 transition duration-700 animate-pulse"></div>
                                <Button asChild size="lg" className="relative bg-white hover:bg-slate-100 text-[#0a0d14] text-2xl sm:text-4xl font-black h-24 sm:h-32 px-10 sm:px-28 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl transition-all transform hover:scale-105 sm:hover:scale-110 active:scale-95 border-b-[8px] sm:border-b-[12px] border-slate-300 w-full sm:w-auto">
                                    <Link href="https://www.linkedin.com/in/jorge-luis-marquez-monsalve-9748a7135/" target="_blank" rel="noopener noreferrer">BETA CERRADA — CONTACTAR</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[1600px] h-[600px] sm:h-[1600px] bg-blue-600/10 rounded-full blur-[150px] sm:blur-[300px] -z-10"></div>
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                </section>
            </main>

            {/* ── FOOTER ── */}
            <footer className="w-full py-12 sm:py-20 border-t border-slate-100 bg-white">
                <div className="container px-4 sm:px-6 md:px-12 mx-auto">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 sm:gap-16 border-b border-slate-100 pb-12 sm:pb-16 mb-10 sm:mb-14">
                        <div className="space-y-5 sm:space-y-8">
                            <div className="flex items-center gap-3 sm:gap-5">
                                <div className="bg-[#2563eb] p-2.5 sm:p-3 rounded-2xl shadow-xl shadow-blue-500/30">
                                    <Image src="/logo.png" alt="" width={28} height={28} className="rounded-sm" />
                                </div>
                                <span className="text-3xl sm:text-4xl font-black tracking-tighter text-slate-900 italic">Medi Clock</span>
                            </div>
                            <p className="text-slate-500 max-w-xs font-black text-lg sm:text-xl leading-tight italic">
                                La transformación digital operativa para líderes del sector salud en Latinoamérica.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-10 sm:gap-20">
                            <div className="space-y-5 sm:space-y-8">
                                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#2563eb]">Software</p>
                                <ul className="space-y-3 sm:space-y-4 text-sm font-black text-slate-400 italic">
                                    <li><Link href="#admin" className="hover:text-blue-600 transition-colors uppercase tracking-widest">Para Coordinadores</Link></li>
                                    <li><Link href="#medicos" className="hover:text-blue-600 transition-colors uppercase tracking-widest">Para Médicos</Link></li>
                                    <li><Link href="https://www.linkedin.com/in/jorge-luis-marquez-monsalve-9748a7135/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors uppercase tracking-widest">Contactar</Link></li>
                                </ul>
                            </div>
                            <div className="space-y-5 sm:space-y-8">
                                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#2563eb]">Empresa</p>
                                <ul className="space-y-3 sm:space-y-4 text-sm font-black text-slate-400 italic">
                                    <li><Link href="#" className="hover:text-blue-600 transition-colors uppercase tracking-widest">Privacidad</Link></li>
                                    <li><Link href="#" className="hover:text-blue-600 transition-colors uppercase tracking-widest">Términos</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3 sm:gap-5">
                            <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#2563eb] animate-pulse shadow-[0_0_10px_#2563eb]"></div>
                            <p className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] sm:tracking-[0.6em] text-center sm:text-left">
                                © 2026 MEDICLOCK.CLICK • BUENOS AIRES • ARGENTINA.
                            </p>
                        </div>
                        <div className="flex gap-6 sm:gap-12 opacity-30">
                            <Globe className="h-6 w-6 sm:h-8 sm:w-8 text-slate-900" />
                            <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-slate-900" />
                            <Smartphone className="h-6 w-6 sm:h-8 sm:w-8 text-slate-900" />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
