"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Search, Filter, Star, Users, Brain, SlidersHorizontal, Grid3X3, List, X, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { allTools, categories, pricingOptions, allTags, type Tool } from "@/lib/tools-data"

const ITEMS_PER_PAGE = 9

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const urlQuery = searchParams.get("q") || ""
  const urlCategory = searchParams.get("category")

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState(urlQuery)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedPricing, setSelectedPricing] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [ratingRange, setRatingRange] = useState([0, 5])
  const [sortBy, setSortBy] = useState("rating")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (urlCategory && !selectedCategories.includes(urlCategory)) {
      setSelectedCategories([urlCategory])
    }
  }, [urlCategory]) // Only depend on the extracted value

  useEffect(() => {
    setSearchQuery(urlQuery)
  }, [urlQuery])

  // Filter and sort tools
  const filteredAndSortedTools = useMemo(() => {
    const filtered = allTools.filter((tool) => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.category.toLowerCase().includes(query) ||
          tool.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          tool.developer?.toLowerCase().includes(query)

        if (!matchesSearch) return false
      }

      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(tool.category)) {
        return false
      }

      // Pricing filter
      if (selectedPricing.length > 0 && !selectedPricing.includes(tool.pricing)) {
        return false
      }

      // Tags filter
      if (selectedTags.length > 0 && !selectedTags.some((tag) => tool.tags.includes(tag))) {
        return false
      }

      // Rating filter
      if (tool.rating < ratingRange[0] || tool.rating > ratingRange[1]) {
        return false
      }

      return true
    })

    // Sort tools
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "reviews":
          return b.reviews - a.reviews
        case "name":
          return a.name.localeCompare(b.name)
        case "newest":
          return new Date(b.lastUpdated || "").getTime() - new Date(a.lastUpdated || "").getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [searchQuery, selectedCategories, selectedPricing, selectedTags, ratingRange, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedTools.length / ITEMS_PER_PAGE)
  const paginatedTools = filteredAndSortedTools.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategories, selectedPricing, selectedTags, ratingRange])

  const clearAllFilters = () => {
    setSearchQuery("")
    setSelectedCategories([])
    setSelectedPricing([])
    setSelectedTags([])
    setRatingRange([0, 5])
    setCurrentPage(1)
  }

  const hasActiveFilters =
    searchQuery ||
    selectedCategories.length > 0 ||
    selectedPricing.length > 0 ||
    selectedTags.length > 0 ||
    ratingRange[0] > 0 ||
    ratingRange[1] < 5

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-serif font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.name} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.name}`}
                checked={selectedCategories.includes(category.name)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedCategories([...selectedCategories, category.name])
                  } else {
                    setSelectedCategories(selectedCategories.filter((c) => c !== category.name))
                  }
                }}
              />
              <label
                htmlFor={`category-${category.name}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {category.name} ({category.count})
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Pricing */}
      <div>
        <h3 className="font-serif font-semibold mb-3">Pricing</h3>
        <div className="space-y-2">
          {pricingOptions.map((pricing) => (
            <div key={pricing} className="flex items-center space-x-2">
              <Checkbox
                id={`pricing-${pricing}`}
                checked={selectedPricing.includes(pricing)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedPricing([...selectedPricing, pricing])
                  } else {
                    setSelectedPricing(selectedPricing.filter((p) => p !== pricing))
                  }
                }}
              />
              <label
                htmlFor={`pricing-${pricing}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {pricing}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Rating */}
      <div>
        <h3 className="font-serif font-semibold mb-3">Rating</h3>
        <div className="space-y-3">
          <Slider value={ratingRange} onValueChange={setRatingRange} max={5} min={0} step={0.1} className="w-full" />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{ratingRange[0].toFixed(1)}+ stars</span>
            <span>up to {ratingRange[1].toFixed(1)} stars</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Popular Tags */}
      <div>
        <h3 className="font-serif font-semibold mb-3">Popular Tags</h3>
        <div className="flex flex-wrap gap-2">
          {allTags.slice(0, 12).map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => {
                if (selectedTags.includes(tag)) {
                  setSelectedTags(selectedTags.filter((t) => t !== tag))
                } else {
                  setSelectedTags([...selectedTags, tag])
                }
              }}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )

  const ToolCard = ({ tool }: { tool: Tool }) => (
    <Card className="hover:shadow-xl transition-all duration-300 group border-2 hover:border-primary/30">
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
            {tool.verified && (
              <Badge variant="secondary" className="text-xs">
                Verified
              </Badge>
            )}
            {tool.popular && (
              <Badge variant="outline" className="text-xs">
                Popular
              </Badge>
            )}
          </div>
        </div>
        <Badge variant="secondary" className="text-xs mb-3">
          {tool.category}
        </Badge>
        <CardDescription className="text-muted-foreground mb-4 leading-relaxed">{tool.description}</CardDescription>

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
        <Button size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground" asChild>
          <Link href={`/tools/${tool.id}`}>Learn More</Link>
        </Button>
      </CardFooter>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 hover:text-primary transition-colors">
              <Brain className="h-6 w-6 text-primary" />
              <span className="text-lg font-serif font-black text-foreground">AI Tools Hub</span>
            </Link>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/utilities">AI Utilities</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-black text-foreground mb-4">Discover AI Tools</h1>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search AI tools, categories, or use cases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg border-2 border-border focus:border-primary"
              />
            </div>
            <div className="flex items-center gap-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center border border-border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-80">
            <Card className="border-2 sticky top-24">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-serif flex items-center gap-2">
                    <Filter className="h-5 w-5 text-primary" />
                    Filters
                  </CardTitle>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                      <X className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <FilterSidebar />
              </CardContent>
            </Card>
          </div>

          {/* Mobile Filter Sheet */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full mb-6 bg-transparent">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters & Sort
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-2">
                      Active
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-primary" />
                    Filters
                  </SheetTitle>
                  <SheetDescription>Refine your search to find the perfect AI tools</SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <FilterSidebar />
                </div>
                {hasActiveFilters && (
                  <div className="mt-6">
                    <Button variant="outline" onClick={clearAllFilters} className="w-full bg-transparent">
                      <X className="h-4 w-4 mr-2" />
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-muted-foreground">
                  Showing {paginatedTools.length} of {filteredAndSortedTools.length} tools
                  {searchQuery && <span> for "{searchQuery}"</span>}
                </p>
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategories.map((category) => (
                  <Badge key={category} variant="secondary" className="gap-1">
                    {category}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setSelectedCategories(selectedCategories.filter((c) => c !== category))}
                    />
                  </Badge>
                ))}
                {selectedPricing.map((pricing) => (
                  <Badge key={pricing} variant="secondary" className="gap-1">
                    {pricing}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setSelectedPricing(selectedPricing.filter((p) => p !== pricing))}
                    />
                  </Badge>
                ))}
                {selectedTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setSelectedTags(selectedTags.filter((t) => t !== tag))}
                    />
                  </Badge>
                ))}
              </div>
            )}

            {/* Tools Grid */}
            {paginatedTools.length > 0 ? (
              <div
                className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}
              >
                {paginatedTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            ) : (
              <Card className="border-2 border-dashed">
                <CardContent className="p-12 text-center">
                  <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-serif font-semibold mb-2">No tools found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your search criteria or filters</p>
                  <Button onClick={clearAllFilters}>Clear All Filters</Button>
                </CardContent>
              </Card>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  )
                })}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span className="text-muted-foreground">...</span>
                    <Button variant="outline" onClick={() => setCurrentPage(totalPages)}>
                      {totalPages}
                    </Button>
                  </>
                )}

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
