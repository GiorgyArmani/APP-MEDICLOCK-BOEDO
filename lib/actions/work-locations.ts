"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { WorkLocation } from "@/lib/supabase/types"

export interface WorkLocationInput {
  name: string
  latitude: number
  longitude: number
  radius_meters: number
  is_active: boolean
}

async function requireAdmin() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { supabase, error: "No autenticado" }

  const { data: doctor } = await supabase.from("doctors").select("role").eq("id", user.id).single()
  if (doctor?.role !== "administrator") return { supabase, error: "No tienes permiso para gestionar ubicaciones" }

  return { supabase, error: null }
}

function validate(input: WorkLocationInput): string | null {
  if (!input.name?.trim()) return "El nombre es obligatorio"
  if (!Number.isFinite(input.latitude) || Math.abs(input.latitude) > 90) return "Latitud inválida"
  if (!Number.isFinite(input.longitude) || Math.abs(input.longitude) > 180) return "Longitud inválida"
  if (!Number.isInteger(input.radius_meters) || input.radius_meters < 20 || input.radius_meters > 5000) {
    return "El radio debe estar entre 20 y 5000 metros"
  }
  return null
}

export async function getWorkLocations(): Promise<WorkLocation[]> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase.from("work_locations").select("*").order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching work locations:", error)
    return []
  }
  return data as WorkLocation[]
}

export async function saveWorkLocation(input: WorkLocationInput, id?: string) {
  const { supabase, error: authError } = await requireAdmin()
  if (authError) return { error: authError }

  const validationError = validate(input)
  if (validationError) return { error: validationError }

  const payload = {
    name: input.name.trim(),
    latitude: input.latitude,
    longitude: input.longitude,
    radius_meters: input.radius_meters,
    is_active: input.is_active,
    updated_at: new Date().toISOString(),
  }

  const { error } = id
    ? await supabase.from("work_locations").update(payload).eq("id", id)
    : await supabase.from("work_locations").insert(payload)

  if (error) {
    console.error("Error saving work location:", error)
    return { error: error.message }
  }

  revalidatePath("/admin/locations")
  return { success: true }
}

export async function deleteWorkLocation(id: string) {
  const { supabase, error: authError } = await requireAdmin()
  if (authError) return { error: authError }

  const { error } = await supabase.from("work_locations").delete().eq("id", id)
  if (error) {
    console.error("Error deleting work location:", error)
    return { error: error.message }
  }

  revalidatePath("/admin/locations")
  return { success: true }
}
