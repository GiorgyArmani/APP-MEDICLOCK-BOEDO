// Interruptor del control de ubicación (geofence) para entrada/salida.
// Apagado por defecto: el fichaje funciona como antes, sin pedir GPS.
// Para activarlo: correr geofence.sql en Supabase, cargar las sedes y definir
// NEXT_PUBLIC_GEOFENCE_ENABLED=true (en .env local y en Vercel).
export const GEOFENCE_ENABLED = process.env.NEXT_PUBLIC_GEOFENCE_ENABLED === "true"
