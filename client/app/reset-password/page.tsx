"use client";

import Link from "next/link";
import { useState } from "react";
import { KeyRound, Eye, EyeOff, CheckCircle2, ArrowRight } from "lucide-react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Card, { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Validation states
    const [passwordError, setPasswordError] = useState("");
    const [confirmError, setConfirmError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const validateForm = () => {
        let isValid = true;

        if (!password) {
            setPasswordError("Password is required");
            isValid = false;
        } else if (password.length < 8) {
            setPasswordError("Password must be at least 8 characters");
            isValid = false;
        } else {
            setPasswordError("");
        }

        if (!confirmPassword) {
            setConfirmError("Please confirm your password");
            isValid = false;
        } else if (password !== confirmPassword) {
            setConfirmError("Passwords do not match");
            isValid = false;
        } else {
            setConfirmError("");
        }

        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);
        }, 1500);
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
                        <CardTitle className="text-xl text-center font-bold">Reset Password</CardTitle>
                        <CardDescription className="text-center text-slate-400">
                            Enter your new credentials to recover workspace access
                        </CardDescription>
                    </CardHeader>

                    {!isSuccess ? (
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-4">
                                <Input
                                    label="New Password"
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

                                <Input
                                    label="Confirm New Password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        if (confirmError) setConfirmError("");
                                    }}
                                    error={confirmError}
                                    placeholder="••••••••"
                                    icon={<KeyRound className="h-4 w-4" />}
                                />
                            </CardContent>

                            <CardFooter className="flex flex-col gap-4 mt-2">
                                <Button type="submit" isLoading={isLoading} className="w-full text-slate-950 font-bold">
                                    Update Password
                                </Button>
                            </CardFooter>
                        </form>
                    ) : (
                        <CardContent className="space-y-6 py-4 flex flex-col items-center text-center">
                            <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
                                <CheckCircle2 className="h-6 w-6" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-white">Password Updated!</h3>
                                <p className="text-xs text-slate-400 max-w-xs">
                                    Your password has been successfully updated. You can now log back into the workspace.
                                </p>
                            </div>
                            <div className="pt-2 w-full">
                                <Link href="/login">
                                    <Button className="w-full text-slate-950 font-bold flex items-center justify-center gap-1.5">
                                        Back to Sign In
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    )}
                </Card>
            </div>
        </div>
    );
}
