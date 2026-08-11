"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbar";
import { usePathname, useRouter } from "next/navigation";
import { formatCapitalize } from "@/utils/format";
import { api } from "@/lib/api";
import Spinner from "@/components/ui/spinner";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const token = api.auth.getToken();
        if (!token) {
            router.replace("/login");
        } else {
            setIsCheckingAuth(false);
        }
    }, [router]);

    // Generate page title based on path
    const getPageTitle = (path: string) => {
        if (path === "/dashboard") return "Overview Dashboard";
        if (path === "/feedback") return "Customer Feedback Inbox";
        if (path === "/analytics") return "Feedback Analytics";
        if (path === "/ask-loop") return "Ask LOOP - AI Insights";
        if (path === "/reports") return "Generated Workspace Reports";
        if (path === "/settings") return "Workspace Configurations";

        // Fallback formatting
        const segments = path.split("/").filter(Boolean);
        if (segments.length === 0) return "Overview";
        return formatCapitalize(segments[segments.length - 1]);
    };

    if (isCheckingAuth) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-background text-slate-105 font-sans">
                <div className="flex flex-col items-center gap-3">
                    <Spinner size="md" className="text-emerald-500" />
                    <span className="text-xs text-slate-400 font-mono">Verifying credentials...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-background font-sans grid-bg text-slate-105 antialiased">
            {/* Sidebar navigation */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main viewport */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
                {/* Top Navbar */}
                <Navbar
                    onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
                    pageTitle={getPageTitle(pathname)}
                />

                {/* Content Wrapper */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8 bg-slate-950/20">
                    {children}
                </main>
            </div>
        </div>
    );
}
