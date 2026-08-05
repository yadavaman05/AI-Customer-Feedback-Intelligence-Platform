"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
<<<<<<< HEAD
import { mockCategoryChart } from "@/lib/mock-data";
=======
import { mockCategoryChart } from "@/lib/mockData";
>>>>>>> origin/main

const COLORS = ["#10b981", "#8b5cf6", "#3b82f6", "#f59e0b", "#94a3b8"];

export default function CategorySplit() {
    return (
        <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={mockCategoryChart}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {mockCategoryChart.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: "#0b0f19", borderColor: "#1e293b", color: "#f8fafc" }}
                        itemStyle={{ color: "#f8fafc" }}
                    />
                    <Legend wrapperStyle={{ paddingTop: 10 }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
