import { ApiResponse, ApiError, PaginatedResponse, AnalyticsSummary } from "@/types/api";
import { FeedbackItem } from "@/types/feedback";

const DEFAULT_API_URL = "http://localhost:8000";

class ApiClient {
    private getBaseUrl(): string {
        return process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;
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
                // Prepare for auth eviction or redirect if needed
                if (typeof window !== "undefined") {
                    localStorage.removeItem("loop_auth_token");
                    window.location.href = "/login";
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
            // Check if it is already an ApiError
            const err = e as Record<string, unknown>;
            if (err && err.status !== undefined && err.message !== undefined) {
                throw err;
            }

            // Fallback for network connectivity/CORS errors
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

    private getWorkspaceId(): string | null {
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
                throw new Error("No active workspace selected.");
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
                data: any[];
                pagination: {
                    page: number;
                    pageSize: number;
                    total: number;
                    totalPages: number;
                }
            }>(`/api/workspaces/${workspaceId}/feedbacks${queryStr ? `?${queryStr}` : ""}`);

            const items: FeedbackItem[] = resData.data.map((item: any) => ({
                id: item.id,
                source: (item.source || "manual").toLowerCase() as any,
                customerName: item.rawData?.customerName || "Ingested Customer",
                customerEmail: item.rawData?.customerEmail || "customer@ingest.loop",
                sentiment: (item.sentiment || "neutral").toLowerCase() as any,
                category: item.rawData?.category || "performance",
                content: item.content,
                status: (item.status || "new").toLowerCase() as any,
                createdAt: item.createdAt,
                confidenceScore: 0.95,
                rating: item.rawData?.rating || 4,
            }));

            return {
                success: true,
                data: {
                    items,
                    total: resData.pagination.total,
                    page: resData.pagination.page,
                    limit: resData.pagination.pageSize,
                    pages: resData.pagination.totalPages
                }
            };
        },

        get: async (id: string): Promise<ApiResponse<FeedbackItem>> => {
            const workspaceId = this.getWorkspaceId();
            if (!workspaceId) {
                throw new Error("No active workspace selected.");
            }

            const item: any = await this.get<any>(`/api/workspaces/${workspaceId}/feedbacks/${id}`);

            return {
                success: true,
                data: {
                    id: item.id,
                    source: (item.source || "manual").toLowerCase() as any,
                    customerName: item.rawData?.customerName || "Ingested Customer",
                    customerEmail: item.rawData?.customerEmail || "customer@ingest.loop",
                    sentiment: (item.sentiment || "neutral").toLowerCase() as any,
                    category: item.rawData?.category || "performance",
                    content: item.content,
                    status: (item.status || "new").toLowerCase() as any,
                    createdAt: item.createdAt,
                    confidenceScore: 0.95,
                    rating: item.rawData?.rating || 4,
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

            // Map frontend payload to backend structure, storing client-only details in rawData JSON
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

            const res: any = await this.post<any>(`/api/workspaces/${workspaceId}/feedbacks`, payload);
            const created = res.feedback;

            return {
                success: true,
                data: {
                    id: created.id,
                    source: (created.source || "manual").toLowerCase() as any,
                    customerName: feedback.customerName,
                    customerEmail: feedback.customerEmail,
                    sentiment: (created.sentiment || "neutral").toLowerCase() as any,
                    category: feedback.category as any,
                    content: created.content,
                    status: (created.status || "new").toLowerCase() as any,
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

            // Map frontend status to database status enums: 'new' -> 'OPEN', 'in_progress' -> 'IN_PROGRESS', 'resolved' -> 'RESOLVED'
            let mappedStatus = "OPEN";
            if (status === "in_progress") mappedStatus = "IN_PROGRESS";
            else if (status === "resolved") mappedStatus = "RESOLVED";

            const res: any = await this.patch<any>(`/api/workspaces/${workspaceId}/feedbacks/${id}`, { status: mappedStatus });

            return {
                success: true,
                data: {
                    id,
                    status,
                } as any
            };
        },
    };

    // Analytics Resource
    public analytics = {
        getSummary: async (): Promise<ApiResponse<AnalyticsSummary>> => {
            return this.get<ApiResponse<AnalyticsSummary>>("/api/analytics");
        },
    };

    // Chat Resource
    public chat = {
        ask: async (query: string): Promise<ApiResponse<{ response: string }>> => {
            return this.post<ApiResponse<{ response: string }>>("/api/chat", { query });
        },
    };
}

export const api = new ApiClient();
export default api;
