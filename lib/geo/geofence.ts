import type { getSupabaseServerClient } from "@/lib/supabase/server"
import type { WorkLocation } from "@/lib/supabase/types"
import { GEOFENCE_ENABLED } from "./config"

type ServerClient = Awaited<ReturnType<typeof getSupabaseServerClient>>

export interface GeoCoords {
  latitude: number
  longitude: number
  accuracy: number
}

// Precisión GPS máxima aceptada (metros). Por encima de esto la posición no es
// confiable para decidir si la persona está dentro del perímetro.
export const MAX_GPS_ACCURACY_METERS = 100

// Distancia en metros entre dos coordenadas (fórmula de Haversine)
export function distanceInMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

function isValidCoords(coords: GeoCoords | null | undefined): coords is GeoCoords {
  return (
    !!coords &&
    Number.isFinite(coords.latitude) &&
    Number.isFinite(coords.longitude) &&
    Number.isFinite(coords.accuracy) &&
    Math.abs(coords.latitude) <= 90 &&
    Math.abs(coords.longitude) <= 180 &&
    coords.accuracy >= 0
  )
}

export type GeofenceResult =
  | { ok: true; enforced: false }
  | { ok: true; enforced: true; location: WorkLocation; distance: number; coords: GeoCoords }
  | { ok: false; error: string; code?: "location_required" }

/**
 * Verifica que las coordenadas estén dentro del perímetro de alguna sede activa.
 * Si no hay sedes activas configuradas, el control no se aplica.
 */
export async function checkGeofence(
  supabase: ServerClient,
  coords: GeoCoords | null | undefined
): Promise<GeofenceResult> {
  if (!GEOFENCE_ENABLED) {
    return { ok: true, enforced: false }
  }

  const { data: locations, error } = await supabase
    .from("work_locations")
    .select("*")
    .eq("is_active", true)

  if (error) {
    console.error("Error fetching work locations:", error)
    return { ok: false, error: "No se pudo verificar la ubicación. Intente nuevamente." }
  }

  if (!locations || locations.length === 0) {
    return { ok: true, enforced: false }
  }

  if (!isValidCoords(coords)) {
    return {
      ok: false,
      code: "location_required",
      error: "Se requiere su ubicación para marcar. Active el GPS y permita el acceso a la ubicación.",
    }
  }

  if (coords.accuracy > MAX_GPS_ACCURACY_METERS) {
    return {
      ok: false,
      error: `La señal de ubicación es imprecisa (±${Math.round(coords.accuracy)} m). Acérquese a una ventana o active el GPS e intente nuevamente.`,
    }
  }

  let nearest: { location: WorkLocation; distance: number } | null = null
  for (const location of locations as WorkLocation[]) {
    const distance = distanceInMeters(coords.latitude, coords.longitude, location.latitude, location.longitude)
    if (!nearest || distance - location.radius_meters < nearest.distance - nearest.location.radius_meters) {
      nearest = { location, distance }
    }
  }

  if (!nearest || nearest.distance > nearest.location.radius_meters) {
    const away = nearest ? Math.round(nearest.distance - nearest.location.radius_meters) : 0
    return {
      ok: false,
      error: nearest
        ? `Está fuera del perímetro de trabajo (${nearest.location.name}), a ${away} m del área permitida. Solo puede marcar dentro del lugar de trabajo.`
        : "Está fuera del perímetro de trabajo.",
    }
  }

  return { ok: true, enforced: true, location: nearest.location, distance: nearest.distance, coords }
}
