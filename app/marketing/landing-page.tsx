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
            {/* Navigation - Ultra High Fidelity */}
            <header className="px-6 lg:px-12 h-20 flex items-center border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-xl z-50">
                <Link className="flex items-center gap-4 group" href="#">
                    <div className="relative h-12 w-12 overflow-hidden rounded-2xl shadow-xl shadow-blue-500/10 group-hover:scale-110 transition-transform bg-[#2563eb] p-1.5 border border-white/20">
                        <Image
                            src="/logo.png"
                            alt="MediClock Logo"
                            fill
                            className="object-contain p-1.5"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-black tracking-tighter text-slate-900 leading-none">Medi Clock</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Gestión de Guardias</span>
                    </div>
                </Link>
                <nav className="ml-auto flex gap-10 items-center font-black">
                    <Link className="text-[11px] uppercase tracking-[0.2em] text-slate-500 hover:text-[#2563eb] transition-colors hidden md:block" href="#admin">
                        Para Admins
                    </Link>
                    <Link className="text-[11px] uppercase tracking-[0.2em] text-slate-500 hover:text-[#2563eb] transition-colors hidden md:block" href="#medicos">
                        Para Médicos
                    </Link>
                    <Link className="text-[11px] uppercase tracking-[0.2em] text-slate-500 hover:text-[#2563eb] transition-colors hidden md:block" href="#mensajeria">
                        Mensajes
                    </Link>
                    <Button asChild className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-black rounded-full px-10 h-14 shadow-2xl shadow-blue-500/30 transition-all transform hover:-translate-y-1 active:translate-y-0 text-sm">
                        <Link href="/login">Ingresar</Link>
                    </Button>
                </nav>
            </header>

            <main className="flex-1">
                {/* Hero Section - 2026 Fresh Medical */}
                <section className="relative w-full py-28 lg:py-52 overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.08),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.05),transparent_40%)]">
                    <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
                        <div className="flex flex-col items-center space-y-14">
                            <div className="inline-flex items-center gap-3 rounded-full bg-blue-50 border border-blue-100 px-6 py-3 text-[10px] font-black text-[#2563eb] uppercase tracking-[0.4em] animate-in fade-in zoom-in duration-1000">
                                <Activity className="h-4 w-4" /> REVOLUCIONANDO LA GESTIÓN CLÍNICA
                            </div>
                            <h1 className="text-7xl font-black tracking-tighter sm:text-8xl md:text-[10rem] text-slate-900 leading-[1.1] max-w-7xl uppercase italic">
                                CERO ERRORES. <br /> <span className="bg-gradient-to-r from-[#2563eb] to-[#0891b2] bg-clip-text text-transparent italic">MÁXIMA EFICIENCIA.</span>
                            </h1>
                            <p className="mx-auto max-w-[900px] text-slate-500 text-2xl md:text-4xl font-black leading-tight">
                                La solución definitiva para coordinar equipos médicos, reducir ausentismo y automatizar liquidaciones.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-8 mt-12">
                                <Button asChild className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-3xl font-black h-28 px-24 rounded-[3rem] group transition-all shadow-[0_30px_60px_rgba(37,99,235,0.3)] hover:shadow-[0_40px_80px_rgba(37,99,235,0.4)] transform hover:-translate-y-2 active:translate-y-0 border-b-[10px] border-blue-900">
                                    <Link href="https://www.linkedin.com/in/jorge-luis-marquez-monsalve-9748a7135/" target="_blank" rel="noopener noreferrer" className="flex items-center">
                                        BETA CERRADA — CONTACTAR <ArrowUpRight className="ml-4 h-12 w-12 transition-transform group-hover:translate-x-2 group-hover:-translate-y-2" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1400px] bg-blue-50/50 rounded-full blur-[240px] -z-10"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:40px_40px] -z-10"></div>
                </section>

                {/* Use Case: Admin Power (Honorarios & Calendar) */}
                <section id="admin" className="w-full pb-40">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col lg:flex-row gap-20 items-center">
                            <div className="lg:w-1/3 space-y-12">
                                <div className="bg-[#2563eb] p-5 rounded-[2rem] w-fit shadow-2xl shadow-blue-500/20">
                                    <LayoutDashboard className="h-10 w-10 text-white" />
                                </div>
                                <div className="space-y-6">
                                    <h2 className="text-6xl font-black tracking-tighter text-slate-900 uppercase italic leading-[1.1]">PODER PARA <br /> <span className="text-[#2563eb]">ADMINS.</span></h2>
                                    <p className="text-slate-500 text-2xl font-bold leading-relaxed">
                                        Supervisá toda tu operación en un solo panel. Liquidaciones instantáneas, métricas de asistencia y control total de guardias.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    {["Reportes de Honorarios Pro", "Auditoría de Guardias", "Control de Liquidación"].map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 text-slate-900 font-bold uppercase tracking-widest text-xs italic">
                                            <div className="h-4 w-4 rounded-full bg-[#2563eb]" /> {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* High Fidelity Admin Mockup */}
                            <div className="lg:w-2/3 bg-white rounded-[4rem] shadow-[0_80px_160px_-40px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden flex h-[650px] transform lg:rotate-1 hover:rotate-0 transition-transform duration-1000">
                                {/* Dark Sidebar */}
                                <aside className="w-64 bg-[#0a0d14] flex flex-col pt-10 border-r border-white/5 hidden md:flex">
                                    <div className="px-8 mb-12 flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-[#2563eb] p-1.5 flex items-center justify-center">
                                            <Image src="/logo.png" alt="" width={24} height={24} className="rounded-sm" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-white leading-none">Medi Clock</span>
                                            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-1">Administración</span>
                                        </div>
                                    </div>
                                    <nav className="flex-1 px-5 space-y-3">
                                        <div className="bg-[#2563eb] text-white rounded-[1.25rem] px-5 py-4 flex items-center gap-4 shadow-xl shadow-blue-600/20">
                                            <LayoutDashboard className="h-4 w-4" />
                                            <span className="text-[11px] font-black uppercase tracking-wider">Dashboard</span>
                                        </div>
                                        {["Calendario", "Médicos", "Mensajes", "Reportes"].map((item, i) => (
                                            <div key={i} className="text-slate-500 px-5 py-4 flex items-center gap-4 hover:bg-white/5 rounded-[1.25rem] transition-colors cursor-pointer group">
                                                <div className="h-4 w-4 group-hover:text-white transition-colors">
                                                    {item === "Calendario" && <Calendar className="h-4 w-4" />}
                                                    {item === "Médicos" && <Users className="h-4 w-4" />}
                                                    {item === "Mensajes" && <MessageSquare className="h-4 w-4" />}
                                                    {item === "Reportes" && <FileDown className="h-4 w-4" />}
                                                </div>
                                                <span className="text-[11px] font-bold uppercase tracking-wider group-hover:text-white transition-colors">{item}</span>
                                            </div>
                                        ))}
                                    </nav>
                                    <div className="p-8 border-t border-white/5">
                                        <div className="flex items-center gap-4 text-slate-500 uppercase font-black text-[9px] tracking-widest">
                                            <ChevronLeft className="h-4 w-4" /> Contraer
                                        </div>
                                    </div>
                                </aside>
                                {/* Main Content Area */}
                                <div className="flex-1 bg-[#f8fafc]/50 flex flex-col relative overflow-hidden">
                                    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 relative z-10 shadow-sm">
                                        <div className="h-8 w-48 bg-slate-50 rounded-full animate-pulse"></div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] font-black text-slate-900 leading-none">Admin Usuario</span>
                                                <span className="text-[8px] text-[#2563eb] font-black uppercase mt-1 bg-blue-50 px-2 py-0.5 rounded-full">Honorarios</span>
                                            </div>
                                            <div className="h-10 w-10 rounded-full bg-slate-200 border-2 border-slate-50 shadow-sm"></div>
                                        </div>
                                    </header>
                                    <div className="flex-1 p-10 overflow-y-auto space-y-10">
                                        <div className="space-y-2">
                                            <h3 className="text-3xl font-black tracking-tighter text-slate-900 italic uppercase">Panel de Honorarios</h3>
                                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Vista de todas las guardias para auditoría y reportes</p>
                                        </div>
                                        {/* Stats Cards - Exact colors from screenshot */}
                                        <div className="grid grid-cols-4 gap-6">
                                            {[
                                                { label: "TOTAL FILTRADO", value: "315", sub: "Guardias encontradas", icon: Calendar, color: "text-[#2563eb]", bg: "bg-blue-50" },
                                                { label: "PENDIENTES", value: "15", sub: "En rango seleccionado", icon: Clock, color: "text-orange-500", bg: "bg-orange-50" },
                                                { label: "CONFIRMADAS", value: "300", sub: "Listas para liquidar", icon: CheckCircle2, color: "text-[#00ba88]", bg: "bg-emerald-50" },
                                                { label: "MÉDICOS", value: "28", sub: "Personal activo", icon: Users, color: "text-purple-500", bg: "bg-purple-50" }
                                            ].map((stat, i) => (
                                                <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-5 hover:scale-105 transition-transform">
                                                    <div className="flex justify-between items-start">
                                                        <span className="text-[9px] font-black text-slate-400 tracking-[0.2em]">{stat.label}</span>
                                                        <div className={cn("p-2.5 rounded-xl", stat.bg)}>
                                                            <stat.icon className={cn("h-4 w-4", stat.color)} />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</div>
                                                        <div className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{stat.sub}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {/* Filter Mockup */}
                                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-end gap-6">
                                            <div className="flex-1 grid grid-cols-3 gap-6">
                                                {["Médico", "Área", "Periodo"].map((f, i) => (
                                                    <div key={i} className="space-y-2">
                                                        <label className="text-[9px] font-black text-slate-400 tracking-widest uppercase ml-1">{f}</label>
                                                        <div className="h-12 bg-slate-50 rounded-xl border border-slate-100 px-4 flex items-center justify-between text-[11px] font-bold text-slate-600">
                                                            {f === "Periodo" ? "ESTE MES" : "Todos..."}
                                                            <ChevronRight className="h-4 w-4 rotate-90 text-slate-300" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="bg-[#2563eb] text-white p-3.5 rounded-xl shadow-lg shadow-blue-500/20 cursor-pointer">
                                                <Filter className="h-5 w-5" />
                                            </div>
                                            <div className="bg-white border border-slate-100 p-3.5 rounded-xl shadow-sm text-slate-400 cursor-pointer">
                                                <FileDown className="h-5 w-5" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Use Case: Medical Experience (Doctor Dashboard & Mobile) */}
                <section id="medicos" className="w-full bg-[#f8fafc]/50 py-40 border-y border-slate-100 relative">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col lg:flex-row gap-20 items-center">
                            {/* High Fidelity Doctor Mockup */}
                            <div className="lg:w-2/3 order-2 lg:order-1">
                                <div className="bg-white rounded-[4rem] shadow-[0_80px_160px_-40px_rgba(37,99,235,0.1)] border border-slate-100 overflow-hidden min-h-[500px] flex flex-col p-10 space-y-10 transform lg:-rotate-1 hover:rotate-0 transition-transform duration-1000">
                                    <div className="space-y-2">
                                        <h3 className="text-4xl font-black tracking-tighter text-slate-900 italic uppercase leading-[1.1]">BIENVENIDO, <br /> <span className="text-[#2563eb]">ESTIMADO MÉDICO</span></h3>
                                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Gestioná tus guardias y horarios en tiempo real</p>
                                    </div>
                                    {/* Doctor Stats */}
                                    <div className="grid grid-cols-4 gap-6">
                                        {[
                                            { label: "TOTAL GUARDIAS", value: "1", icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
                                            { label: "NUEVAS", value: "0", icon: Clock, color: "text-orange-500", bg: "bg-orange-50" },
                                            { label: "DISPONIBLES", value: "0", icon: Stethoscope, color: "text-[#0891b2]", bg: "bg-cyan-50" },
                                            { label: "CONFIRMADAS", value: "1", icon: CheckCircle2, color: "text-[#00ba88]", bg: "bg-emerald-50" }
                                        ].map((stat, i) => (
                                            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <div className={cn("p-2 rounded-xl", stat.bg)}>
                                                        <stat.icon className={cn("h-4 w-4", stat.color)} />
                                                    </div>
                                                    <span className="text-2xl font-black text-slate-900">{stat.value}</span>
                                                </div>
                                                <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Active Guard Card - Exact from screenshot */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3">
                                            <Plus className="h-5 w-5 text-slate-400" />
                                            <span className="text-xl font-black text-slate-900 uppercase italic">Tus Guardias</span>
                                        </div>
                                        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl p-10 space-y-8 group relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-8">
                                                <div className="bg-blue-50 text-[#2563eb] px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">Asignada</div>
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="text-3xl font-black italic uppercase text-slate-900 leading-none">Noche Internación</h4>
                                                <div className="bg-[#e0fdf4] text-[#00ba88] px-3 py-1 rounded-full text-[10px] font-black uppercase w-fit">Confirmada</div>
                                            </div>
                                            <div className="flex gap-8">
                                                <div className="flex items-center gap-3 text-slate-400">
                                                    <Clock className="h-4 w-4" />
                                                    <span className="text-xs font-bold uppercase tracking-widest">20:00 - 08:00</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-slate-400">
                                                    <Calendar className="h-4 w-4" />
                                                    <span className="text-xs font-bold uppercase tracking-widest">viernes, 27 de marzo de 2026</span>
                                                </div>
                                            </div>
                                            <div className="bg-[#00ba88] hover:bg-[#00a377] text-white rounded-full py-6 flex items-center justify-center gap-4 shadow-xl shadow-emerald-500/20 font-black text-lg uppercase transition-all transform hover:scale-[1.02] cursor-pointer">
                                                <Clock className="h-6 w-6" /> Marcar Entrada (Check-In)
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Text Content */}
                            <div className="lg:w-1/3 space-y-12 order-1 lg:order-2">
                                <div className="bg-[#00ba88] p-5 rounded-[2rem] w-fit shadow-2xl shadow-emerald-500/20">
                                    <Stethoscope className="h-10 w-10 text-white" />
                                </div>
                                <div className="space-y-6">
                                    <h2 className="text-6xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">DISEÑADO PARA <br /> <span className="text-[#00ba88]">MÉDICOS.</span></h2>
                                    <p className="text-slate-500 text-2xl font-bold leading-relaxed">
                                        Un sistema que trabaja para el médico. Facilidad de uso, notificaciones instantáneas y control total de tu disponibilidad.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    {["Check-In Biométrico Fácil", "Gestión de Disponibilidad", "Alertas de Guardias Libres"].map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 text-slate-900 font-bold uppercase tracking-widest text-xs italic">
                                            <div className="h-4 w-4 rounded-full bg-[#00ba88]" /> {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Use Case: Real-time Communication */}
                <section id="mensajeria" className="w-full py-40">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
                            <div className="lg:col-span-4 space-y-12">
                                <div className="bg-slate-900 p-5 rounded-[2rem] w-fit shadow-2xl shadow-slate-900/20">
                                    <MessageSquare className="h-10 w-10 text-white" />
                                </div>
                                <div className="space-y-6">
                                    <h2 className="text-6xl font-black tracking-tighter text-slate-900 uppercase italic leading-[1.1]">CHATEÁ EN <br /> <span className="text-blue-600">TIEMPO REAL.</span></h2>
                                    <p className="text-slate-500 text-2xl font-bold leading-relaxed">
                                        Reemplazamos los grupos de WhatsApp con una herramienta profesional auditable y organizada por clínica.
                                    </p>
                                </div>
                            </div>
                            {/* Messaging Mockup (Faithful to Screenshot) */}
                            <div className="lg:col-span-8 bg-white rounded-[4rem] shadow-[0_80px_160px_-40px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden flex h-[550px] transform lg:rotate-1 hover:rotate-0 transition-transform duration-1000">
                                <aside className="w-72 border-r border-slate-100 bg-white flex flex-col">
                                    <div className="p-8 border-b border-slate-50 flex items-center gap-3">
                                        <MessageSquare className="h-6 w-6 text-slate-900" />
                                        <h4 className="text-xl font-black uppercase italic tracking-tighter">Mensajes</h4>
                                    </div>
                                    <div className="p-6">
                                        <div className="h-12 bg-slate-50 rounded-2xl flex items-center px-4 gap-3 border border-slate-50">
                                            <Search className="h-4 w-4 text-slate-400" />
                                            <span className="text-[11px] font-bold text-slate-400">Buscar médico...</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto px-4 space-y-1 pb-6">
                                        {[
                                            { name: "M. González Alarcón", sub: "m.gonzalez@hospital.com", active: true },
                                            { name: "A. López Martínez", sub: "a.lopez@clinica.com" },
                                            { name: "C. Ramírez Bianchi", sub: "c.ramirez@medico.com" },
                                            { name: "D. Fernández Souza", sub: "d.fernandez@sanatorio.com" }
                                        ].map((p, i) => (
                                            <div key={i} className={cn("flex items-center gap-4 p-4 rounded-[1.5rem] transition-all cursor-pointer", p.active ? "bg-[#2563eb] shadow-xl shadow-blue-500/30 text-white" : "hover:bg-slate-50")}>
                                                <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0", p.active ? "bg-white/20" : "bg-blue-50 text-blue-600")}>
                                                    {p.name[0]}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-[11px] font-black truncate uppercase leading-tight">{p.name}</div>
                                                    <div className={cn("text-[9px] font-bold truncate mt-0.5", p.active ? "text-white/60" : "text-slate-400")}>{p.sub}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </aside>
                                <main className="flex-1 bg-white flex flex-col">
                                    <header className="h-20 bg-[#0a0d14] flex items-center justify-between px-8 text-white relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-xs">M</div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black uppercase tracking-tight">M. González Alarcón</span>
                                                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Conversación con el Médico</span>
                                            </div>
                                        </div>
                                        <MoreVertical className="h-4 w-4 text-slate-500" />
                                    </header>
                                    <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-4">
                                        <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center">
                                            <MessageSquare className="h-8 w-8 text-slate-200" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900 uppercase italic">No hay mensajes en esta conversación</p>
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2">Iniciá la comunicación enviando un mensaje abajo.</p>
                                        </div>
                                    </div>
                                    <footer className="p-6 border-t border-slate-100">
                                        <div className="h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center px-6 justify-between">
                                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Escribí un mensaje...</span>
                                            <Send className="h-5 w-5 text-blue-600" />
                                        </div>
                                    </footer>
                                </main>
                            </div>
                        </div>
                    </div>
                </section>


                <section id="final" className="w-full py-40 lg:py-72 bg-[#0a0d14] relative overflow-hidden text-center">
                    <div className="container mx-auto px-4 md:px-6 relative z-10 space-y-24">
                        <h2 className="text-7xl md:text-[12rem] font-black tracking-tighter text-white uppercase italic leading-[1.1]">
                            LLEVÁ TU CLÍNICA <br /> <span className="bg-gradient-to-r from-blue-500 to-[#00ba88] bg-clip-text text-transparent">AL FUTURO.</span>
                        </h2>
                        <div className="flex flex-col items-center space-y-16">
                            <p className="max-w-[800px] text-slate-400 text-2xl lg:text-5xl font-black italic leading-tight">
                                Unite a las instituciones que ya están operando con Medi Clock.
                            </p>
                            <div className="relative group scale-110">
                                <div className="absolute -inset-3 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-[3.5rem] blur-xl opacity-40 group-hover:opacity-100 transition duration-700 animate-pulse"></div>
                                <Button asChild size="lg" className="relative bg-white hover:bg-slate-100 text-[#0a0d14] text-4xl font-black h-32 px-28 rounded-[3.5rem] shadow-2xl transition-all transform hover:scale-110 active:scale-95 border-b-[12px] border-slate-300">
                                    <Link href="https://www.linkedin.com/in/jorge-luis-marquez-monsalve-9748a7135/" target="_blank" rel="noopener noreferrer">BETA CERRADA — CONTACTAR</Link>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Background Decoration */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1600px] h-[1600px] bg-blue-600/10 rounded-full blur-[300px] -z-10"></div>
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                </section>
            </main>

            {/* Footer - Final High Fidelity */}
            <footer className="w-full py-28 border-t border-slate-100 bg-white">
                <div className="container px-6 md:px-12 mx-auto">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-24 border-b border-slate-100 pb-24 mb-16">
                        <div className="space-y-10">
                            <div className="flex items-center gap-5">
                                <div className="bg-[#2563eb] p-3 rounded-2xl shadow-xl shadow-blue-500/30">
                                    <Image src="/logo.png" alt="" width={32} height={32} className="rounded-sm" />
                                </div>
                                <span className="text-5xl font-black tracking-tighter text-slate-900 italic">Medi Clock</span>
                            </div>
                            <p className="text-slate-500 max-w-sm font-black text-2xl leading-tight italic">
                                La transformación digital operativa para líderes del sector salud en Latinoamérica.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-16 lg:gap-32">
                            <div className="space-y-8">
                                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#2563eb]">Software</p>
                                <ul className="space-y-4 text-sm font-black text-slate-400 italic">
                                    <li><Link href="#admin" className="hover:text-blue-600 transition-colors uppercase tracking-widest">Admisión Pro</Link></li>
                                    <li><Link href="#medicos" className="hover:text-blue-600 transition-colors uppercase tracking-widest">Para Médicos</Link></li>
                                    <li><Link href="https://www.linkedin.com/in/jorge-luis-marquez-monsalve-9748a7135/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors uppercase tracking-widest">Contactar</Link></li>
                                </ul>
                            </div>
                            <div className="space-y-8">
                                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#2563eb]">Empresa</p>
                                <ul className="space-y-4 text-sm font-black text-slate-400 italic">
                                    <li><Link href="#" className="hover:text-blue-600 transition-colors uppercase tracking-widest">Privacidad</Link></li>
                                    <li><Link href="#" className="hover:text-blue-600 transition-colors uppercase tracking-widest">Terminos</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                        <div className="flex items-center gap-5">
                            <div className="h-3 w-3 rounded-full bg-[#2563eb] animate-pulse shadow-[0_0_10px_#2563eb]"></div>
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em]">
                                © 2026 MEDICLOCK.CLICK • BUENOS AIRES • ARGENTINA.
                            </p>
                        </div>
                        <div className="flex gap-12 opacity-30 group cursor-pointer">
                            <Globe className="h-8 w-8 text-slate-900 group-hover:scale-110 transition-transform" />
                            <Activity className="h-8 w-8 text-slate-900 group-hover:scale-110 transition-transform" />
                            <Smartphone className="h-8 w-8 text-slate-900 group-hover:scale-110 transition-transform" />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
