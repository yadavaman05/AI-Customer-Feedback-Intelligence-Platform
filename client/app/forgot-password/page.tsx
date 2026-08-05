"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Card, { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Email validation check
        if (!email) {
            setEmailError("Email is required");
            return;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError("Please enter a valid email address");
            return;
        } else {
            setEmailError("");
        }

        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-background grid-bg p-4 text-slate-100">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl" />

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

                <Card className="border-slate-805 bg-slate-955/65 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="text-xl text-center font-bold">Forgot Password</CardTitle>
                        <CardDescription className="text-center text-slate-400">
                            We will send you a secure link to reset your workspace password
                        </CardDescription>
                    </CardHeader>

                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-4">
                                <Input
                                    label="Corporate Email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (emailError) setEmailError("");
                                    }}
                                    error={emailError}
                                    placeholder="you@company.com"
                                    icon={<Mail className="h-4 w-4" />}
                                />
                            </CardContent>

                            <CardFooter className="flex flex-col gap-4 mt-2">
                                <Button type="submit" isLoading={isLoading} className="w-full text-slate-950 font-bold">
                                    Send Reset Link
                                </Button>
                                <div className="text-xs text-center w-full">
                                    <Link href="/login" className="text-slate-400 hover:text-white inline-flex items-center gap-1.5 transition-colors">
                                        <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
                                    </Link>
                                </div>
                            </CardFooter>
                        </form>
                    ) : (
                        <CardContent className="space-y-6 py-4 flex flex-col items-center text-center">
                            <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
                                <CheckCircle2 className="h-6 w-6" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-white">Reset link sent!</h3>
                                <p className="text-xs text-slate-400 max-w-xs">
                                    Check your inbox at <span className="text-slate-200 font-semibold">{email}</span> for instructions. The demo link is also available directly below.
                                </p>
                            </div>
                            <div className="pt-2 w-full">
                                <Link href="/reset-password">
                                    <Button variant="outline" className="w-full text-xs">
                                        Simulate Clicking Reset Link (Demo)
                                    </Button>
                                </Link>
                            </div>
                            <div className="text-xs text-center pt-2">
                                <Link href="/login" className="text-slate-400 hover:text-white inline-flex items-center gap-1.5 transition-colors">
                                    <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
                                </Link>
                            </div>
                        </CardContent>
                    )}
                </Card>
            </div>
        </div>
    );
}
