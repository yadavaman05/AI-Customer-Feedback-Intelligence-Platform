import { ApiResponse, ApiError, PaginatedResponse, AnalyticsSummary } from "@/types/api";
import { FeedbackItem } from "@/types/feedback";

const DEFAULT_API_URL = "http://localhost:8000";

interface RawFeedbackItem {
    id: string;
    source?: string;
    sentiment?: string;
    content: string;
    status?: string;
    createdAt: string;
    rawData?: {
        customerName?: string;
        customerEmail?: string;
        category?: string;
        rating?: number;
    };
}

class ApiClient {
    public getBaseUrl(): string {
        const rawUrl =
            process.env.NEXT_PUBLIC_API_URL ||
            process.env.NEXT_PUBLIC_API_BASE_URL ||
            process.env.VITE_API_URL ||
            DEFAULT_API_URL;
        return rawUrl.replace(/\/+$/, "");
    }

    private getHeaders(customHeaders: HeadersInit = {}): Headers {
        const headers = new Headers({
            "Content-Type": "application/json",
            ...customHeaders,
        });

        // Add authorization token if stored
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("loop_auth_token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
        }

        return headers;
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        let payload: unknown;
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            payload = await response.json();
        } else {
            payload = { message: await response.text() };
        }

        if (!response.ok) {
            // Handle specific status codes
            if (response.status === 401 || response.status === 403) {
                if (typeof window !== "undefined") {
                    localStorage.removeItem("loop_auth_token");
                }
            }

            const errPayload = payload as { message?: string; error?: string; errors?: Record<string, string[]> };
            const error: ApiError = {
                message: errPayload?.message || errPayload?.error || "An unknown network error occurred",
                status: response.status,
                errors: errPayload?.errors,
            };
            throw error;
        }

