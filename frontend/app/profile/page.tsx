"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, LayoutDashboard, LogOut, Mail } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProfilePage() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const reduceMotion = Boolean(useReducedMotion())
  useEffect(() => { if (!isLoading && !user) router.replace("/login") }, [isLoading, user, router])
  if (isLoading || !user) return <div className="mx-auto max-w-3xl py-12" role="status" aria-label="Loading profile"><div className="h-44 animate-pulse rounded-2xl bg-muted"/></div>

  return <motion.section initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 110, damping: 20 }} className="mx-auto max-w-3xl py-6">
    <p className="text-xs font-semibold uppercase tracking-[.16em] text-violet-600">Account</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Profile</h1><p className="mt-2 text-sm text-slate-500">Your AI Tool Hub account details and workspace settings.</p>
    <Card className="mt-7 border-slate-200 bg-white shadow-sm"><CardHeader className="flex flex-row items-center gap-4"><Avatar className="h-14 w-14"><AvatarFallback className="bg-violet-100 text-lg font-semibold text-violet-700">{user.name?.slice(0,1) || user.email?.slice(0,1) || "U"}</AvatarFallback></Avatar><div><CardTitle>{user.name || "Your workspace"}</CardTitle><CardDescription>Member since {new Date(user.joinDate).toLocaleDateString()}</CardDescription></div></CardHeader><CardContent className="space-y-4"><div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4"><Mail className="h-4 w-4 text-slate-500"/><span className="text-sm text-slate-700">{user.email}</span></div><div className="flex flex-wrap gap-3">          <Button asChild className="rounded-xl bg-violet-600 !text-white shadow-sm hover:bg-violet-700">
            <Link href="/dashboard" className="inline-flex items-center !text-white">
              <LayoutDashboard className="mr-2 h-4 w-4 !text-white"/>Dashboard &amp; settings
            </Link>
          </Button><Button variant="outline" asChild><Link href="/notes">Your notes<ArrowRight className="ml-2 h-4 w-4"/></Link></Button><Button variant="ghost" onClick={() => { logout(); router.replace("/login") }} className="text-rose-600 hover:bg-rose-50"><LogOut className="mr-2 h-4 w-4"/>Sign out</Button></div></CardContent></Card>
  </motion.section>
}
