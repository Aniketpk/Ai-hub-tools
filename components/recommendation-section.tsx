"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { recommendationEngine, type RecommendationScore } from "@/lib/recommendation-engine"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Users, Sparkles } from "lucide-react"
import Link from "next/link"
import type { Tool } from "@/lib/tools-data"

interface RecommendationSectionProps {
  title?: string
  subtitle?: string
  limit?: number
  showReasons?: boolean
}

export function RecommendationSection({
  title = "Recommended for You",
  subtitle = "Personalized AI tools based on your interests",
  limit = 6,
  showReasons = true,
}: RecommendationSectionProps) {
  const { user } = useAuth()
  const [recommendations, setRecommendations] = useState<RecommendationScore[]>([])
  const [fallbackTools, setFallbackTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRecommendations = () => {
      if (user) {
        // Get personalized recommendations for logged-in users
        const personalizedRecs = recommendationEngine.getPersonalizedRecommendations(user.id, limit)
        setRecommendations(personalizedRecs)
      } else {
        // Get trending tools for anonymous users
        const trending = recommendationEngine.getTrendingTools(limit)
        setFallbackTools(trending)
      }
      setLoading(false)
    }

    loadRecommendations()
  }, [user, limit])

  if (loading) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    )
  }

  const toolsToShow = user ? recommendations.map((r) => r.tool) : fallbackTools
  const displayTitle = user ? title : "Trending AI Tools"
  const displaySubtitle = user ? subtitle : "Popular tools in the AI community"

  if (toolsToShow.length === 0) {
    return null
  }

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <h3 className="text-3xl font-serif font-bold">{displayTitle}</h3>
            </div>
            <p className="text-muted-foreground">{displaySubtitle}</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/search">View All Tools</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {toolsToShow.map((tool, index) => {
            const recommendation = user ? recommendations[index] : null

            return (
              <Card
                key={tool.id}
                className="hover:shadow-xl transition-all duration-300 group border-2 hover:border-primary/30"
              >
                <CardHeader className="p-0">
                  <img
                    src={tool.image || "/placeholder.svg"}
                    alt={tool.name}
                    className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                  />
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <CardTitle className="font-serif font-bold text-lg group-hover:text-primary transition-colors">
                      {tool.name}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {tool.category}
                      </Badge>
                      {tool.verified && (
                        <Badge variant="outline" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardDescription className="text-muted-foreground mb-4 leading-relaxed">
                    {tool.description}
                  </CardDescription>

                  {user && recommendation && showReasons && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {recommendation.reasons.slice(0, 2).map((reason, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs bg-primary/5 text-primary border-primary/20"
                          >
                            {reason}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{tool.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">{tool.reviews.toLocaleString()} reviews</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {tool.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {tool.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{tool.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0 flex items-center justify-between">
                  <span className="text-sm font-semibold text-accent">{tool.pricing}</span>
                  <Button
                    size="sm"
                    className="group-hover:bg-primary group-hover:text-primary-foreground"
                    asChild
                    onClick={() => {
                      if (user) {
                        recommendationEngine.trackToolView(user.id, tool.id)
                      }
                    }}
                  >
                    <Link href={`/tools/${tool.id}`}>Learn More</Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
