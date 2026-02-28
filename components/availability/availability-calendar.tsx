"use client"

import { useState } from "react"
import { setAvailability, deleteAvailability, type AvailabilitySlot } from "@/lib/actions/availability"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Clock, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface AvailabilityCalendarProps {
    doctorId: string
    availability: AvailabilitySlot[]
}

const DAYS = [
    { value: 0, label: "Domingo" },
    { value: 1, label: "Lunes" },
    { value: 2, label: "Martes" },
    { value: 3, label: "Miércoles" },
    { value: 4, label: "Jueves" },
    { value: 5, label: "Viernes" },
    { value: 6, label: "Sábado" },
]

export function AvailabilityCalendar({ doctorId, availability }: AvailabilityCalendarProps) {
    const router = useRouter()
    const [selectedDay, setSelectedDay] = useState<number | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [startTime, setStartTime] = useState("09:00")
    const [endTime, setEndTime] = useState("17:00")
    const [notes, setNotes] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleDayClick = (dayValue: number) => {
        setSelectedDay(dayValue)
        setIsDialogOpen(true)
        setStartTime("09:00")
        setEndTime("17:00")
        setNotes("")
    }

    const handleSubmit = async () => {
        if (selectedDay === null) return

        setIsSubmitting(true)
        const result = await setAvailability(doctorId, selectedDay, startTime, endTime, notes)

        if (result.error) {
            toast.error(`Error: ${result.error}`)
        } else {
            toast.success("Disponibilidad guardada")
            setIsDialogOpen(false)
            router.refresh()
        }
        setIsSubmitting(false)
    }

    const handleDelete = async (availabilityId: string) => {
        const result = await deleteAvailability(availabilityId)

        if (result.error) {
            toast.error(`Error: ${result.error}`)
        } else {
            toast.success("Disponibilidad eliminada")
            router.refresh()
        }
    }

    const getAvailabilityForDay = (dayValue: number) => {
        return availability.filter((a) => a.day_of_week === dayValue)
    }

    return (
        <>
            <div className="space-y-4">
                {DAYS.map((day) => {
                    const dayAvailability = getAvailabilityForDay(day.value)
                    return (
                        <div
                            key={day.value}
                            className="flex items-center justify-between p-6 border border-slate-100 rounded-2xl bg-white hover:shadow-lg hover:shadow-slate-200/20 transition-all duration-300 group"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                                        <Clock className="h-5 w-5" />
                                    </div>
                                    <span className="font-black text-slate-800 tracking-tight text-lg">{day.label}</span>
                                </div>
                                {dayAvailability.length > 0 ? (
                                    <div className="ml-14 space-y-3">
                                        {dayAvailability.map((slot) => (
                                            <div key={slot.id} className="flex items-center gap-3">
                                                <Badge variant="outline" className="bg-emerald-50/50 text-emerald-700 border-emerald-100 px-3 py-1 font-bold text-[11px] rounded-lg">
                                                    {slot.start_time.substring(0, 5)} — {slot.end_time.substring(0, 5)}
                                                </Badge>
                                                {slot.notes && (
                                                    <span className="text-[11px] font-medium text-slate-400 italic">“{slot.notes}”</span>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(slot.id)}
                                                    className="h-8 w-8 p-0 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="ml-14 text-xs font-bold text-slate-300 uppercase tracking-widest">Sin disponibilidad configurada</p>
                                )}
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => handleDayClick(day.value)}
                                className="gap-2 bg-slate-50 border-slate-200 rounded-xl font-black text-[10px] uppercase tracking-widest h-10 px-5 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                            >
                                <Plus className="h-4 w-4" />
                                Agregar
                            </Button>
                        </div>
                    )
                })}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Agregar Disponibilidad - {selectedDay !== null ? DAYS[selectedDay].label : ""}
                        </DialogTitle>
                        <DialogDescription>
                            Configura el horario en el que estás disponible para guardias
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="start-time">Hora Inicio</Label>
                                <Input
                                    id="start-time"
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="end-time">Hora Fin</Label>
                                <Input
                                    id="end-time"
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notas (opcional)</Label>
                            <Textarea
                                id="notes"
                                placeholder="Ej: Preferencia de turno mañana"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                            />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                            Cancelar
                        </Button>
                        <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
                            {isSubmitting ? "Guardando..." : "Guardar"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
