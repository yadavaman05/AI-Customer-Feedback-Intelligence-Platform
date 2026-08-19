import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

export type WorkspaceContext = {
    userId: string;
    workspaceId: string;
    role: Role;
};

/**
 * Retrieves the currently authenticated user from NextAuth.
 * Returns null if the user is unauthenticated.
 */
export async function getCurrentUser() {
    const session = await getServerSession(authOptions);
    return session?.user ?? null;
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
    const userId = (user as any)?.id;

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
