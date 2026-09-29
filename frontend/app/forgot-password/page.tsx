import Link from "next/link"
import { ArrowLeft, KeyRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ForgotPasswordPage() {
  return <section className="mx-auto max-w-lg py-10"><Card className="border-slate-200 bg-white shadow-sm"><CardHeader><span className="mb-2 grid h-11 w-11 place-items-center rounded-xl bg-violet-50 text-violet-700"><KeyRound className="h-5 w-5"/></span><CardTitle>Password recovery</CardTitle><CardDescription>Password reset is not configured for this local account system.</CardDescription></CardHeader><CardContent><p className="text-sm leading-6 text-slate-600">Accounts are stored in this browser. If you registered here, sign in with the same email and password on this device. There is no password reset service connected to the project yet.</p>        <div className="mt-6 flex gap-3">
          <Button asChild className="rounded-xl bg-violet-600 !text-white shadow-sm hover:bg-violet-700">
            <Link href="/login" className="!text-white">Back to sign in</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/signup">Create account</Link>
          </Button>
        </div><Link href="/" className="mt-5 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-violet-700"><ArrowLeft className="h-4 w-4"/>Home</Link></CardContent></Card></section>
}
