"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Paperclip, Star, StarOff } from "lucide-react"

interface MailListProps {
  selectedEmail: any;
  setSelectedEmail: (email: any) => void;
}

export default function MailList({ selectedEmail, setSelectedEmail }: MailListProps) {
  const [activeTab, setActiveTab] = useState("inbox")
  const [inboxEmails, setInboxEmails] = useState<any[]>([])
  const [openedEmails, setOpenedEmails] = useState<any[]>([])
  const [sentEmails, setSentEmails] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Main fetch function that shows loading state - for initial load
    const fetchEmails = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/mails')

        if (!response.ok) {
          throw new Error('Failed to fetch emails')
        }

        const data = await response.json()
        setInboxEmails(data.inbox || [])
        setOpenedEmails(data.opened || [])
        setSentEmails(data.sent || [])
        setError(null)
      } catch (err) {
        setError('Error loading emails. Please try again later.')
        console.error('Error fetching emails:', err)
      } finally {
        setLoading(false)
      }
    }

    // Background refresh function that doesn't show loading state
    const refreshEmailsSilently = async () => {
      try {
        const response = await fetch('/api/mails')

        if (!response.ok) {
          console.error('Failed to refresh emails')
          return
        }

        const data = await response.json()
        setInboxEmails(data.inbox || [])
        setOpenedEmails(data.opened || [])
        setSentEmails(data.sent || [])
      } catch (err) {
        console.error('Error refreshing emails:', err)
      }
    }

    // Initial fetch with loading indicator
    fetchEmails()

    // Set up interval to refresh emails silently every 3 seconds
    const intervalId = setInterval(refreshEmailsSilently, 3000)

    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  const handleEmailClick = async (email: any) => {
    setSelectedEmail(email)

    // Only mark as read if this is an inbox email and not already read
    if (activeTab === "inbox") {
      try {
        // Call the API to mark email as read
        const response = await fetch('/api/mails/read', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ emailId: email._id }),
        });

        if (response.ok) {
          // Update local state to reflect the change
          // Remove from inbox
          setInboxEmails(prevEmails =>
            prevEmails.filter(e => e._id !== email._id)
          );
          // Add to opened emails
          setOpenedEmails(prevOpened => [email, ...prevOpened]);
        } else {
          console.error('Failed to mark email as read');
        }
      } catch (err) {
        console.error('Error marking email as read:', err);
      }
    }
  }

  const handleStarClick = (e: React.MouseEvent, emailId: string) => {
    e.stopPropagation()
    // In a real app, you would toggle the starred status here
  }

  const renderLoadingState = () => (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2">Loading emails...</span>
    </div>
  )

  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center h-64 p-4 text-center">
      <p className="text-red-500 mb-4">{error}</p>
      <Button onClick={() => window.location.reload()}>Retry</Button>
    </div>
  )

  return (
    <div className="flex h-full w-full flex-col border-r md:w-1/2 lg:w-2/5">
      <Tabs defaultValue="inbox" className="w-full" onValueChange={setActiveTab}>
        <div className="border-b px-4 py-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inbox">
              Inbox
              <Badge className="ml-2 bg-primary" variant="secondary">
                {inboxEmails.filter(email => !email.read).length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
          </TabsList>
        </div>

        {loading ? renderLoadingState() : error ? renderErrorState() : (
          <>
            <TabsContent value="inbox" className="flex-1 overflow-auto p-0">
              <div className="flex items-center justify-between border-b px-4 py-2">
                <div className="flex items-center gap-2">
                  <Checkbox id="select-all" />
                  <label htmlFor="select-all" className="text-xs font-medium">
                    Select All
                  </label>
                </div>
                <Button variant="ghost" size="sm">
                  Refresh
                </Button>
              </div>
              <div className="divide-y">
                {inboxEmails.map((email) => (
                  <div
                    key={email._id}
                    className={`cursor-pointer p-4 transition-colors hover:bg-muted ${selectedEmail && selectedEmail._id === email._id ? "bg-muted" : ""
                      } ${!email.read ? "font-medium" : ""}`}
                    onClick={() => handleEmailClick(email)}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox className="mt-1" />
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`/placeholder.svg?height=32&width=32&text=${email.senderName.charAt(0)}`}
                          alt={email.senderName}
                        />
                        <AvatarFallback>{email.senderName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${!email.read ? "font-semibold" : ""}`}>{email.senderName}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(email.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <h3 className={`text-sm ${!email.read ? "font-semibold" : ""}`}>{email.subject}</h3>
                        <p className="line-clamp-2 text-xs text-muted-foreground">{email.message.slice(0, 100)}...</p>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => handleStarClick(e, email._id)}
                        >
                          {email.starred ? (
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ) : (
                            <StarOff className="h-4 w-4" />
                          )}
                        </Button>
                        {email.attachments && email.attachments.length > 0 &&
                          <Paperclip className="h-4 w-4 text-muted-foreground" />
                        }
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="sent" className="flex-1 overflow-auto p-0">
              <div className="flex items-center justify-between border-b px-4 py-2">
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
              <div className="divide-y">
                {sentEmails.map((email) => (
                  <div
                    key={email._id}
                    className={`cursor-pointer p-4 transition-colors hover:bg-muted ${selectedEmail && selectedEmail._id === email._id ? "bg-muted" : ""
                      }`}
                    onClick={() => handleEmailClick(email)}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox className="mt-1" />
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`/placeholder.svg?height=32&width=32&text=${email.to[0].charAt(0)}`}
                          alt={`To: ${email.to[0]}`}
                        />
                        <AvatarFallback>{email.to[0].charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">To: {email.to.join(", ")}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(email.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <h3 className="text-sm">{email.subject}</h3>
                        <p className="line-clamp-2 text-xs text-muted-foreground">{email.message.slice(0, 100)}...</p>
                      </div>
                      <div>
                        {email.attachments && email.attachments.length > 0 &&
                          <Paperclip className="h-4 w-4 text-muted-foreground" />
                        }
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="read" className="flex-1 overflow-auto p-0">
              <div className="flex items-center justify-between border-b px-4 py-2">
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
              <div className="divide-y">
                {openedEmails.map((email) => (
                  <div
                    key={email._id}
                    className={`cursor-pointer p-4 transition-colors hover:bg-muted ${selectedEmail && selectedEmail._id === email._id ? "bg-muted" : ""
                      }`}
                    onClick={() => handleEmailClick(email)}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox className="mt-1" />
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`/placeholder.svg?height=32&width=32&text=${email.senderName.charAt(0)}`}
                          alt={email.senderName}
                        />
                        <AvatarFallback>{email.senderName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{email.senderName}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(email.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <h3 className="text-sm">{email.subject}</h3>
                        <p className="line-clamp-2 text-xs text-muted-foreground">{email.message.slice(0, 100)}...</p>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => handleStarClick(e, email._id)}
                        >
                          {email.starred ? (
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ) : (
                            <StarOff className="h-4 w-4" />
                          )}
                        </Button>
                        {email.attachments && email.attachments.length > 0 &&
                          <Paperclip className="h-4 w-4 text-muted-foreground" />
                        }
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  )
}
