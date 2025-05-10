"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Paperclip, ArchiveRestore } from "lucide-react"

// Sample data for trash emails
const trashEmails = [
  {
    id: "t1",
    from: "Newsletter",
    email: "newsletter@example.com",
    subject: "Weekly Newsletter: Tech Updates",
    preview: "Check out the latest tech news and updates from around the industry...",
    date: "10:30 AM",
    hasAttachment: false,
    to: ["john.doe@example.com"],
    cc: [],
    bcc: [],
    content: `
      Check out the latest tech news and updates from around the industry:

      - New AI breakthrough in natural language processing
      - Top 10 programming languages of 2023
      - Upcoming tech conferences and events
      - Job opportunities in the tech sector

      Click here to read more.
    `,
  },
  {
    id: "t2",
    from: "Subscription Service",
    email: "subscriptions@example.com",
    subject: "Your Subscription is About to Expire",
    preview: "Your premium subscription is set to expire in 7 days. Renew now to avoid interruption...",
    date: "Yesterday",
    hasAttachment: false,
    to: ["john.doe@example.com"],
    cc: [],
    bcc: [],
    content: `
      Your premium subscription is set to expire in 7 days. Renew now to avoid interruption to your service.

      Subscription details:
      - Plan: Premium
      - Expiration: June 1, 2023
      - Monthly cost: $9.99

      Click here to renew your subscription.
    `,
  },
  {
    id: "t3",
    from: "Social Media",
    email: "notifications@socialmedia.com",
    subject: "You have 5 new notifications",
    preview: "Check your account for new friend requests, comments, and likes...",
    date: "May 20",
    hasAttachment: false,
    to: ["john.doe@example.com"],
    cc: [],
    bcc: [],
    content: `
      Check your account for new friend requests, comments, and likes.

      Recent activity:
      - Jane Smith commented on your post
      - 3 people liked your photo
      - You have 2 new friend requests
      - Your post was shared 5 times

      Log in to view all notifications.
    `,
  },
  {
    id: "t4",
    from: "Old Client",
    email: "oldclient@example.com",
    subject: "Past Project Files",
    preview: "Here are the files from our project last year. I thought you might want them for reference...",
    date: "May 18",
    hasAttachment: true,
    to: ["john.doe@example.com"],
    cc: [],
    bcc: [],
    content: `
      Here are the files from our project last year. I thought you might want them for reference.

      It was great working with you on this project. Let me know if you need anything else from our past collaboration.

      Best regards,
      Old Client
    `,
    attachments: [{ name: "project-archive.zip", size: "15.7 MB" }],
  },
  {
    id: "t5",
    from: "Recruiter",
    email: "recruiter@example.com",
    subject: "Job Opportunity",
    preview: "I came across your profile and wanted to discuss a potential job opportunity...",
    date: "May 15",
    hasAttachment: false,
    to: ["john.doe@example.com"],
    cc: [],
    bcc: [],
    content: `
      I came across your profile and wanted to discuss a potential job opportunity that might be a good fit for your skills and experience.

      The role is for a Senior Developer at a growing tech company. Key details:
      - Competitive salary
      - Remote work options
      - Comprehensive benefits package
      - Opportunity for growth

      If you're interested, please reply with your availability for a brief call.

      Best regards,
      Recruiter
    `,
  },
]

export default function TrashMailList() {
  const [selectedEmail, setSelectedEmail] = useState(trashEmails[0])

  const handleEmailClick = (email: any) => {
    setSelectedEmail(email)
  }

  const handleRestoreClick = (e: React.MouseEvent, emailId: string) => {
    e.stopPropagation()
    // In a real app, you would restore the email here
  }

  return (
    <div className="flex h-full w-full flex-col border-r md:w-1/2 lg:w-2/5">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <h2 className="text-lg font-semibold">Trash</h2>
        <div className="flex items-center gap-2">
          <Checkbox id="select-all-trash" />
          <label htmlFor="select-all-trash" className="text-xs font-medium">
            Select All
          </label>
        </div>
        <Button variant="ghost" size="sm">
          Empty Trash
        </Button>
      </div>
      <div className="divide-y overflow-auto">
        {trashEmails.map((email) => (
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => handleRestoreClick(e, email.id)}
                  title="Restore from trash"
                >
                  <ArchiveRestore className="h-4 w-4" />
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
