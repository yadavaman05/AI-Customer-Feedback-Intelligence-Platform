"use client";

import { useState } from "react";
import PageHeader from "@/components/ui/page-header";
import Card, { CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Badge from "@/components/ui/badge";
import { KeyRound, Cpu, Save } from "lucide-react";

export default function SettingsPage() {
    const [workspaceName, setWorkspaceName] = useState("LOOP AI Sandbox");
    const [confidenceThreshold, setConfidenceThreshold] = useState(85);
    const [visibleKey, setVisibleKey] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
        }, 800);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Workspace Settings"
                description="Configure feedback aggregations, threshold classifications, and developer API credentials."
            />

            <div className="grid md:grid-cols-2 gap-6">
                {/* Workspace details form */}
                <Card className="p-6 border-slate-800">
                    <CardHeader className="px-0 pt-0 pb-4">
                        <CardTitle>Workspace details</CardTitle>
                        <CardDescription>Setup metadata tags and namespace settings for this workspace.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSave}>
                        <CardContent className="px-0 pb-0 space-y-4">
                            <Input
                                label="Workspace Namespace"
                                value={workspaceName}
                                onChange={(e) => setWorkspaceName(e.target.value)}
                                placeholder="LOOP Sandbox"
                                disabled={isSaving}
                            />
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-slate-350 uppercase tracking-wider font-mono">Workspace Role</label>
                                <div className="w-full bg-slate-909 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-400">
                                    Workspace Administrator (Owner)
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="px-0 pt-4 flex justify-end">
                            <Button type="submit" isLoading={isSaving} className="text-slate-950 font-bold flex items-center gap-1.5">
                                <Save className="h-4 w-4" />
                                Save Configurations
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                {/* AI Parameters block */}
                <Card className="p-6 border-slate-800 flex flex-col justify-between">
                    <div>
                        <CardHeader className="px-0 pt-0 pb-4">
                            <CardTitle>AI Inference Parameters</CardTitle>
                            <CardDescription>Configure routing thresholds and default LLM intelligence engines.</CardDescription>
                        </CardHeader>
                        <CardContent className="px-0 pb-0 space-y-5">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs font-semibold text-slate-350 uppercase tracking-wider font-mono">
                                    <span>Confidence Threshold</span>
                                    <span className="text-emerald-400 text-sm font-bold font-mono">{confidenceThreshold}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="50"
                                    max="99"
                                    value={confidenceThreshold}
                                    onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                                    className="w-full accent-emerald-500 h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer"
                                />
                                <p className="text-4xs text-slate-500 leading-normal">
                                    Feedback items with NLP category predictions scoring below this threshold are routed to &apos;Unsorted&apos; queue.
                                </p>
                            </div>

                            <div className="space-y-2 pt-2 border-t border-slate-900">
                                <label className="block text-xs font-semibold text-slate-350 uppercase tracking-wider font-mono">Classification Engine</label>
                                <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2">
                                    <Cpu className="h-4 w-4 text-emerald-400 shrink-0" />
                                    <div className="flex-1 text-xs">
                                        <div className="text-white font-medium">LOOP-Sentiment-v2.1</div>
                                        <div className="text-4xs text-slate-500 mt-0.5">Custom Claude 3.5 Sonnet Finetuned model</div>
                                    </div>
                                    <Badge variant="outline" className="text-3xs py-0.5 px-2">default</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </div>
                </Card>

                {/* API credentials block */}
                <Card className="md:col-span-2 p-6 border-slate-800">
                    <CardHeader className="px-0 pt-0 pb-4">
                        <CardTitle>Developer Access Integrations</CardTitle>
                        <CardDescription>Use these keys to ingest customer feedback logs via REST hooks.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0 pb-0 space-y-4">
                        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <KeyRound className="h-4 w-4 text-emerald-450" />
                                    <span className="text-xs font-bold text-white font-sans">Sandbox API Ingestion Token</span>
                                </div>
                                <Badge variant="success">active</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type={visibleKey ? "text" : "password"}
                                    value="lp_live_58c21a4f91c981bde8d120a1eb1d85021a8c9fb6"
                                    readOnly
                                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-400 font-mono focus:outline-none"
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setVisibleKey(!visibleKey)}
                                    className="px-3 text-xs"
                                >
                                    {visibleKey ? "Hide" : "Reveal"}
                                </Button>
                            </div>
                            <p className="text-4xs text-slate-500 font-mono">
                                Authorization header format: <code className="text-slate-350 bg-slate-950 py-0.5 px-1.5 rounded">Authorization: Bearer lp_live_...</code>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
