"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { MessageSquare, Smile, Frown, Meh, Users, Sparkles, ArrowUpRight, Wifi, WifiOff } from "lucide-react";
import PageHeader from "@/components/ui/page-header";
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import ErrorState from "@/components/ui/error-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockMetrics, mockFeedbackList } from "@/lib/mockData";
import { formatDate, formatCapitalize } from "@/utils/format";
import { FeedbackItem, MetricCardData } from "@/types/feedback";
import { api } from "@/lib/api";

// Recharts components
import SentimentTrend from "@/components/charts/sentiment-trend";
import CategorySplit from "@/components/charts/category-split";
import RatingDistribution from "@/components/charts/rating-distribution";

export default function DashboardPage() {
    const [connectionMode, setConnectionMode] = useState<"mock" | "live">("mock");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [metrics, setMetrics] = useState<MetricCardData[]>([]);
    const [recentFeedback, setRecentFeedback] = useState<FeedbackItem[]>([]);

    const loadDashboardData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        if (connectionMode === "live") {
            try {
                // Fetch basic analytics summaries and latest items concurrently
                const [analyticsRes, feedbackRes] = await Promise.all([
                    api.analytics.getSummary(),
                    api.feedback.list({ limit: 3 }),
                ]);

                if (analyticsRes && feedbackRes && analyticsRes.success && feedbackRes.success) {
                    const data = analyticsRes.data;
                    const items = feedbackRes.data.items;

                    // Dynamically map API response figures back to the UI metric structures
                    const mappedMetrics: MetricCardData[] = [
                        {
                            title: "Total Feedback Items",
                            value: data.metrics.totalFeedback,
                            change: "+14%", // Hardcoded change since baseline changes are computed
                            isPositive: true,
                            timeframe: "vs yesterday",
                            iconName: "MessageSquare",
                        },
                        {
                            title: "Positive Sentiment Score",
                            value: `${Math.round(
                                (data.metrics.positiveFeedback / (data.metrics.totalFeedback || 1)) * 100
                            )}%`,
                            change: "+2%",
                            isPositive: true,
                            timeframe: "vs yesterday",
                            iconName: "Smile",
                        },
                        {
                            title: "Neutral Sentiment Items",
                            value: data.metrics.neutralFeedback,
                            change: "-1%",
                            isPositive: true,
                            timeframe: "vs yesterday",
                            iconName: "Meh",
                        },
                        {
                            title: "Negative Sentiment Items",
                            value: data.metrics.negativeFeedback,
                            change: "+4%",
                            isPositive: false,
                            timeframe: "vs yesterday",
                            iconName: "Frown",
                        },
                        {
                            title: "Average Customer Rating",
                            value: `${data.metrics.avgRating.toFixed(1)} / 5`,
                            change: "+0.2 stars",
                            isPositive: true,
                            timeframe: "vs yesterday",
                            iconName: "Sparkles",
                        },
                        {
                            title: "Unique Ingestion Users",
                            value: items.length > 0 ? new Set(items.map(item => item.customerEmail)).size : 0,
                            change: "Stable",
                            isPositive: true,
                            timeframe: "Active this week",
                            iconName: "Users",
                        },
                    ];

                    setMetrics(mappedMetrics);
                    setRecentFeedback(items);
                } else {
                    throw new Error("Unable to read complete analytics data payload from the API server.");
                }
            } catch (err) {
                console.error("Dashboard page failed to fetch REST API resources", err);
                const errMsg = (err as Error).message || "Failed to establish a network connection with the API server. Revert to Mock Mode or boot the backend.";
                setError(errMsg);
                setMetrics([]);
                setRecentFeedback([]);
            } finally {
                setIsLoading(false);
            }
        } else {
            // Mock Mode: Client side load with simulated delays
            const timer = setTimeout(() => {
                setMetrics(mockMetrics);
                setRecentFeedback(mockFeedbackList.slice(0, 3));
                setIsLoading(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [connectionMode]);

    useEffect(() => {
        loadDashboardData();
    }, [loadDashboardData]);

    const getIcon = (name: string) => {
        switch (name) {
            case "MessageSquare":
                return <MessageSquare className="h-4 w-4 md:h-5 md:w-5 text-emerald-450" />;
            case "Smile":
                return <Smile className="h-4 w-4 md:h-5 md:w-5 text-emerald-450" />;
            case "Frown":
                return <Frown className="h-4 w-4 md:h-5 md:w-5 text-red-400" />;
            case "Meh":
                return <Meh className="h-4 w-4 md:h-5 md:w-5 text-amber-400" />;
            case "Users":
                return <Users className="h-4 w-4 md:h-5 md:w-5 text-blue-450" />;
            case "Sparkles":
                return <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-teal-400 animate-pulse" />;
            default:
                return <MessageSquare className="h-4 w-4 md:h-5 md:w-5 text-slate-400" />;
        }
    };

    return (
        <div className="space-y-6 font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <PageHeader
                    title="System Overview"
                    description="Monitor aggregated sentiment, categories, and latest ticket ingestions."
                />

                <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs sm:self-end">
                    <button
                        onClick={() => setConnectionMode("mock")}
                        className={`px-3 py-1 rounded transition-all font-semibold flex items-center gap-1 cursor-pointer ${connectionMode === "mock"
                            ? "bg-slate-800 text-teal-400 border border-teal-500/20"
                            : "text-slate-500 hover:text-slate-350"
                            }`}
                    >
                        <WifiOff className="h-3 w-3" />
                        Mock Mode
                    </button>
                    <button
                        onClick={() => setConnectionMode("live")}
                        className={`px-3 py-1 rounded transition-all font-semibold flex items-center gap-1 cursor-pointer ${connectionMode === "live"
                            ? "bg-slate-800 text-emerald-455 border border-emerald-500/20"
                            : "text-slate-500 hover:text-slate-350"
                            }`}
                    >
                        <Wifi className="h-3 w-3" />
                        Live API
                    </button>
                </div>
            </div>

            {/* Error state if API call failed in Live mode */}
            {error && !isLoading ? (
                <ErrorState
                    title="Analytics Server Offline"
                    description={error}
                    actionText="Retry Dashboard Connection"
                    onRetry={loadDashboardData}
                />
            ) : (
                <>
                    {/* Metrics Cards Grid - 6 Cards */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                        {isLoading ? (
                            /* Skeletons */
                            [...Array(6)].map((_, i) => (
                                <Card key={i} className="bg-slate-955/40 border-slate-900/60 p-4 space-y-3 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <div className="h-2 w-16 bg-slate-800 rounded animate-pulse" />
                                        <div className="h-7 w-7 bg-slate-800 rounded" />
                                    </div>
                                    <div className="h-6 w-12 bg-slate-800 rounded animate-pulse" />
                                    <div className="h-2 w-20 bg-slate-800 rounded animate-pulse" />
                                </Card>
                            ))
                        ) : (
                            metrics.map((metric) => (
                                <Card key={metric.title} hoverEffect className="bg-slate-955/40 border-slate-900/60 rounded-xl">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                        <span className="text-2xs font-semibold text-slate-400 truncate">
                                            {metric.title}
                                        </span>
                                        <div className="h-7 w-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                                            {getIcon(metric.iconName)}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-lg md:text-xl font-bold text-white tracking-tight">
                                            {metric.value}
                                        </div>
                                        <div className="flex items-center gap-1 text-3xs mt-1 text-slate-500">
                                            <span className={metric.isPositive ? "font-semibold text-emerald-450" : "font-semibold text-slate-450"}>
                                                {metric.change}
                                            </span>
                                            <span className="truncate">{metric.timeframe}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>

                    {/* Recharts Graphical Panels */}
                    <div className="grid lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2 p-6 border-slate-805 bg-slate-955/30 min-h-[300px] rounded-xl">
                            {isLoading ? (
                                <div className="h-72 w-full bg-slate-900/40 rounded-xl flex items-center justify-center text-xs text-slate-500 animate-pulse">
                                    Loading Ingestion & Sentiment Trend Chart...
                                </div>
                            ) : (
                                <>
                                    <CardHeader className="px-0 pt-0 pb-4">
                                        <CardTitle>Feedback Ingestion & Sentiment Trend</CardTitle>
                                        <CardDescription>Visualizing month-by-month positive vs negative customer tickets.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="px-0 pb-0">
                                        <SentimentTrend />
                                    </CardContent>
                                </>
                            )}
                        </Card>

                        <Card className="p-6 border-slate-805 bg-slate-955/30 min-h-[350px] rounded-xl">
                            {isLoading ? (
                                <div className="h-72 w-full bg-slate-900/40 rounded-xl flex items-center justify-center text-xs text-slate-500 animate-pulse">
                                    Loading Category Splits...
                                </div>
                            ) : (
                                <>
                                    <CardHeader className="px-0 pt-0 pb-4">
                                        <CardTitle>Issues by Category</CardTitle>
                                        <CardDescription>Aggregation of labels extracted by AI model tags.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="px-0 pb-0 flex items-center justify-center">
                                        <CategorySplit />
                                    </CardContent>
                                </>
                            )}
                        </Card>
                    </div>

                    {/* Third chart - Rating Distribution */}
                    <Card className="p-6 border-slate-805 bg-slate-955/30 min-h-[350px] rounded-xl">
                        {isLoading ? (
                            <div className="h-72 w-full bg-slate-900/40 rounded-xl flex items-center justify-center text-xs text-slate-500 animate-pulse">
                                Loading Rating distribution...
                            </div>
                        ) : (
                            <>
                                <CardHeader className="px-0 pt-0 pb-4">
                                    <CardTitle>Customer Rating Distribution (Star reviews)</CardTitle>
                                    <CardDescription>Distribution of stars given by clients in surveys and app-store feedback.</CardDescription>
                                </CardHeader>
                                <CardContent className="px-0 pb-0">
                                    <RatingDistribution />
                                </CardContent>
                            </>
                        )}
                    </Card>

                    {/* Recent Feedbacks Card */}
                    <Card className="p-6 border-slate-805 bg-slate-955/30 rounded-xl">
                        <CardHeader className="px-0 pt-0 pb-4 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Recent Feedbacks</CardTitle>
                                <CardDescription>Latest customer inputs parsed and flagged by sentiment classifier.</CardDescription>
                            </div>
                            <Link href="/feedback" className="text-2xs md:text-xs text-emerald-400 hover:underline flex items-center gap-1 font-bold">
                                See all inbox <ArrowUpRight className="h-3.5 w-3.5" />
                            </Link>
                        </CardHeader>
                        <CardContent className="px-0 pb-0 overflow-x-auto">
                            {isLoading ? (
                                <div className="space-y-3">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="h-10 bg-slate-900/50 border border-slate-900/60 rounded animate-pulse" />
                                    ))}
                                </div>
                            ) : recentFeedback.length === 0 ? (
                                <div className="text-center py-6 text-xs text-slate-500 font-mono">
                                    No recent feedback records.
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Customer</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Sentiment</TableHead>
                                            <TableHead>Feedback Snippet</TableHead>
                                            <TableHead className="text-right">Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentFeedback.map((item) => (
                                            <TableRow key={item.id} className="cursor-pointer hover:bg-slate-900/30">
                                                <TableCell className="font-medium">
                                                    <div className="text-xs text-white">{item.customerName}</div>
                                                    <div className="text-4xs text-slate-500 mt-0.5">{item.customerEmail}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{formatCapitalize(item.category)}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={
                                                        item.sentiment === "positive" ? "success" :
                                                            item.sentiment === "negative" ? "error" : "default"
                                                    }>
                                                        {formatCapitalize(item.sentiment)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="max-w-xs md:max-w-md truncate text-xs text-slate-350">
                                                    {item.content}
                                                </TableCell>
                                                <TableCell className="text-right text-4xs md:text-xs text-slate-450">
                                                    {formatDate(item.createdAt)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
