"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  Brain,
  Star,
  Users,
  ExternalLink,
  Heart,
  Share2,
  Flag,
  ChevronLeft,
  Globe,
  Shield,
  Zap,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth-context"
import { recommendationEngine } from "@/lib/recommendation-engine"
import { SimilarTools } from "@/components/similar-tools"
import ReviewForm from "@/components/review-form"

// Mock data for tools - in real app, this would come from API
const toolsData = {
  "1": {
    id: "1",
    name: "GPT-4 Turbo",
    description:
      "Advanced language model for text generation, analysis, and conversation with improved reasoning capabilities and extended context window.",
    longDescription:
      "GPT-4 Turbo represents the latest advancement in large language models, offering unprecedented capabilities in text generation, analysis, and conversational AI. With its extended context window of 128,000 tokens, it can process and understand much longer documents and conversations while maintaining coherence and accuracy throughout.",
    category: "Language Models",
    rating: 4.8,
    reviews: 2847,
    pricing: "Pay-per-use",
    website: "https://openai.com/gpt-4",
    image: "/placeholder-xoj99.png",
    tags: ["Text Generation", "Analysis", "Chatbot", "API"],
    features: [
      "Extended 128K context window",
      "Improved reasoning capabilities",
      "Multimodal input support",
      "Function calling",
      "JSON mode output",
      "Reproducible outputs",
    ],
    useCases: [
      "Content creation and editing",
      "Code generation and debugging",
      "Data analysis and insights",
      "Customer support automation",
      "Educational tutoring",
      "Creative writing assistance",
    ],
    pros: ["Exceptional text quality", "Large context window", "Versatile applications", "Strong reasoning abilities"],
    cons: ["Can be expensive for high usage", "Occasional hallucinations", "Rate limits on API"],
    lastUpdated: "2024-01-15",
    developer: "OpenAI",
    supportedLanguages: ["English", "Spanish", "French", "German", "Chinese", "Japanese", "+50 more"],
  },
}

const mockReviews = [
  {
    id: 1,
    user: { name: "Sarah Chen", avatar: "SC", joinDate: "2023-06-15" },
    rating: 5,
    title: "Game-changer for content creation",
    content:
      "GPT-4 Turbo has completely transformed my content creation workflow. The quality of output is consistently excellent, and the extended context window means I can work with much longer documents without losing coherence.",
    date: "2024-01-10",
    helpful: 24,
    verified: true,
    tags: ["Content Creation", "Productivity"],
  },
  {
    id: 2,
    user: { name: "Marcus Rodriguez", avatar: "MR", joinDate: "2023-03-22" },
    rating: 4,
    title: "Excellent for coding assistance",
    content:
      "As a developer, I find GPT-4 Turbo incredibly helpful for code generation and debugging. It understands context well and provides practical solutions. The only downside is the cost for heavy usage.",
    date: "2024-01-08",
    helpful: 18,
    verified: true,
    tags: ["Development", "Code Generation"],
  },
  {
    id: 3,
    user: { name: "Emily Watson", avatar: "EW", joinDate: "2023-09-10" },
    rating: 5,
    title: "Perfect for research and analysis",
    content:
      "The analytical capabilities are outstanding. I use it for research synthesis and data analysis, and it consistently provides insightful and accurate results. Highly recommend for academic and business use.",
    date: "2024-01-05",
    helpful: 31,
    verified: false,
    tags: ["Research", "Analysis"],
  },
]

