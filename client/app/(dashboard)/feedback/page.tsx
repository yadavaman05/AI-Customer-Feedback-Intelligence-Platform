"use client";

import { useState } from "react";
import PageHeader from "@/components/ui/page-header";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockFeedbackList } from "@/lib/mockData";
import { formatDate, formatCapitalize } from "@/utils/format";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { FeedbackItem } from "@/types/feedback";

export default function FeedbackInboxPage() {
    const [items, setItems] = useState<FeedbackItem[]>(mockFeedbackList);
    const [selectedItem, setSelectedItem] = useState<FeedbackItem | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [sentimentFilter, setSentimentFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [realSearchQuery, setRealSearchQuery] = useState<string>("");

    // Pagination states
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);

    const filteredItems = items.filter((item) => {
        const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
        const matchesSentiment = sentimentFilter === "all" || item.sentiment === sentimentFilter;
        const matchesStatus = statusFilter === "all" || item.status === statusFilter;
        const matchesSearch =
            item.customerName.toLowerCase().includes(realSearchQuery.toLowerCase()) ||
            item.customerEmail.toLowerCase().includes(realSearchQuery.toLowerCase()) ||
            item.content.toLowerCase().includes(realSearchQuery.toLowerCase());

        return matchesCategory && matchesSentiment && matchesStatus && matchesSearch;
    });

    // Reset pagination to first page when filters change
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategoryFilter(e.target.value);
        setCurrentPage(1);
    };

    const handleSentimentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSentimentFilter(e.target.value);
        setCurrentPage(1);
    };

    const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRealSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const totalItems = filteredItems.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const paginatedItems = filteredItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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
            <Card className="p-4 border-slate-905 bg-slate-955/30">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                    {/* Search bar */}
                    <div className="flex-1 flex items-center border border-slate-900 bg-slate-950/40 rounded-lg px-3 py-2 max-w-md">
                        <Search className="h-3.5 w-3.5 text-slate-500 mr-2" />
                        <input
                            type="text"
                            placeholder="Search by customer name, email, or content..."
                            value={realSearchQuery}
                            onChange={handleSearchChange}
                            className="bg-transparent border-none outline-none text-xs text-slate-205 placeholder-slate-500 w-full"
                        />
                    </div>

                    {/* Core filters */}
                    <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm">
                        <div className="flex items-center gap-1.5 bg-slate-950/40 px-3 py-2 border border-slate-900 rounded-lg">
                            <span className="text-slate-500 text-3xs font-mono">CATEGORY:</span>
                            <select
                                value={categoryFilter}
                                onChange={handleCategoryChange}
                                className="bg-transparent outline-none border-none text-xs text-slate-350 cursor-pointer font-sans"
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
                            <span className="text-slate-500 text-3xs font-mono">SENTIMENT:</span>
                            <select
                                value={sentimentFilter}
                                onChange={handleSentimentChange}
                                className="bg-transparent outline-none border-none text-xs text-slate-350 cursor-pointer font-sans"
                            >
                                <option value="all" className="bg-slate-950 text-slate-300">All Sentiments</option>
                                <option value="positive" className="bg-slate-950 text-slate-300">Positive</option>
                                <option value="neutral" className="bg-slate-950 text-slate-300">Neutral</option>
                                <option value="negative" className="bg-slate-950 text-slate-300">Negative</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-1.5 bg-slate-950/40 px-3 py-2 border border-slate-900 rounded-lg">
                            <span className="text-slate-500 text-3xs font-mono">STATUS:</span>
                            <select
                                value={statusFilter}
                                onChange={handleStatusFilterChange}
                                className="bg-transparent outline-none border-none text-xs text-slate-350 cursor-pointer font-sans"
                            >
                                <option value="all" className="bg-slate-950 text-slate-300">All Statuses</option>
                                <option value="new" className="bg-slate-950 text-slate-300">New</option>
                                <option value="in_progress" className="bg-slate-950 text-slate-300">In Progress</option>
                                <option value="resolved" className="bg-slate-950 text-slate-300">Resolved</option>
                            </select>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Main Table Card */}
            <Card className="p-0 border-slate-805 bg-slate-955/30 overflow-hidden">
                <div className="overflow-x-auto">
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
                            {paginatedItems.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-36 text-center text-slate-500 text-xs">
                                        No feedback items match the selected criteria.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedItems.map((item) => (
                                    <TableRow
                                        key={item.id}
                                        onClick={() => setSelectedItem(item)}
                                        className="cursor-pointer hover:bg-slate-900/30"
                                    >
                                        <TableCell className="font-semibold">
                                            <div className="text-xs text-white leading-5">{item.customerName}</div>
                                            <div className="text-4xs text-slate-550 leading-3">{item.customerEmail}</div>
                                        </TableCell>
                                        <TableCell className="max-w-xs md:max-w-md truncate text-xs text-slate-350">
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
                                        <TableCell className="text-right text-4xs md:text-xs text-slate-450">
                                            {formatDate(item.createdAt)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Controls */}
                <div className="px-6 py-4 border-t border-slate-905 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs bg-slate-955/20 text-slate-400">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <span>Show</span>
                            <select
                                value={itemsPerPage}
                                onChange={handlePageSizeChange}
                                className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-300 outline-none focus:border-emerald-500/50"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                            </select>
                            <span>rows per page</span>
                        </div>
                        <span className="hidden sm:inline text-slate-550">|</span>
                        <span>
                            Showing <span className="text-slate-200 font-semibold">{totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                            <span className="text-slate-200 font-semibold">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{" "}
                            <span className="text-slate-200 font-semibold">{totalItems}</span> matching items
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((c) => Math.max(c - 1, 1))}
                            className="h-8 py-0.5 px-2.5 flex items-center gap-1 text-xs"
                        >
                            <ChevronLeft className="h-3.5 w-3.5" /> Previous
                        </Button>
                        <span className="text-slate-400">
                            Page <span className="text-slate-200 font-semibold">{currentPage}</span> of{" "}
                            <span className="text-slate-200 font-semibold">{totalPages}</span>
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((c) => Math.min(c + 1, totalPages))}
                            className="h-8 py-0.5 px-2.5 flex items-center gap-1 text-xs"
                        >
                            Next <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Feedback details popup overlay */}
            {selectedItem && (
                <Modal
                    isOpen={!!selectedItem}
                    onClose={() => setSelectedItem(null)}
                    title={`Ticket Details - #${selectedItem.id}`}
                    description={`Customer inputs ingested from ${formatCapitalize(selectedItem.source)} channel`}
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
                                <span className="text-slate-505 uppercase tracking-widest font-mono text-4xs">LLM Confidence Classification</span>
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
                                <span className="text-slate-505 uppercase tracking-widest font-mono text-4xs">Customer Rating</span>
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

