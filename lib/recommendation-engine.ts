import { allTools, type Tool } from "./tools-data"

export interface UserPreferences {
  favoriteCategories: string[]
  viewedTools: string[]
  ratedTools: { toolId: string; rating: number }[]
  searchHistory: string[]
}

export interface RecommendationScore {
  tool: Tool
  score: number
  reasons: string[]
}

export class RecommendationEngine {
  private static instance: RecommendationEngine
  private userPreferences: Map<string, UserPreferences> = new Map()

  static getInstance(): RecommendationEngine {
    if (!RecommendationEngine.instance) {
      RecommendationEngine.instance = new RecommendationEngine()
    }
    return RecommendationEngine.instance
  }

  // Initialize user preferences from localStorage or defaults
  getUserPreferences(userId: string): UserPreferences {
    if (!this.userPreferences.has(userId)) {
      const stored = localStorage.getItem(`ai-tools-preferences-${userId}`)
      if (stored) {
        try {
          this.userPreferences.set(userId, JSON.parse(stored))
        } catch {
          this.userPreferences.set(userId, this.getDefaultPreferences())
        }
      } else {
        this.userPreferences.set(userId, this.getDefaultPreferences())
      }
    }
    return this.userPreferences.get(userId)!
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      favoriteCategories: [],
      viewedTools: [],
      ratedTools: [],
      searchHistory: [],
    }
  }

  // Update user preferences and save to localStorage
  updateUserPreferences(userId: string, preferences: Partial<UserPreferences>) {
    const current = this.getUserPreferences(userId)
    const updated = { ...current, ...preferences }
    this.userPreferences.set(userId, updated)
    localStorage.setItem(`ai-tools-preferences-${userId}`, JSON.stringify(updated))
  }

  // Track user interactions
  trackToolView(userId: string, toolId: string) {
    const preferences = this.getUserPreferences(userId)
    const viewedTools = [...preferences.viewedTools]

    // Remove if already exists and add to front
    const index = viewedTools.indexOf(toolId)
    if (index > -1) {
      viewedTools.splice(index, 1)
    }
    viewedTools.unshift(toolId)

    // Keep only last 50 viewed tools
    if (viewedTools.length > 50) {
      viewedTools.splice(50)
    }

    this.updateUserPreferences(userId, { viewedTools })
  }

  trackToolRating(userId: string, toolId: string, rating: number) {
    const preferences = this.getUserPreferences(userId)
    const ratedTools = [...preferences.ratedTools]

    // Update existing rating or add new one
    const existingIndex = ratedTools.findIndex((r) => r.toolId === toolId)
    if (existingIndex > -1) {
      ratedTools[existingIndex].rating = rating
    } else {
      ratedTools.push({ toolId, rating })
    }

    this.updateUserPreferences(userId, { ratedTools })
  }

  trackSearch(userId: string, query: string) {
    const preferences = this.getUserPreferences(userId)
    const searchHistory = [...preferences.searchHistory]

    // Remove if already exists and add to front
    const index = searchHistory.indexOf(query)
    if (index > -1) {
      searchHistory.splice(index, 1)
    }
    searchHistory.unshift(query)

    // Keep only last 20 searches
    if (searchHistory.length > 20) {
      searchHistory.splice(20)
    }

    this.updateUserPreferences(userId, { searchHistory })
  }

  // Generate personalized recommendations
  getPersonalizedRecommendations(userId: string, limit = 6): RecommendationScore[] {
    const preferences = this.getUserPreferences(userId)
    const scores: RecommendationScore[] = []

    for (const tool of allTools) {
      // Skip tools user has already viewed recently
      if (preferences.viewedTools.slice(0, 10).includes(tool.id)) {
        continue
      }

      let score = 0
      const reasons: string[] = []

      // Base score from tool rating and popularity
      score += tool.rating * 10
      score += Math.log(tool.reviews + 1) * 2

      // Category preference bonus
      if (preferences.favoriteCategories.includes(tool.category)) {
        score += 30
        reasons.push(`Popular in ${tool.category}`)
      }

      // Similar to highly rated tools bonus
      const highRatedCategories = preferences.ratedTools
        .filter((r) => r.rating >= 4)
        .map((r) => allTools.find((t) => t.id === r.toolId)?.category)
        .filter(Boolean)

      if (highRatedCategories.includes(tool.category)) {
        score += 20
        reasons.push("Similar to tools you rated highly")
      }

      // Search history relevance
      const searchRelevance = preferences.searchHistory.some(
        (query) =>
          tool.name.toLowerCase().includes(query.toLowerCase()) ||
          tool.description.toLowerCase().includes(query.toLowerCase()) ||
          tool.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())),
      )

      if (searchRelevance) {
        score += 15
        reasons.push("Matches your search interests")
      }

      // Trending/popular bonus
      if (tool.popular) {
        score += 10
        reasons.push("Trending now")
      }

      // Verified tool bonus
      if (tool.verified) {
        score += 5
        reasons.push("Verified tool")
      }

      // Free/freemium preference (assume users like free tools)
      if (tool.pricing === "Free" || tool.pricing === "Freemium") {
        score += 8
      }

      if (reasons.length === 0) {
        reasons.push("Highly rated")
      }

      scores.push({ tool, score, reasons })
    }

    // Sort by score and return top results
    return scores.sort((a, b) => b.score - a.score).slice(0, limit)
  }

  // Get similar tools based on a specific tool
  getSimilarTools(toolId: string, limit = 4): Tool[] {
    const targetTool = allTools.find((t) => t.id === toolId)
    if (!targetTool) return []

    const scores: { tool: Tool; score: number }[] = []

    for (const tool of allTools) {
      if (tool.id === toolId) continue

      let score = 0

      // Same category bonus
      if (tool.category === targetTool.category) {
        score += 50
      }

      // Similar tags bonus
      const commonTags = tool.tags.filter((tag) => targetTool.tags.includes(tag))
      score += commonTags.length * 10

      // Similar pricing bonus
      if (tool.pricing === targetTool.pricing) {
        score += 15
      }

      // Similar rating range bonus
      const ratingDiff = Math.abs(tool.rating - targetTool.rating)
      if (ratingDiff <= 0.5) {
        score += 20
      } else if (ratingDiff <= 1.0) {
        score += 10
      }

      // Popular tools bonus
      if (tool.popular) {
        score += 10
      }

      scores.push({ tool, score })
    }

    return scores
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((s) => s.tool)
  }

  // Get trending tools (mock implementation)
  getTrendingTools(limit = 6): Tool[] {
    return allTools
      .filter((tool) => tool.popular || tool.rating >= 4.5)
      .sort((a, b) => b.reviews - a.reviews)
      .slice(0, limit)
  }

  // Get tools by category with smart ordering
  getToolsByCategory(category: string, limit = 6): Tool[] {
    return allTools
      .filter((tool) => tool.category === category)
      .sort((a, b) => {
        // Sort by rating first, then by review count
        if (Math.abs(a.rating - b.rating) > 0.1) {
          return b.rating - a.rating
        }
        return b.reviews - a.reviews
      })
      .slice(0, limit)
  }
}

// Export singleton instance
export const recommendationEngine = RecommendationEngine.getInstance()
