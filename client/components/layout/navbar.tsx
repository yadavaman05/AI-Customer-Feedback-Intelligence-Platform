"use client";

import { Menu, Bell, Search } from "lucide-react";
import Badge from "../ui/badge";

interface NavbarProps {
    onMenuToggle: () => void;
    pageTitle: string;
}

export default function Navbar({ onMenuToggle, pageTitle }: NavbarProps) {
    return (
        <header className="h-16 border-b border-slate-900 bg-slate-950/40 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
            {/* Mobile Menu Icon & Title */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuToggle}
                    className="xl:hidden p-2 rounded-lg text-slate-450 hover:text-white hover:bg-slate-900 border border-slate-900 transition-colors"
                >
                    <Menu className="h-4 w-4 md:h-5 md:w-5" />
                </button>
                <h2 className="text-sm md:text-base font-bold text-white tracking-tight">
                    {pageTitle}
                </h2>
            </div>

            {/* Navbar Actions */}
            <div className="flex items-center gap-3">
                {/* Search Mock */}
                <div className="hidden md:flex items-center border border-slate-900 bg-slate-950/45 rounded-lg px-3 py-1.5 w-64 max-w-sm">
                    <Search className="h-3.5 w-3.5 text-slate-500 mr-2" />
                    <input
                        type="text"
                        placeholder="Search feedback..."
                        className="bg-transparent border-none outline-none text-xs text-slate-350 placeholder-slate-500 w-full"
                        readOnly
                    />
                    <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-4xs font-mono bg-slate-900 border border-slate-800 text-slate-500 rounded">
                        ⌘K
                    </kbd>
                </div>

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
            </div>
        </header>
    );
}
export type { NavbarProps };

