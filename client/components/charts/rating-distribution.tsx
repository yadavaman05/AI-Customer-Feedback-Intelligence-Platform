"use client";

<<<<<<< HEAD
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const data = [
    { rating: "5 Stars", count: 450 },
    { rating: "4 Stars", count: 320 },
    { rating: "3 Stars", count: 180 },
    { rating: "2 Stars", count: 90 },
    { rating: "1 Star", count: 58 },
];
=======
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { mockRatingChart } from "@/lib/mockData";
>>>>>>> origin/main

export default function RatingDistribution() {
    return (
        <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
<<<<<<< HEAD
                <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
=======
                <BarChart data={mockRatingChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
>>>>>>> origin/main
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                    <XAxis dataKey="rating" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                        contentStyle={{ backgroundColor: "#0b0f19", borderColor: "#1e293b", color: "#f8fafc" }}
                        itemStyle={{ color: "#f8fafc" }}
                    />
<<<<<<< HEAD
                    <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} name="Tickets Count" />
=======
                    <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} name="Tickets Count">
                        {mockRatingChart.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Bar>
>>>>>>> origin/main
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
<<<<<<< HEAD
export { data };
=======

>>>>>>> origin/main
