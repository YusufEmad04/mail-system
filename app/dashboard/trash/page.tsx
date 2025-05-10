import type { Metadata } from "next"
import DashboardLayout from "@/components/dashboard-layout"
import TrashMailList from "@/components/trash-mail-list"
import MailPreview from "@/components/mail-preview"

export const metadata: Metadata = {
  title: "Trash | MailBox",
  description: "Your deleted emails",
}

export default function TrashPage() {
  return (
    <DashboardLayout>
      <div className="flex h-full flex-col md:flex-row">
        <TrashMailList />
        <MailPreview />
      </div>
    </DashboardLayout>
  )
}
