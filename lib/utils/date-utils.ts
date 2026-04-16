import { format, subDays, addDays } from "date-fns"

export const ARG_TIMEZONE = "America/Argentina/Buenos_Aires"
export const ARG_OFFSET = "-03:00"

/**
 * Returns the current date string in YYYY-MM-DD format for Argentina.
 */
export function getArgentinaTodayString(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: ARG_TIMEZONE })
}

/**
 * Returns an array of date strings [yesterday, today, tomorrow] in Argentina time.
 * Useful for check-in window validations.
 */
export function getArgentinaValidationDates(): string[] {
  const todayStr = getArgentinaTodayString()
  const todayDate = new Date(`${todayStr}T12:00:00${ARG_OFFSET}`)
  
  const yesterday = subDays(todayDate, 1)
  const tomorrow = addDays(todayDate, 1)
  
  return [
    format(yesterday, "yyyy-MM-dd"),
    todayStr,
    format(tomorrow, "yyyy-MM-dd")
  ]
}

/**
 * Parses a shift date and hour into a Date object with Argentina offset.
 * @param dateStr Format "YYYY-MM-DD"
 * @param hourStr Format "H" or "HH" (e.g. "8", "20")
 */
export function parseShiftDateTime(dateStr: string, hourStr?: string): Date {
  const hour = hourStr ? hourStr.padStart(2, '0') : '00'
  return new Date(`${dateStr}T${hour}:00:00${ARG_OFFSET}`)
}

/**
 * Safely parses a UTC ISO string (like clock_in) into a Date object.
 */
export function parseUTCDate(isoString: string): Date {
  return new Date(isoString)
}

/**
 * Calculates the difference in minutes between now (UTC) and a scheduled Argentina time.
 */
export function getMinutesDiffFromNow(scheduledDate: Date): number {
  const now = new Date()
  return (now.getTime() - scheduledDate.getTime()) / (1000 * 60)
}
