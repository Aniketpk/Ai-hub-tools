"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Brain, Star, BookOpen, Zap, TrendingUp, Clock, Heart, Settings, BarChart3, Activity, Target, Bell, Filter, Search, Calendar, Award, Users, MessageSquare, Moon, Sun, X, User, Palette, Shield, Mail, Globe, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { RecommendationSection } from "@/components/recommendation-section"

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  
  // State variables
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [notifications, setNotifications] = useState(3)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  
  // Settings state
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      weekly: false,
      achievements: true
    },
    privacy: {
      profile: "public",
      activity: "friends",
      analytics: true
    },
    appearance: {
      theme: "system",
      fontSize: 16,
      animations: true,
      compact: false
    },
    preferences: {
      language: "en",
      timezone: "auto",
      sounds: true,
      autoSave: true
    }
  })
  
  // Handle theme changes from settings
  useEffect(() => {
    if (settings?.appearance?.theme !== 'system' && setTheme) {
      setTheme(settings.appearance.theme)
    }
  }, [settings?.appearance?.theme, setTheme])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showNotifications) {
        const target = event.target as Element
        if (!target.closest('[data-notification-dropdown]')) {
          setShowNotifications(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showNotifications])

  // Settings update functions
  const updateSettings = (category: string, key: string, value: any) => {
    setSettings(prev => {
      if (!prev || !prev[category as keyof typeof prev]) {
        return prev
      }
      return {
        ...prev,
        [category]: {
          ...prev[category as keyof typeof prev],
          [key]: value
        }
      }
    })
  }

  const saveSettings = () => {
    try {
      // In a real app, this would save to backend
      localStorage.setItem('userSettings', JSON.stringify(settings))
      setShowSettings(false)
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  }

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('userSettings')
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings))
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Enhanced data with more realistic metrics
  const userStats = {
    toolsExplored: 24,
    reviewsWritten: 8,
    utilitiesUsed: 12,
    reputationScore: 342,
    weeklyGoal: 5,
    weeklyProgress: 3,
    streakDays: 7,
    totalTimeSpent: "42h 15m"
  }

  const recentTools = [
    { name: "GPT-4 Turbo", category: "Language Models", lastUsed: "2 hours ago", timeSpent: "1h 23m", rating: 5 },
    { name: "Midjourney", category: "Image Generation", lastUsed: "1 day ago", timeSpent: "45m", rating: 4 },
    { name: "GitHub Copilot", category: "Development", lastUsed: "3 days ago", timeSpent: "2h 15m", rating: 5 },
    { name: "Claude 3", category: "Language Models", lastUsed: "4 days ago", timeSpent: "1h 8m", rating: 4 },
    { name: "DALL-E 3", category: "Image Generation", lastUsed: "1 week ago", timeSpent: "30m", rating: 4 },
  ]

  const favoriteTools = [
    { name: "Jasper AI", category: "Content Creation", rating: 4.5, usageCount: 23 },
    { name: "Synthesia", category: "Video Generation", rating: 4.4, usageCount: 15 },
    { name: "Notion AI", category: "Productivity", rating: 4.3, usageCount: 31 },
    { name: "Cursor", category: "Development", rating: 4.5, usageCount: 18 },
  ]

  const activityFeed = [
    { type: "review", tool: "GPT-4 Turbo", action: "wrote a review", time: "2 hours ago", rating: 5 },
    { type: "usage", tool: "Midjourney", action: "generated 5 images", time: "1 day ago" },
    { type: "achievement", tool: "Productivity Master", action: "unlocked achievement", time: "2 days ago" },
    { type: "review", tool: "GitHub Copilot", action: "wrote a review", time: "3 days ago", rating: 5 },
    { type: "usage", tool: "Claude 3", action: "completed analysis task", time: "4 days ago" },
  ]

  const insights = [
    { title: "Most Productive Day", value: "Tuesday", description: "You're most active on Tuesdays" },
    { title: "Favorite Category", value: "Language Models", description: "60% of your tool usage" },
    { title: "Weekly Streak", value: "7 days", description: "Keep it up! 🔥" },
    { title: "Time Saved", value: "12.5 hours", description: "This week with AI tools" },
  ]

  const notificationData = [
    { id: 1, title: "New AI Tool Added", message: "GPT-4 Turbo is now available in our collection", time: "2 hours ago", type: "info", read: false },
    { id: 2, title: "Review Request", message: "Someone liked your review of Midjourney", time: "4 hours ago", type: "like", read: false },
    { id: 3, title: "Achievement Unlocked", message: "You've reached Level 4! Keep exploring AI tools", time: "1 day ago", type: "achievement", read: true },
    { id: 4, title: "Weekly Summary", message: "You used 5 AI tools this week. Great progress!", time: "2 days ago", type: "summary", read: true },
  ]

  // Error boundary for rendering
  try {

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-serif font-black text-foreground">AI Tools Hub</h1>
            </div>
            
            {/* Search Bar - Hidden on mobile */}
            <div className="flex-1 max-w-md mx-8 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tools, reviews, or activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Mobile Search Button */}
              <Button variant="ghost" size="sm" className="md:hidden">
                <Search className="h-4 w-4" />
              </Button>
              
              <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="hidden sm:flex">
                Browse Tools
              </Button>
              
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme && setTheme(theme === "dark" ? "light" : "dark")}
                className="relative"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
              
              {/* Notifications */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="h-4 w-4" />
                  {notifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {notifications}
                    </Badge>
                  )}
                </Button>
                
                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 top-12 w-80 bg-card border-2 border-border rounded-lg shadow-lg z-50 dark:bg-card dark:border-border" data-notification-dropdown>
                    <div className="p-4 border-b border-border dark:border-border">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground dark:text-foreground">Notifications</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setShowNotifications(false)}
                          className="text-foreground hover:bg-muted dark:text-foreground dark:hover:bg-muted"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notificationData.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-border hover:bg-muted/50 transition-colors dark:border-border dark:hover:bg-muted/50 ${
                            !notification.read ? 'bg-primary/5 dark:bg-primary/10' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-full ${
                              notification.type === 'info' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                              notification.type === 'like' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                              notification.type === 'achievement' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                              'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                            }`}>
                              {notification.type === 'info' ? <Bell className="h-4 w-4" /> :
                               notification.type === 'like' ? <Heart className="h-4 w-4" /> :
                               notification.type === 'achievement' ? <Award className="h-4 w-4" /> :
                               <BarChart3 className="h-4 w-4" />}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm text-foreground dark:text-foreground">{notification.title}</h4>
                              <p className="text-sm text-muted-foreground dark:text-muted-foreground mt-1">{notification.message}</p>
                              <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-2">{notification.time}</p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full mt-2 dark:bg-primary"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border-t border-border dark:border-border">
                      <Button variant="outline" size="sm" className="w-full dark:border-border dark:text-foreground dark:hover:bg-muted">
                        Mark All as Read
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden md:flex">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Settings
                    </DialogTitle>
                    <DialogDescription>
                      Manage your account preferences and application settings
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Tabs defaultValue="notifications" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="notifications">Notifications</TabsTrigger>
                      <TabsTrigger value="privacy">Privacy</TabsTrigger>
                      <TabsTrigger value="appearance">Appearance</TabsTrigger>
                      <TabsTrigger value="preferences">Preferences</TabsTrigger>
                    </TabsList>
                    
                    {/* Notifications Tab */}
                    <TabsContent value="notifications" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Notification Preferences
                          </CardTitle>
                          <CardDescription>Choose how you want to be notified</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-sm font-medium">Email Notifications</Label>
                              <p className="text-xs text-muted-foreground">Receive updates via email</p>
                            </div>
                            <Switch
                              checked={settings.notifications.email}
                              onCheckedChange={(checked) => updateSettings('notifications', 'email', checked)}
                            />
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-sm font-medium">Push Notifications</Label>
                              <p className="text-xs text-muted-foreground">Browser push notifications</p>
                            </div>
                            <Switch
                              checked={settings.notifications.push}
                              onCheckedChange={(checked) => updateSettings('notifications', 'push', checked)}
                            />
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-sm font-medium">Weekly Summary</Label>
                              <p className="text-xs text-muted-foreground">Weekly activity reports</p>
                            </div>
                            <Switch
                              checked={settings.notifications.weekly}
                              onCheckedChange={(checked) => updateSettings('notifications', 'weekly', checked)}
                            />
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-sm font-medium">Achievement Alerts</Label>
                              <p className="text-xs text-muted-foreground">Notify when you unlock achievements</p>
                            </div>
                            <Switch
                              checked={settings.notifications.achievements}
                              onCheckedChange={(checked) => updateSettings('notifications', 'achievements', checked)}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    {/* Privacy Tab */}
                    <TabsContent value="privacy" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Privacy Settings
                          </CardTitle>
                          <CardDescription>Control your privacy and data sharing</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Profile Visibility</Label>
                            <Select value={settings.privacy.profile} onValueChange={(value) => updateSettings('privacy', 'profile', value)}>
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="public">Public</SelectItem>
                                <SelectItem value="friends">Friends Only</SelectItem>
                                <SelectItem value="private">Private</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Separator />
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Activity Sharing</Label>
                            <Select value={settings.privacy.activity} onValueChange={(value) => updateSettings('privacy', 'activity', value)}>
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="public">Public</SelectItem>
                                <SelectItem value="friends">Friends Only</SelectItem>
                                <SelectItem value="private">Private</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-sm font-medium">Analytics</Label>
                              <p className="text-xs text-muted-foreground">Help improve the app with usage analytics</p>
                            </div>
                            <Switch
                              checked={settings.privacy.analytics}
                              onCheckedChange={(checked) => updateSettings('privacy', 'analytics', checked)}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    {/* Appearance Tab */}
                    <TabsContent value="appearance" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Palette className="h-5 w-5" />
                            Appearance Settings
                          </CardTitle>
                          <CardDescription>Customize the look and feel of your dashboard</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Theme</Label>
                            <Select value={settings.appearance.theme} onValueChange={(value) => updateSettings('appearance', 'theme', value)}>
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Separator />
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Font Size: {settings.appearance.fontSize}px</Label>
                            <Slider
                              value={[settings.appearance.fontSize]}
                              onValueChange={(value) => updateSettings('appearance', 'fontSize', value[0])}
                              min={12}
                              max={20}
                              step={1}
                              className="w-full"
                            />
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-sm font-medium">Animations</Label>
                              <p className="text-xs text-muted-foreground">Enable smooth transitions and animations</p>
                            </div>
                            <Switch
                              checked={settings.appearance.animations}
                              onCheckedChange={(checked) => updateSettings('appearance', 'animations', checked)}
                            />
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-sm font-medium">Compact Mode</Label>
                              <p className="text-xs text-muted-foreground">Reduce spacing for more content</p>
                            </div>
                            <Switch
                              checked={settings.appearance.compact}
                              onCheckedChange={(checked) => updateSettings('appearance', 'compact', checked)}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    {/* Preferences Tab */}
                    <TabsContent value="preferences" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            General Preferences
                          </CardTitle>
                          <CardDescription>Configure your general application preferences</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Language</Label>
                            <Select value={settings.preferences.language} onValueChange={(value) => updateSettings('preferences', 'language', value)}>
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="es">Spanish</SelectItem>
                                <SelectItem value="fr">French</SelectItem>
                                <SelectItem value="de">German</SelectItem>
                                <SelectItem value="zh">Chinese</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Separator />
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Timezone</Label>
                            <Select value={settings.preferences.timezone} onValueChange={(value) => updateSettings('preferences', 'timezone', value)}>
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="auto">Auto-detect</SelectItem>
                                <SelectItem value="utc">UTC</SelectItem>
                                <SelectItem value="est">Eastern Time</SelectItem>
                                <SelectItem value="pst">Pacific Time</SelectItem>
                                <SelectItem value="gmt">GMT</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-sm font-medium">Sound Effects</Label>
                              <p className="text-xs text-muted-foreground">Play sounds for notifications and actions</p>
                            </div>
                            <Switch
                              checked={settings.preferences.sounds}
                              onCheckedChange={(checked) => updateSettings('preferences', 'sounds', checked)}
                            />
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-sm font-medium">Auto-save</Label>
                              <p className="text-xs text-muted-foreground">Automatically save your work</p>
                            </div>
                            <Switch
                              checked={settings.preferences.autoSave}
                              onCheckedChange={(checked) => updateSettings('preferences', 'autoSave', checked)}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setShowSettings(false)}>
                      Cancel
                    </Button>
                    <Button onClick={saveSettings}>
                      Save Settings
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm" onClick={logout} className="hidden sm:flex">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 border-2 border-primary">
                <AvatarFallback className="text-lg font-serif font-bold bg-primary text-primary-foreground">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl lg:text-3xl font-serif font-bold text-foreground">Welcome back, {user.name}!</h2>
                <p className="text-muted-foreground">Member since {new Date(user.joinDate).toLocaleDateString()}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Badge variant="outline" className="flex items-center gap-1 text-xs">
                    <Award className="h-3 w-3" />
                    Level {Math.floor(userStats.reputationScore / 100) + 1}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1 text-xs">
                    <Target className="h-3 w-3" />
                    {userStats.streakDays} day streak
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="text-center lg:text-right">
              <p className="text-sm text-muted-foreground">Total time saved</p>
              <p className="text-2xl font-bold text-primary">{userStats.totalTimeSpent}</p>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 hover:border-primary/50 transition-colors group cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-muted-foreground">Tools Explored</p>
                  <p className="text-2xl font-serif font-bold text-primary">{userStats.toolsExplored}</p>
                  <p className="text-xs text-muted-foreground">+3 this week</p>
                </div>
                <BookOpen className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-accent/50 transition-colors group cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-muted-foreground">Reviews Written</p>
                  <p className="text-2xl font-serif font-bold text-accent">{userStats.reviewsWritten}</p>
                  <p className="text-xs text-muted-foreground">+1 this week</p>
                </div>
                <Star className="h-8 w-8 text-accent group-hover:scale-110 transition-transform" />
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-accent h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-secondary/50 transition-colors group cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-muted-foreground">AI Utilities Used</p>
                  <p className="text-2xl font-serif font-bold text-secondary">{userStats.utilitiesUsed}</p>
                  <p className="text-xs text-muted-foreground">+2 this week</p>
                </div>
                <Zap className="h-8 w-8 text-secondary group-hover:scale-110 transition-transform" />
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-secondary h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-foreground/50 transition-colors group cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-muted-foreground">Reputation Score</p>
                  <p className="text-2xl font-serif font-bold text-foreground">{userStats.reputationScore}</p>
                  <p className="text-xs text-muted-foreground">+15 this week</p>
                </div>
                <TrendingUp className="h-8 w-8 text-foreground group-hover:scale-110 transition-transform" />
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-foreground h-2 rounded-full" style={{ width: '68%' }}></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights Section */}
        <Card className="mb-8 border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <BarChart3 className="h-5 w-5 text-primary" />
              AI Insights
            </CardTitle>
            <CardDescription>Personalized insights based on your usage patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {insights.map((insight, index) => (
                <div key={index} className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <p className="text-sm text-muted-foreground">{insight.title}</p>
                  <p className="text-lg font-bold text-primary">{insight.value}</p>
                  <p className="text-xs text-muted-foreground">{insight.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <RecommendationSection
          title="Recommended for You"
          subtitle="AI tools tailored to your interests and usage patterns"
          limit={6}
          showReasons={true}
        />

        {/* Enhanced Activity Section with Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enhanced Recent Activity */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 font-serif">
                    <Activity className="h-5 w-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Your latest tool interactions and achievements</CardDescription>
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-32 dark:bg-card dark:border-border dark:text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-card dark:border-border">
                    <SelectItem value="all" className="dark:text-foreground dark:hover:bg-muted">All</SelectItem>
                    <SelectItem value="usage" className="dark:text-foreground dark:hover:bg-muted">Usage</SelectItem>
                    <SelectItem value="review" className="dark:text-foreground dark:hover:bg-muted">Reviews</SelectItem>
                    <SelectItem value="achievement" className="dark:text-foreground dark:hover:bg-muted">Achievements</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="recent" className="w-full">
                <TabsList className="grid w-full grid-cols-2 dark:bg-muted dark:border-border">
                  <TabsTrigger value="recent" className="dark:data-[state=active]:bg-card dark:data-[state=active]:text-foreground dark:text-muted-foreground">Recent Tools</TabsTrigger>
                  <TabsTrigger value="activity" className="dark:data-[state=active]:bg-card dark:data-[state=active]:text-foreground dark:text-muted-foreground">Activity Feed</TabsTrigger>
                </TabsList>
                
                <TabsContent value="recent" className="space-y-4 mt-4">
                  {recentTools.map((tool, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < tool.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                        <div>
                          <p className="font-semibold">{tool.name}</p>
                          <p className="text-sm text-muted-foreground">{tool.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-xs mb-1">
                          {tool.lastUsed}
                        </Badge>
                        <p className="text-xs text-muted-foreground">{tool.timeSpent}</p>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="activity" className="space-y-4 mt-4">
                  {activityFeed.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className={`p-2 rounded-full ${
                        activity.type === 'review' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        activity.type === 'usage' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {activity.type === 'review' ? <Star className="h-4 w-4" /> :
                         activity.type === 'usage' ? <Zap className="h-4 w-4" /> :
                         <Award className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">
                          {activity.action} {activity.tool}
                          {activity.rating && (
                            <span className="ml-2">
                              {Array.from({ length: activity.rating }).map((_, i) => (
                                <Star key={i} className="inline h-3 w-3 fill-yellow-400 text-yellow-400" />
                              ))}
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
              
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                View All Activity
              </Button>
            </CardContent>
          </Card>

          {/* Enhanced Favorite Tools */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <Heart className="h-5 w-5 text-accent" />
                Favorite Tools
              </CardTitle>
              <CardDescription>Your most loved AI tools and utilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {favoriteTools.map((tool, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(tool.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <div>
                      <p className="font-semibold group-hover:text-accent transition-colors">{tool.name}</p>
                      <p className="text-sm text-muted-foreground">{tool.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">{tool.rating}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{tool.usageCount} uses</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4 bg-transparent hover:bg-accent hover:text-accent-foreground">
                Manage Favorites
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Progress */}
        <Card className="mt-8 border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <Target className="h-5 w-5 text-primary" />
              Weekly Progress
            </CardTitle>
            <CardDescription>Track your AI tool exploration goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Tools Explored This Week</p>
                  <p className="text-sm text-muted-foreground">{userStats.weeklyProgress} of {userStats.weeklyGoal} tools</p>
                </div>
                <Badge variant="outline">{Math.round((userStats.weeklyProgress / userStats.weeklyGoal) * 100)}%</Badge>
              </div>
              <Progress value={(userStats.weeklyProgress / userStats.weeklyGoal) * 100} className="h-2" />
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-primary">{userStats.streakDays}</p>
                  <p className="text-sm text-muted-foreground">Day Streak</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-accent">{userStats.totalTimeSpent}</p>
                  <p className="text-sm text-muted-foreground">Time Saved</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Quick Actions */}
        <Card className="mt-8 border-2">
          <CardHeader>
            <CardTitle className="font-serif">Quick Actions</CardTitle>
            <CardDescription>Jump into your AI workflow with these shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="h-20 flex-col space-y-2 hover:scale-105 transition-transform" onClick={() => router.push("/")}>
                <BookOpen className="h-6 w-6" />
                <span className="text-xs sm:text-sm">Explore New Tools</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 bg-transparent hover:scale-105 transition-transform"
                onClick={() => router.push("/utilities")}
              >
                <Zap className="h-6 w-6" />
                <span className="text-xs sm:text-sm">AI Utilities</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent hover:scale-105 transition-transform">
                <Star className="h-6 w-6" />
                <span className="text-xs sm:text-sm">Write Review</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent hover:scale-105 transition-transform">
                <MessageSquare className="h-6 w-6" />
                <span className="text-xs sm:text-sm">Community</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
  } catch (error) {
    console.error('Dashboard rendering error:', error)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">We're working to fix this issue.</p>
          <Button onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </div>
      </div>
    )
  }
}
