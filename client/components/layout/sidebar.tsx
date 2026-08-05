"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    MessageSquare,
<<<<<<< HEAD
    BarChart3,
=======
>>>>>>> origin/main
    Sparkles,
    FileText,
    Settings,
    X,
    Home
} from "lucide-react";
<<<<<<< HEAD

export const navigationItems = [
    { name: "Home Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Feedback Inbox", href: "/feedback", icon: MessageSquare },
    { name: "Analytics Dashboard", href: "/analytics", icon: BarChart3 },
    { name: "Ask LOOP (AI)", href: "/ask-loop", icon: Sparkles },
    { name: "Reports Workspace", href: "/reports", icon: FileText },
=======
import { mockUser } from "@/lib/mockData";

export const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Feedback", href: "/feedback", icon: MessageSquare },
    { name: "Ask LOOP", href: "/ask-loop", icon: Sparkles },
    { name: "Reports", href: "/reports", icon: FileText },
>>>>>>> origin/main
    { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
    isOpen: boolean;
    onClose?: () => void;
    className?: string;
}

export default function Sidebar({ isOpen, onClose, className }: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Overlay backdrop */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-xs xl:hidden"
                />
            )}
            <aside
                className={cn(
<<<<<<< HEAD
                    "fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-900 bg-slate-950/80 backdrop-blur-md transition-transform duration-300 xl:translate-x-0 xl:static xl:flex xl:flex-col",
=======
                    "fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-900 bg-slate-955/80 backdrop-blur-md transition-transform duration-300 xl:translate-x-0 xl:static xl:flex xl:flex-col",
>>>>>>> origin/main
                    isOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0",
                    className
                )}
            >
                {/* Sidebar Header */}
                <div className="flex h-16 items-center justify-between px-6 border-b border-slate-900">
<<<<<<< HEAD
                    <Link href="/" className="flex items-center gap-2 group">
=======
                    <Link href="/dashboard" className="flex items-center gap-2 group">
>>>>>>> origin/main
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 font-bold text-slate-950 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-all">
                            L
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                            LOOP
                        </span>
                    </Link>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="xl:hidden p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>

                {/* Sidebar Links */}
                <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto">
                    <div className="px-3 mb-3 text-3xs font-semibold text-slate-500 uppercase tracking-wider">
                        Workspace Pages
                    </div>
                    {navigationItems.map((item) => {
<<<<<<< HEAD
                        const isActive = pathname === item.href;
=======
                        const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard");
>>>>>>> origin/main
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all group border-l-2 border-transparent",
                                    isActive
<<<<<<< HEAD
                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500"
=======
                                        ? "bg-emerald-500/10 text-emerald-450 border-emerald-500"
>>>>>>> origin/main
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                                )}
                            >
                                <Icon
                                    className={cn(
                                        "h-4 w-4 md:h-5 md:w-5 transition-colors",
<<<<<<< HEAD
                                        isActive ? "text-emerald-400" : "text-slate-400 group-hover:text-slate-200"
=======
                                        isActive ? "text-emerald-450" : "text-slate-400 group-hover:text-slate-200"
>>>>>>> origin/main
                                    )}
                                />
                                {item.name}
                            </Link>
                        );
                    })}

                    <div className="pt-4 border-t border-slate-900 my-4" />
                    <Link
                        href="/"
                        onClick={onClose}
<<<<<<< HEAD
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs md:text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
=======
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs md:text-sm font-medium text-slate-400 hover:text-slate-202 hover:bg-slate-900/60"
>>>>>>> origin/main
                    >
                        <Home className="h-4 w-4 md:h-5 md:w-5 text-slate-400" />
                        Landing Page
                    </Link>
                </nav>

                {/* Sidebar Footer */}
<<<<<<< HEAD
                <div className="p-4 border-t border-slate-900 bg-slate-950/40">
                    <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg mb-3">
                        <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center font-bold text-emerald-400 border border-emerald-500/30 text-xs shadow-inner">
                            JD
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <h4 className="text-xs font-semibold text-white truncate">John Doe</h4>
                            <p className="text-4xs text-slate-500 truncate">demo.john@loop.ai</p>
=======
                <div className="p-4 border-t border-slate-900 bg-slate-955/40">
                    <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg mb-3">
                        <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center font-bold text-emerald-450 border border-emerald-500/30 text-xs shadow-inner">
                            {mockUser.avatarInitials}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <h4 className="text-xs font-semibold text-white truncate">{mockUser.name}</h4>
                            <p className="text-4xs text-slate-500 truncate">{mockUser.email}</p>
>>>>>>> origin/main
                        </div>
                    </div>
                    <Link
                        href="/login"
                        className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-medium border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                    >
                        Sign Out
                    </Link>
                </div>
            </aside>
        </>
    );
}
export type { SidebarProps };

<<<<<<< HEAD
=======

>>>>>>> origin/main
