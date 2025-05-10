"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Paperclip, Star, StarOff } from "lucide-react"

// Sample data for read emails
const readEmails = [
  {
    id: "r1",
    from: "Bob Smith",
    email: "bob@example.com",
    subject: "Project Proposal Review",
    preview:
      "I've reviewed the proposal and have some feedback. Overall, it looks good but there are a few areas that need improvement.",
    date: "Yesterday",
    read: true,
    starred: false,
    hasAttachment: false,
    to: ["john.doe@example.com"],
    cc: [],
    bcc: [],
    content: `
      Hi John,
      
      I've reviewed the proposal and have some feedback. Overall, it looks good but there are a few areas that need improvement:
      
      - The budget section needs more detail
      - Timeline seems a bit aggressive
      - We should add more about risk mitigation
      
      Let's discuss these points in our next meeting. I think with a few adjustments, we'll be ready to present to the client.
      
      Regards,
      Bob
    `,
  },
  {
    id: "r2",
    from: "Carol Williams",
    email: "carol@example.com",
    subject: "Client Feedback on Latest Deliverable",
    preview:
      "The client has provided feedback on our latest deliverable. They're very happy with the results but have a few minor suggestions.",
    date: "May 20",
    read: true,
    starred: false,
    hasAttachment: true,
    to: ["john.doe@example.com"],
    cc: ["team@example.com"],
    bcc: ["manager@example.com"],
    content: `
      Hi John,
      
      Great news! The client has provided feedback on our latest deliverable. They're very happy with the results but have a few minor suggestions:
      
      1. They'd like to see more vibrant colors in the UI
      2. The loading time on the dashboard could be improved
      3. They suggested adding a help section for new users
      
      These are all relatively small changes, and they've approved the invoice for this milestone. Let's implement these changes in the next sprint.
      
      Great work to you and the team!
      
      Best,
      Carol
    `,
    attachments: [{ name: "client-feedback.pdf", size: "1.2 MB" }],
  },
  {
    id: "r3",
    from: "Eva Martinez",
    email: "eva@example.com",
    subject: "Holiday Schedule",
    preview:
      "Please find attached the holiday schedule for the upcoming quarter. Let me know if you have any questions.",
    date: "May 15",
    read: true,
    starred: false,
    hasAttachment: true,
    to: ["all-staff@example.com"],
    cc: [],
    bcc: [],
    content: `
      Dear Team,
      
      Please find attached the holiday schedule for the upcoming quarter. All team members should submit their time-off requests by the end of this month.
      
      Remember that we have a company-wide shutdown from December 24th to January 2nd, so you don't need to request time off for that period.
      
      Let me know if you have any questions.
      
      Best regards,
      Eva Martinez
      HR Department
    `,
    attachments: [{ name: "holiday-schedule-q3.pdf", size: "845 KB" }],
  },
  {
    id: "r4",
    from: "Frank Johnson",
    email: "frank@example.com",
    subject: "Team Building Event",
    preview:
      "We're planning a team building event for next month. Please fill out the survey to indicate your preferences.",
    date: "May 12",
    read: true,
    starred: true,
    hasAttachment: false,
    to: ["department@example.com"],
    cc: [],
    bcc: [],
    content: `
      Hello Team,
      
      We're planning a team building event for next month. To make sure we plan something everyone will enjoy, please fill out the survey linked below to indicate your preferences.
      
      Survey link: https://example.com/team-survey
      
      Options we're considering:
      - Outdoor adventure day
      - Cooking class
      - Escape room challenge
      - Sports tournament
      
      Please submit your responses by the end of the week.
      
      Thanks,
      Frank
    `,
  },
  {
    id: "r5",
    from: "Grace Lee",
    email: "grace@example.com",
    subject: "New Office Layout",
    preview:
      "The facilities team has finalized the new office layout. Please review the attached floor plan and let me know if you have any concerns.",
    date: "May 10",
    read: true,
    starred: false,
    hasAttachment: true,
    to: ["john.doe@example.com"],
    cc: ["facilities@example.com"],
    bcc: [],
    content: `
      Hi John,
      
      The facilities team has finalized the new office layout. Please review the attached floor plan and let me know if you have any concerns.
      
      Your team will be located in the north wing, with dedicated meeting rooms nearby. We've also included the collaborative space you requested.
      
      The move is scheduled for the last weekend of this month. More details about the moving process will be shared next week.
      
      Best regards,
      Grace
    `,
    attachments: [
      { name: "new-office-layout.pdf", size: "3.2 MB" },
      { name: "moving-checklist.docx", size: "425 KB" },
    ],
  },
]

export default function ReadMailList() {
  const [selectedEmail, setSelectedEmail] = useState(readEmails[0])

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
        <h2 className="text-lg font-semibold">Read</h2>
        <div className="flex items-center gap-2">
          <Checkbox id="select-all-read" />
          <label htmlFor="select-all-read" className="text-xs font-medium">
            Select All
          </label>
        </div>
        <Button variant="ghost" size="sm">
          Refresh
        </Button>
      </div>
      <div className="divide-y overflow-auto">
        {readEmails.map((email) => (
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
                <AvatarImage
                  src={`/placeholder.svg?height=32&width=32&text=${email.from.charAt(0)}`}
                  alt={email.from}
                />
                <AvatarFallback>{email.from.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{email.from}</span>
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
