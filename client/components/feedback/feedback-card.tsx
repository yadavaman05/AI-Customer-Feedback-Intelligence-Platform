import * as React from "react";
import { FeedbackItem } from "@/types/feedback";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import SourceBadge from "./source-badge";
import RatingStars from "./rating-stars";
import { formatDate, formatCapitalize } from "@/utils/format";
import { ArrowUpRight } from "lucide-react";

interface FeedbackCardProps {
    item: FeedbackItem;
    onClick: () => void;
}

export const FeedbackCard = ({ item, onClick }: FeedbackCardProps) => {
    // Determine sentiment styling
    let sentimentVariant: 'success' | 'warning' | 'error' | 'default' = 'default';
    if (item.sentiment === 'positive') sentimentVariant = 'success';
    else if (item.sentiment === 'negative') sentimentVariant = 'error';

    // Determine status styling
    let statusVariant: 'success' | 'warning' | 'error' | 'default' = 'default';
    if (item.status === 'resolved') statusVariant = 'success';
    else if (item.status === 'in_progress') statusVariant = 'warning';

    return (
        <Card
            onClick={onClick}
            className="group relative flex flex-col justify-between p-5 border border-slate-900 bg-slate-950/40 hover:bg-slate-900/30 hover:border-slate-800 transition-all duration-300 cursor-pointer overflow-hidden rounded-xl"
        >
            {/* Hover visual accents */}
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/0 group-hover:bg-emerald-500/50 transition-all duration-300" />

            <div className="space-y-3.5">
                {/* Header: Customer Name and Details Link */}
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <h4 className="text-xs font-semibold text-slate-100 group-hover:text-white transition-colors line-clamp-1">
                            {item.customerName}
                        </h4>
                        <span className="text-[10px] text-slate-500 font-mono line-clamp-1">
                            {item.customerEmail}
                        </span>
                    </div>
                    <div className="p-1 rounded bg-slate-900 border border-slate-800/80 text-slate-500 group-hover:text-emerald-400 group-hover:border-emerald-500/20 transition-all">
                        <ArrowUpRight className="h-3 w-3" />
                    </div>
                </div>

                {/* Rating & Source badge */}
                <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                    {item.rating !== undefined ? (
                        <RatingStars rating={item.rating} size={12} />
                    ) : (
                        <span className="text-[10px] text-slate-550 italic">No rating</span>
                    )}
                    <SourceBadge source={item.source} />
                </div>

                {/* Body Content Snippet */}
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 min-h-[54px] pt-1">
                    &quot;{item.content}&quot;
                </p>
            </div>

            {/* Footer Metadata */}
            <div className="flex items-center justify-between gap-2 pt-4 mt-4 border-t border-slate-900/60 text-[10px] text-slate-500">
                <div className="flex items-center gap-1.5">
                    <Badge variant={sentimentVariant} className="text-[10px] px-2 py-0.5">
                        {formatCapitalize(item.sentiment)}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] px-2 py-0.5 max-w-[80px] truncate">
                        {formatCapitalize(item.category)}
                    </Badge>
                </div>
                <div className="flex flex-col items-end gap-1 font-mono text-[9px] text-slate-550">
                    <Badge variant={statusVariant} className="text-[8px] px-1.5 py-0 uppercase">
                        {formatCapitalize(item.status.replace("_", " "))}
                    </Badge>
                    <span>{formatDate(item.createdAt)}</span>
                </div>
            </div>
        </Card>
    );
};

export default FeedbackCard;
