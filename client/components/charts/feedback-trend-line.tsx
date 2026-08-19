"use client";

import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { mockFeedbackTrend } from "@/lib/chartData";

export default function FeedbackTrendLine() {
    return (
        <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockFeedbackTrend} margin={{ top: 12, right: 12, left: -22, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                    <XAxis dataKey="date" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                        contentStyle={{ backgroundColor: "#0b0f19", borderColor: "#1e293b", color: "#f8fafc" }}
                        itemStyle={{ color: "#f8fafc" }}
                    />
                    <Legend wrapperStyle={{ paddingTop: 10 }} />
                    <Line
                        type="monotone"
                        dataKey="positive"
                        name="Positive"
                        stroke="#10b981"
                        strokeWidth={2}
                        activeDot={{ r: 6 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="neutral"
                        name="Neutral"
                        stroke="#fbbf24"
                        strokeWidth={2}
                    />
                    <Line
                        type="monotone"
                        dataKey="negative"
                        name="Negative"
                        stroke="#ef4444"
                        strokeWidth={2}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
