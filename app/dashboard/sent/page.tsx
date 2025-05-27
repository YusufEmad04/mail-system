import type { Metadata } from "next"
import DashboardLayout from "@/components/dashboard-layout"
import SentMailList from "@/components/sent-mail-list"
import MailPreview from "@/components/mail-preview"

export const metadata: Metadata = {
  title: "Sent | MailBox",
  description: "Your sent emails",
}

export default function SentPage() {
  return (
    <DashboardLayout>
      <div className="flex h-full flex-col md:flex-row">
        <SentMailList />
        <MailPreview email={""} />
      </div>
    </DashboardLayout>
  )
}
