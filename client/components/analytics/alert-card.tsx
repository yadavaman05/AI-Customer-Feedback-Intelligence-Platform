"use client";

import React from "react";
import Card, { CardContent } from "@/components/ui/card";
import { AlertCircle, AlertTriangle, TrendingUp, BellRing, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertCardProps {
    title: string;
    message: string;
    severity: "high" | "medium" | "critical" | "info";
    timestamp: string;
    isRead: boolean;
    onMarkRead?: () => void;
}

export default function AlertCard({
    title,
    message,
    severity,
    timestamp,
    isRead,
    onMarkRead,
}: AlertCardProps) {
    // Determine severity styles
    const severityConfig = {
        critical: {
            border: "border-red-500/30",
            bg: "bg-red-500/5",
            text: "text-red-400",
            glow: "shadow-red-500/5",
            icon: AlertCircle,
        },
        high: {
            border: "border-orange-500/30",
            bg: "bg-orange-500/5",
            text: "text-orange-400",
            glow: "shadow-orange-500/5",
            icon: AlertTriangle,
        },
        medium: {
            border: "border-yellow-500/30",
            bg: "bg-yellow-500/5",
            text: "text-yellow-400",
            glow: "shadow-yellow-500/5",
            icon: TrendingUp,
        },
        info: {
            border: "border-blue-500/30",
            bg: "bg-blue-500/5",
            text: "text-blue-400",
            glow: "shadow-blue-500/5",
            icon: BellRing,
        },
    };

    const config = severityConfig[severity] || severityConfig.info;
    const Icon = config.icon;

    return (
        <Card className={cn(
            "border transition-all duration-300 relative overflow-hidden shadow-sm",
            config.border,
            config.bg,
            !isRead && "ring-1 ring-slate-800",
            isRead && "opacity-75"
        )}>
            <CardContent className="p-4 flex items-start space-x-3.5">
                <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg border flex-shrink-0 mt-0.5",
                    config.border.replace("/30", "/20"),
                    config.text
                )}>
                    <Icon className="h-4.5 w-4.5" />
                </div>

                <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center space-x-2">
                        <h5 className="text-xs md:text-sm font-semibold text-slate-100 truncate">
                            {title}
                        </h5>
                        {!isRead && (
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse" />
                        )}
                    </div>
                    <p className="text-2xs md:text-xs text-slate-300 mt-1 leading-relaxed">
                        {message}
                    </p>
                    <span className="text-3xs md:text-2xs text-slate-400 block mt-2">
                        {timestamp}
                    </span>
                </div>

                {onMarkRead && !isRead && (
                    <button
                        onClick={onMarkRead}
                        className="absolute top-4 right-4 p-1 rounded-md border border-slate-800 hover:border-slate-700 bg-slate-950 text-slate-400 hover:text-white transition-all"
                        title="Mark as Read"
                    >
                        <Check className="h-3 w-3" />
                    </button>
                )}
            </CardContent>
        </Card>
    );
}
