import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { decode } from "next-auth/jwt";
import { headers } from "next/headers";

export type WorkspaceContext = {
    userId: string;
    workspaceId: string;
    role: Role;
};

export type AuthUser = {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
};

/**
 * Retrieves the currently authenticated user from NextAuth or Bearer token.
 * Returns null if the user is unauthenticated.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
    // 1. Try standard cookie-based session
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.id) {
            return {
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                image: session.user.image,
            };
        }
    } catch (e) {
        console.error("NextAuth session check failed:", e);
    }

    // 2. Try Authorization: Bearer token in headers
    try {
        const reqHeaders = headers();
        const authHeader = reqHeaders.get("authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const tokenString = authHeader.substring(7);
            const secret = process.env.NEXTAUTH_SECRET;
            if (secret) {
                const decoded = await decode({
                    token: tokenString,
                    secret,
                });
                if (decoded) {
                    const id = (decoded.id as string) || (decoded.sub as string);
                    if (id) {
                        return {
                            id,
                            name: decoded.name as string | null,
                            email: decoded.email as string,
                            image: decoded.picture as string | null,
                        };
                    }
                }
            }
        }
    } catch (e) {
        console.error("Bearer token decode failed:", e);
    }

    return null;
}

/**
 * Verifies that the current user belongs to the specified workspace
 * and possesses one of the explicitly allowed roles.
 * Returns the resolved context if authorized, or null if unauthorized.
 */
export async function requireWorkspaceAccess(
    workspaceId: string,
    allowedRoles: Role[] = ["OWNER", "ADMIN", "MEMBER", "VIEWER"]
): Promise<WorkspaceContext | null> {
    const user = await getCurrentUser();
    const userId = user?.id;

    if (!userId) {
        return null;
    }

    // Look up the mapping in the WorkspaceMember junction table
    const membership = await prisma.workspaceMember.findUnique({
        where: {
            userId_workspaceId: {
                userId: userId,
                workspaceId,
            },
        },
    });

    if (!membership) {
        return null;
    }

    // Ensure role complies
    if (!allowedRoles.includes(membership.role)) {
        return null;
    }

    return {
        userId: membership.userId,
        workspaceId: membership.workspaceId,
        role: membership.role,
    };
}
