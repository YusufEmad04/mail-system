"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import MailList from "@/components/mail-list"
import MailPreview from "@/components/mail-preview"

export default function DashboardPage() {
  const [selectedEmail, setSelectedEmail] = useState(null)

  return (
    <DashboardLayout>
      <div className="flex h-full flex-col md:flex-row">
        <MailList selectedEmail={selectedEmail} setSelectedEmail={setSelectedEmail} />
        <MailPreview email={selectedEmail} />
      </div>
    </DashboardLayout>
  )
}
