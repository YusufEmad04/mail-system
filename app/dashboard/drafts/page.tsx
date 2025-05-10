import type { Metadata } from "next"
import DashboardLayout from "@/components/dashboard-layout"
import DraftsMailList from "@/components/drafts-mail-list"
import MailPreview from "@/components/mail-preview"

export const metadata: Metadata = {
  title: "Drafts | MailBox",
  description: "Your email drafts",
}

export default function DraftsPage() {
  return (
    <DashboardLayout>
      <div className="flex h-full flex-col md:flex-row">
        <DraftsMailList />
        <MailPreview />
      </div>
    </DashboardLayout>
  )
}
