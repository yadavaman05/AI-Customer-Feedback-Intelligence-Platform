import { NextResponse } from "next/server";
import { requireWorkspaceAccess } from "@/lib/rbac";
import { classifyFeedback } from "@/lib/ai/claude";

export async function POST(
    request: Request,
    { params }: { params: { workspaceId: string } }
) {
    try {
        const { workspaceId } = params;
        const context = await requireWorkspaceAccess(workspaceId);

        if (!context) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        if (!body || typeof body.content !== "string" || body.content.trim() === "") {
            return NextResponse.json({ error: "Invalid Request: 'content' is strictly required" }, { status: 400 });
        }

        try {
            const result = await classifyFeedback(body.content);
            if (!result) {
                return NextResponse.json({ error: "Classification failed due to malformed AI response" }, { status: 422 });
            }
            return NextResponse.json({ classification: result }, { status: 200 });
        } catch (apiError: unknown) {
            const errorMessage = apiError instanceof Error ? apiError.message : "AI service unavailable";
            return NextResponse.json({ error: errorMessage }, { status: 503 });
        }

    } catch (error) {
        console.error("POST AI Test Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
