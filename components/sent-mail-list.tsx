"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Paperclip, Star, StarOff } from "lucide-react"

// Sample data for sent emails
const sentEmails = [
  {
    id: "s1",
    to: "Alice Johnson",
    email: "alice@example.com",
    subject: "Re: Weekly Team Meeting",
    preview: "Thanks for the reminder. I'll be there with my updates ready.",
    date: "11:45 AM",
    read: true,
    starred: false,
    hasAttachment: false,
    cc: ["team@example.com"],
    bcc: [],
    content: `
      Hi Alice,
      
      Thanks for the reminder. I'll be there with my updates ready.
      
      I'd also like to discuss the new feature request from the product team during the meeting.
      
      See you tomorrow,
      John
    `,
  },
  {
    id: "s2",
    to: "Bob Smith",
    email: "bob@example.com",
    subject: "Re: Project Proposal Review",
    preview: "Thanks for your feedback. I'll make the suggested changes and send you an updated version by tomorrow.",
    date: "Yesterday",
    read: true,
    starred: false,
    hasAttachment: false,
    cc: [],
    bcc: [],
    content: `
      Hi Bob,
      
      Thanks for your feedback. I'll make the suggested changes and send you an updated version by tomorrow.
      
      I agree that the timeline is aggressive, but I think we can make it work if we prioritize correctly.
      
      Best,
      John
    `,
  },
  {
    id: "s3",
    to: "Marketing Team",
    email: "marketing@example.com",
    subject: "Q3 Marketing Strategy",
    preview: "Attached is the Q3 marketing strategy document for your review. Please provide feedback by Friday.",
    date: "May 21",
    read: true,
    starred: true,
    hasAttachment: true,
    cc: ["manager@example.com"],
    bcc: ["ceo@example.com"],
    content: `
      Hi Marketing Team,
      
      Attached is the Q3 marketing strategy document for your review. Please provide feedback by Friday.
      
      Key points to focus on:
      
      1. Social media campaign timeline
      2. Budget allocation
      3. Performance metrics
      
      Let me know if you have any questions.
      
      Best regards,
      John
    `,
    attachments: [
      { name: "Q3-Marketing-Strategy.pdf", size: "2.4 MB" },
      { name: "Budget-Breakdown.xlsx", size: "1.1 MB" },
    ],
  },
  {
    id: "s4",
    to: "David Brown",
    email: "david@example.com",
    subject: "Vacation Request",
    preview: "I'd like to request vacation time from July 15-22. Please let me know if this works with our schedule.",
    date: "May 18",
    read: true,
    starred: false,
    hasAttachment: false,
    cc: ["hr@example.com"],
    bcc: [],
    content: `
      Hi David,
      
      I'd like to request vacation time from July 15-22. Please let me know if this works with our schedule.
      
      I've already completed most of my deliverables for that period, and I can ensure a smooth handover before I leave.
      
      Thanks,
      John
    `,
  },
  {
    id: "s5",
    to: "Client Services",
    email: "client-services@example.com",
    subject: "Client Feedback Implementation Plan",
    preview:
      "Here's the implementation plan for the recent client feedback. I've prioritized the items based on impact.",
    date: "May 15",
    read: true,
    starred: true,
    hasAttachment: true,
    cc: ["project-manager@example.com"],
    bcc: [],
    content: `
      Hello Client Services Team,
      
      Here's the implementation plan for the recent client feedback. I've prioritized the items based on impact and effort required.
      
      High priority items:
      - Dashboard performance optimization
      - User profile enhancement
      - Mobile responsiveness fixes
      
      Medium priority items:
      - Additional filter options
      - Export functionality improvements
      
      Low priority items:
      - UI color scheme adjustments
      - Additional report templates
      
      Please review and let me know if you agree with this prioritization.
      
      Best regards,
      John
    `,
    attachments: [{ name: "Implementation-Plan.pdf", size: "1.8 MB" }],
  },
]

export default function SentMailList() {
  const [selectedEmail, setSelectedEmail] = useState(sentEmails[0])

  const handleEmailClick = (email: any) => {
    setSelectedEmail(email)
  }

  const handleStarClick = (e: React.MouseEvent, emailId: string) => {
    e.stopPropagation()
    // In a real app, you would toggle the starred status here
  }

  return (
    <div className="flex h-full w-full flex-col border-r md:w-1/2 lg:w-2/5">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <h2 className="text-lg font-semibold">Sent</h2>
        <div className="flex items-center gap-2">
          <Checkbox id="select-all-sent" />
          <label htmlFor="select-all-sent" className="text-xs font-medium">
            Select All
          </label>
        </div>
        <Button variant="ghost" size="sm">
          Refresh
        </Button>
      </div>
      <div className="divide-y overflow-auto">
        {sentEmails.map((email) => (
          <div
            key={email.id}
            className={`cursor-pointer p-4 transition-colors hover:bg-muted ${
              selectedEmail.id === email.id ? "bg-muted" : ""
            }`}
            onClick={() => handleEmailClick(email)}
          >
            <div className="flex items-start gap-3">
              <Checkbox className="mt-1" />
              <Avatar className="h-8 w-8">
                <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${email.to.charAt(0)}`} alt={email.to} />
                <AvatarFallback>{email.to.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm">To: {email.to}</span>
                  <span className="text-xs text-muted-foreground">{email.date}</span>
                </div>
                <h3 className="text-sm">{email.subject}</h3>
                <p className="line-clamp-2 text-xs text-muted-foreground">{email.preview}</p>
              </div>
              <div className="flex flex-col items-center gap-2">
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
