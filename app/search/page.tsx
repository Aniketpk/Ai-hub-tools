"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { 
  Search, 
  Star, 
  ChevronRight,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { allTools, categories, type Tool } from "@/lib/tools-data"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

const ITEMS_PER_PAGE = 12

export default function SearchPage() {
  const searchParams = useSearchParams()

  const urlQuery = searchParams.get("q") || ""
  const urlCategory = searchParams.get("category")

  const [searchQuery, setSearchQuery] = useState(urlQuery)
  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory || "All")
  const [sortBy, setSortBy] = useState("rating")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (urlCategory) setSelectedCategory(urlCategory)
  }, [urlCategory])

  useEffect(() => {
    setSearchQuery(urlQuery)
  }, [urlQuery])

  const filteredAndSortedTools = useMemo(() => {
    const filtered = allTools.filter((tool) => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.tags.some((tag) => tag.toLowerCase().includes(query))
        if (!matchesSearch) return false
      }

      // Category
      if (selectedCategory !== "All" && tool.category !== selectedCategory) {
        return false
      }

      return true
    })

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating
      if (sortBy === "name") return a.name.localeCompare(b.name)
      if (sortBy === "newest") return new Date(b.lastUpdated || "").getTime() - new Date(a.lastUpdated || "").getTime()
      return 0
    })

    return filtered
  }, [searchQuery, selectedCategory, sortBy])

  const totalPages = Math.ceil(filteredAndSortedTools.length / ITEMS_PER_PAGE)
  const paginatedTools = filteredAndSortedTools.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory])

  const ToolCard = ({ tool }: { tool: Tool }) => {
    const reduceMotion = Boolean(useReducedMotion())
    return <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 22, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={reduceMotion ? undefined : { y: -7, rotateX: 1.5, transition: { type: "spring", stiffness: 280, damping: 19 } }}
      whileTap={reduceMotion ? undefined : { scale: .98 }}
      exit={{ opacity: 0, scale: 0.96 }}
      viewport={{ once: true, amount: .12 }}
      transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 130, damping: 18 }}
      style={{ transformPerspective: 900 }}
      onPointerMove={(event) => {
        if (reduceMotion) return
        const bounds = event.currentTarget.getBoundingClientRect()
        event.currentTarget.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`)
        event.currentTarget.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`)
      }}
    >
      <Card className="relative bg-[#161b22]/40 border border-white/5 hover:border-primary/50 focus-within:border-violet-300 focus-within:ring-2 focus-within:ring-violet-300/40 transition-[border-color,box-shadow] duration-300 group h-full flex flex-col overflow-hidden backdrop-blur-sm shadow-2xl">
        <motion.span aria-hidden="true" className="tool-card-glow" />
        <div className="relative aspect-[16/9] overflow-hidden bg-black/40">
           <Image 
             src={tool.image || "/placeholder.svg"} 
             alt={tool.name} 
             fill 
             className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
           />
           <div className="absolute top-4 left-4">
              <Badge className="bg-black/60 backdrop-blur-md border-none text-[10px] font-bold uppercase tracking-widest px-2 py-0.5">
                {tool.category}
              </Badge>
           </div>
           <div className="absolute top-4 right-4 flex gap-2">
             {tool.verified && (
               <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
               </div>
             )}
           </div>
        </div>

        <CardContent className="p-5 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-2">
             <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors truncate">
               {tool.name}
             </h3>
             <div className="flex items-center gap-1 text-yellow-500 font-bold text-xs ring-1 ring-yellow-500/20 px-1.5 py-0.5 rounded bg-yellow-500/5">
                <Star className="w-3 h-3 fill-current" />
                {tool.rating || 5}
             </div>
          </div>
          
          <p className="text-white/40 text-sm mb-4 line-clamp-2 leading-relaxed flex-1">
            {tool.description}
          </p>

          <div className="flex flex-wrap gap-1 mb-6">
            {tool.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-white/20 bg-white/5 px-2 py-0.5 rounded">
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
             <span className="text-[10px] font-bold uppercase tracking-widest text-[#5d5dff]">{tool.pricing}</span>
             <Link href={`/tools/${tool.id}`} className="inline-flex items-center gap-1 text-xs font-bold text-white/40 hover:text-white transition-colors group/link">
                View Details <ChevronRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
             </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-foreground">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Simple Header */}
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 italic tracking-tight">Explore the Frontier.</h1>
          <p className="text-white/40 text-lg mb-10 leading-relaxed font-light">
            Discover thousands of high-performance AI tools curated for your engineering workflow.
          </p>
          
          <div className="relative group max-w-2xl mx-auto mb-8">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-white/30">
              <Search className="w-5 h-5 group-focus-within:text-primary transition-colors" />
            </div>
            <Input
              placeholder="Search by name, category, or functionality..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#161b22]/60 border-white/5 text-white h-14 pl-14 rounded-2xl focus-visible:ring-1 focus-visible:ring-primary/50 text-base"
            />
          </div>

          {/* Categories Bar - Simplified */}
          <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
             {["All", ...categories.map(c => c.name)].map((cat) => (
               <button
                 key={cat}
                 onClick={() => setSelectedCategory(cat)}
                 className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                   selectedCategory === cat 
                   ? "bg-white text-black" 
                   : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
                 }`}
               >
                 {cat}
               </button>
             ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
           <div className="text-xs font-bold uppercase tracking-widest text-white/30">
             Showing {filteredAndSortedTools.length} results
           </div>
           <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 bg-transparent border-none text-white/60 hover:text-white text-xs font-bold uppercase tracking-widest focus:ring-0">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent className="bg-[#161b22] border-white/10 text-white">
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
           </div>
        </div>

        {/* Dynamic Grid */}
        <AnimatePresence mode="popLayout">
          {paginatedTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-32 text-center"
            >
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-white/20" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No tools found</h3>
              <p className="text-white/40 mb-8 max-w-md mx-auto">We couldn&apos;t find any tools matching your search criteria. Try a different query or category.</p>
              <Button 
                variant="outline" 
                onClick={() => {setSearchQuery(""); setSelectedCategory("All")}}
                className="border-white/10 text-white hover:bg-white/5"
              >
                Clear all filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-20">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="border-white/10 text-white hover:bg-white/5 px-6 rounded-xl"
            >
              Previous
            </Button>
            <div className="flex items-center gap-2">
               {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                 <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                      currentPage === page ? "bg-primary text-white" : "bg-white/5 text-white/40 hover:bg-white/10"
                    }`}
                 >
                   {page}
                 </button>
               ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="border-white/10 text-white hover:bg-white/5 px-6 rounded-xl"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
