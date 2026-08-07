"use client";

import React, { useState } from "react";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
    className?: string;
    onRangeChange?: (range: string) => void;
}

export default function DateRangePicker({ className, onRangeChange }: DateRangePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedRange, setSelectedRange] = useState("Last 30 Days");

    const ranges = [
        "Today",
        "Yesterday",
        "Last 7 Days",
        "Last 30 Days",
        "Last 90 Days",
        "Last 12 Months",
        "Custom Range"
    ];

    const handleSelect = (range: string) => {
        setSelectedRange(range);
        setIsOpen(false);
        if (onRangeChange) {
            onRangeChange(range);
        }
    };

    return (
        <div className={cn("relative", className)}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-between gap-2.5 rounded-lg border border-slate-800 bg-slate-950/60 p-2.5 text-xs font-medium text-slate-3550 hover:bg-slate-950 transition-all w-full min-w-[160px] cursor-pointer"
            >
                <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-emerald-400" />
                    <span className="text-slate-2050 font-medium text-white">{selectedRange}</span>
                </div>
                <ChevronDown className={cn("h-4 w-4 text-slate-500 transition-transform", isOpen && "transform rotate-180")} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-20 cursor-default"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-1.5 w-48 rounded-lg border border-slate-800 bg-slate-950 p-1 shadow-xl z-35 bg-opacity-95 backdrop-blur-md">
                        {ranges.map((range) => (
                            <button
                                key={range}
                                type="button"
                                onClick={() => handleSelect(range)}
                                className={cn(
                                    "flex w-full items-center rounded-md px-3 py-2 text-left text-xs transition-colors hover:bg-slate-900",
                                    selectedRange === range ? "bg-slate-900 text-emerald-400 font-semibold" : "text-slate-300"
                                )}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
