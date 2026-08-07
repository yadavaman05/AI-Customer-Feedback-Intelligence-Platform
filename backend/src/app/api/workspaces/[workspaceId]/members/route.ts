import { NextResponse } from "next/server";
import { requireWorkspaceAccess } from "@/lib/rbac";
import prisma from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: { workspaceId: string } }
) {
    try {
        const { workspaceId } = params;

        // RBAC Security Gate: Only OWNER and ADMIN can access members list endpoint.
        const context = await requireWorkspaceAccess(workspaceId, ["OWNER", "ADMIN"]);

        if (!context) {
            // Check if they are just a lower-tier member to return 403 Forbidden instead of 401 Unauthorized
            const isMember = await requireWorkspaceAccess(workspaceId);
            if (isMember) {
                return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
            }
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // STRICT WORKSPACE DATA ISOLATION:
        // Every query relies absolutely on the `workspaceId` established by the strictly validated context!
        // No query operates solely by user-supplied ID blindly.
        const members = await prisma.workspaceMember.findMany({
            where: {
                workspaceId: context.workspaceId, // Data isolation guarantee
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        createdAt: true,
                    }
                }
            }
        });

        // Compiling the safe dataset (excluding hashes, secrets, etc.)
        const safeMembersList = members.map(m => ({
            id: m.id,
            userId: m.userId,
            role: m.role,
            addedAt: m.addedAt,
            user: m.user
        }));

        return NextResponse.json({ members: safeMembersList }, { status: 200 });

    } catch (error) {
        console.error("GET Workspace Members Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
