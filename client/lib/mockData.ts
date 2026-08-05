import { FeedbackItem, MetricCardData } from "@/types/feedback";

// Workspace user mock
export const mockUser = {
    name: "John Doe",
    email: "demo.john@loop.ai",
    avatarInitials: "JD",
    role: "Workspace Admin",
};

// Day 2 Dashboard Cards
export const mockMetrics: MetricCardData[] = [
    {
        title: "Total Feedback",
        value: "1,482",
        change: "+12.5%",
        isPositive: true,
        timeframe: "vs last month",
        iconName: "MessageSquare",
    },
    {
        title: "Positive Feedback",
        value: "71.2%",
        change: "+4.1%",
        isPositive: true,
        timeframe: "vs last month",
        iconName: "Smile",
    },
    {
        title: "Negative Feedback",
        value: "18.3%",
        change: "-3.5%",
        isPositive: true, // positive because negative sentiment went down
        timeframe: "vs last month",
        iconName: "Frown",
    },
    {
        title: "Neutral Feedback",
        value: "10.5%",
        change: "-0.6%",
        isPositive: true,
        timeframe: "vs last month",
        iconName: "Meh",
    },
    {
        title: "Active Users",
        value: "3,842",
        change: "+8.7%",
        isPositive: true,
        timeframe: "vs last week",
        iconName: "Users",
    },
    {
        title: "AI Insights",
        value: "94.2%",
        change: "+0.8%",
        isPositive: true,
        timeframe: "from relative base",
        iconName: "Sparkles",
    }
];

// Feedback items list supporting: Customer Name, Feedback, Sentiment, Rating, Date, Status
export const mockFeedbackList: FeedbackItem[] = [
    {
        id: "fb-1",
        source: "email",
        customerName: "Alice Vance",
        customerEmail: "alice@vancetech.io",
        sentiment: "negative",
        category: "bug",
        content: "The billing section throws an unexpected 500 error when attempting to download our monthly PDF invoices. This is blocking our accounting team from closing their accounts.",
        status: "new",
        createdAt: "2026-08-04T18:45:00Z",
        confidenceScore: 0.98,
        rating: 2,
    },
    {
        id: "fb-2",
        source: "playstore",
        customerName: "David Kim",
        customerEmail: "david.kim@gmail.com",
        sentiment: "positive",
        category: "ui_ux",
        content: "Absolutely love the new dark mode design! Navigator gestures are so smooth and simple. Great job on the 1.4 update.",
        status: "resolved",
        createdAt: "2026-08-04T12:30:00Z",
        confidenceScore: 0.95,
        rating: 5,
    },
    {
        id: "fb-3",
        source: "chat",
        customerName: "Sophie Dupont",
        customerEmail: "sophie@dupontconsulting.fr",
        sentiment: "neutral",
        category: "feature_request",
        content: "Would it be possible to add webhook notifications for MS Teams? We have migrated away from Slack and want realtime alerts on our support channel for VIP tags.",
        status: "in_progress",
        createdAt: "2026-08-03T15:10:00Z",
        confidenceScore: 0.89,
        rating: 4,
    },
    {
        id: "fb-4",
        source: "twitter",
        customerName: "Alex Mercer",
        customerEmail: "alex@mercer.dev",
        sentiment: "negative",
        category: "performance",
        content: "Initial script loading times for the embedded page widget are taking way too long on mobile devices (almost 4.2 seconds). Pls optimize chunk size and leverage edge CDN caching.",
        status: "new",
        createdAt: "2026-08-03T09:20:00Z",
        confidenceScore: 0.97,
        rating: 1,
    },
    {
        id: "fb-5",
        source: "appstore",
        customerName: "Elena Rostova",
        customerEmail: "elena.r@ya.ru",
        sentiment: "neutral",
        category: "pricing",
        content: "The custom enterprise plans require calling sales, but a clear overview for start-up bundles would save developer teams a lot of initial negotiation and back-and-forth.",
        status: "in_progress",
        createdAt: "2026-08-02T20:15:00Z",
        confidenceScore: 0.88,
        rating: 3,
    },
    {
        id: "fb-6",
        source: "email",
        customerName: "Marcus Sterling",
        customerEmail: "marcus@sterling.co.uk",
        sentiment: "positive",
        category: "performance",
        content: "Query response time has dropped under 50ms in Western Europe regions. The migration to Edge databases has been a remarkable improvement.",
        status: "resolved",
        createdAt: "2026-08-01T14:22:00Z",
        confidenceScore: 0.99,
        rating: 5,
    },
    {
        id: "fb-7",
        source: "survey",
        customerName: "Nisha Patel",
        customerEmail: "nisha.patel@techsolutions.in",
        sentiment: "negative",
        category: "ui_ux",
        content: "The dashboard is hard to navigate on mobile devices. The text boxes overflow the margins and the side bars block the main table columns.",
        status: "new",
        createdAt: "2026-07-31T11:05:00Z",
        confidenceScore: 0.91,
        rating: 2,
    },
];

// Line Chart: Ingestion and Sentiment Trend
export const mockSentimentChart = [
    { name: "Jan", positive: 400, neutral: 240, negative: 180 },
    { name: "Feb", positive: 500, neutral: 280, negative: 200 },
    { name: "Mar", positive: 650, neutral: 300, negative: 150 },
    { name: "Apr", positive: 800, neutral: 320, negative: 120 },
    { name: "May", positive: 950, neutral: 280, negative: 90 },
    { name: "Jun", positive: 1248, neutral: 340, negative: 130 },
];

// Pie Chart: Issues by Category
export const mockCategoryChart = [
    { name: "Bugs", value: 382 },
    { name: "Features", value: 294 },
    { name: "UI/UX", value: 218 },
    { name: "Performance", value: 184 },
    { name: "Pricing", value: 170 },
];

// Bar Chart: Rating Distribution
export const mockRatingChart = [
    { rating: "5 Stars", count: 450, fill: "#10b981" },
    { rating: "4 Stars", count: 320, fill: "#34d399" },
    { rating: "3 Stars", count: 180, fill: "#fbbf24" },
    { rating: "2 Stars", count: 90, fill: "#f87171" },
    { rating: "1 Star", count: 58, fill: "#ef4444" },
];
