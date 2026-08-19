"use client";

import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { mockSentimentDistribution } from "@/lib/chartData";

export default function SentimentDistributionPie() {
    return (
        <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={mockSentimentDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                        nameKey="name"
                    >
                        {mockSentimentDistribution.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: "#0b0f19", borderColor: "#1e293b", color: "#f8fafc" }}
                        itemStyle={{ color: "#f8fafc" }}
                        formatter={(value: unknown) => [`${value} comments`, "Volume"]}
                    />
                    <Legend wrapperStyle={{ paddingTop: 10 }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
