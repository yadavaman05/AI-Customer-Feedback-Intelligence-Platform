import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'table-row';
}

export const Skeleton = ({
    className,
    variant = "rectangular",
    ...props
}: SkeletonProps) => {
    return (
        <div
            className={cn(
                "animate-pulse bg-slate-800/60 rounded",
                {
                    "h-4 w-full": variant === "text",
                    "rounded-full": variant === "circular",
                    "rounded-lg": variant === "rectangular" || variant === "card",
                    "h-12 w-full": variant === "table-row",
                },
                className
            )}
            {...props}
        />
    );
};

export default Skeleton;
