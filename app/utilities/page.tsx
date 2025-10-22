"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Brain,
  FileText,
  Code,
  MessageSquare,
  ImageIcon,
  Languages,
  Lightbulb,
  ChevronRight,
  Zap,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import TextSummarizer from "@/components/utilities/text-summarizer"
import CodeGenerator from "@/components/utilities/code-generator"
import AIChatbot from "@/components/utilities/ai-chatbot"
import ImageAnalyzer from "@/components/utilities/image-analyzer"
import LanguageTranslator from "@/components/utilities/language-translator"
import { useAuth } from "@/lib/auth-context"

const utilities = [
  {
    id: "summarizer",
    name: "Text Summarizer",
    description: "Condense long articles, documents, and texts into concise summaries",
    icon: FileText,
    category: "Text Processing",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    popular: true,
  },
  {
    id: "code-generator",
    name: "Code Generator",
    description: "Generate code snippets, functions, and complete programs in multiple languages",
    icon: Code,
    category: "Development",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    popular: true,
  },
  {
    id: "chatbot",
    name: "AI Assistant",
    description: "Chat with an intelligent AI assistant for questions, brainstorming, and support",
    icon: MessageSquare,
    category: "Conversation",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    popular: true,
  },
  {
    id: "image-analyzer",
    name: "Image Analyzer",
    description: "Analyze and describe images, extract text, and identify objects",
    icon: ImageIcon,
    category: "Vision",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    popular: false,
  },
  {
    id: "translator",
    name: "Language Translator",
    description: "Translate text between multiple languages with context awareness",
    icon: Languages,
    category: "Language",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    popular: false,
  },
  {
    id: "idea-generator",
    name: "Idea Generator",
    description: "Generate creative ideas for projects, content, and business solutions",
    icon: Lightbulb,
    category: "Creativity",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    popular: false,
  },
]

export default function UtilitiesPage() {
  const [activeUtility, setActiveUtility] = useState("summarizer")
  const { user } = useAuth()

  const renderUtilityComponent = () => {
    try {
      switch (activeUtility) {
        case "summarizer":
          return <TextSummarizer />
        case "code-generator":
          return <CodeGenerator />
        case "chatbot":
          return <AIChatbot />
        case "image-analyzer":
          return <ImageAnalyzer />
        case "translator":
          return <LanguageTranslator />
        default:
          return <TextSummarizer />
      }
    } catch (error) {
      console.error('Error rendering utility component:', error)
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">This utility is temporarily unavailable. Please try again later.</p>
        </div>
      )
    }
  }

  const activeUtil = utilities.find((u) => u.id === activeUtility)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 hover:text-primary transition-colors">
                <Brain className="h-6 w-6 text-primary" />
                <span className="text-lg font-serif font-black text-foreground">AI Tools Hub</span>
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground font-semibold">AI Utilities</span>
            </div>
            <div className="flex items-center space-x-3">
              {user ? (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-serif font-black text-foreground">AI Utilities</h1>
            <Sparkles className="h-8 w-8 text-accent" />
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Powerful AI-powered utilities at your fingertips. Boost your productivity with our collection of intelligent
            tools for text processing, code generation, and creative tasks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Utilities Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-2 sticky top-24">
              <CardHeader>
                <CardTitle className="font-serif flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Available Utilities
                </CardTitle>
                <CardDescription>Choose an AI utility to get started</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {utilities.map((utility) => (
                    <button
                      key={utility.id}
                      onClick={() => setActiveUtility(utility.id)}
                      className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                        activeUtility === utility.id
                          ? `${utility.bgColor} ${utility.borderColor} border-2`
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <utility.icon className={`h-5 w-5 ${utility.color}`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-sm">{utility.name}</h3>
                            {utility.popular && (
                              <Badge variant="secondary" className="text-xs">
                                Popular
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{utility.category}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Utility Area */}
          <div className="lg:col-span-3">
            <Card className="border-2 min-h-[600px]">
              <CardHeader className={`${activeUtil?.bgColor} ${activeUtil?.borderColor} border-b-2`}>
                <div className="flex items-center gap-3">
                  {activeUtil && <activeUtil.icon className={`h-6 w-6 ${activeUtil.color}`} />}
                  <div>
                    <CardTitle className="font-serif text-xl">{activeUtil?.name}</CardTitle>
                    <CardDescription className="text-base">{activeUtil?.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">{renderUtilityComponent()}</CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">Why Use Our AI Utilities?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 text-center">
              <CardContent className="p-6">
                <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-serif font-semibold mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Get instant results with our optimized AI models and efficient processing
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 text-center">
              <CardContent className="p-6">
                <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-serif font-semibold mb-2">Intelligent</h3>
                <p className="text-muted-foreground">
                  Powered by state-of-the-art AI models for accurate and contextual results
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 text-center">
              <CardContent className="p-6">
                <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-serif font-semibold mb-2">Easy to Use</h3>
                <p className="text-muted-foreground">
                  Simple, intuitive interfaces that anyone can use without technical knowledge
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
