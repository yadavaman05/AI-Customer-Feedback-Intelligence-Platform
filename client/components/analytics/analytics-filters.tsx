"use client";

import React, { useState } from "react";
import Button from "@/components/ui/button";
import { Filter, RotateCcw } from "lucide-react";


interface AnalyticsFiltersProps {
    onCategoryChange?: (category: string) => void;
    onSourceChange?: (source: string) => void;
    onSentimentChange?: (sentiment: string) => void;
    onResetFilters?: () => void;
}

export default function AnalyticsFilters({
    onCategoryChange,
    onSourceChange,
    onSentimentChange,
    onResetFilters,
}: AnalyticsFiltersProps) {
    const [category, setCategory] = useState("all");
    const [source, setSource] = useState("all");
    const [sentiment, setSentiment] = useState("all");

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setCategory(val);
        if (onCategoryChange) onCategoryChange(val);
    };

    const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setSource(val);
        if (onSourceChange) onSourceChange(val);
    };

    const handleSentimentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setSentiment(val);
        if (onSentimentChange) onSentimentChange(val);
    };

    const handleReset = () => {
        setCategory("all");
        setSource("all");
        setSentiment("all");
        if (onResetFilters) onResetFilters();
    };

    const isFiltered = category !== "all" || source !== "all" || sentiment !== "all";

    return (
        <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3.5 flex-1 select-none">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <Filter className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Filters</span>
                </div>

                {/* Category select filter */}
                <div className="flex flex-col gap-1 w-full max-w-[150px]">
                    <select
                        value={category}
                        onChange={handleCategoryChange}
                        className="cursor-pointer rounded-lg border border-slate-800 bg-slate-950/80 px-2.5 py-1.5 text-xs text-slate-300 outline-none hover:border-slate-700 transition"
                    >
                        <option value="all">All Categories</option>
                        <option value="bug">Bugs</option>
                        <option value="feature_request">Feature Requests</option>
                        <option value="ui_ux">UI/UX</option>
                        <option value="performance">Performance</option>
                        <option value="pricing">Pricing</option>
                        <option value="other">Other Dev</option>
                    </select>
                </div>

                {/* Source select filter */}
                <div className="flex flex-col gap-1 w-full max-w-[155px]">
                    <select
                        value={source}
                        onChange={handleSourceChange}
                        className="cursor-pointer rounded-lg border border-slate-800 bg-slate-950/80 px-2.5 py-1.5 text-xs text-slate-300 outline-none hover:border-slate-700 transition"
                    >
                        <option value="all">All Sources</option>
                        <option value="email">Support Email</option>
                        <option value="chat">Live Chat</option>
                        <option value="playstore">Play Store</option>
                        <option value="appstore">App Store</option>
                        <option value="twitter">Twitter / X</option>
                        <option value="survey">Feedback Survey</option>
                        <option value="website">Web Portal</option>
                        <option value="google">Google Review</option>
                        <option value="other">Other Stream</option>
                    </select>
                </div>

                {/* Sentiment select filter */}
                <div className="flex flex-col gap-1 w-full max-w-[140px]">
                    <select
                        value={sentiment}
                        onChange={handleSentimentChange}
                        className="cursor-pointer rounded-lg border border-slate-800 bg-slate-950/80 px-2.5 py-1.5 text-xs text-slate-300 outline-none hover:border-slate-700 transition"
                    >
                        <option value="all">All Sentiments</option>
                        <option value="positive">Positive</option>
                        <option value="neutral">Neutral</option>
                        <option value="negative">Negative</option>
                    </select>
                </div>
            </div>

            {isFiltered && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="h-8 py-1.5 px-3 flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer w-fit"
                >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Clear Filters
                </Button>
            )}
        </div>
    );
}
