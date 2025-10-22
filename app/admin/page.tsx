"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Brain,
  Users,
  Star,
  MessageSquare,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  BarChart3,
  Shield,
  Search,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { allTools } from "@/lib/tools-data"

// Mock data for admin dashboard
const mockStats = {
  totalTools: 156,
  totalUsers: 12847,
  totalReviews: 3421,
  pendingReviews: 23,
  monthlyGrowth: 12.5,
}

const mockUsers = [
  { id: "1", name: "John Doe", email: "john@example.com", joinDate: "2024-01-15", status: "active", role: "user" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", joinDate: "2024-01-20", status: "active", role: "user" },
  { id: "3", name: "Bob Wilson", email: "bob@example.com", joinDate: "2024-02-01", status: "suspended", role: "user" },
  { id: "4", name: "Alice Brown", email: "alice@example.com", joinDate: "2024-02-10", status: "active", role: "admin" },
]

const mockReviews = [
  {
    id: "1",
    toolName: "ChatGPT",
    userName: "John Doe",
    rating: 5,
    comment: "Excellent AI tool for writing and coding assistance.",
    status: "pending",
    date: "2024-02-15",
  },
  {
    id: "2",
    toolName: "Midjourney",
    userName: "Jane Smith",
    rating: 4,
    comment: "Great for creating artwork, but can be expensive.",
    status: "approved",
    date: "2024-02-14",
  },
  {
    id: "3",
    toolName: "GitHub Copilot",
    userName: "Bob Wilson",
    rating: 1,
    comment: "This is spam content that should be removed.",
    status: "pending",
    date: "2024-02-13",
  },
]

export default function AdminPage() {
  const { user, isAdmin } = useAuth()
  const router = useRouter()
  const [selectedTool, setSelectedTool] = useState(null)
  const [isAddToolOpen, setIsAddToolOpen] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    if (!isAdmin) {
      router.push("/")
      return
    }
  }, [user, isAdmin, router])

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-serif font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">You need admin privileges to access this page.</p>
            <Button asChild>
              <Link href="/">Go Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

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
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Admin Panel
              </Badge>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">Back to Site</Link>
              </Button>
              <div className="text-sm text-muted-foreground">Welcome, {user.name}</div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="border-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalTools}</div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />+{mockStats.monthlyGrowth}% this month
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalUsers.toLocaleString()}</div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <Users className="h-3 w-3 mr-1" />
                Active community
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalReviews.toLocaleString()}</div>
              <div className="flex items-center text-xs text-blue-600 mt-1">
                <Star className="h-3 w-3 mr-1" />
                High engagement
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.pendingReviews}</div>
              <div className="flex items-center text-xs text-orange-600 mt-1">
                <MessageSquare className="h-3 w-3 mr-1" />
                Need attention
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <div className="text-xs text-muted-foreground mt-1">View detailed stats</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="tools" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tools">AI Tools</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Tools Management */}
          <TabsContent value="tools" className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-serif">AI Tools Management</CardTitle>
                    <CardDescription>Manage and moderate AI tools in the directory</CardDescription>
                  </div>
                  <Dialog open={isAddToolOpen} onOpenChange={setIsAddToolOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Tool
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add New AI Tool</DialogTitle>
                        <DialogDescription>Add a new AI tool to the directory</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="tool-name">Tool Name</Label>
                            <Input id="tool-name" placeholder="Enter tool name" />
                          </div>
                          <div>
                            <Label htmlFor="tool-category">Category</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="writing">Writing & Content</SelectItem>
                                <SelectItem value="design">Design & Art</SelectItem>
                                <SelectItem value="coding">Coding & Development</SelectItem>
                                <SelectItem value="productivity">Productivity</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="tool-description">Description</Label>
                          <Textarea id="tool-description" placeholder="Enter tool description" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="tool-pricing">Pricing</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select pricing" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="free">Free</SelectItem>
                                <SelectItem value="freemium">Freemium</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="tool-website">Website URL</Label>
                            <Input id="tool-website" placeholder="https://example.com" />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="tool-verified" />
                          <Label htmlFor="tool-verified">Mark as verified</Label>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddToolOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => setIsAddToolOpen(false)}>Add Tool</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input placeholder="Search tools..." className="pl-10" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="writing">Writing & Content</SelectItem>
                      <SelectItem value="design">Design & Art</SelectItem>
                      <SelectItem value="coding">Coding & Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tool</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Reviews</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allTools.slice(0, 10).map((tool) => (
                      <TableRow key={tool.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <img
                              src={tool.image || "/placeholder.svg"}
                              alt={tool.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div>
                              <div className="font-medium">{tool.name}</div>
                              <div className="text-sm text-muted-foreground">{tool.developer}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{tool.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            {tool.rating}
                          </div>
                        </TableCell>
                        <TableCell>{tool.reviews.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={tool.verified ? "default" : "outline"}>
                            {tool.verified ? "Verified" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Management */}
          <TabsContent value="users" className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="font-serif">User Management</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === "active" ? "default" : "destructive"}>{user.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Management */}
          <TabsContent value="reviews" className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="font-serif">Review Moderation</CardTitle>
                <CardDescription>Moderate user reviews and ratings</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tool</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Comment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockReviews.map((review) => (
                      <TableRow key={review.id}>
                        <TableCell className="font-medium">{review.toolName}</TableCell>
                        <TableCell>{review.userName}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            {review.rating}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{review.comment}</TableCell>
                        <TableCell>
                          <Badge variant={review.status === "approved" ? "default" : "secondary"}>
                            {review.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost" className="text-green-600 hover:text-green-700">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="font-serif">Platform Growth</CardTitle>
                  <CardDescription>User and tool growth over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <BarChart3 className="h-16 w-16 mx-auto mb-4" />
                      <p>Analytics charts would be displayed here</p>
                      <p className="text-sm">Integration with analytics service needed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="font-serif">Popular Categories</CardTitle>
                  <CardDescription>Most viewed tool categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Writing & Content</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-muted rounded-full">
                          <div className="w-20 h-2 bg-primary rounded-full"></div>
                        </div>
                        <span className="text-sm text-muted-foreground">83%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Design & Art</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-muted rounded-full">
                          <div className="w-16 h-2 bg-primary rounded-full"></div>
                        </div>
                        <span className="text-sm text-muted-foreground">67%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Coding & Development</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-muted rounded-full">
                          <div className="w-12 h-2 bg-primary rounded-full"></div>
                        </div>
                        <span className="text-sm text-muted-foreground">50%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Productivity</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-muted rounded-full">
                          <div className="w-8 h-2 bg-primary rounded-full"></div>
                        </div>
                        <span className="text-sm text-muted-foreground">33%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
