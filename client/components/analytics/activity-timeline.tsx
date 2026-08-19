"use client";

import React from "react";

import { MessageSquare, Sparkles, FileText, AlertTriangle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActivityItem {
    id: string;
    type: "feedback_received" | "ai_analysis" | "report_generated" | "alert_triggered";
    title: string;
    description: string;
    timestamp: string;
    meta?: string;
}

interface ActivityTimelineProps {
    activities: ActivityItem[];
}

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
    // Map activity type to styling elements
    const typeConfig = {
        feedback_received: {
            icon: MessageSquare,
            color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        },
        ai_analysis: {
            icon: Sparkles,
            color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
        },
        report_generated: {
            icon: FileText,
            color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        },
        alert_triggered: {
            icon: AlertTriangle,
            color: "text-red-400 bg-red-500/10 border-red-500/20",
        },
    };

    return (
        <div className="relative pl-1">
            {/* Timeline Vertical Line */}
            <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-800" />

            <div className="space-y-6">
                {activities.map((activity) => {
                    const config = typeConfig[activity.type] || {
                        icon: HelpCircle,
                        color: "text-slate-400 bg-slate-500/10 border-slate-500/20",
                    };
                    const Icon = config.icon;

                    return (
                        <div key={activity.id} className="relative flex items-start space-x-4">
                            {/* timeline node icon */}
                            <div aria-hidden="true" className={cn(
                                "relative z-10 flex h-9.5 w-9.5 items-center justify-center rounded-full border bg-slate-950 transition-all duration-300",
                                config.color
                            )}>
                                <Icon className="h-4.5 w-4.5" />
                            </div>

                            {/* info details */}
                            <div className="flex-1 min-w-0 bg-slate-950/20 rounded-lg border border-slate-900/60 p-3 hover:border-slate-800 transition-all duration-200">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                    <h6 className="text-xs font-semibold text-slate-200">
                                        {activity.title}
                                    </h6>
                                    <span className="text-3xs md:text-2xs text-slate-400 shrink-0">
                                        {activity.timestamp}
                                    </span>
                                </div>
                                <p className="text-2xs md:text-xs text-slate-400 mt-1 font-normal leading-relaxed">
                                    {activity.description}
                                </p>
                                {activity.meta && (
                                    <div className="mt-2 flex items-center">
                                        <span className="inline-flex items-center rounded bg-slate-900 px-1.5 py-0.5 text-3xs font-medium text-slate-450 border border-slate-800">
                                            {activity.meta}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
