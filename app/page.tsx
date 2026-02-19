import { redirect } from "next/navigation"
import { getCurrentDoctor } from "@/lib/actions/auth"
import { LandingPage } from "@/app/marketing/landing-page"

export default async function HomePage() {
  const doctor = await getCurrentDoctor()

  if (!doctor) {
    return <LandingPage />
  }

  if (doctor.role === "administrator") {
    redirect("/admin")
  }

  if (doctor.role === "honorarios") {
    redirect("/honorarios")
  } else {
    redirect("/dashboard")
  }
}
