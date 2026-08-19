"use client";

import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { mockFeedbackSources } from "@/lib/chartData";

export default function FeedbackSourcesDonut() {
    return (
        <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={mockFeedbackSources}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                        nameKey="name"
                    >
                        {mockFeedbackSources.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: "#0b0f19", borderColor: "#1e293b", color: "#f8fafc" }}
                        itemStyle={{ color: "#f8fafc" }}
                        formatter={(value: unknown, name: unknown, item: unknown) => {
                            const payload = (item as { payload: { percentage: string } }).payload;
                            return [`${value} (${payload.percentage})`, "Volume"];
                        }}
                    />
                    <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        wrapperStyle={{ paddingTop: 10, fontSize: "10px" }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
