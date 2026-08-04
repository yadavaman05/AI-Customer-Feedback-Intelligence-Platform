"use client";

import PageHeader from "@/components/ui/page-header";
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SentimentTrend from "@/components/charts/sentiment-trend";
import CategorySplit from "@/components/charts/category-split";
import RatingDistribution from "@/components/charts/rating-distribution";

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Advanced Feedback Analytics"
                description="Drill down on net promoter scores, aggregate sentiment metrics, and issue categories."
            />

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 border-slate-800">
                    <CardHeader className="px-0 pt-0 pb-4">
                        <CardTitle>Over-Time Sentiment Trend</CardTitle>
                        <CardDescription>Visualizing month-by-month positive vs negative feedback ingestion.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0 pb-0">
                        <SentimentTrend />
                    </CardContent>
                </Card>

                <Card className="p-6 border-slate-800">
                    <CardHeader className="px-0 pt-0 pb-4">
                        <CardTitle>Extracted Issue Category Mix</CardTitle>
                        <CardDescription>Aggregation of labels assigned by AI classification models.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0 pb-0 flex items-center justify-center">
                        <CategorySplit />
                    </CardContent>
                </Card>

                <Card className="md:col-span-2 p-6 border-slate-800">
                    <CardHeader className="px-0 pt-0 pb-4">
                        <CardTitle>Customer Score Rating Distribution</CardTitle>
                        <CardDescription>Breaking down raw rating scores across ingested platforms.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0 pb-0">
                        <RatingDistribution />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
