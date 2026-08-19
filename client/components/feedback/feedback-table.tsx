import * as React from "react";
import { FeedbackItem } from "@/types/feedback";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import Badge from "@/components/ui/badge";
import SourceBadge from "./source-badge";
import RatingStars from "./rating-stars";
import { formatDate, formatCapitalize } from "@/utils/format";

interface FeedbackTableProps {
    items: FeedbackItem[];
    onSelectItem: (item: FeedbackItem) => void;
}

export const FeedbackTable = ({ items, onSelectItem }: FeedbackTableProps) => {
    return (
        <div className="overflow-x-auto min-w-full">
            <Table className="w-full text-left border-collapse">
                <TableHeader className="bg-slate-950/20 border-b border-slate-900">
                    <TableRow>
                        <TableHead className="py-3.5 px-4 font-mono text-3xs text-slate-500 uppercase tracking-wider">Customer</TableHead>
                        <TableHead className="py-3.5 px-4 font-mono text-3xs text-slate-500 uppercase tracking-wider">Source</TableHead>
                        <TableHead className="py-3.5 px-4 font-mono text-3xs text-slate-500 uppercase tracking-wider">Rating</TableHead>
                        <TableHead className="py-3.5 px-4 font-mono text-3xs text-slate-500 uppercase tracking-wider">Feedback Snippet</TableHead>
                        <TableHead className="py-3.5 px-4 font-mono text-3xs text-slate-500 uppercase tracking-wider">Category</TableHead>
                        <TableHead className="py-3.5 px-4 font-mono text-3xs text-slate-500 uppercase tracking-wider">Sentiment</TableHead>
                        <TableHead className="py-3.5 px-4 font-mono text-3xs text-slate-500 uppercase tracking-wider">Status</TableHead>
                        <TableHead className="py-3.5 px-4 font-mono text-3xs text-slate-500 uppercase tracking-wider text-right">Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="h-32 text-center text-slate-500 text-xs py-8">
                                No feedback items match the selected criteria.
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((item) => {
                            // Determine sentiment styling
                            let sentimentVariant: 'success' | 'warning' | 'error' | 'default' = 'default';
                            if (item.sentiment === 'positive') sentimentVariant = 'success';
                            else if (item.sentiment === 'negative') sentimentVariant = 'error';

                            // Determine status styling
                            let statusVariant: 'success' | 'warning' | 'error' | 'default' = 'default';
                            if (item.status === 'resolved') statusVariant = 'success';
                            else if (item.status === 'in_progress') statusVariant = 'warning';

                            return (
                                <TableRow
                                    key={item.id}
                                    onClick={() => onSelectItem(item)}
                                    className="cursor-pointer border-b border-slate-900/60 hover:bg-slate-900/30 transition-all"
                                >
                                    <TableCell className="py-3.5 px-4 font-medium">
                                        <div className="text-xs text-white leading-5">{item.customerName}</div>
                                        <div className="text-[10px] text-slate-550 leading-3">{item.customerEmail}</div>
                                    </TableCell>
                                    <TableCell className="py-3.5 px-4">
                                        <SourceBadge source={item.source} />
                                    </TableCell>
                                    <TableCell className="py-3.5 px-4">
                                        {item.rating !== undefined ? (
                                            <RatingStars rating={item.rating} size={11} />
                                        ) : (
                                            <span className="text-[10px] text-slate-550 italic">None</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="py-3.5 px-4 max-w-xs md:max-w-md truncate text-xs text-slate-350">
                                        {item.content}
                                    </TableCell>
                                    <TableCell className="py-3.5 px-4">
                                        <Badge variant="outline" className="text-[10px] px-2 py-0.5 max-w-[90px] truncate">
                                            {formatCapitalize(item.category)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-3.5 px-4">
                                        <Badge variant={sentimentVariant} className="text-[10px] px-2 py-0.5">
                                            {formatCapitalize(item.sentiment)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-3.5 px-4">
                                        <Badge variant={statusVariant} className="text-[9px] px-2 py-0 text-slate-200">
                                            {formatCapitalize(item.status.replace("_", " "))}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-3.5 px-4 text-right text-[10px] text-slate-450 font-mono">
                                        {formatDate(item.createdAt)}
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default FeedbackTable;
