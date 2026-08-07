"use client";

import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from "recharts";
import { mockCategoryDistribution } from "@/lib/chartData";

export default function CategoryHorizontalBar() {
    return (
        <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    layout="vertical"
                    data={mockCategoryDistribution}
                    margin={{ top: 12, right: 30, left: 20, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} horizontal={false} />
                    <XAxis type="number" stroke="#64748b" />
                    <YAxis
                        type="category"
                        dataKey="name"
                        stroke="#64748b"
                        width={110}
                        style={{ fontSize: "10px" }}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: "#0b0f19", borderColor: "#1e293b", color: "#f8fafc" }}
                        itemStyle={{ color: "#f8fafc" }}
                        formatter={(value: unknown, name: unknown, item: unknown) => {
                            const payload = (item as { payload: { percentage: string } }).payload;
                            return [`${value} (${payload.percentage})`, "Count"];
                        }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {mockCategoryDistribution.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
