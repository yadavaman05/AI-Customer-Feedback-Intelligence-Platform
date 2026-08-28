import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const origin = request.headers.get("origin") || "";
    const allowedOrigin = process.env.ALLOWED_ORIGIN || "http://localhost:3000";
    const allowOriginHeader = origin === allowedOrigin ? origin : allowedOrigin;

    // Handle preflight OPTIONS requests
    if (request.method === "OPTIONS") {
        const response = new NextResponse(null, { status: 204 });
        response.headers.set("Access-Control-Allow-Credentials", "true");
        response.headers.set("Access-Control-Allow-Origin", allowOriginHeader);
        response.headers.set("Access-Control-Allow-Methods", "GET,DELETE,PATCH,POST,PUT,OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization");
        return response;
    }

    // Continue with other middleware / responses
    const response = NextResponse.next();
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Access-Control-Allow-Origin", allowOriginHeader);
    response.headers.set("Access-Control-Allow-Methods", "GET,DELETE,PATCH,POST,PUT,OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization");
    return response;
}

export const config = {
    matcher: [
        "/api/:path*",
    ]
};
