"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { mockRatingChart } from "@/lib/mockData";

export default function RatingDistribution() {
    return (
        <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockRatingChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                    <XAxis dataKey="rating" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                        contentStyle={{ backgroundColor: "#0b0f19", borderColor: "#1e293b", color: "#f8fafc" }}
                        itemStyle={{ color: "#f8fafc" }}
                    />
                    <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} name="Tickets Count">
                        {mockRatingChart.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

