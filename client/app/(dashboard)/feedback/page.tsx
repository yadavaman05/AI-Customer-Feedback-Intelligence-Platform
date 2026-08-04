"use client";

import { useState } from "react";
import PageHeader from "@/components/ui/page-header";
import Card from "@/components/ui/card";

import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockFeedbackList } from "@/lib/mock-data";
import { formatDate, formatCapitalize } from "@/utils/format";
import { Search, Filter } from "lucide-react";
import { FeedbackItem } from "@/types/feedback";

export default function FeedbackInboxPage() {
    const [items, setItems] = useState<FeedbackItem[]>(mockFeedbackList);
    const [selectedItem, setSelectedItem] = useState<FeedbackItem | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [sentimentFilter, setSentimentFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");

    const filteredItems = items.filter((item) => {
        const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
        const matchesSentiment = sentimentFilter === "all" || item.sentiment === sentimentFilter;
        const matchesSearch =
            item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.content.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSentiment && matchesSearch;
    });

    const handleStatusChange = (id: string, newStatus: 'new' | 'in_progress' | 'resolved') => {
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, status: newStatus } : item
            )
        );
        if (selectedItem && selectedItem.id === id) {
            setSelectedItem(prev => prev ? { ...prev, status: newStatus } : null);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Feedback Inbox"
                description="Browse, filter, and inspect customer feedback ingested from standard support streams."
            />

            {/* Filter Toolbar */}
            <Card className="p-4 border-slate-800">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Search bar */}
                    <div className="flex-1 flex items-center border border-slate-900 bg-slate-950/40 rounded-lg px-3 py-2 max-w-md">
                        <Search className="h-3.5 w-3.5 text-slate-500 mr-2" />
                        <input
                            type="text"
                            placeholder="Search by customer name, email, or content..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none outline-none text-xs text-slate-205 placeholder-slate-500 w-full"
                        />
                    </div>

                    {/* Core filters */}
                    <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm">
                        <div className="flex items-center gap-1.5 bg-slate-950/40 px-3 py-2 border border-slate-900 rounded-lg">
                            <Filter className="h-3.5 w-3.5 text-slate-500" />
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="bg-transparent outline-none border-none text-xs text-slate-350 cursor-pointer"
                            >
                                <option value="all" className="bg-slate-950 text-slate-300">All Categories</option>
                                <option value="bug" className="bg-slate-950 text-slate-300">Bugs</option>
                                <option value="feature_request" className="bg-slate-950 text-slate-300">Feature Requests</option>
                                <option value="ui_ux" className="bg-slate-950 text-slate-300">UI/UX</option>
                                <option value="performance" className="bg-slate-950 text-slate-300">Performance</option>
                                <option value="pricing" className="bg-slate-950 text-slate-300">Pricing</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-1.5 bg-slate-950/40 px-3 py-2 border border-slate-900 rounded-lg">
                            <Filter className="h-3.5 w-3.5 text-slate-500" />
                            <select
                                value={sentimentFilter}
                                onChange={(e) => setSentimentFilter(e.target.value)}
                                className="bg-transparent outline-none border-none text-xs text-slate-350 cursor-pointer"
                            >
                                <option value="all" className="bg-slate-950 text-slate-300">All Sentiments</option>
                                <option value="positive" className="bg-slate-950 text-slate-300">Positive</option>
                                <option value="neutral" className="bg-slate-950 text-slate-300">Neutral</option>
                                <option value="negative" className="bg-slate-950 text-slate-300">Negative</option>
                            </select>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Main Table Card */}
            <Card className="p-0 border-slate-800">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Feedback Snippet</TableHead>
                            <TableHead>AI Category</TableHead>
                            <TableHead>Sentiment</TableHead>
                            <TableHead>Execution Status</TableHead>
                            <TableHead className="text-right">Ingested</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredItems.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-36 text-center text-slate-500 font-medium">
                                    No feedback items match the selected criteria.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredItems.map((item) => (
                                <TableRow
                                    key={item.id}
                                    onClick={() => setSelectedItem(item)}
                                    className="cursor-pointer hover:bg-slate-900/30"
                                >
                                    <TableCell className="font-semibold">
                                        <div className="text-xs text-white">{item.customerName}</div>
                                        <div className="text-4xs text-slate-500 mt-0.5">{item.customerEmail}</div>
                                    </TableCell>
                                    <TableCell className="max-w-xs md:max-w-md truncate text-xs text-slate-300">
                                        {item.content}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{formatCapitalize(item.category)}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            item.sentiment === "positive" ? "success" :
                                                item.sentiment === "negative" ? "error" : "default"
                                        }>
                                            {formatCapitalize(item.sentiment)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            item.status === "resolved" ? "success" :
                                                item.status === "in_progress" ? "warning" : "default"
                                        }>
                                            {formatCapitalize(item.status)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right text-4xs md:text-xs text-slate-500">
                                        {formatDate(item.createdAt)}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Feedback details popup overlay */}
            {selectedItem && (
                <Modal
                    isOpen={!!selectedItem}
                    onClose={() => setSelectedItem(null)}
                    title={`Ticket details - #${selectedItem.id}`}
                    description={`Customer inputs from ${selectedItem.source}`}
                    footer={
                        <div className="flex items-center justify-between w-full">
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={selectedItem.status === "in_progress"}
                                    onClick={() => handleStatusChange(selectedItem.id, "in_progress")}
                                >
                                    Mark In-Progress
                                </Button>
                                <Button
                                    size="sm"
                                    variant="primary"
                                    className="text-slate-950 font-bold"
                                    disabled={selectedItem.status === "resolved"}
                                    onClick={() => handleStatusChange(selectedItem.id, "resolved")}
                                >
                                    Mark Resolved
                                </Button>
                            </div>
                            <Button size="sm" variant="ghost" className="text-slate-400" onClick={() => setSelectedItem(null)}>
                                Close Panel
                            </Button>
                        </div>
                    }
                >
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-900 pb-3">
                            <div>
                                <span className="text-4xs text-slate-505 uppercase tracking-widest font-mono">Customer</span>
                                <h4 className="text-xs md:text-sm font-semibold text-white mt-0.5">{selectedItem.customerName}</h4>
                                <p className="text-4xs md:text-xs text-slate-405">{selectedItem.customerEmail}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant={
                                    selectedItem.sentiment === "positive" ? "success" :
                                        selectedItem.sentiment === "negative" ? "error" : "default"
                                }>
                                    {formatCapitalize(selectedItem.sentiment)}
                                </Badge>
                                <Badge variant="outline">{formatCapitalize(selectedItem.category)}</Badge>
                            </div>
                        </div>

                        <div>
                            <span className="text-4xs text-slate-505 uppercase tracking-widest font-mono">Aggregated Feedback Content</span>
                            <p className="mt-2 text-xs md:text-sm text-slate-350 leading-relaxed bg-slate-900/40 p-4 border border-slate-900 rounded-lg">
                                &quot;{selectedItem.content}&quot;
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-t border-slate-900 pt-3 text-2xs md:text-xs">
                            <div>
                                <span className="text-slate-500 uppercase tracking-widest font-mono text-4xs">LLM Confidence Classification</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex-1 bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                                        <div
                                            className="bg-emerald-500 h-full rounded-full transition-all"
                                            style={{ width: `${selectedItem.confidenceScore * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-white font-bold font-mono">{(selectedItem.confidenceScore * 100).toFixed(0)}%</span>
                                </div>
                            </div>
                            <div>
                                <span className="text-slate-500 uppercase tracking-widest font-mono text-4xs">Customer Rating</span>
                                <div className="text-white font-semibold mt-1">
                                    {selectedItem.rating ? `${selectedItem.rating} / 5 Stars` : "Not provided"}
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
