"use client"

import { useEffect, useState } from "react"
import { recommendationEngine } from "@/lib/recommendation-engine"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Users, ArrowRight } from "lucide-react"
import Link from "next/link"
import type { Tool } from "@/lib/tools-data"

interface SimilarToolsProps {
  toolId: string
  limit?: number
}

export function SimilarTools({ toolId, limit = 4 }: SimilarToolsProps) {
  const [similarTools, setSimilarTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSimilarTools = () => {
      const similar = recommendationEngine.getSimilarTools(toolId, limit)
      setSimilarTools(similar)
      setLoading(false)
    }

    loadSimilarTools()
  }, [toolId, limit])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (similarTools.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ArrowRight className="h-5 w-5 text-primary" />
        <h3 className="text-2xl font-serif font-bold">Similar Tools</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {similarTools.map((tool) => (
          <Card
            key={tool.id}
            className="hover:shadow-lg transition-all duration-300 group border-2 hover:border-primary/30"
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <img
                  src={tool.image || "/placeholder.svg"}
                  alt={tool.name}
                  className="w-16 h-16 rounded-lg object-cover group-hover:scale-105 transition-transform"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="font-serif font-bold text-lg group-hover:text-primary transition-colors truncate">
                      {tool.name}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs ml-2 flex-shrink-0">
                      {tool.category}
                    </Badge>
                  </div>

                  <CardDescription className="text-muted-foreground mb-3 leading-relaxed line-clamp-2">
                    {tool.description}
                  </CardDescription>

                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-sm">{tool.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">{tool.reviews.toLocaleString()}</span>
                    </div>
                    <span className="text-sm font-semibold text-accent ml-auto">{tool.pricing}</span>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground bg-transparent"
                    asChild
                  >
                    <Link href={`/tools/${tool.id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
