import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { encode } from "next-auth/jwt";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user || !user.password) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        // Get user's workspaces
        const workspaceMember = await prisma.workspaceMember.findFirst({
            where: { userId: user.id },
            include: { workspace: true }
        });

        const workspace = workspaceMember?.workspace ?? null;

        // Generate the NextAuth JWT token payload
        const tokenPayload = {
            id: user.id,
            name: user.name,
            email: user.email,
            picture: user.image,
            sub: user.id,
        };

        const secret = process.env.NEXTAUTH_SECRET;
        if (!secret) {
            console.error("NEXTAUTH_SECRET is not configured on the backend server.");
            return NextResponse.json({ error: "Server misconfiguration: NEXTAUTH_SECRET missing" }, { status: 500 });
        }

        // Encrypt the token using NextAuth's helper
        const token = await encode({
            token: tokenPayload,
            secret,
            maxAge: 30 * 24 * 60 * 60, // 30 days
        });

        return NextResponse.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
            },
            workspace: workspace ? {
                id: workspace.id,
                name: workspace.name,
                slug: workspace.slug,
            } : null
        }, { status: 200 });

    } catch (error) {
        console.error("Login API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
