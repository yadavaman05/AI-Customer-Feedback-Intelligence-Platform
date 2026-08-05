import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "./button";

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    description?: string;
    actionText?: string;
    onRetry?: () => void;
}

export const ErrorState = ({
    className,
    title = "Something went wrong",
    description = "We encountered a network error while retrieving your customer feedback stream. Please try again.",
    actionText = "Try Again",
    onRetry,
    ...props
}: ErrorStateProps) => {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center rounded-xl border border-red-500/10 p-8 text-center bg-red-950/5 backdrop-blur-sm",
                className
            )}
            {...props}
        >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 mb-4 shadow-inner">
                <AlertTriangle className="h-6 w-6 animate-pulse" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
            <p className="text-sm text-slate-450 max-w-sm mb-6">{description}</p>
            {actionText && onRetry && (
                <Button variant="destructive" size="sm" onClick={onRetry} className="text-xs">
                    {actionText}
                </Button>
            )}
        </div>
    );
};

export default ErrorState;
