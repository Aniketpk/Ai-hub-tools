"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AIChatbot from "@/components/utilities/ai-chatbot"

export default function TestChatbotPage() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto py-8">
        <Card className="border-2">
          <CardHeader>
            <CardTitle>AI Chatbot Test</CardTitle>
          </CardHeader>
          <CardContent>
            <AIChatbot />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}