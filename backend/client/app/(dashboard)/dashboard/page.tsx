"use client";

import Link from "next/link";
import { MessageSquare, TrendingDown, CheckCircle2, Sparkles, ArrowRight, ArrowUpRight } from "lucide-react";
import PageHeader from "@/components/ui/page-header";
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockMetrics, mockFeedbackList } from "@/lib/mock-data";
import { formatDate, formatCapitalize } from "@/utils/format";
import SentimentTrend from "@/components/charts/sentiment-trend";
import CategorySplit from "@/components/charts/category-split";

export default function DashboardPage() {
    const getIcon = (name: string) => {
        switch (name) {
            case "MessageSquare":
                return <MessageSquare className="h-4 w-4 md:h-5 md:w-5 text-emerald-450" />;
            case "TrendingDown":
                return <TrendingDown className="h-4 w-4 md:h-5 md:w-5 text-emerald-450" />;
            case "CheckCircle":
                return <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-emerald-450" />;
            case "Sparkles":
                return <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-teal-400 animate-pulse" />;
            default:
                return <MessageSquare className="h-4 w-4 md:h-5 md:w-5 text-slate-400" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <PageHeader
                title="System Overview"
                description="Monitor aggregated sentiment, categories, and latest ticket ingestions."
                actions={
                    <Link href="/feedback">
                        <Button size="sm" className="flex items-center gap-1.5 text-slate-950 font-bold">
                            Review Feedbacks
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                }
            />

            {/* Metrics Cards Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {mockMetrics.map((metric) => (
                    <Card key={metric.title} hoverEffect>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <span className="text-2xs md:text-xs font-semibold text-slate-400">
                                {metric.title}
                            </span>
                            <div className="h-7 w-7 md:h-8 md:w-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
                                {getIcon(metric.iconName)}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl md:text-2xl font-bold text-white tracking-tight">
                                {metric.value}
                            </div>
                            <div className="flex items-center gap-1 text-3xs md:text-2xs mt-1.5 text-slate-500">
                                <span className="font-semibold text-emerald-400">{metric.change}</span>
                                {metric.timeframe}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recharts Graphical Panels */}
            <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 p-6 border-slate-800">
                    <CardHeader className="px-0 pt-0 pb-4">
                        <CardTitle>Feedback Ingestion & Sentiment Trend</CardTitle>
                        <CardDescription>Visualizing month-by-month positive vs negative customer tickets.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0 pb-0">
                        <SentimentTrend />
                    </CardContent>
                </Card>

                <Card className="p-6 border-slate-800">
                    <CardHeader className="px-0 pt-0 pb-4">
                        <CardTitle>Issues by Category</CardTitle>
                        <CardDescription>Aggregation of labels extracted by AI model tags.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0 pb-0 flex items-center justify-center">
                        <CategorySplit />
                    </CardContent>
                </Card>
            </div>

            {/* Recent Feedbacks Card */}
            <Card className="p-6 border-slate-800">
                <CardHeader className="px-0 pt-0 pb-4 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Recent Feedbacks</CardTitle>
                        <CardDescription>Latest customer inputs parsed and flagged by sentiment classifier.</CardDescription>
                    </div>
                    <Link href="/feedback" className="text-2xs md:text-xs text-emerald-400 hover:underline flex items-center gap-1">
                        See all inbox <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                </CardHeader>
                <CardContent className="px-0 pb-0">
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
                            {mockFeedbackList.slice(0, 3).map((item) => (
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
                                    <TableCell className="max-w-xs md:max-w-md truncate text-xs text-slate-300">
                                        {item.content}
                                    </TableCell>
                                    <TableCell className="text-right text-4xs md:text-xs text-slate-450">
                                        {formatDate(item.createdAt)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
