import type { TPath } from "@/lib/i18n/dictionaries"
import { cn } from "@/lib/utils"

const roleLabelKeys: Record<string, TPath> = {
    doctor: "roles.doctor",
    administrator: "roles.administrator",
    honorarios: "roles.honorarios",
}

export function roleLabelKey(role: string): TPath {
    return roleLabelKeys[role] ?? "roles.doctor"
}

// Initials from a full name, skipping titles like "Dr." / "Dra.".
function initials(name: string) {
    const parts = name
        .split(/\s+/)
        .filter((p) => p && !/^dra?\.?$/i.test(p))
    return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?"
}

export function UserAvatar({ name, className }: { name: string; className?: string }) {
    return (
        <span
            aria-hidden
            className={cn(
                "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-xs font-bold text-white ring-2 ring-white/10",
                className,
            )}
        >
            {initials(name)}
        </span>
    )
}
