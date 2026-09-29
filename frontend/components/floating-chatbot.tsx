"use client"

import { useState } from "react"
import { MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import AIChatbot from "@/components/utilities/ai-chatbot"

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg z-50"
        size="icon"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">Open AI Chatbot</span>
      </Button>

      {/* Chatbot Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:items-end sm:justify-end">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <Card className="relative z-50 flex h-[80vh] max-h-[90dvh] w-full max-w-md min-h-0 flex-col sm:h-[70vh]">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">AI Assistant</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <CardContent className="flex min-h-0 flex-1 flex-col overflow-hidden p-0">
              <AIChatbot />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}