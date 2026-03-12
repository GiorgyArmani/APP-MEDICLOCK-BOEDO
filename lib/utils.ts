import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Format time to readable string
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Format date and time
 */
export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)} ${formatTime(date)}`
}

/**
 * Check if date is today
 */
export function isToday(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date
  const today = new Date()
  return d.toDateString() === today.toDateString()
}

/**
 * Check if date is tomorrow
 */
export function isTomorrow(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return d.toDateString() === tomorrow.toDateString()
}

/**
 * Get relative date string (Today, Tomorrow, or formatted date)
 */
export function getRelativeDateString(date: Date | string): string {
  if (isToday(date)) return 'Hoy'
  if (isTomorrow(date)) return 'Mañana'
  return formatDate(date)
}

/**
 * Checks if two shifts overlap based on their hour ranges (e.g. "8-14", "20-8")
 * Implementation follows: startA < endB AND startB < endA
 * For overnight shifts (e.g. 20-8), we add 24 to the end time.
 */
export function shiftsOverlap(hours1: string, hours2: string): boolean {
  const parseRange = (h: string) => {
    // Expected format: "8-14" or "20-8" or "8-20"
    const [startStr, endStr] = h.split('-').map(s => s.trim())
    let start = parseInt(startStr, 10)
    let end = parseInt(endStr, 10)

    if (isNaN(start) || isNaN(end)) return null

    // Handle overnight shifts (e.g., 20 to 8)
    if (end <= start) {
      end += 24
    }
    return { start, end }
  }

  const range1 = parseRange(hours1)
  const range2 = parseRange(hours2)

  if (!range1 || !range2) return false

  // Overlap condition: start1 < end2 AND start2 < end1
  return range1.start < range2.end && range2.start < range1.end
}
