"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Brain, Search, Command, LayoutDashboard, FileText, Languages, Code2, MessageSquare, Menu, X, ArrowUpRight, History, StickyNote, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

const links = [
  { label: "Home", href: "/", exact: true },
  { label: "AI Tools", href: "/search" },
  { label: "Workspace", href: "/utilities" },
  { label: "Notes", href: "/notes" },
  { label: "History", href: "/history" },
]
const commands = [
  { label: "Explore AI tools", detail: "Search the directory", href: "/search", icon: Search },
  { label: "Summarizer", detail: "Turn long text into the essentials", href: "/utilities", icon: FileText },
  { label: "Translator", detail: "Translate with context", href: "/utilities", icon: Languages },
  { label: "Code assistant", detail: "Generate and refine code", href: "/utilities", icon: Code2 },
  { label: "AI chat", detail: "Talk through an idea", href: "/orchestrator", icon: MessageSquare },
  { label: "Notes", detail: "Save useful prompts and answers", href: "/notes", icon: StickyNote },
  { label: "History", detail: "Continue a saved conversation", href: "/history", icon: History },
  { label: "Dashboard", detail: "Your personal command center", href: "/dashboard", icon: LayoutDashboard },
]

export function SiteHeader() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const navRef = useRef<HTMLElement>(null)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [query, setQuery] = useState("")
  const reduceMotion = Boolean(useReducedMotion())
  const { scrollY } = useScroll()
  const headerOpacity = useTransform(scrollY, [0, 48], [.8, .96])
  const headerShadow = useTransform(scrollY, [0, 48], ["0 8px 26px rgba(30,35,60,.07)", "0 14px 38px rgba(30,35,60,.13)"])
  const headerBackground = useTransform(headerOpacity, (alpha) => `rgba(255,255,255,${alpha})`)
  const headerBlur = useTransform(scrollY, [0, 48], ["blur(14px)", "blur(22px)"])
  const filteredCommands = useMemo(() => commands.filter((item) => `${item.label} ${item.detail}`.toLowerCase().includes(query.toLowerCase())), [query])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setPaletteOpen((open) => !open)
      }
      if (event.key === "Escape") setMobileOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])
  useEffect(() => setMobileOpen(false), [pathname])
  useEffect(() => {
    if (!mobileOpen) return
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !navRef.current?.contains(event.target)) setMobileOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [mobileOpen])

  const openCommand = (href: string) => {
    setPaletteOpen(false)
    setMobileOpen(false)
    setQuery("")
    router.push(href)
  }
  const handleLogout = () => {
    logout()
    setMobileOpen(false)
    router.push("/login")
  }

  return (
    <>
      <motion.header ref={navRef} initial={reduceMotion ? false : { opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 110, damping: 20 }} className="site-header sticky top-0 z-50 mx-auto w-full max-w-[1480px] px-3 pt-3 sm:px-5">
        <motion.div style={{ backgroundColor: headerBackground, boxShadow: headerShadow, backdropFilter: headerBlur, WebkitBackdropFilter: headerBlur }} className="site-header-inner mx-auto grid h-[68px] w-full max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center rounded-2xl border border-slate-200/80 px-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-2">
            <motion.button whileTap={reduceMotion ? undefined : { scale: .9, rotate: 8 }} onClick={() => setMobileOpen((open) => !open)} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-600 transition hover:bg-slate-100 md:hidden" aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen}>
              <AnimatePresence mode="wait" initial={false}>{mobileOpen ? <motion.span key="close" initial={{ opacity: 0, rotate: -80 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 80 }}><X className="h-[18px] w-[18px]" /></motion.span> : <motion.span key="menu" initial={{ opacity: 0, rotate: 80 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -80 }}><Menu className="h-[18px] w-[18px]" /></motion.span>}</AnimatePresence>
            </motion.button>
            <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="AI Tool Hub home">
              <span className="brand-mark"><Brain className="h-[17px] w-[17px]" /></span>
              <span className="text-[14px] font-semibold tracking-[-.045em] text-slate-900 sm:text-base">AI Tool <span className="text-slate-500">Hub</span></span>
            </Link>
          </div>
          <nav className="hidden items-center justify-center gap-0.5 md:flex" aria-label="Main navigation">
            {links.map((item) => {
              const active = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/")
              return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={`nav-link relative ${active ? "nav-link-active" : ""}`}><span className="relative z-[1]">{item.label}</span>{active && <motion.span layoutId="active-nav-link" className="absolute inset-x-1 -inset-y-1 rounded-lg bg-violet-50" transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 30 }} />}</Link>
            })}
          </nav>
          <div className="flex items-center justify-end gap-1.5 sm:gap-2">
            <motion.button whileTap={reduceMotion ? undefined : { scale: .94 }} onClick={() => setPaletteOpen(true)} className="command-trigger hidden items-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-xs text-slate-500 transition hover:border-violet-200 hover:text-slate-800 sm:flex" aria-label="Open command palette"><Search className="h-3.5 w-3.5" /> <span>Search</span><kbd className="ml-2 inline-flex items-center gap-0.5 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-400"><Command className="h-2.5 w-2.5"/>K</kbd></motion.button>
            <motion.button whileTap={reduceMotion ? undefined : { scale: .9 }} onClick={() => setPaletteOpen(true)} className="grid h-9 w-9 place-items-center rounded-xl text-slate-600 hover:bg-slate-100 sm:hidden" aria-label="Search tools"><Search className="h-4 w-4"/></motion.button>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" aria-label="Open profile menu" className="h-9 w-9 rounded-xl p-0 hover:bg-violet-50">
                    <Avatar className="h-8 w-8 border border-violet-100">
                      <AvatarFallback className="bg-violet-100 text-xs font-semibold text-violet-700">
                        {user.name?.slice(0, 1) || user.email?.slice(0, 1) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 border-slate-200 bg-white text-slate-800 shadow-xl" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <span className="block text-sm font-medium">{user.name || "Your workspace"}</span>
                    <span className="mt-1 block text-xs text-slate-500">{user.email}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile"><UserRound className="mr-2 h-4 w-4" />Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard &amp; settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                className="inline-flex h-9 items-center justify-center gap-1 rounded-xl bg-slate-900 px-3.5 text-xs font-semibold !text-white shadow-sm transition-colors hover:bg-violet-700 sm:px-4 cursor-pointer"
              >
                <span>Sign in</span>
                <ArrowUpRight className="h-3.5 w-3.5 !text-white" />
              </Link>
            )}
          </div>
        </motion.div>
        <AnimatePresence>{mobileOpen && <motion.div initial={{ opacity: 0, y: -9, scale: .985, filter: "blur(7px)" }} animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, y: -7, scale: .985, filter: "blur(5px)" }} transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 25 }} className="mobile-nav-panel mx-auto mt-2 max-w-[1400px] rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-[0_20px_55px_rgba(34,38,70,.16)] backdrop-blur-2xl md:hidden">
          <motion.div variants={{ show: { transition: { staggerChildren: .055 } } }} initial="hidden" animate="show">{[...links, ...(user ? [{ label: "Profile", href: "/profile" }] : [{ label: "Sign in", href: "/login" }])].map((item) => <motion.div key={item.label} variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }}><Link href={item.href} onClick={() => setMobileOpen(false)} className={`mobile-nav-link ${pathname === item.href ? "mobile-nav-link-active" : ""}`}><span>{item.label}</span><ArrowUpRight className="h-4 w-4 text-slate-400"/></Link></motion.div>)}</motion.div>
          {user && <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .25 }} className="mobile-nav-link w-full text-left text-rose-600 hover:bg-rose-50" onClick={handleLogout}><span>Sign out</span><ArrowUpRight className="h-4 w-4"/></motion.button>}
        </motion.div>}</AnimatePresence>
      </motion.header>
      <Dialog open={paletteOpen} onOpenChange={(open) => { setPaletteOpen(open); if (!open) setQuery("") }}>
        <DialogContent className="command-dialog overflow-hidden border-slate-200 bg-white p-0 text-slate-800 shadow-[0_28px_100px_rgba(30,35,60,.25)] backdrop-blur-2xl sm:max-w-xl"><DialogTitle className="sr-only">Quick navigation</DialogTitle><DialogDescription className="sr-only">Search AI tools and navigate the workspace.</DialogDescription>
          <motion.div initial={{ opacity: 0, scale: .96, filter: "blur(8px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 23 }}>
            <div className="flex items-center gap-3 border-b border-slate-100 px-5"><Search className="h-4 w-4 shrink-0 text-violet-500"/><Input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tools, pages, and actions..." className="h-14 border-0 bg-transparent px-0 text-sm text-slate-800 shadow-none placeholder:text-slate-400 focus-visible:ring-0"/><kbd className="rounded-md border border-slate-200 px-1.5 py-1 text-[10px] text-slate-400">ESC</kbd></div>
            <div className="max-h-[min(60vh,420px)] overflow-y-auto p-2"><p className="px-3 pb-2 pt-2 text-[10px] font-semibold uppercase tracking-[.17em] text-slate-400">Jump to</p>{filteredCommands.length ? filteredCommands.map((item, index) => <motion.button key={item.label} initial={reduceMotion ? false : { opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: reduceMotion ? 0 : index * .04, type: "spring", stiffness: 220, damping: 22 }} whileTap={reduceMotion ? undefined : { scale: .985 }} onClick={() => openCommand(item.href)} className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-violet-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-400"><span className="grid h-9 w-9 place-items-center rounded-lg border border-slate-100 bg-violet-50 text-violet-600"><item.icon className="h-4 w-4"/></span><span className="min-w-0 flex-1"><span className="block text-sm font-medium text-slate-800">{item.label}</span><span className="mt-0.5 block text-xs text-slate-500">{item.detail}</span></span><ArrowUpRight className="h-4 w-4 text-slate-300 transition group-hover:text-violet-500"/></motion.button>) : <p className="px-3 py-8 text-center text-sm text-slate-500">No matches. Try another search.</p>}</div>
            <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2.5 text-[10px] text-slate-400"><span>AI Tool Hub</span><span>Navigate <kbd className="rounded border border-slate-200 px-1">↵</kbd></span></div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  )
}
