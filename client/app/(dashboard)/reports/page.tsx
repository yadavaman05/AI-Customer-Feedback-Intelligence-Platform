"use client";

import { useState } from "react";
import PageHeader from "@/components/ui/page-header";
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, Calendar, Plus } from "lucide-react";

interface ReportItem {
    id: string;
    name: string;
    timeframe: string;
    category: string;
    status: 'ready' | 'generating';
    createdAt: string;
    size: string;
}

export default function ReportsPage() {
    const [reports, setReports] = useState<ReportItem[]>([
        {
            id: "rep-1",
            name: "Q3_Customer_Feedback_Executive_Summary.pdf",
            timeframe: "Last 30 Days",
            category: "All Categories",
            status: "ready",
            createdAt: "2026-08-01 10:24",
            size: "2.4 MB"
        },
        {
            id: "rep-2",
            name: "Billing_Issues_HighSeverity_Analysis.pdf",
            timeframe: "Last 7 Days",
            category: "Bugs & Billing",
            status: "ready",
            createdAt: "2026-07-28 15:40",
            size: "1.1 MB"
        }
    ]);
    const [timeframe, setTimeframe] = useState("last_30_days");
    const [category, setCategory] = useState("all");
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = (e: React.FormEvent) => {
        e.preventDefault();
        setIsGenerating(true);

        setTimeout(() => {
            const newReport: ReportItem = {
                id: `rep-${Date.now()}`,
                name: `${category.toUpperCase()}_Feedback_Summary_${timeframe.replace(/_/g, '').toUpperCase()}.pdf`,
                timeframe: timeframe.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                category: category === "all" ? "All Categories" : category.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                status: "ready",
                createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
                size: "1.5 MB"
            };
            setReports(prev => [newReport, ...prev]);
            setIsGenerating(false);
        }, 1500);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Reports Workspace"
                description="Generate, schedule and download compiled PDF reports of customer feedback metrics."
            />

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Form panel */}
                <Card className="p-6 border-slate-805 h-fit">
                    <CardHeader className="px-0 pt-0 pb-4">
                        <CardTitle>Configure Report</CardTitle>
                        <CardDescription>Select range parameters for feedback summarizer compiler.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleGenerate}>
                        <CardContent className="px-0 pb-0 space-y-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-slate-350 uppercase tracking-wider font-mono">Timeframe</label>
                                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 w-full">
                                    <Calendar className="h-4 w-4 text-slate-500" />
                                    <select
                                        value={timeframe}
                                        onChange={(e) => setTimeframe(e.target.value)}
                                        disabled={isGenerating}
                                        className="bg-transparent outline-none border-none text-xs text-slate-200 cursor-pointer w-full disabled:opacity-50"
                                    >
                                        <option value="last_7_days" className="bg-slate-950">Last 7 Days</option>
                                        <option value="last_30_days" className="bg-slate-950">Last 30 Days</option>
                                        <option value="last_90_days" className="bg-slate-950">Last 90 Days</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-slate-355 uppercase tracking-wider font-mono">Feedback Segment</label>
                                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 w-full">
                                    <FileText className="h-4 w-4 text-slate-500" />
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        disabled={isGenerating}
                                        className="bg-transparent outline-none border-none text-xs text-slate-200 cursor-pointer w-full disabled:opacity-50"
                                    >
                                        <option value="all" className="bg-slate-950">All Categories</option>
                                        <option value="bug" className="bg-slate-950">Bugs</option>
                                        <option value="feature_request" className="bg-slate-950">Feature Requests</option>
                                        <option value="ui_ux" className="bg-slate-950">UI/UX Layouts</option>
                                    </select>
                                </div>
                            </div>

                            <Button type="submit" isLoading={isGenerating} className="w-full mt-2 text-slate-950 font-bold flex items-center justify-center gap-1.5">
                                <Plus className="h-4 w-4" />
                                Compile PDF Report
                            </Button>
                        </CardContent>
                    </form>
                </Card>

                {/* Existing reports list */}
                <Card className="lg:col-span-2 p-6 border-slate-800">
                    <CardHeader className="px-0 pt-0 pb-4">
                        <CardTitle>Generated Archive</CardTitle>
                        <CardDescription>List of compile jobs executed for this workspace.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0 pb-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Document Name</TableHead>
                                    <TableHead>Filters</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Compiling Date</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reports.map((report) => (
                                    <TableRow key={report.id}>
                                        <TableCell className="font-semibold">
                                            <div className="flex items-center gap-2.5">
                                                <div className="h-8 w-8 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shrink-0">
                                                    <FileText className="h-4 w-4" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <div className="text-xs text-white truncate max-w-xs">{report.name}</div>
                                                    <div className="text-4xs text-slate-500 mt-0.5">{report.size}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs">
                                            <div>{report.timeframe}</div>
                                            <div className="text-4xs text-slate-500 mt-0.5">{report.category}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={report.status === "ready" ? "success" : "warning"}>
                                                {report.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs text-slate-350">
                                            {report.createdAt}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="icon" className="h-8 w-8 border-slate-900 bg-slate-950 hover:bg-slate-900">
                                                <Download className="h-3.5 w-3.5 text-slate-400 hover:text-white" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
