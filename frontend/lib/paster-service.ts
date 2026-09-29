export interface Paste {
    id: string
    title: string
    content: string
    type: "text" | "code"
    tags: string[]
    createdAt: number
    updatedAt: number
}

const STORAGE_KEY = "ai_hub_pastes"

export const PasterService = {
    // Get all pastes
    getAll: (): Paste[] => {
        if (typeof window === "undefined") return []
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            return stored ? JSON.parse(stored) : []
        } catch (error) {
            console.error("Error loading pastes:", error)
            return []
        }
    },

    // Get a single paste by ID
    getById: (id: string): Paste | undefined => {
        const pastes = PasterService.getAll()
        return pastes.find((p) => p.id === id)
    },

    // Create a new paste
    create: (paste: Omit<Paste, "id" | "createdAt" | "updatedAt">): Paste => {
        const pastes = PasterService.getAll()
        const newPaste: Paste = {
            ...paste,
            id: crypto.randomUUID(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
        }
        const updatedPastes = [newPaste, ...pastes]
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPastes))
        return newPaste
    },

    // Update an existing paste
    update: (id: string, updates: Partial<Omit<Paste, "id" | "createdAt">>): Paste | null => {
        const pastes = PasterService.getAll()
        const index = pastes.findIndex((p) => p.id === id)
        if (index === -1) return null

        const updatedPaste = {
            ...pastes[index],
            ...updates,
            updatedAt: Date.now(),
        }
        pastes[index] = updatedPaste
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pastes))
        return updatedPaste
    },

    // Delete a paste
    delete: (id: string): boolean => {
        const pastes = PasterService.getAll()
        const filtered = pastes.filter((p) => p.id !== id)
        if (filtered.length === pastes.length) return false

        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
        return true
    },

    // Search pastes
    search: (query: string): Paste[] => {
        const pastes = PasterService.getAll()
        const lowerQuery = query.toLowerCase()

        return pastes.filter((p) =>
            p.title.toLowerCase().includes(lowerQuery) ||
            p.content.toLowerCase().includes(lowerQuery) ||
            p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        )
    }
}
