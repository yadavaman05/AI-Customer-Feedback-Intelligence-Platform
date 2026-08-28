"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Card, { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("demo.john@loop.ai");
    const [password, setPassword] = useState("password123");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Validation states
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [formError, setFormError] = useState("");

    const validateForm = () => {
        let isValid = true;
        setFormError("");

        // Email validation
        if (!email) {
            setEmailError("Email is required");
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError("Please enter a valid email address");
            isValid = false;
        } else {
            setEmailError("");
        }

        // Password validation
        if (!password) {
            setPasswordError("Password is required");
            isValid = false;
        } else if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters");
            isValid = false;
        } else {
            setPasswordError("");
        }

        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setFormError("");

        try {
            const apiUrl = api.getBaseUrl();
            const response = await fetch(`${apiUrl}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setFormError(data.error || "Invalid email or password.");
                setIsLoading(false);
                return;
            }

            api.auth.setToken(data.token);
            if (data.workspace) {
                localStorage.setItem("loop_workspace_id", data.workspace.id);
                localStorage.setItem("loop_workspace_slug", data.workspace.slug);
            }
            localStorage.setItem("loop_user_name", data.user.name || "");
            localStorage.setItem("loop_user_email", data.user.email || "");

            router.push("/dashboard");
        } catch (err) {
            console.error("Login failed:", err);
            setFormError("Network connection error. Ensure backend is running.");
        } finally {
            setIsLoading(false);
        }
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
                <Card className="border-slate-800 bg-slate-955/65 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="text-xl text-center font-bold">Welcome Back</CardTitle>
                        <CardDescription className="text-center text-slate-400">
                            Login to access your customer feedback workspace
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            {formError && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2.5 text-xs text-red-405">
                                    <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                    <span>{formError}</span>
                                </div>
                            )}

                            <Input
                                label="Corporate Email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (emailError) setEmailError("");
                                    if (formError) setFormError("");
                                }}
                                error={emailError}
                                placeholder="you@company.com"
                                icon={<Mail className="h-4 w-4" />}
                                disabled={isLoading}
                            />

                            <Input
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (passwordError) setPasswordError("");
                                    if (formError) setFormError("");
                                }}
                                error={passwordError}
                                placeholder="••••••••"
                                icon={<KeyRound className="h-4 w-4" />}
                                disabled={isLoading}
                                rightElement={
                                    <button
                                        type="button"
                                        disabled={isLoading}
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-slate-400 hover:text-slate-200 focus:outline-none transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                }
                            />

                            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                    <input type="checkbox" defaultChecked className="rounded bg-slate-900 border-slate-800 text-emerald-500 focus:ring-emerald-500/30 focus:ring-opacity-50" />
                                    Remember this device
                                </label>
                                <Link href="/forgot-password" className="text-slate-400 hover:text-emerald-400 Transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-4 mt-2">
                            <Button type="submit" isLoading={isLoading} className="w-full text-slate-950 font-bold">
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

