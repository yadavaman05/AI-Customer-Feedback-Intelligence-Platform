import * as React from "react";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import { Search, RotateCcw, Calendar } from "lucide-react";

export interface FeedbackFiltersState {
    searchQuery: string;
    rating: string;
    sentiment: string;
    source: string;
    category: string;
    status: string;
    startDate: string;
    endDate: string;
}

interface FeedbackFiltersProps {
    filters: FeedbackFiltersState;
    onChange: (filters: FeedbackFiltersState) => void;
    onReset: () => void;
}

export const FeedbackFilters = ({
    filters,
    onChange,
    onReset,
}: FeedbackFiltersProps) => {
    const handleFilterChange = (key: keyof FeedbackFiltersState, value: string) => {
        onChange({
            ...filters,
            [key]: value,
        });
    };

    const hasActiveFilters =
        filters.searchQuery !== "" ||
        filters.rating !== "all" ||
        filters.sentiment !== "all" ||
        filters.source !== "all" ||
        filters.category !== "all" ||
        filters.status !== "all" ||
        filters.startDate !== "" ||
        filters.endDate !== "";

    return (
        <Card className="p-4 border-slate-900 bg-slate-955/30 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Search Input */}
                <div className="flex-1 flex items-center border border-slate-900 bg-slate-950/40 rounded-lg px-3 py-2 max-w-lg">
                    <Search className="h-3.5 w-3.5 text-slate-500 mr-2" />
                    <input
                        type="text"
                        placeholder="Search by customer name, email, or content..."
                        value={filters.searchQuery}
                        onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
                        className="bg-transparent border-none outline-none text-xs text-slate-200 placeholder-slate-500 w-full"
                    />
                </div>

                {/* Left Side: Actions */}
                <div className="flex items-center gap-2">
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onReset}
                            className="h-9 py-1 px-3 flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 cursor-pointer"
                        >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Reset Filters
                        </Button>
                    )}
                </div>
            </div>

            {/* Expansible Filter Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 border-t border-slate-900/60">
                {/* Category Filter */}
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Category</label>
                    <div className="flex items-center bg-slate-950/40 px-2.5 py-1.5 border border-slate-900 rounded-lg">
                        <select
                            value={filters.category}
                            onChange={(e) => handleFilterChange("category", e.target.value)}
                            className="bg-transparent outline-none border-none text-xs text-slate-300 cursor-pointer font-sans w-full"
                        >
                            <option value="all" className="bg-slate-950 text-slate-350">All Categories</option>
                            <option value="bug" className="bg-slate-950 text-slate-350">Bugs</option>
                            <option value="feature_request" className="bg-slate-950 text-slate-350">Feature Requests</option>
                            <option value="ui_ux" className="bg-slate-950 text-slate-350">UI/UX</option>
                            <option value="performance" className="bg-slate-950 text-slate-350">Performance</option>
                            <option value="pricing" className="bg-slate-950 text-slate-350">Pricing</option>
                            <option value="other" className="bg-slate-950 text-slate-350">Other Dev</option>
                        </select>
                    </div>
                </div>

                {/* Sentiment Filter */}
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Sentiment</label>
                    <div className="flex items-center bg-slate-950/40 px-2.5 py-1.5 border border-slate-900 rounded-lg">
                        <select
                            value={filters.sentiment}
                            onChange={(e) => handleFilterChange("sentiment", e.target.value)}
                            className="bg-transparent outline-none border-none text-xs text-slate-300 cursor-pointer font-sans w-full"
                        >
                            <option value="all" className="bg-slate-950 text-slate-350">All Sentiments</option>
                            <option value="positive" className="bg-slate-950 text-slate-350">Positive</option>
                            <option value="neutral" className="bg-slate-950 text-slate-350">Neutral</option>
                            <option value="negative" className="bg-slate-950 text-slate-350">Negative</option>
                        </select>
                    </div>
                </div>

                {/* Rating Filter */}
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Rating</label>
                    <div className="flex items-center bg-slate-950/40 px-2.5 py-1.5 border border-slate-900 rounded-lg">
                        <select
                            value={filters.rating}
                            onChange={(e) => handleFilterChange("rating", e.target.value)}
                            className="bg-transparent outline-none border-none text-xs text-slate-300 cursor-pointer font-sans w-full"
                        >
                            <option value="all" className="bg-slate-950 text-slate-350">All Ratings</option>
                            <option value="5" className="bg-slate-950 text-slate-350">5 Stars</option>
                            <option value="4" className="bg-slate-950 text-slate-350">4 Stars</option>
                            <option value="3" className="bg-slate-950 text-slate-350">3 Stars</option>
                            <option value="2" className="bg-slate-950 text-slate-350">2 Stars</option>
                            <option value="1" className="bg-slate-950 text-slate-350">1 Star</option>
                        </select>
                    </div>
                </div>

                {/* Source Filter */}
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Stream Source</label>
                    <div className="flex items-center bg-slate-950/40 px-2.5 py-1.5 border border-slate-900 rounded-lg">
                        <select
                            value={filters.source}
                            onChange={(e) => handleFilterChange("source", e.target.value)}
                            className="bg-transparent outline-none border-none text-xs text-slate-300 cursor-pointer font-sans w-full"
                        >
                            <option value="all" className="bg-slate-950 text-slate-350">All Sources</option>
                            <option value="email" className="bg-slate-950 text-slate-350">Email Support</option>
                            <option value="chat" className="bg-slate-950 text-slate-350">Live Chat</option>
                            <option value="playstore" className="bg-slate-950 text-slate-350">Google Play Store</option>
                            <option value="appstore" className="bg-slate-950 text-slate-350">Apple App Store</option>
                            <option value="twitter" className="bg-slate-950 text-slate-350">Twitter / X</option>
                            <option value="survey" className="bg-slate-950 text-slate-350">Feedback Survey</option>
                            <option value="website" className="bg-slate-950 text-slate-350">Web Portal</option>
                            <option value="google" className="bg-slate-950 text-slate-350">Google Review</option>
                            <option value="other" className="bg-slate-950 text-slate-350">Other Stream</option>
                        </select>
                    </div>
                </div>

                {/* Date Min Filter */}
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-500 font-mono uppercase tracking-wider flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-slate-655" />
                        From Date
                    </label>
                    <div className="flex items-center bg-slate-950/40 px-2 py-1 border border-slate-900 rounded-lg">
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => handleFilterChange("startDate", e.target.value)}
                            className="bg-transparent outline-none border-none text-xs text-slate-350 select-none cursor-pointer w-full font-mono invert-[0.8] hue-rotate-180 brightness-[0.7]"
                        />
                    </div>
                </div>

                {/* Date Max Filter */}
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-500 font-mono uppercase tracking-wider flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-slate-655" />
                        To Date
                    </label>
                    <div className="flex items-center bg-slate-950/40 px-2 py-1 border border-slate-900 rounded-lg">
                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => handleFilterChange("endDate", e.target.value)}
                            className="bg-transparent outline-none border-none text-xs text-slate-350 select-none cursor-pointer w-full font-mono invert-[0.8] hue-rotate-180 brightness-[0.7]"
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default FeedbackFilters;
