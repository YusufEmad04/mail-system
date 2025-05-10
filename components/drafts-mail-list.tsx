"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Paperclip, Star, StarOff, Edit } from "lucide-react"

// Sample data for draft emails
const draftEmails = [
  {
    id: "d1",
    to: "Marketing Team",
    email: "marketing@example.com",
    subject: "Marketing Campaign Ideas",
    preview: "I've been thinking about our upcoming marketing campaign and wanted to share some ideas...",
    date: "10:30 AM",
    starred: false,
    hasAttachment: false,
    cc: [],
    bcc: [],
    content: `
      I've been thinking about our upcoming marketing campaign and wanted to share some ideas:

      1. Social media contest
      2. Influencer partnerships
      3. Email newsletter series

      Let me know what you think.
    `,
  },
  {
    id: "d2",
    to: "Alice Johnson",
    email: "alice@example.com",
    subject: "Project Timeline Update",
    preview: "Based on our recent progress, I think we need to adjust the project timeline...",
    date: "Yesterday",
    starred: true,
    hasAttachment: true,
    cc: ["manager@example.com"],
    bcc: [],
    content: `
      Based on our recent progress, I think we need to adjust the project timeline. I've attached a revised schedule for your review.

      Key changes:
      - Extended the research phase by one week
      - Compressed the testing phase
      - Added a buffer before the final delivery

      Let me know if this works for you.
    `,
    attachments: [{ name: "revised-timeline.xlsx", size: "1.2 MB" }],
  },
  {
    id: "d3",
    to: "HR Department",
    email: "hr@example.com",
    subject: "Vacation Request",
    preview: "I would like to request vacation time for the following dates...",
    date: "May 20",
    starred: false,
    hasAttachment: false,
    cc: [],
    bcc: [],
    content: `
      I would like to request vacation time for the following dates:

      July 15-22, 2023

      I've already discussed this with my team and ensured that there are no critical deliverables during this period.

      Thank you,
      John
    `,
  },
  {
    id: "d4",
    to: "Client",
    email: "client@example.com",
    subject: "Proposal for Website Redesign",
    preview: "Thank you for the opportunity to submit a proposal for your website redesign project...",
    date: "May 18",
    starred: true,
    hasAttachment: true,
    cc: ["sales@example.com"],
    bcc: ["manager@example.com"],
    content: `
      Thank you for the opportunity to submit a proposal for your website redesign project.

      Based on our discussions, we understand that you're looking for:
      - A modern, responsive design
      - Improved user experience
      - Integration with your CRM system
      - Enhanced SEO capabilities

      I've attached our detailed proposal including timeline, cost estimates, and examples of our previous work.

      Please let me know if you have any questions.
    `,
    attachments: [
      { name: "website-redesign-proposal.pdf", size: "3.5 MB" },
      { name: "portfolio-examples.zip", size: "8.2 MB" },
    ],
  },
  {
    id: "d5",
    to: "Team",
    email: "team@example.com",
    subject: "Weekly Update",
    preview: "Here's a summary of our progress this week and plans for next week...",
    date: "May 15",
    starred: false,
    hasAttachment: false,
    cc: [],
    bcc: [],
    content: `
      Here's a summary of our progress this week and plans for next week:

      Accomplishments:
      - Completed the user authentication module
      - Fixed 12 high-priority bugs
      - Conducted 3 user testing sessions

      Next week:
      - Start work on the reporting dashboard
      - Finalize the API documentation
      - Prepare for the mid-project review

      Let me know if there's anything else we should prioritize.
    `,
  },
]

export default function DraftsMailList() {
  const [selectedEmail, setSelectedEmail] = useState(draftEmails[0])
  const router = useRouter()

  const handleEmailClick = (email: any) => {
    setSelectedEmail(email)
  }

  const handleEditDraft = (e: React.MouseEvent, emailId: string) => {
    e.stopPropagation()
    // In a real app, you would navigate to the compose page with the draft loaded
    router.push("/dashboard/compose")
  }

  const handleStarClick = (e: React.MouseEvent, emailId: string) => {
    e.stopPropagation()
    // In a real app, you would toggle the starred status here
  }

  return (
    <div className="flex h-full w-full flex-col border-r md:w-1/2 lg:w-2/5">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <h2 className="text-lg font-semibold">Drafts</h2>
        <div className="flex items-center gap-2">
          <Checkbox id="select-all-drafts" />
          <label htmlFor="select-all-drafts" className="text-xs font-medium">
            Select All
          </label>
        </div>
        <Button variant="ghost" size="sm">
          Refresh
        </Button>
      </div>
      <div className="divide-y overflow-auto">
        {draftEmails.map((email) => (
          <div
            key={email.id}
            className={`cursor-pointer p-4 transition-colors hover:bg-muted ${
              selectedEmail.id === email.id ? "bg-muted" : ""
            }`}
            onClick={() => handleEmailClick(email)}
          >
            <div className="flex items-start gap-3">
              <Checkbox className="mt-1" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Draft</span>
                  <span className="text-xs text-muted-foreground">{email.date}</span>
                </div>
                <h3 className="text-sm">{email.subject || "(No subject)"}</h3>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span className="line-clamp-1">To: {email.to}</span>
                </div>
                <p className="line-clamp-2 text-xs text-muted-foreground">{email.preview}</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => handleEditDraft(e, email.id)}
                  title="Edit draft"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => handleStarClick(e, email.id)}>
                  {email.starred ? (
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ) : (
                    <StarOff className="h-4 w-4" />
                  )}
                </Button>
                {email.hasAttachment && <Paperclip className="h-4 w-4 text-muted-foreground" />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
