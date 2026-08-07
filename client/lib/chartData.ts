export interface FeedbackTrendData {
    date: string;
    positive: number;
    neutral: number;
    negative: number;
    total: number;
}

export interface SentimentDistributionData {
    name: string;
    value: number;
    color: string;
}

export interface RatingDistributionData {
    rating: string;
    count: number;
    fill: string;
}

export interface FeedbackSourceData {
    name: string;
    value: number;
    percentage: string;
    color: string;
}

export interface CategoryDistributionData {
    name: string;
    value: number;
    percentage: string;
    color: string;
}

// Feedback Trend over 6 months
export const mockFeedbackTrend: FeedbackTrendData[] = [
    { date: "Mar", positive: 180, neutral: 60, negative: 80, total: 320 },
    { date: "Apr", positive: 240, neutral: 90, negative: 110, total: 440 },
    { date: "May", positive: 310, neutral: 110, negative: 90, total: 510 },
    { date: "Jun", positive: 450, neutral: 120, negative: 130, total: 700 },
    { date: "Jul", positive: 680, neutral: 150, negative: 140, total: 970 },
    { date: "Aug", positive: 1055, neutral: 156, negative: 271, total: 1482 },
];

// Sentiment Distribution (Pie chart)
export const mockSentimentDistribution: SentimentDistributionData[] = [
    { name: "Positive", value: 1055, color: "#10b981" }, // Emerald 500
    { name: "Neutral", value: 156, color: "#fbbf24" },  // Amber 400
    { name: "Negative", value: 271, color: "#ef4444" }, // Red 500
];

// Rating Distribution (Bar chart)
export const mockRatingDistribution: RatingDistributionData[] = [
    { rating: "5 Stars", count: 712, fill: "#10b981" },
    { rating: "4 Stars", count: 343, fill: "#34d399" }, // Emerald 400
    { rating: "3 Stars", count: 156, fill: "#fbbf24" }, // Amber 400
    { rating: "2 Stars", count: 182, fill: "#f87171" }, // Red 400
    { rating: "1 Star", count: 89, fill: "#ef4444" },  // Red 500
];

// Feedback Sources (Donut Chart)
export const mockFeedbackSources: FeedbackSourceData[] = [
    { name: "Support Email", value: 450, percentage: "30.4%", color: "#3b82f6" }, // Blue 500
    { name: "Live Chat", value: 322, percentage: "21.7%", color: "#06b6d4" },     // Cyan 500
    { name: "Play Store", value: 288, percentage: "19.4%", color: "#8b5cf6" },     // Violet 500
    { name: "App Store", value: 212, percentage: "14.3%", color: "#ec4899" },      // Pink 500
    { name: "Twitter / X", value: 140, percentage: "9.4%", color: "#14b8a6" },     // Teal 500
    { name: "Other Forms", value: 70, percentage: "4.7%", color: "#64748b" },      // Slate 500
];

// Category Distribution (Horizontal Bar Chart)
export const mockCategoryDistribution: CategoryDistributionData[] = [
    { name: "Bug Reports", value: 382, percentage: "25.8%", color: "#ef4444" },
    { name: "Feature Requests", value: 310, percentage: "20.9%", color: "#3b82f6" },
    { name: "UI/UX Usability", value: 275, percentage: "18.6%", color: "#ec4899" },
    { name: "Performance Latency", value: 220, percentage: "14.8%", color: "#10b981" },
    { name: "Pricing & Billing", value: 185, percentage: "12.5%", color: "#f59e0b" },
    { name: "Other Inquiries", value: 110, percentage: "7.4%", color: "#64748b" },
];
