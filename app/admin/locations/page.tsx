import { notFound } from "next/navigation"
import { MapPin } from "lucide-react"
import { GEOFENCE_ENABLED } from "@/lib/geo/config"
import { getWorkLocations } from "@/lib/actions/work-locations"
import { WorkLocationsManager } from "@/components/admin/work-locations-manager"
import { T } from "@/components/i18n/t"

export default async function LocationsPage() {
    // Mientras el geofence esté apagado la tabla puede no existir todavía.
    if (!GEOFENCE_ENABLED) notFound()

    const locations = await getWorkLocations()

    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            <div className="flex items-center gap-3">
                <MapPin className="h-7 w-7 text-slate-500" />
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900"><T k="locations.title" /></h1>
                    <p className="text-slate-600"><T k="locations.subtitle" /></p>
                </div>
            </div>

            <WorkLocationsManager locations={locations} />
        </div>
    )
}
