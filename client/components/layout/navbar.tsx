"use client";

<<<<<<< HEAD
import { Menu, Bell, Search } from "lucide-react";
import Badge from "../ui/badge";
=======
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, Bell, Search, ChevronDown, User as UserIcon, Settings as SettingsIcon, LogOut } from "lucide-react";
import Badge from "../ui/badge";
import { mockUser } from "@/lib/mockData";
import Link from "next/link";
>>>>>>> origin/main

interface NavbarProps {
    onMenuToggle: () => void;
    pageTitle: string;
}

export default function Navbar({ onMenuToggle, pageTitle }: NavbarProps) {
<<<<<<< HEAD
    return (
        <header className="h-16 border-b border-slate-900 bg-slate-950/40 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
            {/* Mobile Menu Icon & Title */}
=======
    const pathname = usePathname();

    // UI state toggles
    const [profileOpen, setProfileOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);

    // Dynamic breadcrumb generation
    const getBreadcrumbs = () => {
        const segments = pathname.split("/").filter(Boolean);
        if (segments.length === 0) return [{ label: "LOOP", href: "/dashboard" }];

        return [
            { label: "LOOP", href: "/dashboard" },
            ...segments.map((segment, index) => {
                const href = `/${segments.slice(0, index + 1).join("/")}`;
                // Capitalize first letter and format
                const label = segment
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase());
                return { label, href };
            })
        ];
    };

    const breadcrumbs = getBreadcrumbs();

    // Close menus on click outside
    useEffect(() => {
        if (!profileOpen && !notificationsOpen) return;

        const handleOutsideClick = () => {
            setProfileOpen(false);
            setNotificationsOpen(false);
        };

        window.addEventListener("click", handleOutsideClick);
        return () => window.removeEventListener("click", handleOutsideClick);
    }, [profileOpen, notificationsOpen]);

    return (
        <header className="h-16 border-b border-slate-905 bg-slate-955/40 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
            {/* Mobile Menu Toggle & Dynamic Breadcrumbs */}
>>>>>>> origin/main
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuToggle}
                    className="xl:hidden p-2 rounded-lg text-slate-450 hover:text-white hover:bg-slate-900 border border-slate-900 transition-colors"
                >
<<<<<<< HEAD
                    <Menu className="h-4 w-4 md:h-5 md:w-5" />
                </button>
                <h2 className="text-sm md:text-base font-bold text-white tracking-tight">
=======
                    <Menu className="h-4 w-4" />
                </button>

                {/* Breadcrumb Area */}
                <nav className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                    {breadcrumbs.map((crumb, idx) => (
                        <div key={crumb.href} className="flex items-center gap-1.5">
                            {idx > 0 && <span className="text-slate-700">/</span>}
                            <Link
                                href={crumb.href}
                                className={idx === breadcrumbs.length - 1 ? "text-emerald-400 font-semibold" : "hover:text-slate-300 transition-colors"}
                            >
                                {crumb.label}
                            </Link>
                        </div>
                    ))}
                </nav>

                <h2 className="sm:hidden text-xs font-bold text-white tracking-tight">
>>>>>>> origin/main
                    {pageTitle}
                </h2>
            </div>

            {/* Navbar Actions */}
<<<<<<< HEAD
            <div className="flex items-center gap-3">
                {/* Search Mock */}
                <div className="hidden md:flex items-center border border-slate-900 bg-slate-950/45 rounded-lg px-3 py-1.5 w-64 max-w-sm">
                    <Search className="h-3.5 w-3.5 text-slate-500 mr-2" />
                    <input
                        type="text"
                        placeholder="Search feedback..."
                        className="bg-transparent border-none outline-none text-xs text-slate-350 placeholder-slate-500 w-full"
                        readOnly
=======
            <div className="flex items-center gap-4">
                {/* Search Bar - Interactive styling */}
                <div className={`relative hidden md:flex items-center border rounded-lg px-3 py-1.5 w-64 max-w-sm transition-all duration-300 ${searchFocused
                    ? "border-emerald-500/50 bg-slate-950 shadow-md shadow-emerald-500/5 w-80"
                    : "border-slate-900 bg-slate-955/45 text-slate-400"
                    }`}>
                    <Search className="h-3.5 w-3.5 text-slate-500 mr-2" />
                    <input
                        type="text"
                        placeholder="Search feedback tickets..."
                        className="bg-transparent border-none outline-none text-xs text-slate-300 placeholder-slate-500 w-full"
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
>>>>>>> origin/main
                    />
                    <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-4xs font-mono bg-slate-900 border border-slate-800 text-slate-500 rounded">
                        ⌘K
                    </kbd>
                </div>

<<<<<<< HEAD
                {/* Notifications Mock */}
                <div className="relative">
                    <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-900 transition-colors">
                        <Bell className="h-3.5 w-3.5 md:h-4 md:w-4" />
                        <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/20" />
                    </button>
                </div>

                {/* Environment Badge */}
                <Badge variant="success" className="py-1 px-3 hidden xs:inline-flex">
                    Sandbox
                </Badge>
=======
                {/* Notifications Panel */}
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => {
                            setNotificationsOpen(!notificationsOpen);
                            setProfileOpen(false);
                        }}
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-900 transition-colors relative"
                    >
                        <Bell className="h-4 w-4" />
                        <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/20 animate-pulse" />
                    </button>

                    {/* Notifications Dropdown Window */}
                    {notificationsOpen && (
                        <div className="absolute right-0 mt-2.5 w-80 rounded-xl border border-slate-800 bg-slate-955 p-2 shadow-xl shadow-slate-955/50 z-50">
                            <div className="px-3 py-2 border-b border-slate-900 flex justify-between items-center">
                                <span className="text-xs font-semibold text-white">Recent Realtime Alerts</span>
                                <Badge variant="success" className="text-4xs py-0.5">3 New</Badge>
                            </div>
                            <div className="divide-y divide-slate-900 max-h-64 overflow-y-auto">
                                <div className="p-3 text-2xs hover:bg-slate-900/40 cursor-pointer transition-colors max-w-full">
                                    <div className="flex gap-2">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                                        <div>
                                            <p className="text-slate-200 font-medium font-sans">Negative sentiment Spike detected</p>
                                            <p className="text-slate-500 text-3xs mt-1">5 new billing queries flagged by AI engine</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 text-2xs hover:bg-slate-900/40 cursor-pointer transition-colors max-w-full">
                                    <div className="flex gap-2">
                                        <div className="h-2 w-2 rounded-full bg-blue-500 mt-1 shrink-0" />
                                        <div>
                                            <p className="text-slate-200 font-medium font-sans">Weekly report compilation complete</p>
                                            <p className="text-slate-500 text-3xs mt-1">Analytics summaries ready for export</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 text-2xs hover:bg-slate-900/40 cursor-pointer transition-colors max-w-full">
                                    <div className="flex gap-2">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                                        <div>
                                            <p className="text-slate-203 font-medium font-sans">Database optimization resolved</p>
                                            <p className="text-slate-500 text-3xs mt-1">Edge response latency resolved in EU-West</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile Profile Dropdown */}
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => {
                            setProfileOpen(!profileOpen);
                            setNotificationsOpen(false);
                        }}
                        className="flex items-center gap-2 px-2 py-1 border border-slate-900 hover:border-slate-800 hover:bg-slate-900/30 rounded-lg transition-all"
                    >
                        <div className="h-7 w-7 rounded-lg bg-emerald-500/20 text-emerald-450 border border-emerald-500/30 flex items-center justify-center font-bold text-xs select-none">
                            {mockUser.avatarInitials}
                        </div>
                        <span className="hidden sm:inline text-xs font-semibold text-slate-300 max-w-[80px] truncate">{mockUser.name}</span>
                        <ChevronDown className={`h-3 w-3 text-slate-500 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                    </button>

                    {/* Dropdown Menu Box */}
                    {profileOpen && (
                        <div className="absolute right-0 mt-2.5 w-56 rounded-xl border border-slate-800 bg-slate-955 p-1.5 shadow-xl shadow-slate-955/50 z-50">
                            <div className="px-3 py-2 border-b border-slate-900">
                                <p className="text-xs font-semibold text-white truncate">{mockUser.name}</p>
                                <p className="text-4xs text-slate-500 truncate mt-0.5">{mockUser.email}</p>
                            </div>
                            <div className="py-1">
                                <Link
                                    href="/settings"
                                    onClick={() => setProfileOpen(false)}
                                    className="flex items-center gap-2.5 px-3 py-2 text-2xs text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
                                >
                                    <UserIcon className="h-3.5 w-3.5 text-slate-500" />
                                    Workspace Profile
                                </Link>
                                <Link
                                    href="/settings"
                                    onClick={() => setProfileOpen(false)}
                                    className="flex items-center gap-2.5 px-3 py-2 text-2xs text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
                                >
                                    <SettingsIcon className="h-3.5 w-3.5 text-slate-500" />
                                    Account Configurations
                                </Link>
                            </div>
                            <div className="border-t border-slate-900 my-1" />
                            <Link
                                href="/login"
                                onClick={() => setProfileOpen(false)}
                                className="flex items-center gap-2.5 px-3 py-2 text-2xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                                <LogOut className="h-3.5 w-3.5 text-red-500" />
                                Sign Out
                            </Link>
                        </div>
                    )}
                </div>
>>>>>>> origin/main
            </div>
        </header>
    );
}
export type { NavbarProps };

<<<<<<< HEAD
=======

>>>>>>> origin/main
