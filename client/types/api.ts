import { FeedbackItem } from "./feedback";

export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface ApiError {
    message: string;
    status?: number;
    errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}

export interface AnalyticsSummary {
    metrics: {
        totalFeedback: number;
        positiveFeedback: number;
        neutralFeedback: number;
        negativeFeedback: number;
        avgRating: number;
    };
    sentimentDistribution: {
        sentiment: 'positive' | 'neutral' | 'negative';
        count: number;
        percentage: number;
    }[];
    ratingDistribution: {
        rating: number;
        count: number;
    }[];
    sourceDistribution: {
        source: string;
        count: number;
    }[];
    categoryDistribution: {
        category: string;
        count: number;
    }[];
}
