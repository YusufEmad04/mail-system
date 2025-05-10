import type { Metadata } from "next"
import DashboardLayout from "@/components/dashboard-layout"
import ReadMailList from "@/components/read-mail-list"
import MailPreview from "@/components/mail-preview"

export const metadata: Metadata = {
  title: "Read | MailBox",
  description: "Your read emails",
}

export default function ReadPage() {
  return (
    <DashboardLayout>
      <div className="flex h-full flex-col md:flex-row">
        <ReadMailList />
        <MailPreview />
      </div>
    </DashboardLayout>
  )
}
