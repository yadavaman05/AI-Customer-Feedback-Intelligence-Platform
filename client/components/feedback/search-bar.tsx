import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export const SearchBar = ({
    value,
    onChange,
    placeholder = "Search...",
    className,
}: SearchBarProps) => {
    return (
        <div
            className={cn(
                "flex-1 flex items-center border border-slate-900 bg-slate-950/40 rounded-lg px-3 py-2 transition-all focus-within:border-emerald-500/30",
                className
            )}
        >
            <Search className="h-3.5 w-3.5 text-slate-500 mr-2 flex-shrink-0" />
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="bg-transparent border-none outline-none text-xs text-slate-200 placeholder-slate-550 w-full"
            />
            {value && (
                <button
                    type="button"
                    onClick={() => onChange("")}
                    className="text-slate-500 hover:text-slate-300 transition-colors p-0.5 rounded"
                >
                    <X className="h-3 w-3" />
                </button>
            )}
        </div>
    );
};

export default SearchBar;
