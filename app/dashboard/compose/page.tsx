"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Paperclip, X, Plus } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { Badge } from "@/components/ui/badge"

export default function ComposePage() {
  const router = useRouter()
  const [to, setTo] = useState("")
  const [toList, setToList] = useState<string[]>([])
  const [cc, setCc] = useState("")
  const [ccList, setCcList] = useState<string[]>([])
  const [bcc, setBcc] = useState("")
  const [bccList, setBccList] = useState<string[]>([])
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const [showCc, setShowCc] = useState(false)
  const [showBcc, setShowBcc] = useState(false)

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setAttachments((prev) => [...prev, ...newFiles])
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const addToList = (type: "to" | "cc" | "bcc") => {
    let value = ""
    let setter: React.Dispatch<React.SetStateAction<string>> = () => { }
    let list: string[] = []
    let listSetter: React.Dispatch<React.SetStateAction<string[]>> = () => { }

    switch (type) {
      case "to":
        value = to
        setter = setTo
        list = toList
        listSetter = setToList
        break
      case "cc":
        value = cc
        setter = setCc
        list = ccList
        listSetter = setCcList
        break
      case "bcc":
        value = bcc
        setter = setBcc
        list = bccList
        listSetter = setBccList
        break
    }

    if (value.trim() && isValidEmail(value.trim()) && !list.includes(value.trim())) {
      listSetter([...list, value.trim()])
      setter("")
    }
  }

  const removeFromList = (type: "to" | "cc" | "bcc", index: number) => {
    switch (type) {
      case "to":
        setToList(toList.filter((_, i) => i !== index))
        break
      case "cc":
        setCcList(ccList.filter((_, i) => i !== index))
        break
      case "bcc":
        setBccList(bccList.filter((_, i) => i !== index))
        break
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, type: "to" | "cc" | "bcc") => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addToList(type)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Submitting email...")
    e.preventDefault()

    // Validate that we have at least one recipient
    if (toList.length === 0) {
      alert("Please add at least one recipient")
      return
    }

    try {
      // Send request to API
      const response = await fetch('/api/mails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: toList,
          cc: ccList,
          bcc: bccList,
          subject,
          message,
          attachments: []
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Email sent successfully!")
        router.push("/dashboard")
      } else {
        alert(`Failed to send email: ${data.error}`)
      }
    } catch (error) {
      console.error("Error sending email:", error)
      alert("An error occurred while sending the email. Please try again.")
    }
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-4xl p-4">
        <Card>
          <CardHeader>
            <CardTitle>Compose New Email</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="to">To</Label>
                <div className="flex flex-wrap items-center gap-2 rounded-md border p-2">
                  {toList.map((email, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {email}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0"
                        onClick={() => removeFromList("to", index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                  <div className="flex flex-1 items-center gap-1">
                    <Input
                      id="to"
                      placeholder="Add recipient (press Enter or comma to add)"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, "to")}
                      className="border-0 p-0 focus-visible:ring-0"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => addToList("to")}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!showCc && (
                  <Button type="button" variant="link" className="h-auto p-0 text-sm" onClick={() => setShowCc(true)}>
                    Add Cc
                  </Button>
                )}
                {!showBcc && (
                  <Button type="button" variant="link" className="h-auto p-0 text-sm" onClick={() => setShowBcc(true)}>
                    Add Bcc
                  </Button>
                )}
              </div>

              {showCc && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="cc">Cc</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={() => {
                        setShowCc(false)
                        setCc("")
                        setCcList([])
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 rounded-md border p-2">
                    {ccList.map((email, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {email}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0"
                          onClick={() => removeFromList("cc", index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                    <div className="flex flex-1 items-center gap-1">
                      <Input
                        id="cc"
                        placeholder="Add CC recipient (press Enter or comma to add)"
                        value={cc}
                        onChange={(e) => setCc(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, "cc")}
                        className="border-0 p-0 focus-visible:ring-0"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => addToList("cc")}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {showBcc && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="bcc">Bcc</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={() => {
                        setShowBcc(false)
                        setBcc("")
                        setBccList([])
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 rounded-md border p-2">
                    {bccList.map((email, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {email}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0"
                          onClick={() => removeFromList("bcc", index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                    <div className="flex flex-1 items-center gap-1">
                      <Input
                        id="bcc"
                        placeholder="Add BCC recipient (press Enter or comma to add)"
                        value={bcc}
                        onChange={(e) => setBcc(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, "bcc")}
                        className="border-0 p-0 focus-visible:ring-0"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => addToList("bcc")}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Email subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Write your message here..."
                  className="min-h-[200px]"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="attachments">Attachments</Label>
                <div className="flex flex-wrap gap-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 rounded-md border p-2">
                      <Paperclip className="h-4 w-4" />
                      <span className="text-sm">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        onClick={() => removeAttachment(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" className="flex items-center gap-2" asChild>
                    <label>
                      <Paperclip className="h-4 w-4" />
                      <span>Attach Files</span>
                      <input type="file" className="sr-only" multiple onChange={handleAttachmentChange} />
                    </label>
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
                Discard
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline">
                  Save as Draft
                </Button>
                <Button type="submit">Send Email</Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}
