"use client";

import React from "react";
import * as Icons from "lucide-react";
import Card, { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
    title: string;
    value: string | number;
    change: string;
    isPositive: boolean;
    timeframe: string;
    iconName: string;
}

export default function StatCard({
    title,
    value,
    change,
    isPositive,
    timeframe,
    iconName,
}: StatCardProps) {
    // Gracefully load Lucide icons
    const LucideIcon = (Icons[iconName as keyof typeof Icons] || Icons.HelpCircle) as React.ComponentType<{ className?: string }>;

    const trendUp = isPositive;
    const isNeutralChange = change === "Optimal" || change === "100%";

    return (
        <Card hoverEffect className="relative overflow-hidden border-slate-800 bg-slate-950/40 backdrop-blur-md">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-400">{title}</span>
                    <div className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
                    )}>
                        <LucideIcon className="h-5 w-5" />
                    </div>
                </div>

                <div className="mt-4 flex items-baseline justify-between">
                    <div>
                        <h3 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                            {value}
                        </h3>
                        <div className="mt-2 flex items-center space-x-2 text-xs">
                            <span
                                className={cn(
                                    "inline-flex items-center font-medium",
                                    isNeutralChange
                                        ? "text-emerald-400"
                                        : trendUp
                                            ? "text-emerald-400"
                                            : "text-red-400"
                                )}
                            >
                                {!isNeutralChange && (
                                    trendUp ? (
                                        <Icons.ArrowUpRight className="mr-0.5 h-3.5 w-3.5" />
                                    ) : (
                                        <Icons.ArrowDownRight className="mr-0.5 h-3.5 w-3.5" />
                                    )
                                )}
                                {change}
                            </span>
                            <span className="text-slate-500">{timeframe}</span>
                        </div>
                    </div>
                </div>

                {/* Accent background glow lines */}
                <div className={cn(
                    "absolute -bottom-6 -right-6 h-24 w-24 rounded-full blur-3xl opacity-10",
                    title.includes("Negative") ? "bg-red-500" : "bg-emerald-500"
                )} />
            </CardContent>
        </Card>
    );
}
