"use client"

import type { GeoCoords } from "./geofence"

export type GeoErrorCode = "unsupported" | "denied" | "unavailable" | "timeout"

export type GeoResult = { coords: GeoCoords; error?: undefined } | { coords?: undefined; error: GeoErrorCode }

// Obtiene la posición actual del dispositivo con alta precisión y sin caché,
// para que cada marcación use una lectura fresca.
export function getCurrentCoords(): Promise<GeoResult> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve({ error: "unsupported" })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          },
        }),
      (err) => {
        if (err.code === err.PERMISSION_DENIED) resolve({ error: "denied" })
        else if (err.code === err.TIMEOUT) resolve({ error: "timeout" })
        else resolve({ error: "unavailable" })
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    )
  })
}

export const geoErrorKeys = {
  unsupported: "geo.unsupported",
  denied: "geo.denied",
  unavailable: "geo.unavailable",
  timeout: "geo.timeout",
} as const
