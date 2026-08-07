export interface AIInsightData {
    id: string;
    title: string;
    type: "positive" | "negative" | "neutral" | "keyword" | "csat" | "confidence" | "action" | "summary";
    value: string | number;
    subtitle?: string;
    badgeText?: string;
    badgeVariant?: "success" | "warning" | "error" | "info" | "default";
    growthIcon?: "up" | "down" | "flat";
    details: string;
    recommendation?: string;
}

export interface ProcessingStatusData {
    status: "idle" | "processing" | "completed" | "error";
    label: string;
    processedCount: number;
    totalCount: number;
    lastUpdated: string;
    accuracy: string;
}

export const mockProcessingStatus: ProcessingStatusData = {
    status: "completed",
    label: "Optimal Status",
    processedCount: 1482,
    totalCount: 1482,
    lastUpdated: "Just now",
    accuracy: "98.4%"
};

export const mockStatCards = [
    {
        id: "total-feedback",
        title: "Total Feedback",
        value: "1,482",
        change: "+12.5%",
        isPositive: true,
        timeframe: "vs last month",
        iconName: "MessageSquare",
    },
    {
        id: "positive-feedback",
        title: "Positive Feedback",
        value: "71.2%",
        change: "+4.1%",
        isPositive: true,
        timeframe: "vs last month",
        iconName: "Smile",
    },
    {
        id: "neutral-feedback",
        title: "Neutral Feedback",
        value: "10.5%",
        change: "-0.6%",
        isPositive: true,
        timeframe: "vs last month",
        iconName: "Meh",
    },
    {
        id: "negative-feedback",
        title: "Negative Feedback",
        value: "18.3%",
        change: "-3.5%",
        isPositive: true, // true because drops in negative feedback are positive
        timeframe: "vs last month",
        iconName: "Frown",
    },
    {
        id: "avg-rating",
        title: "Average Rating",
        value: "4.2 / 5",
        change: "+0.3",
        isPositive: true,
        timeframe: "vs last week",
        iconName: "Star",
    },
    {
        id: "ai-status",
        title: "AI Processing Status",
        value: "100%",
        change: "Optimal",
        isPositive: true,
        timeframe: "1,482 logs analyzed",
        iconName: "Cpu",
    }
];

export const mockAIInsightsItems: AIInsightData[] = [
    {
        id: "insight-1",
        title: "Top Positive Topic",
        type: "positive",
        value: "Version 1.4 Dark Mode UI",
        subtitle: "Highly praised gestures and animations",
        badgeText: "High Praise",
        badgeVariant: "success",
        details: "Users are reporting significant satisfaction (+95% positive rating) with the new dark mode aesthetics and transitions implemented in mobile layouts.",
        recommendation: "Highlight dark mode screenshots in App Store / Play Store marketing visuals."
    },
    {
        id: "insight-2",
        title: "Top Negative Topic",
        type: "negative",
        value: "Billing Invoice PDF Failures",
        subtitle: "Throws 500 error on download attempts",
        badgeText: "High Urgency",
        badgeVariant: "error",
        details: "Representing 14.5% of total bug reports, accounting teams are unable to download monthly PDF invoices, disrupting their reconciliation processes.",
        recommendation: "Investigate PDF rendering server-side logs. Consider rollback of the invoice library update."
    },
    {
        id: "insight-3",
        title: "Most Mentioned Keyword",
        type: "keyword",
        value: "performance",
        subtitle: "Mentioned 184 times in comments",
        badgeText: "+8.5% frequency spike",
        badgeVariant: "info",
        details: "Data caching optimization query latencies decreased Western Europe DB response times below 50ms, resulting in heavy community mentions.",
        recommendation: "Ensure edge caching is configured correctly across other global hosting regions."
    },
    {
        id: "insight-4",
        title: "Customer Satisfaction",
        type: "csat",
        value: "82%",
        subtitle: "Customer Satisfaction Score (CSAT)",
        badgeText: "+4.1% monthly gain",
        badgeVariant: "success",
        growthIcon: "up",
        details: "Computed by analyzing sentiment distribution weight metrics over the past 30 days. Strong progress driven by support responsiveness."
    },
    {
        id: "insight-5",
        title: "AI Confidence Score",
        type: "confidence",
        value: "94.2%",
        subtitle: "Classification Model Match Rate",
        badgeText: "Stable Accuracy",
        badgeVariant: "default",
        details: "Current rating of labels assigned by AI classification models aligned with human audit validations. Optimal range is > 90%."
    },
    {
        id: "insight-6",
        title: "Recommended Action",
        type: "action",
        value: "Deploy Rate Limiter Hotfix",
        subtitle: "API Rate-limiting return content-type",
        badgeText: "Actionable priority",
        badgeVariant: "warning",
        details: "Rate limiter is returning default HTML error landing pages (code 429) rather than structured JSON. Disrupting automated developer client scripts.",
        recommendation: "Update client middleware response content-type to 'application/json' immediately."
    },
    {
        id: "insight-7",
        title: "Weekly AI Summary",
        type: "summary",
        value: "Overall dashboard healthy; Bug volume trending downwards (-8%)",
        details: "This week, Project LOOP ingested 1,482 feedback items, showing a clear shift towards positive sentiment (71.2%). System optimization has successfully boosted latency satisfaction. However, a major issue remains: our payment/billing PDF handler requires technical attention due to sudden invoice export exceptions."
    }
];
