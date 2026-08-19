"use client";

import { useState, useEffect, useCallback } from "react";
import PageHeader from "@/components/ui/page-header";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import ErrorState from "@/components/ui/error-state";
import Skeleton from "@/components/ui/skeleton";
import { mockFeedbackList } from "@/lib/mockData";
import { formatDate, formatCapitalize } from "@/utils/format";
import { FeedbackItem } from "@/types/feedback";
import { api } from "@/lib/api";

// Import custom reusable feedback components
import SourceBadge from "@/components/feedback/source-badge";
import SentimentBadge from "@/components/feedback/sentiment-badge";
import FeedbackCard from "@/components/feedback/feedback-card";
import FeedbackTable from "@/components/feedback/feedback-table";
import FeedbackFilters, { FeedbackFiltersState } from "@/components/feedback/feedback-filters";
import FeedbackModal from "@/components/feedback/feedback-modal";
import FeedbackForm from "@/components/feedback/feedback-form";
import Pagination from "@/components/feedback/pagination";

import { LayoutGrid, List, Plus, Sparkles, Activity, FileText, Wifi, WifiOff } from "lucide-react";

export default function FeedbackInboxPage() {
    const [items, setItems] = useState<FeedbackItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [connectionMode, setConnectionMode] = useState<"mock" | "live">("live");

    const [selectedItem, setSelectedItem] = useState<FeedbackItem | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [viewMode, setViewMode] = useState<"table" | "grid">("table");

    // Unified filter state
    const [filters, setFilters] = useState<FeedbackFiltersState>({
        searchQuery: "",
        rating: "all",
        sentiment: "all",
        source: "all",
        category: "all",
        status: "all",
        startDate: "",
        endDate: "",
    });

    // Pagination states
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [totalItemsCount, setTotalItemsCount] = useState<number>(0);

    // Fetch or Filter feedback items
    const loadFeedback = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        if (connectionMode === "live") {
            try {
                const res = await api.feedback.list({
                    query: filters.searchQuery,
                    rating: filters.rating,
                    sentiment: filters.sentiment,
                    source: filters.source,
                    category: filters.category,
                    status: filters.status,
                    page: currentPage,
                    limit: itemsPerPage,
                });
                if (res && res.success && res.data) {
                    setItems(res.data.items);
                    setTotalItemsCount(res.data.total);
                } else {
                    throw new Error("Could not retrieve feedback data from server API");
                }
            } catch (err) {
                console.error("API error loading feedback", err);
                const errMsg = (err as Error).message || "Failed to establish a network connection with the API server. Set base URL or revert to Mock Mode.";
                setError(errMsg);
                setItems([]);
                setTotalItemsCount(0);
            } finally {
                setIsLoading(false);
            }
        } else {
            // Mock Mode: Client-Side Filters & Pagination with simulated delay (300ms)
            const timer = setTimeout(() => {
                const filtered = mockFeedbackList.filter((item) => {
                    const query = filters.searchQuery.toLowerCase().trim();
                    const matchesSearch =
                        query === "" ||
                        item.customerName.toLowerCase().includes(query) ||
                        item.customerEmail.toLowerCase().includes(query) ||
                        item.content.toLowerCase().includes(query);

                    const matchesCategory = filters.category === "all" || item.category === filters.category;
                    const matchesSentiment = filters.sentiment === "all" || item.sentiment === filters.sentiment;
                    const matchesStatus = filters.status === "all" || item.status === filters.status;
                    const matchesSource = filters.source === "all" || item.source === filters.source;
                    const matchesRating = filters.rating === "all" || item.rating === Number(filters.rating);

                    let matchesDate = true;
                    const itemDateStr = item.createdAt.slice(0, 10);
                    if (filters.startDate) matchesDate = matchesDate && itemDateStr >= filters.startDate;
                    if (filters.endDate) matchesDate = matchesDate && itemDateStr <= filters.endDate;

                    return (
                        matchesSearch &&
                        matchesCategory &&
                        matchesSentiment &&
                        matchesStatus &&
                        matchesSource &&
                        matchesRating &&
                        matchesDate
                    );
                });

                const startIndex = (currentPage - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                setItems(filtered.slice(startIndex, endIndex));
                setTotalItemsCount(filtered.length);
                setIsLoading(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [connectionMode, filters, currentPage, itemsPerPage]);

    useEffect(() => {
        loadFeedback();
    }, [loadFeedback]);

    // Actions
    const handleFiltersChange = (newFilters: FeedbackFiltersState) => {
        setFilters(newFilters);
        setCurrentPage(1);
    };

    const handleResetFilters = () => {
        setFilters({
            searchQuery: "",
            rating: "all",
            sentiment: "all",
            source: "all",
            category: "all",
            status: "all",
            startDate: "",
            endDate: "",
        });
        setCurrentPage(1);
    };

    const handleStatusChange = async (id: string, newStatus: "new" | "in_progress" | "resolved") => {
        if (connectionMode === "live") {
            try {
                const res = await api.feedback.updateStatus(id, newStatus);
                if (res && res.success) {
                    setItems((prev) =>
                        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
                    );
                    if (selectedItem && selectedItem.id === id) {
                        setSelectedItem((prev) => (prev ? { ...prev, status: newStatus } : null));
                    }
                }
            } catch (err) {
                console.error("Failed to update status", err);
                alert("API Error: Failed to update ticket status on server.");
            }
        } else {
            // Mock mode offline write
            setItems((prev) =>
                prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
            );
            if (selectedItem && selectedItem.id === id) {
                setSelectedItem((prev) => (prev ? { ...prev, status: newStatus } : null));
            }
        }
    };

    const handleCreateSuccess = async (
        formValues: Omit<FeedbackItem, "id" | "createdAt" | "confidenceScore" | "sentiment" | "aiSummary" | "suggestedAction" | "keywords">
    ) => {
        setIsSubmitting(true);
        if (connectionMode === "live") {
            try {
                const res = await api.feedback.create(formValues);
                if (res && res.success) {
                    setIsCreateOpen(false);
                    loadFeedback();
                }
            } catch (err) {
                console.error("API call to create feedback failed", err);
                alert(`API Error: ${(err as Error).message || "Failed to create feedback ticket on backend."}`);
            } finally {
                setIsSubmitting(false);
            }
        } else {
            // Mock creation
            setTimeout(() => {
                const generatedConfidence = parseFloat((Math.random() * (0.99 - 0.72) + 0.72).toFixed(2));
                let inferredSentiment: FeedbackItem["sentiment"] = "neutral";
                if (formValues.rating && formValues.rating >= 4) inferredSentiment = "positive";
                if (formValues.rating && formValues.rating <= 2) inferredSentiment = "negative";

                const generatedSummary = `Ingested review highlights ${formValues.customerName} concern regarding ${formValues.category}.`;
                const generatedAction = `Contact customer at ${formValues.customerEmail} to address the logged ${formValues.category} issue.`;
                const generatedKeywords = [formValues.category, formValues.source, "user-created"];

                const newItem: FeedbackItem = {
                    id: `fb-${Math.floor(Math.random() * 900) + 100}`,
                    createdAt: new Date().toISOString(),
                    confidenceScore: generatedConfidence,
                    sentiment: inferredSentiment,
                    aiSummary: generatedSummary,
                    suggestedAction: generatedAction,
                    keywords: generatedKeywords,
                    ...formValues,
                };

                // Add to start of list locally
                setItems((prev) => [newItem, ...prev].slice(0, itemsPerPage));
                setTotalItemsCount((prev) => prev + 1);
                setIsCreateOpen(false);
                setIsSubmitting(false);
            }, 300);
        }
    };

    const totalPages = Math.ceil(totalItemsCount / itemsPerPage) || 1;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <PageHeader
                    title="Feedback Analytics Inbox"
                    description="Browse, filter, and inspect customer feedbacks ingested from various customer service and review channels."
                />

                <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0 font-sans">
                    {/* Connection Controller */}
                    <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
                        <button
                            onClick={() => {
                                setConnectionMode("mock");
                                setCurrentPage(1);
                            }}
                            className={`px-3 py-1 rounded transition-all font-semibold flex items-center gap-1 cursor-pointer ${connectionMode === "mock"
                                ? "bg-slate-800 text-teal-400 border border-teal-500/20"
                                : "text-slate-500 hover:text-slate-350"
                                }`}
                            title="Operate with client-side mock datasets"
                        >
                            <WifiOff className="h-3 w-3" />
                            Mock Mode
                        </button>
                        <button
                            onClick={() => {
                                setConnectionMode("live");
                                setCurrentPage(1);
                            }}
                            className={`px-3 py-1 rounded transition-all font-semibold flex items-center gap-1 cursor-pointer ${connectionMode === "live"
                                ? "bg-slate-800 text-emerald-450 border border-emerald-500/20"
                                : "text-slate-500 hover:text-slate-350"
                                }`}
                            title="Attempt requests on the live backend API"
                        >
                            <Wifi className="h-3 w-3" />
                            Live API
                        </button>
                    </div>

                    <Button
                        onClick={() => setIsCreateOpen(true)}
                        variant="primary"
                        className="h-9 px-4 bg-emerald-400 hover:bg-emerald-300 font-bold text-slate-950 flex items-center justify-center gap-1.5 rounded-lg shadow-lg cursor-pointer"
                    >
                        <Plus className="h-4.5 w-4.5 stroke-[3px]" />
                        Ingest Feedback
                    </Button>
                </div>
            </div>

            {/* Filter Toolbar */}
            <FeedbackFilters
                filters={filters}
                onChange={handleFiltersChange}
                onReset={handleResetFilters}
            />

            {/* View Layout Toggle Toolbar */}
            <div className="flex justify-between items-center bg-slate-955/20 p-2 rounded-lg border border-slate-900">
                <span className="text-xs text-slate-500 font-mono">
                    FOUND <span className="text-slate-300 font-semibold">{totalItemsCount}</span> ENTRIES
                    {connectionMode === "mock" && <span className="text-teal-405 font-medium ml-1.5">(MOCK ACTIVE)</span>}
                </span>
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded p-1">
                    <button
                        onClick={() => setViewMode("table")}
                        className={`p-1 rounded transition-all cursor-pointer ${viewMode === "table"
                            ? "bg-slate-800 text-emerald-450"
                            : "text-slate-500 hover:text-slate-350"
                            }`}
                        title="Table list View"
                    >
                        <List className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`p-1 rounded transition-all cursor-pointer ${viewMode === "grid"
                            ? "bg-slate-800 text-emerald-450"
                            : "text-slate-500 hover:text-slate-350"
                            }`}
                        title="Card grid View"
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            {isLoading ? (
                /* Loading State: Skeletons */
                viewMode === "table" ? (
                    <Card className="p-0 border-slate-900 bg-slate-955/35 overflow-hidden">
                        <div className="w-full border-collapse">
                            <div className="bg-slate-950/20 border-b border-slate-900 p-4 grid grid-cols-6 gap-4">
                                <div className="h-3 w-16 bg-slate-800 rounded animate-pulse" />
                                <div className="h-3 w-12 bg-slate-800 rounded animate-pulse" />
                                <div className="h-3 w-20 bg-slate-800 rounded animate-pulse" />
                                <div className="h-3 w-32 bg-slate-800 rounded animate-pulse" />
                                <div className="h-3 w-12 bg-slate-800 rounded animate-pulse" />
                                <div className="h-3 w-12 bg-slate-800 rounded animate-pulse justify-self-end" />
                            </div>
                            <div className="p-4 space-y-4">
                                {[...Array(itemsPerPage)].map((_, i) => (
                                    <Skeleton key={i} variant="table-row" className="my-2 animate-pulse bg-slate-800/40 rounded h-12 w-full" />
                                ))}
                            </div>
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(itemsPerPage)].map((_, i) => (
                            <Card key={i} className="p-5 border border-slate-900 bg-slate-955/40 relative space-y-4 rounded-xl">
                                <div className="space-y-2">
                                    <div className="h-4 w-1/3 bg-slate-850 rounded animate-pulse" />
                                    <div className="h-3 w-1/2 bg-slate-850 rounded animate-pulse" />
                                </div>
                                <div className="h-10 w-full bg-slate-850 rounded animate-pulse" />
                                <div className="flex justify-between pt-4 mt-4 border-t border-slate-900/60">
                                    <div className="h-4 w-12 bg-slate-850 rounded animate-pulse" />
                                    <div className="h-4 w-16 bg-slate-850 rounded animate-pulse" />
                                </div>
                            </Card>
                        ))}
                    </div>
                )
            ) : error ? (
                /* Error State: ErrorState component with Retry Button */
                <ErrorState
                    title="API Server Connection Failure"
                    description={error}
                    actionText="Retry Request"
                    onRetry={loadFeedback}
                />
            ) : totalItemsCount === 0 ? (
                /* Empty States */
                filters.searchQuery || filters.rating !== "all" || filters.sentiment !== "all" || filters.source !== "all" || filters.category !== "all" || filters.status !== "all" ? (
                    <EmptyState
                        title="No Matching Search Results"
                        description="We couldn't find any reviews matching the criteria you specified. Try adjusting your query or filters."
                        actionText="Reset Active Filters"
                        onAction={handleResetFilters}
                    />
                ) : (
                    <EmptyState
                        title="No Feedback Records"
                        description="This workspace has not ingested any customer reviews yet. Get started by manual ingestion."
                        actionText="Ingest First Feedback"
                        onAction={() => setIsCreateOpen(true)}
                    />
                )
            ) : viewMode === "table" ? (
                /* Card List table */
                <Card className="p-0 border-slate-900 bg-slate-955/35 overflow-hidden">
                    <FeedbackTable
                        items={items}
                        onSelectItem={(item) => setSelectedItem(item)}
                    />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        itemsPerPage={itemsPerPage}
                        onItemsPerPageChange={(size) => {
                            setItemsPerPage(size);
                            setCurrentPage(1);
                        }}
                        totalItems={totalItemsCount}
                    />
                </Card>
            ) : (
                /* Card grid representation */
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.map((item) => (
                            <FeedbackCard
                                key={item.id}
                                item={item}
                                onClick={() => setSelectedItem(item)}
                            />
                        ))}
                    </div>
                    <Card className="p-0 border-slate-900 bg-slate-955/35 overflow-hidden">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            itemsPerPage={itemsPerPage}
                            onItemsPerPageChange={(size) => {
                                setItemsPerPage(size);
                                setCurrentPage(1);
                            }}
                            totalItems={totalItemsCount}
                        />
                    </Card>
                </div>
            )}

            {/* Ingest Feedback Form Modal */}
            {isCreateOpen && (
                <FeedbackModal
                    isOpen={isCreateOpen}
                    onClose={() => setIsCreateOpen(false)}
                    title="Ingest Customer Review"
                    description="Manually insert an ingested ticket into the processing queue."
                    size="lg"
                >
                    <FeedbackForm
                        onSubmitSuccess={handleCreateSuccess}
                        onCancel={() => setIsCreateOpen(false)}
                        isSubmitting={isSubmitting}
                    />
                </FeedbackModal>
            )}

            {/* Feedback Inspector Detail Modal */}
            {selectedItem && (
                <FeedbackModal
                    isOpen={!!selectedItem}
                    onClose={() => setSelectedItem(null)}
                    title={`Ticket Inspector - #${selectedItem.id}`}
                    description={`Detailed analysis of customer feedback ingested via ${formatCapitalize(selectedItem.source)} stream`}
                    size="lg"
                    footer={
                        <div className="flex flex-wrap items-center justify-between w-full gap-2 font-sans">
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={selectedItem.status === "in_progress"}
                                    onClick={() => handleStatusChange(selectedItem.id, "in_progress")}
                                    className="cursor-pointer text-xs"
                                >
                                    Mark In-Progress
                                </Button>
                                <Button
                                    size="sm"
                                    variant="primary"
                                    className="text-slate-950 font-bold bg-emerald-400 hover:bg-emerald-350 border-none cursor-pointer text-xs"
                                    disabled={selectedItem.status === "resolved"}
                                    onClick={() => handleStatusChange(selectedItem.id, "resolved")}
                                >
                                    Mark Resolved
                                </Button>
                            </div>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="text-slate-400 hover:text-slate-205 cursor-pointer font-medium text-xs"
                                onClick={() => setSelectedItem(null)}
                            >
                                Close Panel
                            </Button>
                        </div>
                    }
                >
                    <div className="space-y-6 font-sans">
                        {/* Section 1: Customer Details Header */}
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-900 pb-4">
                            <div>
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Customer Information</span>
                                <h4 className="text-sm md:text-base font-semibold text-white mt-1">{selectedItem.customerName}</h4>
                                <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedItem.customerEmail}</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5">
                                <SentimentBadge sentiment={selectedItem.sentiment} />
                                <Badge variant="outline" className="px-2.5 py-0.5 border-slate-800 text-slate-350 text-xs">
                                    {formatCapitalize(selectedItem.category)}
                                </Badge>
                                <SourceBadge source={selectedItem.source} />
                            </div>
                        </div>

                        {/* Section 2: Full Feedback Text */}
                        <div>
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono flex items-center gap-1">
                                <FileText className="h-3 w-3 text-slate-600" />
                                Ingested Message Content
                            </span>
                            <p className="mt-2 text-xs md:text-sm text-slate-300 leading-relaxed bg-slate-950/50 p-4 border border-slate-900 rounded-xl whitespace-pre-wrap">
                                &quot;{selectedItem.content}&quot;
                            </p>
                        </div>

                        {/* Section 3: AI Analysis (Summary & Suggestion) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-900 pt-4">
                            <div className="p-4 bg-slate-900/10 border border-slate-900/60 rounded-xl space-y-2">
                                <span className="text-[10px] text-emerald-450 uppercase tracking-widest font-mono flex items-center gap-1 font-bold">
                                    <Sparkles className="h-3 w-3 text-emerald-400" />
                                    AI Summary
                                </span>
                                <p className="text-xs text-slate-350 leading-relaxed">
                                    {selectedItem.aiSummary || "Ingestion algorithm classification in queue. Review highlights will show here once processed."}
                                </p>
                            </div>
                            <div className="p-4 bg-slate-900/10 border border-slate-900/60 rounded-xl space-y-2">
                                <span className="text-[10px] text-emerald-450 uppercase tracking-widest font-mono flex items-center gap-1 font-bold">
                                    <Activity className="h-3 w-3 text-emerald-400" />
                                    Suggested Action
                                </span>
                                <p className="text-xs text-slate-350 leading-relaxed">
                                    {selectedItem.suggestedAction || "Suggested response options will generate automatically post category matching check."}
                                </p>
                            </div>
                        </div>

                        {/* Section 4: Keywords / Key Phrases */}
                        {selectedItem.keywords && selectedItem.keywords.length > 0 && (
                            <div className="border-t border-slate-900/70 pt-4">
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Entity Keywords Found</span>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {selectedItem.keywords.map((word, i) => (
                                        <span
                                            key={i}
                                            className="text-[10px] bg-slate-950 border border-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono"
                                        >
                                            #{word}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Section 5: Metadata Footer */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-900 pt-4 text-xs md:text-sm">
                            <div className="flex flex-col gap-1.5">
                                <span className="text-slate-500 uppercase tracking-widest font-mono text-[10px]">Classification Confidence</span>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-850">
                                        <div
                                            className="bg-emerald-400 h-full rounded-full transition-all"
                                            style={{ width: `${selectedItem.confidenceScore * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-emerald-400 font-bold font-mono text-xs">
                                        {(selectedItem.confidenceScore * 100).toFixed(0)}%
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 md:items-end justify-center">
                                <span className="text-slate-500 uppercase tracking-widest font-mono text-[9px]">Ingested Timestamp</span>
                                <div className="text-slate-350 font-mono text-xs mt-0.5">
                                    {formatDate(selectedItem.createdAt)}
                                </div>
                            </div>
                        </div>
                    </div>
                </FeedbackModal>
            )}
        </div>
    );
}
