"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Mail, User, Eye, EyeOff, AlertCircle } from "lucide-react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Card, { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";

export default function SignupPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Validation states
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [formError, setFormError] = useState("");

    const validateForm = () => {
        let isValid = true;
        setFormError("");

        // Name validation
        if (!name.trim()) {
            setNameError("Full name is required");
            isValid = false;
        } else {
            setNameError("");
        }

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
        } else if (password.length < 8) {
            setPasswordError("Password must be at least 8 characters");
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
            const response = await fetch(`${apiUrl}/api/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setFormError(data.error || "Failed to create account.");
                setIsLoading(false);
                return;
            }

            // Automatically log in
            const loginRes = await fetch(`${apiUrl}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const loginData = await loginRes.json();

            if (!loginRes.ok) {
                setFormError("Account created successfully, but automatic login failed. Please sign in manually.");
                setIsLoading(false);
                return;
            }

            api.auth.setToken(loginData.token);
            if (loginData.workspace) {
                localStorage.setItem("loop_workspace_id", loginData.workspace.id);
                localStorage.setItem("loop_workspace_slug", loginData.workspace.slug);
            }
            localStorage.setItem("loop_user_name", loginData.user.name || "");
            localStorage.setItem("loop_user_email", loginData.user.email || "");

            router.push("/dashboard");
        } catch (err) {
            console.error("Signup failed:", err);
            setFormError("Network connection error. Ensure backend is running.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-background grid-bg p-4 text-slate-100">
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

                <Card className="border-slate-805 bg-slate-955/65 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="text-xl text-center font-bold">Create Workspace</CardTitle>
                        <CardDescription className="text-center text-slate-400 font-medium">
                            Start aggregating and analyzing user feedback in 60 seconds
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
                                label="Full Name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (nameError) setNameError("");
                                }}
                                error={nameError}
                                placeholder="Jane Doe"
                                icon={<User className="h-4 w-4" />}
                            />

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

                            <Input
                                label="Password (min 8 chars)"
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (passwordError) setPasswordError("");
                                }}
                                error={passwordError}
                                placeholder="••••••••"
                                icon={<KeyRound className="h-4 w-4" />}
                                rightElement={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-slate-400 hover:text-slate-205 focus:outline-none transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                }
                            />
                        </CardContent>

                        <CardFooter className="flex flex-col gap-4 mt-2">
                            <Button type="submit" isLoading={isLoading} className="w-full text-slate-955 font-bold">
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

