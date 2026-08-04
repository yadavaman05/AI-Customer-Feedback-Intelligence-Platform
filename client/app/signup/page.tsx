"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Mail, User } from "lucide-react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Card, { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignupPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
        <div className="min-h-screen w-screen flex items-center justify-center bg-background grid-bg p-4 text-slate-105">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl animate-pulse-glow" />

            <div className="w-full max-w-md relative z-10">
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

                <Card className="border-slate-805 bg-slate-955/65">
                    <CardHeader>
                        <CardTitle className="text-xl text-center font-bold">Create Workspace</CardTitle>
                        <CardDescription className="text-center font-medium">
                            Start aggregating and analyzing user feedback in 60 seconds
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <Input
                                label="Full Name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Jane Doe"
                                icon={<User className="h-4 w-4" />}
                            />
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
                        </CardContent>

                        <CardFooter className="flex flex-col gap-4 mt-2">
                            <Button type="submit" isLoading={isLoading} className="w-full text-slate-950 font-bold">
                                Create Free Account
                            </Button>
                            <div className="text-xs text-center text-slate-500 w-full">
                                Already have a workspace?{" "}
                                <Link href="/login" className="text-emerald-400 hover:underline font-semibold">
                                    Sign in
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}
