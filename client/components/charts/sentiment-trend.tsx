"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
<<<<<<< HEAD
import { mockSentimentChart } from "@/lib/mock-data";
=======
import { mockSentimentChart } from "@/lib/mockData";
>>>>>>> origin/main

export default function SentimentTrend() {
    return (
        <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockSentimentChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorNeg" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                        contentStyle={{ backgroundColor: "#0b0f19", borderColor: "#1e293b", color: "#f8fafc" }}
                        itemStyle={{ color: "#f8fafc" }}
                    />
                    <Legend wrapperStyle={{ paddingTop: 10 }} />
                    <Area type="monotone" dataKey="positive" name="Positive Feedback" stroke="#10b981" fillOpacity={1} fill="url(#colorPos)" />
                    <Area type="monotone" dataKey="negative" name="Negative Feedback" stroke="#ef4444" fillOpacity={1} fill="url(#colorNeg)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
