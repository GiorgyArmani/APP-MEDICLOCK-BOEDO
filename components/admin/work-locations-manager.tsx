"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import type { WorkLocation } from "@/lib/supabase/types"
import { saveWorkLocation, deleteWorkLocation, type WorkLocationInput } from "@/lib/actions/work-locations"
import { getCurrentCoords, geoErrorKeys } from "@/lib/geo/client"
import { useT } from "@/lib/i18n/language-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertCircle, CheckCircle2, Crosshair, ExternalLink, MapPin, Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface FormState {
  name: string
  latitude: string
  longitude: string
  radius_meters: string
  is_active: boolean
}

const emptyForm: FormState = { name: "", latitude: "", longitude: "", radius_meters: "200", is_active: true }

export function WorkLocationsManager({ locations }: { locations: WorkLocation[] }) {
  const t = useT()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [capturedAccuracy, setCapturedAccuracy] = useState<number | null>(null)
  const [locating, setLocating] = useState(false)
  const [toDelete, setToDelete] = useState<WorkLocation | null>(null)

  const hasActive = locations.some((l) => l.is_active)

  const openNew = () => {
    setEditingId(null)
    setForm(emptyForm)
    setCapturedAccuracy(null)
    setFormOpen(true)
  }

  const openEdit = (location: WorkLocation) => {
    setEditingId(location.id)
    setForm({
      name: location.name,
      latitude: String(location.latitude),
      longitude: String(location.longitude),
      radius_meters: String(location.radius_meters),
      is_active: location.is_active,
    })
    setCapturedAccuracy(null)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditingId(null)
  }

  const handleUseMyLocation = async () => {
    setLocating(true)
    const geo = await getCurrentCoords()
    setLocating(false)
    if (geo.error) {
      toast.error(t(geoErrorKeys[geo.error]))
      return
    }
    setForm((f) => ({
      ...f,
      latitude: geo.coords.latitude.toFixed(6),
      longitude: geo.coords.longitude.toFixed(6),
    }))
    setCapturedAccuracy(Math.round(geo.coords.accuracy))
  }

  const handleSave = () => {
    const input: WorkLocationInput = {
      name: form.name,
      latitude: Number(form.latitude.replace(",", ".")),
      longitude: Number(form.longitude.replace(",", ".")),
      radius_meters: Number(form.radius_meters),
      is_active: form.is_active,
    }
    startTransition(async () => {
      const result = await saveWorkLocation(input, editingId ?? undefined)
      if (result.error) {
        toast.error(`Error: ${result.error}`)
      } else {
        toast.success(t("locations.toastSaved"))
        closeForm()
        router.refresh()
      }
    })
  }

  const handleToggleActive = (location: WorkLocation, is_active: boolean) => {
    startTransition(async () => {
      const result = await saveWorkLocation(
        {
          name: location.name,
          latitude: location.latitude,
          longitude: location.longitude,
          radius_meters: location.radius_meters,
          is_active,
        },
        location.id
      )
      if (result.error) toast.error(`Error: ${result.error}`)
      else router.refresh()
    })
  }

  const handleDelete = () => {
    if (!toDelete) return
    const id = toDelete.id
    startTransition(async () => {
      const result = await deleteWorkLocation(id)
      if (result.error) {
        toast.error(`Error: ${result.error}`)
      } else {
        toast.success(t("locations.toastDeleted"))
        router.refresh()
      }
      setToDelete(null)
    })
  }

  return (
    <div className="space-y-6">
      <div
        className={
          hasActive
            ? "flex items-start gap-2 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"
            : "flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"
        }
      >
        {hasActive ? <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" /> : <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />}
        <span>{hasActive ? t("locations.enabledInfo") : t("locations.disabledWarning")}</span>
      </div>

      {!formOpen && (
        <Button onClick={openNew} className="gap-2">
          <Plus className="h-4 w-4" />
          {t("locations.add")}
        </Button>
      )}

      {formOpen && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? t("locations.edit") : t("locations.add")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="loc-name">{t("locations.name")}</Label>
              <Input
                id="loc-name"
                value={form.name}
                placeholder={t("locations.namePlaceholder")}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="loc-lat">{t("locations.latitude")}</Label>
                <Input
                  id="loc-lat"
                  inputMode="decimal"
                  value={form.latitude}
                  placeholder="-34.603722"
                  onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loc-lng">{t("locations.longitude")}</Label>
                <Input
                  id="loc-lng"
                  inputMode="decimal"
                  value={form.longitude}
                  placeholder="-58.381592"
                  onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button type="button" variant="outline" onClick={handleUseMyLocation} disabled={locating} className="gap-2">
                <Crosshair className="h-4 w-4" />
                {locating ? t("geo.locating") : t("locations.useMyLocation")}
              </Button>
              {capturedAccuracy !== null && (
                <span className="text-xs text-slate-500">
                  {t("locations.currentAccuracy", { m: capturedAccuracy })}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="loc-radius">{t("locations.radius")}</Label>
              <Input
                id="loc-radius"
                type="number"
                min={20}
                max={5000}
                step={10}
                value={form.radius_meters}
                onChange={(e) => setForm({ ...form, radius_meters: e.target.value })}
                className="max-w-[200px]"
              />
              <p className="text-xs text-slate-500">{t("locations.radiusHint")}</p>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="loc-active"
                checked={form.is_active}
                onCheckedChange={(checked) => setForm({ ...form, is_active: checked })}
              />
              <Label htmlFor="loc-active">{t("locations.active")}</Label>
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} disabled={isPending}>
                {isPending ? t("locations.saving") : t("locations.save")}
              </Button>
              <Button variant="outline" onClick={closeForm} disabled={isPending}>
                {t("locations.cancel")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {locations.length === 0 ? (
        <p className="text-sm text-slate-500">{t("locations.empty")}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {locations.map((location) => (
            <Card key={location.id}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin className="h-5 w-5 text-slate-400 shrink-0" />
                    <h3 className="font-semibold text-slate-900 truncate">{location.name}</h3>
                  </div>
                  <Badge
                    className={
                      location.is_active
                        ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }
                  >
                    {location.is_active ? t("locations.active") : t("locations.inactive")}
                  </Badge>
                </div>
                <div className="text-sm text-slate-600 space-y-1">
                  <p className="font-mono text-xs">
                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </p>
                  <p>{t("locations.radiusLabel", { m: location.radius_meters })}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                  <Switch
                    checked={location.is_active}
                    disabled={isPending}
                    onCheckedChange={(checked) => handleToggleActive(location, checked)}
                    aria-label={t("locations.active")}
                  />
                  <Button variant="ghost" size="sm" asChild className="gap-1">
                    <a
                      href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {t("locations.openMap")}
                    </a>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => openEdit(location)} className="gap-1">
                    <Pencil className="h-4 w-4" />
                    {t("locations.edit")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setToDelete(location)}
                    className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    {t("locations.delete")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!toDelete} onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("locations.deleteConfirm", { name: toDelete?.name ?? "" })}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>{t("locations.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending} className="bg-red-600 hover:bg-red-700">
              {t("locations.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
