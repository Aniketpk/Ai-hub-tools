"use client"

import { Check, Sparkles, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import Link from "next/link"

export default function PricingPage() {
    const plans = [
        {
            name: "Free",
            price: "$0",
            description: "Perfect for exploring AI tools and basic usage.",
            features: [
                "5 AI generations per day",
                "Access to basic models",
                "Standard processing speed",
                "Community support",
                "Basic tool access"
            ],
            current: true,
            popular: false,
            gradient: "from-slate-500 to-slate-700",
            buttonVariant: "outline" as const
        },
        {
            name: "Pro",
            price: "$19",
            period: "/month",
            description: "Unlock your creative potential with advanced features.",
            features: [
                "Unlimited AI generations",
                "Access to GPT-4 & Claude 3",
                "Fast processing speed",
                "Priority email support",
                "Access to all tools",
                "No watermarks",
                "Commercial usage rights"
            ],
            current: false,
            popular: true,
            gradient: "from-primary via-secondary to-accent",
            buttonVariant: "default" as const
        },
        {
            name: "Team",
            price: "$49",
            period: "/month",
            description: "Collaborate and scale with your entire team.",
            features: [
                "Everything in Pro",
                "Team collaboration tools",
                "Admin dashboard",
                "API access",
                "Dedicated account manager",
                "Custom integrations",
                "SSO Authentication"
            ],
            current: false,
            popular: false,
            gradient: "from-purple-600 to-indigo-600",
            buttonVariant: "outline" as const
        }
    ]

    return (
        <div className="min-h-screen bg-background py-20 px-4 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-[pulse-glow_8s_infinite]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px] animate-[pulse-glow_10s_infinite_reverse]" />
            </div>

            <div className="container mx-auto max-w-7xl">
                <div className="text-center mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Badge variant="outline" className="px-4 py-1.5 text-sm rounded-full border-primary/50 text-primary bg-primary/5 backdrop-blur-sm mb-4">
                            <Sparkles className="w-3.5 h-3.5 mr-2 inline-block" />
                            Upgrade your workflow
                        </Badge>
                        <h1 className="text-5xl md:text-6xl font-serif font-black mb-6">
                            Choose Your <span className="text-gradient">Power</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
                            Unlock the full potential of AI with our flexible pricing plans.
                            Scale as you grow, cancel anytime.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`relative ${plan.popular ? 'md:-mt-8' : ''}`}
                        >
                            <Card className={`relative overflow-hidden border-2 h-full flex flex-col ${plan.popular
                                ? 'border-primary shadow-[0_0_30px_rgba(var(--primary),0.3)]'
                                : 'border-white/10 hover:border-white/20'
                                } bg-card/50 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02]`}>

                                {plan.popular && (
                                    <div className="absolute top-0 right-0">
                                        <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xs font-bold px-8 py-1 transform rotate-45 translate-x-8 translate-y-4 shadow-lg">
                                            POPULAR
                                        </div>
                                    </div>
                                )}

                                <CardHeader className="pb-8">
                                    <CardTitle className="text-2xl font-bold mb-2 flex items-center gap-2">
                                        {plan.name}
                                        {plan.name === "Pro" && <Crown className="w-5 h-5 text-yellow-400 fill-yellow-400" />}
                                    </CardTitle>
                                    <CardDescription className="text-base">{plan.description}</CardDescription>
                                </CardHeader>

                                <CardContent className="flex-1">
                                    <div className="mb-8">
                                        <span className="text-5xl font-black">{plan.price}</span>
                                        <span className="text-muted-foreground font-medium">{plan.period}</span>
                                    </div>

                                    <div className="space-y-4">
                                        {plan.features.map((feature) => (
                                            <div key={feature} className="flex items-start gap-3">
                                                <div className={`mt-1 p-0.5 rounded-full ${plan.popular ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                                    <Check className="w-3.5 h-3.5" />
                                                </div>
                                                <span className="text-sm font-medium opacity-90">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>

                                <CardFooter className="pt-8">
                                    <Button
                                        className={`w-full rounded-full h-12 text-lg font-semibold transition-all duration-300 ${plan.popular
                                            ? 'bg-gradient-to-r from-primary to-secondary hover:brightness-110 shadow-lg shadow-primary/25'
                                            : 'hover:bg-primary/10 hover:text-primary'
                                            }`}
                                        variant={plan.buttonVariant}
                                        asChild={!plan.current}
                                    >
                                        {plan.current ? (
                                            <span>Current Plan</span>
                                        ) : (
                                            <Link href={`/signup?plan=${plan.name.toLowerCase()}`}>Get Started</Link>
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <h3 className="text-2xl font-bold mb-8">Trusted by Payment Partners</h3>
                    <div className="flex justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Mock Logos for Stripe, PayPal, etc */}
                        <span className="text-2xl font-black tracking-tighter">Stripe</span>
                        <span className="text-2xl font-black tracking-tighter italic">PayPal</span>
                        <span className="text-2xl font-black tracking-tighter">Visa</span>
                        <span className="text-2xl font-black tracking-tighter">Mastercard</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
