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
            const queryParams = new URLSearchParams();
            if (params) {
                Object.entries(params).forEach(([key, val]) => {
                    if (val !== undefined && val !== null && val !== "all" && val !== "") {
                        queryParams.append(key, String(val));
                    }
                });
            }
            const queryStr = queryParams.toString();
            return this.get<ApiResponse<PaginatedResponse<FeedbackItem>>>(
                `/api/feedback${queryStr ? `?${queryStr}` : ""}`
            );
        },

        get: async (id: string): Promise<ApiResponse<FeedbackItem>> => {
            return this.get<ApiResponse<FeedbackItem>>(`/api/feedback/${id}`);
        },

        create: async (
            feedback: Omit<FeedbackItem, "id" | "createdAt" | "confidenceScore" | "sentiment" | "aiSummary" | "suggestedAction" | "keywords" | "status">
        ): Promise<ApiResponse<FeedbackItem>> => {
            return this.post<ApiResponse<FeedbackItem>>("/api/feedback", feedback);
        },

        updateStatus: async (
            id: string,
            status: "new" | "in_progress" | "resolved"
        ): Promise<ApiResponse<FeedbackItem>> => {
            return this.patch<ApiResponse<FeedbackItem>>(`/api/feedback/${id}`, { status });
        },
    };

    // Analytics Resource
    public analytics = {
        getSummary: async (): Promise<ApiResponse<AnalyticsSummary>> => {
            return this.get<ApiResponse<AnalyticsSummary>>("/api/analytics");
        },
    };
}

export const api = new ApiClient();
export default api;
