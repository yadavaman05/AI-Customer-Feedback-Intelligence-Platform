"use client";

import React from "react";
import Button from "@/components/ui/button";
import PageHeader from "@/components/ui/page-header";
import { Download, FileDown, Share2, FileSpreadsheet } from "lucide-react";

interface DashboardHeaderProps {
    title: string;
    description: string;
}

export default function DashboardHeader({ title, description }: DashboardHeaderProps) {
    return (
        <div className="flex flex-col gap-4 border-b border-slate-900 pb-5 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
                <PageHeader title={title} description={description} />
            </div>

            {/* Export Section (UI Only) */}
            <div className="flex flex-wrap items-center gap-2 md:self-end">
                <Button
                    variant="outline"
                    size="sm"
                    className="h-9 text-xs border-slate-800 bg-slate-950/60 hover:bg-slate-900 text-slate-300 hover:text-white"
                >
                    <FileSpreadshetDummy className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />
                    Export CSV
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-9 text-xs border-slate-800 bg-slate-950/60 hover:bg-slate-900 text-slate-300 hover:text-white"
                >
                    <FileTextDummy className="mr-1.5 h-3.5 w-3.5 text-red-400" />
                    Export PDF
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-9 text-xs border-slate-800 bg-slate-950/60 hover:bg-slate-900 text-slate-300 hover:text-white"
                >
                    <Share2 className="mr-1.5 h-3.5 w-3.5 text-blue-400" />
                    Share Report
                </Button>
                <Button
                    variant="primary"
                    size="sm"
                    className="h-9 text-xs bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold shadow-lg shadow-emerald-500/10"
                >
                    <Download className="mr-1.5 h-3.5 w-3.5" />
                    Download Analytics
                </Button>
            </div>
        </div>
    );
}

// Inline dummy icons if their names in Lucide are different or to avoid build problems
function FileSpreadshetDummy({ className }: { className?: string }) {
    return <FileSpreadsheet className={className} />;
}

function FileTextDummy({ className }: { className?: string }) {
    return <FileDown className={className} />;
}
