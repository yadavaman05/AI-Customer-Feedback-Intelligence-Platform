"use client";

import React from "react";
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChartCardProps {
    title: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
    headerActions?: React.ReactNode;
}

export default function ChartCard({
    title,
    description,
    children,
    className,
    headerActions,
}: ChartCardProps) {
    return (
        <Card hoverEffect className={cn("flex flex-col border-slate-800 bg-slate-950/40 backdrop-blur-md", className)}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 p-6 pb-4">
                <div className="space-y-1">
                    <CardTitle className="text-base font-semibold">{title}</CardTitle>
                    {description && (
                        <CardDescription className="text-xs text-slate-400">{description}</CardDescription>
                    )}
                </div>
                {headerActions && <div>{headerActions}</div>}
            </CardHeader>
            <CardContent className="flex-1 p-6 pt-0">
                {children}
            </CardContent>
        </Card>
    );
}
