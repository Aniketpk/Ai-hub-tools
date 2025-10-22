"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Loader2, RotateCcw, Search, Star, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { allTools } from "@/lib/tools-data"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI assistant with knowledge about all the AI tools in our hub. I can help you find tools, compare features, and answer questions about specific tools. Try asking me about tools like 'GPT-4 Turbo' or categories like 'image generation'. What would you like to know?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Enhanced response system with tool knowledge
  const getToolResponse = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    // Check if query is asking about specific tools
    const matchingTools = allTools.filter(tool => 
      tool.name.toLowerCase().includes(lowerQuery) ||
      tool.description.toLowerCase().includes(lowerQuery) ||
      tool.category.toLowerCase().includes(lowerQuery) ||
      tool.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
    
    if (matchingTools.length > 0) {
      const tool = matchingTools[0];
      return `I found information about **${tool.name}** for you:

${tool.description}

**Category:** ${tool.category}
**Rating:** ${tool.rating}/5 (${tool.reviews} reviews)
**Pricing:** ${tool.pricing}

${tool.longDescription ? tool.longDescription : ''}

Tags: ${tool.tags.join(', ')}

Would you like to know more about this tool or search for others?`;
    }
    
    // Check for category queries
    const categories = ["language models", "image generation", "development", "content creation", "video generation", "productivity"];
    const foundCategory = categories.find(cat => lowerQuery.includes(cat));
    
    if (foundCategory) {
      const categoryTools = allTools.filter(tool => tool.category.toLowerCase().includes(foundCategory));
      if (categoryTools.length > 0) {
        const topTools = categoryTools.sort((a, b) => b.rating - a.rating).slice(0, 3);
        const toolList = topTools.map(tool => `**${tool.name}** - ${tool.description} (Rating: ${tool.rating}/5)`).join('\n\n');
        return `Here are the top tools in the **${foundCategory}** category:

${toolList}

Would you like more details about any of these tools?`;
      }
    }
    
    // Default responses
    const defaultResponses = [
      "That's a great question! Let me think about that for a moment...",
      "I understand what you're asking. Here's my perspective on that topic...",
      "Interesting point! I'd be happy to help you explore this further...",
      "Based on what you've shared, I think there are several approaches we could consider...",
      "That's a complex topic with many facets. Let me break it down for you...",
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)] +
      ` Regarding "${query}", I think this is an important topic that deserves careful consideration. Would you like me to elaborate on any specific aspect?`;
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    // Simulate AI response delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      content: getToolResponse(userMessage.content),
      sender: "bot",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, botResponse])
    setIsLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        content:
          "Hello! I'm your AI assistant with knowledge about all the AI tools in our hub. I can help you find tools, compare features, and answer questions about specific tools. Try asking me about tools like 'GPT-4 Turbo' or categories like 'image generation'. What would you like to know?",
        sender: "bot",
        timestamp: new Date(),
      },
    ])
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">AI Assistant Chat</h3>
        </div>
        <Button variant="outline" size="sm" onClick={clearChat}>
          <RotateCcw className="h-4 w-4 mr-1" />
          Clear Chat
        </Button>
      </div>

      <Card className="border-2">
        <CardContent className="p-0">
          <ScrollArea className="h-96 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.sender === "bot" && (
                    <Avatar className="border-2 border-primary">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    <p
                      className={`text-xs mt-2 ${
                        message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {message.sender === "user" && (
                    <Avatar className="border-2 border-accent">
                      <AvatarFallback className="bg-accent text-accent-foreground">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="border-2 border-primary">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message here..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="border-2 focus:border-primary"
              />
              <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isLoading} size="sm">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Tips */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-2 text-sm">💡 Chat tips:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Ask about specific AI tools by name (e.g., "Tell me about GPT-4 Turbo")</li>
            <li>• Search tools by category (e.g., "Show me image generation tools")</li>
            <li>• Request recommendations based on your needs</li>
            <li>• Compare tools by asking about their features and ratings</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