        return payload as T;
    }

    private async request<T>(
        path: string,
        method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
        body?: unknown,
        customHeaders?: HeadersInit
    ): Promise<T> {
        const url = `${this.getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
        const options: RequestInit = {
            method,
            headers: this.getHeaders(customHeaders),
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(url, options);
            return await this.handleResponse<T>(response);
        } catch (e) {
            const err = e as Record<string, unknown>;
            if (err && err.status !== undefined && err.message !== undefined) {
                throw err;
            }

            const networkError: ApiError = {
                message: (e as Error).message || "Network request failed. Please check if the API server is up and running.",
                status: 0,
            };
            throw networkError;
        }
    }

    public async get<T>(path: string, headers?: HeadersInit): Promise<T> {
        return this.request<T>(path, "GET", undefined, headers);
    }

    public async post<T>(path: string, body: unknown, headers?: HeadersInit): Promise<T> {
        return this.request<T>(path, "POST", body, headers);
    }

    public async put<T>(path: string, body: unknown, headers?: HeadersInit): Promise<T> {
        return this.request<T>(path, "PUT", body, headers);
    }

    public async patch<T>(path: string, body: unknown, headers?: HeadersInit): Promise<T> {
        return this.request<T>(path, "PATCH", body, headers);
    }

    public async delete<T>(path: string, headers?: HeadersInit): Promise<T> {
        return this.request<T>(path, "DELETE", undefined, headers);
    }

    // Auth actions
    public auth = {
        setToken: (token: string) => {
            if (typeof window !== "undefined") {
                localStorage.setItem("loop_auth_token", token);
            }
        },
        clearToken: () => {
            if (typeof window !== "undefined") {
                localStorage.removeItem("loop_auth_token");
            }
        },
        getToken: (): string | null => {
            if (typeof window !== "undefined") {
                return localStorage.getItem("loop_auth_token");
            }
            return null;
        },
    };

    public getWorkspaceId(): string | null {
        if (typeof window !== "undefined") {
            return localStorage.getItem("loop_workspace_id");
        }
        return null;
    }

    // Feedback Resource
    public feedback = {
        list: async (params?: {
            query?: string;
            rating?: string;
            sentiment?: string;
            source?: string;
            category?: string;
            status?: string;
            page?: number;
            limit?: number;
        }): Promise<ApiResponse<PaginatedResponse<FeedbackItem>>> => {
            const workspaceId = this.getWorkspaceId();
            if (!workspaceId) {
                return {
                    success: true,
                    data: {
                        items: [],
                        total: 0,
                        page: 1,
                        limit: params?.limit || 10,
                        pages: 0
                    }
                };
            }

            const queryParams = new URLSearchParams();
            if (params) {
                if (params.query) queryParams.append("search", params.query);
                if (params.source && params.source !== "all") queryParams.append("channel", params.source);
                if (params.sentiment && params.sentiment !== "all") queryParams.append("sentiment", params.sentiment);
                if (params.status && params.status !== "all") queryParams.append("status", params.status);
                if (params.page) queryParams.append("page", String(params.page));
                if (params.limit) queryParams.append("pageSize", String(params.limit));
            }
            const queryStr = queryParams.toString();

            const resData = await this.get<{
                feedbacks: RawFeedbackItem[];
                pagination?: {
                    page: number;
                    pageSize: number;
                    total: number;
                    totalPages: number;
                };
            }>(`/api/workspaces/${workspaceId}/feedbacks${queryStr ? `?${queryStr}` : ""}`);

            const listData = resData.feedbacks || [];
            const pagination = resData.pagination || {
                page: 1,
                pageSize: listData.length,
                total: listData.length,
                totalPages: 1
            };

            const items: FeedbackItem[] = listData.map((item) => ({
                id: item.id,
                source: (item.source || "manual").toLowerCase() as FeedbackItem["source"],
                customerName: item.rawData?.customerName || "Ingested Customer",
                customerEmail: item.rawData?.customerEmail || "customer@ingest.loop",
                sentiment: (item.sentiment || "neutral").toLowerCase() as FeedbackItem["sentiment"],
                category: (item.rawData?.category || "performance") as FeedbackItem["category"],
                content: item.content,
                status: (item.status || "new").toLowerCase() as FeedbackItem["status"],
                createdAt: item.createdAt,
                confidenceScore: 0.95,
                rating: item.rawData?.rating || 4,
            }));

            return {
                success: true,
                data: {
                    items,
                    total: pagination.total,
                    page: pagination.page,
                    limit: pagination.pageSize,
                    pages: pagination.totalPages
                }
            };
        },

        get: async (id: string): Promise<ApiResponse<FeedbackItem>> => {
            const workspaceId = this.getWorkspaceId();
            if (!workspaceId) {
                throw new Error("No active workspace selected.");
            }

            const item = await this.get<{ feedback: RawFeedbackItem }>(`/api/workspaces/${workspaceId}/feedbacks/${id}`);
            const fb = item.feedback;

            return {
                success: true,
                data: {
                    id: fb.id,
                    source: (fb.source || "manual").toLowerCase() as FeedbackItem["source"],
                    customerName: fb.rawData?.customerName || "Ingested Customer",
                    customerEmail: fb.rawData?.customerEmail || "customer@ingest.loop",
                    sentiment: (fb.sentiment || "neutral").toLowerCase() as FeedbackItem["sentiment"],
                    category: (fb.rawData?.category || "performance") as FeedbackItem["category"],
                    content: fb.content,
                    status: (fb.status || "new").toLowerCase() as FeedbackItem["status"],
                    createdAt: fb.createdAt,
                    confidenceScore: 0.95,
                    rating: fb.rawData?.rating || 4,
                }
            };
        },

        create: async (
            feedback: Omit<FeedbackItem, "id" | "createdAt" | "confidenceScore" | "sentiment" | "aiSummary" | "suggestedAction" | "keywords" | "status">
        ): Promise<ApiResponse<FeedbackItem>> => {
            const workspaceId = this.getWorkspaceId();
            if (!workspaceId) {
                throw new Error("No active workspace selected.");
            }

            const payload = {
                content: feedback.content,
                title: feedback.customerName ? `Feedback from ${feedback.customerName}` : null,
                source: feedback.source?.toUpperCase() || "MANUAL",
                rawData: {
                    customerName: feedback.customerName,
                    customerEmail: feedback.customerEmail,
                    category: feedback.category,
                    rating: feedback.rating,
                }
            };

            const res = await this.post<{ feedback: RawFeedbackItem }>(`/api/workspaces/${workspaceId}/feedbacks`, payload);
            const created = res.feedback;

            return {
                success: true,
                data: {
                    id: created.id,
                    source: (created.source || "manual").toLowerCase() as FeedbackItem["source"],
                    customerName: feedback.customerName,
                    customerEmail: feedback.customerEmail,
                    sentiment: (created.sentiment || "neutral").toLowerCase() as FeedbackItem["sentiment"],
                    category: feedback.category as FeedbackItem["category"],
                    content: created.content,
                    status: (created.status || "new").toLowerCase() as FeedbackItem["status"],
                    createdAt: created.createdAt,
                    confidenceScore: 0.95,
                }
            };
        },

        updateStatus: async (
            id: string,
            status: "new" | "in_progress" | "resolved"
        ): Promise<ApiResponse<FeedbackItem>> => {
            const workspaceId = this.getWorkspaceId();
            if (!workspaceId) {
                throw new Error("No active workspace selected.");
            }

            let mappedStatus = "OPEN";
            if (status === "in_progress") mappedStatus = "IN_PROGRESS";
            else if (status === "resolved") mappedStatus = "RESOLVED";

            await this.patch<unknown>(`/api/workspaces/${workspaceId}/feedbacks/${id}`, { status: mappedStatus });

            return {
                success: true,
                data: {
                    id,
                    status,
                } as unknown as FeedbackItem
            };
        },
    };

    // Analytics Resource
    public analytics = {
        getSummary: async (): Promise<ApiResponse<AnalyticsSummary>> => {
            const workspaceId = this.getWorkspaceId();
            if (!workspaceId) {
                return {
                    success: true,
                    data: {
                        metrics: {
                            totalFeedback: 0,
                            positiveFeedback: 0,
                            neutralFeedback: 0,
                            negativeFeedback: 0,
                            avgRating: 0,
                        },
                        sentimentDistribution: [],
                        ratingDistribution: [],
                        sourceDistribution: [],
                        categoryDistribution: [],
                    }
                };
            }

            try {
                const res = await this.get<{
                    volume?: { total: number; trend: Array<{ date: string; count: number }> };
                    sentiment?: Array<{ name: string; value: number }>;
                    topThemes?: Array<{ name: string; value: number }>;
                }>(`/api/workspaces/${workspaceId}/dashboard`);

                const total = res.volume?.total || 0;
                let positive = 0;
                let neutral = 0;
                let negative = 0;

                const sentimentDist = (res.sentiment || []).map((s) => {
                    const name = s.name.toLowerCase() as "positive" | "neutral" | "negative";
                    if (name === "positive") positive = s.value;
                    if (name === "neutral") neutral = s.value;
                    if (name === "negative") negative = s.value;
                    return {
                        sentiment: name,
                        count: s.value,
                        percentage: total > 0 ? Math.round((s.value / total) * 100) : 0,
                    };
                });

                return {
                    success: true,
                    data: {
                        metrics: {
                            totalFeedback: total,
                            positiveFeedback: positive,
                            neutralFeedback: neutral,
                            negativeFeedback: negative,
                            avgRating: 4.5,
                        },
                        sentimentDistribution: sentimentDist,
                        ratingDistribution: [],
                        sourceDistribution: [],
                        categoryDistribution: (res.topThemes || []).map((t) => ({ category: t.name, count: t.value })),
                    }
                };
            } catch {
                return {
                    success: true,
                    data: {
                        metrics: {
                            totalFeedback: 0,
                            positiveFeedback: 0,
                            neutralFeedback: 0,
                            negativeFeedback: 0,
                            avgRating: 0,
                        },
                        sentimentDistribution: [],
                        ratingDistribution: [],
                        sourceDistribution: [],
                        categoryDistribution: [],
                    }
                };
            }
        },
    };

    // Chat Resource
    public chat = {
        ask: async (query: string): Promise<ApiResponse<{ response: string }>> => {
            const workspaceId = this.getWorkspaceId();
            if (!workspaceId) {
                return {
                    success: true,
                    data: {
                        response: "Please sign in to a workspace to chat with Loop AI."
                    }
                };
            }

            const res = await this.post<{ answer: string }>(
                `/api/workspaces/${workspaceId}/ask`,
                { question: query }
            );

            return {
                success: true,
                data: {
                    response: res.answer || "No response received from AI model."
                }
            };
        },
    };
}

export const api = new ApiClient();
export default api;