export default function ToolDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [tool, setTool] = useState(null)
  const [reviews, setReviews] = useState(mockReviews)
  const [isFavorited, setIsFavorited] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)

  useEffect(() => {
    const toolData = toolsData[params.id as string]
    if (toolData) {
      setTool(toolData)
      if (user) {
        recommendationEngine.trackToolView(user.id, toolData.id)
      }
    }
  }, [params.id, user])

  if (!tool) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading tool details...</p>
        </div>
      </div>
    )
  }

  const ratingDistribution = [
    { stars: 5, count: 1420, percentage: 85 },
    { stars: 4, count: 284, percentage: 10 },
    { stars: 3, count: 57, percentage: 3 },
    { stars: 2, count: 28, percentage: 1 },
    { stars: 1, count: 14, percentage: 1 },
  ]

  const handleReviewSubmit = (reviewData) => {
    const newReview = {
      id: reviews.length + 1,
      user: {
        name: user?.name || "Anonymous",
        avatar: user?.name?.charAt(0) || "A",
        joinDate: user?.joinDate || new Date().toISOString(),
      },
      rating: reviewData.rating,
      title: reviewData.title,
      content: reviewData.content,
      date: new Date().toISOString().split("T")[0],
      helpful: 0,
      verified: true,
      tags: reviewData.tags || [],
    }
    setReviews([newReview, ...reviews])
    setShowReviewForm(false)

    if (user) {
      recommendationEngine.trackToolRating(user.id, tool.id, reviewData.rating)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <Brain className="h-6 w-6 text-primary" />
                <Link
                  href="/"
                  className="text-lg font-serif font-black text-foreground hover:text-primary transition-colors"
                >
                  AI Tools Hub
                </Link>
              </div>
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
        {/* Tool Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-start gap-6 mb-6">
                <img
                  src={tool.image || "/placeholder.svg"}
                  alt={tool.name}
                  className="w-24 h-24 rounded-xl border-2 border-border object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-serif font-black text-foreground">{tool.name}</h1>
                    <Badge variant="secondary" className="text-sm">
                      {tool.category}
                    </Badge>
                  </div>
                  <p className="text-xl text-muted-foreground mb-4 leading-relaxed">{tool.description}</p>
                  <div className="flex items-center gap-6 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${
                              star <= Math.floor(tool.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-lg font-semibold">{tool.rating}</span>
                      <span className="text-muted-foreground">({tool.reviews.toLocaleString()} reviews)</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tool.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Panel */}
            <Card className="lg:w-80 border-2">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Pricing</span>
                    <span className="font-semibold text-accent">{tool.pricing}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Developer</span>
                    <span className="font-semibold">{tool.developer}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last Updated</span>
                    <span className="font-semibold">{new Date(tool.lastUpdated).toLocaleDateString()}</span>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Button className="w-full" size="lg" asChild>
                      <a href={tool.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit Website
                      </a>
                    </Button>

                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsFavorited(!isFavorited)}
                        className={isFavorited ? "text-red-500 border-red-200" : ""}
                      >
                        <Heart className={`h-4 w-4 ${isFavorited ? "fill-red-500" : ""}`} />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Flag className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({tool.reviews})</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="font-serif">About {tool.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">{tool.longDescription}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-serif font-semibold mb-3 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      Key Features
                    </h4>
                    <ul className="space-y-2">
                      {tool.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-serif font-semibold mb-3 flex items-center gap-2">
                      <Globe className="h-5 w-5 text-primary" />
                      Use Cases
                    </h4>
                    <ul className="space-y-2">
                      {tool.useCases.map((useCase, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{useCase}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="font-serif text-green-600">Pros</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tool.pros.map((pro, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="font-serif text-orange-600">Cons</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tool.cons.map((con, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{con}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2">
              <CardContent className="p-6">
                <SimilarTools toolId={tool.id} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Rating Summary */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="font-serif">Rating Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-serif font-bold text-primary mb-2">{tool.rating}</div>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= Math.floor(tool.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground">{tool.reviews.toLocaleString()} reviews</p>
                  </div>

                  <div className="space-y-2">
                    {ratingDistribution.map((rating) => (
                      <div key={rating.stars} className="flex items-center gap-3">
                        <span className="text-sm w-8">{rating.stars}★</span>
                        <Progress value={rating.percentage} className="flex-1" />
                        <span className="text-sm text-muted-foreground w-12">{rating.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Review Actions */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-serif font-bold">User Reviews</h3>
                  {user && (
                    <Button onClick={() => setShowReviewForm(true)}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Write Review
                    </Button>
                  )}
                </div>

                {showReviewForm && (
                  <ReviewForm onSubmit={handleReviewSubmit} onCancel={() => setShowReviewForm(false)} />
                )}

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id} className="border-2">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="border-2 border-primary">
                            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                              {review.user.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold">{review.user.name}</h4>
                              {review.verified && (
                                <Badge variant="secondary" className="text-xs">
                                  <Shield className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 ${
                                      star <= review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">{review.date}</span>
                            </div>
                            <h5 className="font-semibold mb-2">{review.title}</h5>
                            <p className="text-muted-foreground leading-relaxed mb-3">{review.content}</p>
                            <div className="flex items-center gap-4">
                              <div className="flex flex-wrap gap-2">
                                {review.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <Button variant="ghost" size="sm" className="ml-auto">
                                <Users className="h-4 w-4 mr-1" />
                                Helpful ({review.helpful})
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="font-serif">Detailed Features</CardTitle>
                <CardDescription>Comprehensive breakdown of {tool.name}'s capabilities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-serif font-semibold mb-4">Technical Specifications</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Context Window</span>
                        <span className="font-semibold">128,000 tokens</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Model Type</span>
                        <span className="font-semibold">Transformer</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">API Access</span>
                        <span className="font-semibold">REST API</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rate Limits</span>
                        <span className="font-semibold">Tier-based</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-serif font-semibold mb-4">Supported Languages</h4>
                    <div className="flex flex-wrap gap-2">
                      {tool.supportedLanguages.slice(0, 8).map((lang) => (
                        <Badge key={lang} variant="secondary" className="text-sm">
                          {lang}
                        </Badge>
                      ))}
                      <Badge variant="outline" className="text-sm">
                        +{tool.supportedLanguages.length - 8} more
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alternatives" className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="font-serif">Similar Tools</CardTitle>
                <CardDescription>AI tools with similar capabilities and use cases</CardDescription>
              </CardHeader>
              <CardContent>
                <SimilarTools toolId={tool.id} limit={6} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
