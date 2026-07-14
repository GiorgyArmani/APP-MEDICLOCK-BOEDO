import { redirect } from "next/navigation"
import { getCurrentDoctor } from "@/lib/actions/auth"
import { ChatWindow } from "@/components/chat/chat-window"
import { MessageSquare } from "lucide-react"
import { T } from "@/components/i18n/t"

export default async function DoctorMessagesPage() {
    const currentDoctor = await getCurrentDoctor()

    if (!currentDoctor) {
        redirect("/login")
    }

    // In the doctor's view, doctorId and currentUserId are the same
    // recipientName is "Administración" because they are talking to the office

    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            <div className="flex items-center gap-2">
                <MessageSquare className="h-8 w-8 text-slate-900" />
                <h1 className="text-3xl font-bold text-slate-900"><T k="messagesPage.title" /></h1>
            </div>

            <p className="text-slate-600 max-w-2xl">
                <T k="messagesPage.subtitle" />
            </p>

            <div className="max-w-4xl mx-auto h-[calc(100dvh-16rem)] min-h-0 border rounded-xl overflow-hidden shadow-sm">
                <ChatWindow
                    doctorId={currentDoctor.id}
                    currentUserId={currentDoctor.id}
                    recipientName="Administración Mediclock"
                    isAdminView={false}
                />
            </div>
        </div>
    )
}
