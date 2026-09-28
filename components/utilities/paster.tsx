"use client"

import { useState, useEffect } from "react"
import { Clipboard, Save, Search, Trash2, Tag, Copy, Check, Share2, Edit, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { PasterService, type Paste } from "@/lib/paster-service"

export default function Paster() {
    const [pastes, setPastes] = useState<Paste[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [tags, setTags] = useState("")
    const [editingId, setEditingId] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState("create")
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const { toast } = useToast()

    useEffect(() => {
        loadPastes()
    }, [])

    useEffect(() => {
        if (searchQuery) {
            setPastes(PasterService.search(searchQuery))
        } else {
            loadPastes()
        }
    }, [searchQuery])

    const loadPastes = () => {
        setPastes(PasterService.getAll())
    }

    const handleSave = () => {
        if (!title.trim() || !content.trim()) {
            toast({
                title: "Validation Error",
                description: "Please provide both a title and content.",
                variant: "destructive",
            })
            return
        }

        const tagList = tags.split(",").map((t) => t.trim()).filter((t) => t)

        if (editingId) {
            PasterService.update(editingId, {
                title,
                content,
                tags: tagList,
            })
            toast({
                title: "Success",
                description: "Paste updated successfully.",
            })
            setEditingId(null)
        } else {
            PasterService.create({
                title,
                content,
                type: "text", // Defaulting to text for now
                tags: tagList,
            })
            toast({
                title: "Success",
                description: "Paste saved successfully.",
            })
        }

        // Reset form
        setTitle("")
        setContent("")
        setTags("")
        setEditingId(null)

        // Refresh list and switch tab
        loadPastes()
        setActiveTab("list")
    }

    const handleEdit = (paste: Paste) => {
        setTitle(paste.title)
        setContent(paste.content)
        setTags(paste.tags.join(", "))
        setEditingId(paste.id)
        setActiveTab("create")
    }

    const handleCancelEdit = () => {
        setTitle("")
        setContent("")
        setTags("")
        setEditingId(null)
    }

    const handleShare = async (paste: Paste) => {
        const textToShare = `${paste.title}\n\n${paste.content}`

        if (navigator.share) {
            try {
                await navigator.share({
                    title: paste.title,
                    text: paste.content,
                })
            } catch (error) {
                console.error("Error sharing:", error)
            }
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(textToShare)
            toast({
                title: "Copied to Clipboard",
                description: "Sharing not supported on this device, content copied instead.",
            })
        }
    }

    const handleDelete = (id: string) => {
        if (PasterService.delete(id)) {
            toast({
                title: "Deleted",
                description: "Paste removed successfully.",
            })
            loadPastes()
        }
    }

    const handleCopy = (content: string, id: string) => {
        navigator.clipboard.writeText(content)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
        toast({
            title: "Copied",
            description: "Content copied to clipboard.",
        })
    }

    return (
        <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="create">{editingId ? "Edit Paste" : "Create Paste"}</TabsTrigger>
                    <TabsTrigger value="list">My Pastes</TabsTrigger>
                </TabsList>

                <TabsContent value="create" className="space-y-4 pt-4">
                    <div className="space-y-4">
                        {editingId && (
                            <div className="bg-muted p-4 rounded-md flex items-center justify-between">
                                <div className="flex items-center text-sm font-medium">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Editing: <span className="text-primary ml-1">{title || "Untitled"}</span>
                                </div>
                                <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                                    <X className="h-4 w-4 mr-1" /> Cancel
                                </Button>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                placeholder="e.g., React Component Snippet"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                placeholder="Paste your text or code here..."
                                className="min-h-[300px] font-mono"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags (comma separated)</Label>
                            <div className="flex items-center space-x-2">
                                <Tag className="h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="tags"
                                    placeholder="react, ui, component"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                />
                            </div>
                        </div>

                        <Button onClick={handleSave} className="w-full sm:w-auto">
                            {editingId ? (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Update Paste
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Paste
                                </>
                            )}
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value="list" className="space-y-4 pt-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search pastes by title, content, or tags..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <ScrollArea className="h-[600px] pr-4">
                        {pastes.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <Clipboard className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                <p>No pastes found. Create one to get started!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {pastes.map((paste) => (
                                    <Card key={paste.id} className="group hover:shadow-md transition-shadow">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <CardTitle className="text-lg font-medium">{paste.title}</CardTitle>
                                                    <CardDescription className="text-xs mt-1">
                                                        {new Date(paste.createdAt).toLocaleDateString()} • {new Date(paste.createdAt).toLocaleTimeString()}
                                                    </CardDescription>
                                                </div>
                                                <div className="flex space-x-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleCopy(paste.content, paste.id)}
                                                        title="Copy content"
                                                    >
                                                        {copiedId === paste.id ? (
                                                            <Check className="h-4 w-4 text-green-500" />
                                                        ) : (
                                                            <Copy className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleShare(paste)}
                                                        title="Share"
                                                    >
                                                        <Share2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleEdit(paste)}
                                                        title="Edit"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() => handleDelete(paste.id)}
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pb-3">
                                            <div className="relative bg-muted/50 p-3 rounded-md font-mono text-sm max-h-[150px] overflow-hidden">
                                                {paste.content}
                                                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-muted/50 to-transparent pointer-events-none" />
                                            </div>
                                        </CardContent>
                                        <CardFooter className="pt-0">
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {paste.tags.map((tag, idx) => (
                                                    <Badge key={idx} variant="outline" className="text-xs">
                                                        #{tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </TabsContent>
            </Tabs>
        </div>
    )
}
