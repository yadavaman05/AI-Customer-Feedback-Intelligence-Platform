"use client";

import React, { useState } from "react";
import DashboardHeader from "@/components/analytics/dashboard-header";
import AnalyticsFilters from "@/components/analytics/analytics-filters";
import DateRangePicker from "@/components/analytics/date-range-picker";
import StatCard from "@/components/analytics/stat-card";
import ChartCard from "@/components/analytics/chart-card";
import InsightCard from "@/components/analytics/insight-card";
import AlertCard from "@/components/analytics/alert-card";
import ActivityTimeline from "@/components/analytics/activity-timeline";

// Charts
import FeedbackTrendLine from "@/components/charts/feedback-trend-line";
import SentimentDistributionPie from "@/components/charts/sentiment-distribution-pie";
import RatingDistributionBar from "@/components/charts/rating-distribution-bar";
import FeedbackSourcesDonut from "@/components/charts/feedback-sources-donut";
import CategoryHorizontalBar from "@/components/charts/category-horizontal-bar";

// Mock Data
import { mockStatCards, mockAIInsightsItems } from "@/lib/analyticsData";
import { mockActivities, mockAlerts } from "@/lib/activityData";

export default function AnalyticsPage() {
    const [alerts, setAlerts] = useState(mockAlerts);
    const [selectedRange, setSelectedRange] = useState("Last 30 Days");

    const handleMarkRead = (id: string) => {
        setAlerts((prev) =>
            prev.map((alert) => (alert.id === id ? { ...alert, isRead: true } : alert))
        );
    };

    const handleFilterChange = (filterType: string, value: string) => {
        console.log(`Filter changed - type: ${filterType}, value: ${value}`);
    };

    const handleResetFilters = () => {
        console.log("Filters reset to default.");
    };

    return (
        <div className="space-y-6 pb-12 text-slate-100 min-h-screen">
            {/* 1. Header & Export Section */}
            <DashboardHeader
                title="AI Analytics Intelligence"
                description={`Monitor system feedback metrics, AI insights model performance, and live operational alerts summaries for ${selectedRange}.`}
            />

            {/* 2. Filters & Date Range Picker */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                    <AnalyticsFilters
                        onCategoryChange={(val) => handleFilterChange("category", val)}
                        onSourceChange={(val) => handleFilterChange("source", val)}
                        onSentimentChange={(val) => handleFilterChange("sentiment", val)}
                        onResetFilters={handleResetFilters}
                    />
                </div>
                <div className="lg:w-fit">
                    <DateRangePicker
                        onRangeChange={(range) => setSelectedRange(range)}
                    />
                </div>
            </div>

            {/* 3. Reusable Statistic Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {mockStatCards.map((card) => (
                    <StatCard
                        key={card.id}
                        title={card.title}
                        value={card.value}
                        change={card.change}
                        isPositive={card.isPositive}
                        timeframe={card.timeframe}
                        iconName={card.iconName}
                    />
                ))}
            </div>

            {/* 4. Recharts Charts Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Feedback Trend (Line Chart) */}
                <div className="lg:col-span-2">
                    <ChartCard
                        title="Feedback Trend Ingestion"
                        description="Tracking daily and monthly intake of feedback divided by sentiment tags over the timeline."
                    >
                        <FeedbackTrendLine />
                    </ChartCard>
                </div>

                {/* Sentiment Distribution (Pie Chart) */}
                <div className="lg:col-span-1">
                    <ChartCard
                        title="Sentiment Distribution Mix"
                        description="Proportionate comparison of positive vs neutral vs negative labels."
                    >
                        <SentimentDistributionPie />
                    </ChartCard>
                </div>

                {/* Rating Distribution (Bar Chart) */}
                <div className="lg:col-span-1">
                    <ChartCard
                        title="Feedback Rating Distribution"
                        description="Aggregation count breakdown from 1-star to 5-star customer reviews."
                    >
                        <RatingDistributionBar />
                    </ChartCard>
                </div>

                {/* Feedback Sources (Donut Chart) */}
                <div className="lg:col-span-1">
                    <ChartCard
                        title="Ingestion Distribution By Source"
                        description="Evaluating channel volumes from stores, chats, support tickets, and forms."
                    >
                        <FeedbackSourcesDonut />
                    </ChartCard>
                </div>

                {/* Category Distribution (Horizontal Bar Chart) */}
                <div className="lg:col-span-1">
                    <ChartCard
                        title="Feedback Category Distribution"
                        description="Ranking of core issue labels and ticket topics classified by NLP AI engines."
                    >
                        <CategoryHorizontalBar />
                    </ChartCard>
                </div>
            </div>

            {/* 5. AI Insight Cards Section */}
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-white tracking-tight">AI Generated Insights</h3>
                    <span className="h-[1px] flex-1 bg-slate-900" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockAIInsightsItems.map((insight) => (
                        <InsightCard
                            key={insight.id}
                            title={insight.title}
                            type={insight.type}
                            value={insight.value}
                            subtitle={insight.subtitle}
                            badgeText={insight.badgeText}
                            badgeVariant={insight.badgeVariant}
                            growthIcon={insight.growthIcon}
                            details={insight.details}
                            recommendation={insight.recommendation}
                        />
                    ))}
                </div>
            </div>

            {/* 6. Smart Alert Panel & Recent Activity Timeline Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Smart Alerts Section */}
                <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                        <h3 className="text-lg font-bold text-white tracking-tight">Smart Notifications & System Alerts</h3>
                        <span className="text-2xs text-slate-400 bg-slate-900 border border-slate-800 rounded px-2 py-0.5 font-semibold">
                            {alerts.filter((a) => !a.isRead).length} Unread
                        </span>
                    </div>

                    <div className="space-y-3.5">
                        {alerts.length === 0 ? (
                            <p className="text-xs text-slate-500 py-6 text-center">No alerts triggered.</p>
                        ) : (
                            alerts.map((alert) => (
                                <AlertCard
                                    key={alert.id}
                                    title={alert.title}
                                    message={alert.message}
                                    severity={alert.severity}
                                    timestamp={alert.timestamp}
                                    isRead={alert.isRead}
                                    onMarkRead={() => handleMarkRead(alert.id)}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Timeline Log Section */}
                <div className="lg:col-span-5 space-y-4">
                    <div className="border-b border-slate-900 pb-2">
                        <h3 className="text-lg font-bold text-white tracking-tight">Recent Activity Log</h3>
                    </div>

                    <div className="pt-2">
                        <ActivityTimeline activities={mockActivities} />
                    </div>
                </div>
            </div>
        </div>
    );
}
