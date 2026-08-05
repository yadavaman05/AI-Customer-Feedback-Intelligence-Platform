"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Mail } from "lucide-react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Card, { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("demo.john@loop.ai");
    const [password, setPassword] = useState("password123");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            router.push("/dashboard");
        }, 1000);
    };

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-background grid-bg p-4 text-slate-100">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl animate-pulse-glow" />

            <div className="w-full max-w-md relative z-10">
                {/* Brand logo header */}
                <div className="flex flex-col items-center mb-8">
                    <Link href="/" className="flex items-center gap-2 group mb-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 font-bold text-slate-950 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-all">
                            L
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                            LOOP
                        </h1>
                    </Link>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">
                        AI Customer Feedback Intelligence
                    </p>
                </div>

                {/* Card Panel */}
                <Card className="border-slate-800 bg-slate-950/65">
                    <CardHeader>
                        <CardTitle className="text-xl text-center font-bold">Welcome Back</CardTitle>
                        <CardDescription className="text-center">
                            Login to access your customer feedback workspace
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <Input
                                label="Corporate Email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@company.com"
                                icon={<Mail className="h-4 w-4" />}
                            />
                            <Input
                                label="Password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                icon={<KeyRound className="h-4 w-4" />}
                            />
                            <div className="flex items-center justify-between text-xs text-slate-400">
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                    <input type="checkbox" defaultChecked className="rounded bg-slate-900 border-slate-805 text-primary focus:ring-opacity-50" />
                                    Remember this device
                                </label>
                                <a href="#" className="hover:text-emerald-400 transition-colors">Forgot password?</a>
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-4 mt-2">
                            <Button type="submit" isLoading={isLoading} className="w-full text-slate-955 font-bold">
                                Sign In to Workspace
                            </Button>
                            <div className="text-xs text-center text-slate-500 w-full">
                                Don&apos;t have a workspace?{" "}
                                <Link href="/signup" className="text-emerald-400 hover:underline font-semibold">
                                    Sign up free
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}
