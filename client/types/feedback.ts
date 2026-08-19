export interface FeedbackItem {
    id: string;
    source: 'email' | 'chat' | 'playstore' | 'appstore' | 'twitter' | 'survey' | 'website' | 'google' | 'other';
    customerName: string;
    customerEmail: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    category: 'bug' | 'feature_request' | 'ui_ux' | 'performance' | 'pricing' | 'other';
    content: string;
    rating?: number;
    status: 'new' | 'in_progress' | 'resolved';
    createdAt: string;
    confidenceScore: number;
    aiSummary?: string;
    suggestedAction?: string;
    keywords?: string[];
}

export interface ChatMessage {
    id: string;
    sender: 'user' | 'loop';
    text: string;
    timestamp: string;
}

export interface MetricCardData {
    title: string;
    value: string | number;
    change: string;
    isPositive: boolean;
    timeframe: string;
    iconName: string;
}
