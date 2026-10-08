"use client"

import { toast } from "sonner"
import { useT } from "@/lib/i18n/language-provider"
import { getCurrentCoords, geoErrorKeys } from "./client"
import { GEOFENCE_ENABLED } from "./config"

/**
 * Obtiene la ubicación para marcar entrada/salida y resuelve el mensaje de error
 * a mostrar cuando el servidor exige ubicación y el dispositivo no la pudo dar.
 */
export function useClockLocation() {
  const t = useT()

  const locate = async () => {
    // Con el geofence apagado no se pide GPS: el fichaje funciona como antes.
    if (!GEOFENCE_ENABLED) return { coords: null, geoError: null }

    const toastId = toast.loading(t("geo.locating"))
    const geo = await getCurrentCoords()
    toast.dismiss(toastId)
    return {
      coords: geo.coords ?? null,
      geoError: geo.error ? t(geoErrorKeys[geo.error]) : null,
    }
  }

  // Mensaje a mostrar para un error del servidor: si falló por falta de ubicación,
  // se muestra la causa concreta del GPS (permiso denegado, timeout, etc.).
  const errorMessage = (result: { error?: string; code?: string }, geoError: string | null) =>
    result.code === "location_required" && geoError ? geoError : result.error

  return { locate, errorMessage }
}
