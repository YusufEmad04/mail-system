"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Reply, Forward, Trash2, Archive, Star, Download, Paperclip, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// This component receives the selected email as a prop
export default function MailPreview({ email }) {
  const [isComposing, setIsComposing] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [to, setTo] = useState("")
  const [cc, setCc] = useState("")
  const [bcc, setBcc] = useState("")
  const [subject, setSubject] = useState("")
  const [currentUserEmail, setCurrentUserEmail] = useState("")

  // Fetch current user's email when component mounts
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // Fetch user profile from API
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const userData = await response.json();
          setCurrentUserEmail(userData.email);
        } else {
          console.error('Failed to fetch user profile');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleReply = () => {
    setIsComposing(true)
    // Use the sender's email for the reply
    setTo(email.from)
    setSubject(`Re: ${email.subject}`)
  }

  const handleForward = () => {
    setIsComposing(true)
    setSubject(`Fwd: ${email.subject}`)
    setReplyText(
      `\n\n---------- Forwarded message ---------\nFrom: ${email.senderName} <${email.from}>\nDate: ${new Date(email.createdAt).toLocaleString()}\nSubject: ${email.subject}\nTo: ${email.to.join(", ")}\n\n${email.message}`,
    )
  }

  const handleSend = () => {
    // In a real app, you would send the email here
    setIsComposing(false)
    setReplyText("")
    setTo("")
    setCc("")
    setBcc("")
    setSubject("")
    // Show a success message
    alert("Email sent successfully!")
  }

  const formatEmailList = (emails: string[]) => {
    return emails ? emails.join(", ") : ""
  }

  // Format date from ISO string to readable format
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  // Check if the current user is the sender of the email
  const isCurrentUserSender = email && currentUserEmail === email.from;

  if (isComposing) {
    return (
      <div className="flex h-full w-full flex-col overflow-auto p-4 md:w-1/2 lg:w-3/5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Compose Email</h2>
          <Button variant="ghost" size="sm" onClick={() => setIsComposing(false)}>
            Cancel
          </Button>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="to" className="text-sm font-medium">
              To:
            </label>
            <input
              id="to"
              type="text"
              className="rounded-md border p-2"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="cc" className="text-sm font-medium">
              CC:
            </label>
            <input
              id="cc"
              type="text"
              className="rounded-md border p-2"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="bcc" className="text-sm font-medium">
              BCC:
            </label>
            <input
              id="bcc"
              type="text"
              className="rounded-md border p-2"
              value={bcc}
              onChange={(e) => setBcc(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="subject" className="text-sm font-medium">
              Subject:
            </label>
            <input
              id="subject"
              type="text"
              className="rounded-md border p-2"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message:
            </label>
            <textarea
              id="message"
              className="min-h-[200px] rounded-md border p-2"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsComposing(false)}>
              Discard
            </Button>
            <Button onClick={handleSend}>Send</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col overflow-auto p-4 md:w-1/2 lg:w-3/5">
      {email ? (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">{email.subject}</h2>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Star className={`h-5 w-5 ${email.starred ? "fill-yellow-400 text-yellow-400" : ""}`} />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Archive className="mr-2 h-4 w-4" />
                    <span>Archive</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Mark as unread</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="mb-4 flex items-start gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={`/placeholder.svg?height=40&width=40&text=${email.senderName?.charAt(0) || '?'}`}
                alt={email.senderName || 'Unknown'}
              />
              <AvatarFallback>{email.senderName?.charAt(0) || '?'}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex flex-col justify-between sm:flex-row">
                <div>
                  <h3 className="font-semibold">{email.senderName || 'Unknown Sender'}</h3>
                  <p className="text-sm text-muted-foreground">{email.from}</p>
                </div>
                <p className="text-sm text-muted-foreground">{formatDate(email.createdAt)}</p>
              </div>

              <div className="mt-2 space-y-1 text-sm">
                <div className="flex flex-wrap items-center gap-1">
                  <span className="font-medium">To:</span>
                  <span>{formatEmailList(email.to)}</span>
                </div>
                {email.cc && email.cc.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="font-medium">CC:</span>
                    <span>{formatEmailList(email.cc)}</span>
                  </div>
                )}
                {/* Only show BCC if current user is the sender */}
                {isCurrentUserSender && email.bcc && email.bcc.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="font-medium">BCC:</span>
                    <span>{formatEmailList(email.bcc)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div className="whitespace-pre-line">{email.message}</div>
          </div>

          {email.attachments && email.attachments.length > 0 && (
            <>
              <Separator className="my-4" />
              <div className="space-y-2">
                <h4 className="font-medium">Attachments</h4>
                <div className="flex flex-wrap gap-2">
                  {email.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center gap-2 rounded-md border p-2">
                      <Paperclip className="h-4 w-4" />
                      <div>
                        <p className="text-sm font-medium">{attachment.filename || attachment.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {attachment.size ? `${Math.round(attachment.size / 1024)} KB` : 'Unknown size'}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="ml-2">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            <Button onClick={handleReply}>
              <Reply className="mr-2 h-4 w-4" />
              Reply
            </Button>
            <Button variant="outline" onClick={handleForward}>
              <Forward className="mr-2 h-4 w-4" />
              Forward
            </Button>
            <Button variant="outline">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </>
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">Select an email to view</p>
        </div>
      )}
    </div>
  )
}
