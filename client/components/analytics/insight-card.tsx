"use client";

import React from "react";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import { Sparkles, ArrowUp, ArrowDown, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface InsightCardProps {
    title: string;
    type: "positive" | "negative" | "neutral" | "keyword" | "csat" | "confidence" | "action" | "summary";
    value: string | number;
    subtitle?: string;
    badgeText?: string;
    badgeVariant?: "success" | "warning" | "error" | "info" | "default";
    growthIcon?: "up" | "down" | "flat";
    details: string;
    recommendation?: string;
}

export default function InsightCard({
    title,
    type,
    value,
    subtitle,
    badgeText,
    badgeVariant = "default",
    growthIcon,
    details,
    recommendation,
}: InsightCardProps) {
    const isSummary = type === "summary";

    return (
        <Card hoverEffect className={cn(
            "border-slate-800 bg-slate-950/40 backdrop-blur-md",
            isSummary && "md:col-span-2 border-emerald-500/20 bg-emerald-950/5 relative overflow-hidden"
        )}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center space-x-2">
                    {isSummary ? (
                        <Sparkles className="h-4.5 w-4.5 text-emerald-400 animate-pulse" />
                    ) : (
                        <Sparkles className="h-4 w-4 text-purple-400" />
                    )}
                    <CardTitle className={cn("text-sm font-semibold", isSummary ? "text-emerald-400" : "text-slate-200")}>
                        {title}
                    </CardTitle>
                </div>
                {badgeText && (
                    <Badge variant={badgeVariant}>
                        {growthIcon === "up" && <ArrowUp className="mr-0.5 h-2.5 w-2.5" />}
                        {growthIcon === "down" && <ArrowDown className="mr-0.5 h-2.5 w-2.5" />}
                        {badgeText}
                    </Badge>
                )}
            </CardHeader>

            <CardContent className="space-y-3 pb-6">
                <div>
                    <h4 className="text-lg font-bold text-white tracking-tight">{value}</h4>
                    {subtitle && (
                        <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
                    )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-normal bg-slate-900/35 p-3 rounded-lg border border-slate-900/50">
                    {details}
                </p>

                {recommendation && (
                    <div className="mt-3 flex items-start space-x-2 rounded-lg bg-slate-950/80 border border-slate-800 p-2.5 text-xs text-slate-300">
                        <Lightbulb className="mt-0.5 h-4 w-4 text-amber-400 flex-shrink-0" />
                        <div>
                            <span className="font-semibold text-slate-200 block mb-0.5">AI Recommendation</span>
                            <span>{recommendation}</span>
                        </div>
                    </div>
                )}

                {isSummary && (
                    <div className="absolute top-0 right-0 -mt-6 -mr-6 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
                )}
            </CardContent>
        </Card>
    );
}
