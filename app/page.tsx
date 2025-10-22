"use client"

import { Search, Star, Users, Zap, Brain, Code, Palette, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { featuredTools, categories } from "@/lib/tools-data"
import { RecommendationSection } from "@/components/recommendation-section"
import { useAuth } from "@/lib/auth-context"

export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-serif font-black text-foreground">AI Tools Hub</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/search" className="text-foreground hover:text-primary transition-colors">
                Browse Tools
              </Link>
              <a href="#categories" className="text-foreground hover:text-primary transition-colors">
                Categories
              </a>
              <Link href="/search" className="text-foreground hover:text-primary transition-colors">
                Reviews
              </Link>
              <Link href="/utilities" className="text-foreground hover:text-primary transition-colors">
                AI Utilities
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-5xl md:text-6xl font-serif font-black text-foreground mb-6 leading-tight">
            Discover the Best
            <span className="text-primary block">AI-Powered Tools</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
            Explore, review, and utilize cutting-edge AI tools across all domains. From content creation to development,
            find the perfect AI solution for your needs.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search AI tools, categories, or use cases..."
              className="pl-12 pr-4 py-6 text-lg border-2 border-border focus:border-primary"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const query = (e.target as HTMLInputElement).value
                  if (query.trim()) {
                    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
                  } else {
                    router.push("/search")
                  }
                }
              }}
            />
            <Button
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              size="sm"
              onClick={() => {
                const input = document.querySelector('input[placeholder*="Search AI tools"]') as HTMLInputElement
                const query = input?.value || ""
                if (query.trim()) {
                  router.push(`/search?q=${encodeURIComponent(query.trim())}`)
                } else {
                  router.push("/search")
                }
              }}
            >
              Search
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div>
              <div className="text-3xl font-serif font-bold text-primary">500+</div>
              <div className="text-muted-foreground">AI Tools</div>
            </div>
            <div>
              <div className="text-3xl font-serif font-bold text-primary">50K+</div>
              <div className="text-muted-foreground">Reviews</div>
            </div>
            <div>
              <div className="text-3xl font-serif font-bold text-primary">25K+</div>
              <div className="text-muted-foreground">Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Personalized Recommendations Section */}
      <RecommendationSection />

      {/* Categories Section */}
      <section id="categories" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h3 className="text-3xl font-serif font-bold text-center mb-12">Browse by Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link key={category.name} href={`/search?category=${encodeURIComponent(category.name)}`}>
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 hover:border-primary/50">
                  <CardContent className="p-6 text-center">
                    {category.icon === "Brain" && (
                      <Brain className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    )}
                    {category.icon === "Palette" && (
                      <Palette className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    )}
                    {category.icon === "Code" && (
                      <Code className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    )}
                    {category.icon === "BookOpen" && (
                      <BookOpen className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    )}
                    {category.icon === "Zap" && (
                      <Zap className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    )}
                    <h4 className="font-serif font-semibold mb-2">{category.name}</h4>
                    <p className="text-sm text-muted-foreground">{category.count} tools</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-3xl font-serif font-bold">Featured AI Tools</h3>
            <Button variant="outline" asChild>
              <Link href="/search">View All Tools</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTools.map((tool) => (
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
                    <Badge variant="secondary" className="text-xs">
                      {tool.category}
                    </Badge>
                  </div>
                  <CardDescription className="text-muted-foreground mb-4 leading-relaxed">
                    {tool.description}
                  </CardDescription>

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
                    {tool.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0 flex items-center justify-between">
                  <span className="text-sm font-semibold text-accent">{tool.pricing}</span>
                  <Button size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground" asChild>
                    <Link href={`/tools/${tool.id}`}>Learn More</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center max-w-3xl">
          <h3 className="text-4xl font-serif font-bold mb-6">Ready to Explore AI Tools?</h3>
          <p className="text-xl mb-8 opacity-90 leading-relaxed">
            Join thousands of users discovering and reviewing the latest AI-powered tools. Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
              <Link href="/search">Browse All Tools</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
              asChild
            >
              <Link href="/utilities">Try AI Utilities</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-6 w-6 text-primary" />
                <span className="text-lg font-serif font-bold">AI Tools Hub</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Your centralized platform for discovering, reviewing, and utilizing AI-powered tools.
              </p>
            </div>
            <div>
              <h4 className="font-serif font-semibold mb-4">Explore</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/search" className="hover:text-primary transition-colors">
                    All Tools
                  </Link>
                </li>
                <li>
                  <a href="#categories" className="hover:text-primary transition-colors">
                    Categories
                  </a>
                </li>
                <li>
                  <Link href="/search?sort=newest" className="hover:text-primary transition-colors">
                    New Releases
                  </Link>
                </li>
                <li>
                  <Link href="/search?sort=rating" className="hover:text-primary transition-colors">
                    Top Rated
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/search" className="hover:text-primary transition-colors">
                    Reviews
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="hover:text-primary transition-colors">
                    Discussions
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="hover:text-primary transition-colors">
                    Submit Tool
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="hover:text-primary transition-colors">
                    Guidelines
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/search" className="hover:text-primary transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="hover:text-primary transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="hover:text-primary transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 AI Tools Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
