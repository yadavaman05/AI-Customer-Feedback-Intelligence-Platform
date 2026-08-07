"use client";

import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { mockRatingDistribution } from "@/lib/chartData";

export default function RatingDistributionBar() {
    return (
        <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockRatingDistribution} margin={{ top: 12, right: 12, left: -22, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                    <XAxis dataKey="rating" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                        contentStyle={{ backgroundColor: "#0b0f19", borderColor: "#1e293b", color: "#f8fafc" }}
                        itemStyle={{ color: "#f8fafc" }}
                        formatter={(value: unknown) => [`${value} logs`, "Feedbacks"]}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {mockRatingDistribution.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={entry.fill} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
