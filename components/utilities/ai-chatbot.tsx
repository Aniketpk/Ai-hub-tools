"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Loader2, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function AIChatbot() {
  const reduceMotion = Boolean(useReducedMotion())
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
  const [hydrated, setHydrated] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => setHydrated(true), [])

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
    const currentInput = inputMessage.trim()
    setInputMessage("")
    setIsLoading(true)

    try {
      // Build conversation history for context
      const conversationHistory = messages
        .filter(msg => msg.id !== "1") // Exclude initial greeting
        .map(msg => ({
          sender: msg.sender,
          content: msg.content
        }))

      let botContent = "";
      
      // Hybrid Logic: Use local Gemma for simple queries
      if (currentInput.toLowerCase().includes("simple") || currentInput.toLowerCase().includes("local") || currentInput.toLowerCase().includes("fast")) {
        try {
          const gemmaResponse = await fetch("/api/ai-hub", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: currentInput, mode: "local" }),
          })
          const data = await gemmaResponse.json()
          if (gemmaResponse.ok && data.result) {
            botContent = `[Gemma Local] ${data.result}`
          }
        } catch (e) {
          console.warn("Local Gemma not available, falling back to API", e)
        }
      }

      if (!botContent) {
        // Call the standard AI API (GPT-4/Claude)
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: currentInput,
            conversationHistory: conversationHistory,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to get AI response')
        }

        const data = await response.json()
        botContent = data.reply;
      }

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: botContent || "I apologize, but I couldn't generate a response. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botResponse])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: error instanceof Error ? error.message : "Sorry, there was an error. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
    <div className="flex h-[min(600px,85dvh)] min-h-0 w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-card/30 shadow-2xl backdrop-blur-md relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5 backdrop-blur-xl z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-primary blur-md opacity-40 animate-pulse" />
            <Avatar className="h-10 w-10 border-2 border-primary/50 relative bg-background">
              <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white">
                <Bot className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
          </div>
          <div>
            <h3 className="font-bold text-sm bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">AI Utility</h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-primary font-medium px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">Hybrid Active</span>
              <span className="text-[9px] text-white/40 uppercase tracking-tighter">Gemma + GPT-4</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={clearChat} className="hover:bg-white/5 text-muted-foreground hover:text-white rounded-full">
          <RotateCcw className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>

      {/* Chat Area — min-h-0 so the footer input stays visible inside flex layouts */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={reduceMotion ? false : { opacity: 0, y: 12, scale: .98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 22 }}
              className={`flex gap-3 ${message.sender === "user" ? "flex-row-reverse" : "flex-row"} group`}
            >
              <Avatar className={`h-8 w-8 border ${message.sender === "bot" ? "border-primary/20" : "border-white/10"} mt-1 scale-0 group-hover:scale-100 transition-transform duration-300`}>
                <AvatarFallback className={message.sender === "bot" ? "bg-primary/10 text-primary" : "bg-white/10"}>
                  {message.sender === "bot" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>

              <div className={`flex flex-col ${message.sender === "user" ? "items-end" : "items-start"} max-w-[80%]`}>
                <div
                  className={`rounded-2xl p-3 shadow-sm backdrop-blur-sm ${message.sender === "user"
                    ? "bg-gradient-to-br from-primary to-purple-600 text-white rounded-tr-none"
                    : "bg-white/5 border border-white/10 text-foreground rounded-tl-none hover:bg-white/10 transition-colors"
                    }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {hydrated ? message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                </span>
              </div>
            </motion.div>
          ))}

          <AnimatePresence>{isLoading && (
            <motion.div key="chat-processing" initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -6 }} className="flex gap-3">
              <Avatar className="h-8 w-8 border border-primary/20 mt-1">
                <AvatarFallback className="bg-primary/10 text-primary">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none p-3 flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce"></span>
                </div>
              </div>
            </motion.div>
          )}</AnimatePresence>
        </div>
      </div>

      {/* Input Area */}
      <div className="shrink-0 border-t border-white/5 bg-white/5 p-4 backdrop-blur-xl z-10">
        <div className="relative w-full">
          <Input
            type="text"
            placeholder="Ask about AI tools..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="h-12 w-full min-w-0 rounded-full border-white/10 bg-black/20 pr-14 transition-all placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
          />
          <Button
            type="button"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            size="icon"
            className="absolute right-1.5 top-1/2 size-9 -translate-y-1/2 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:scale-105 active:scale-95"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <div className="text-center mt-2">
          <span className="text-[10px] text-muted-foreground/50">AI can make mistakes. Please verify important information.</span>
        </div>
      </div>
    </div>
  )
}
