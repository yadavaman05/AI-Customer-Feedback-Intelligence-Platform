import * as React from "react";
import Badge from "@/components/ui/badge";
import { formatCapitalize } from "@/utils/format";
import { Smile, Frown, Meh } from "lucide-react";
import { cn } from "@/lib/utils";

interface SentimentBadgeProps {
    sentiment: 'positive' | 'neutral' | 'negative';
    className?: string;
}

export const SentimentBadge = ({ sentiment, className }: SentimentBadgeProps) => {
    let variant: 'success' | 'warning' | 'error' | 'default' = 'default';
    let icon = <Meh className="h-3 w-3 mr-1" />;

    if (sentiment === 'positive') {
        variant = 'success';
        icon = <Smile className="h-3 w-3 mr-1" />;
    } else if (sentiment === 'negative') {
        variant = 'error';
        icon = <Frown className="h-3 w-3 mr-1" />;
    }

    return (
        <Badge
            variant={variant}
            className={cn("inline-flex items-center text-xs font-semibold px-2.5 py-0.5", className)}
        >
            {icon}
            {formatCapitalize(sentiment)}
        </Badge>
    );
};

export default SentimentBadge;
