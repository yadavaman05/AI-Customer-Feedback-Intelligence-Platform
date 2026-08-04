import * as React from "react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "./button";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    description: string;
    actionText?: string;
    onAction?: () => void;
    icon?: React.ReactNode;
}

export const EmptyState = ({
    className,
    title,
    description,
    actionText,
    onAction,
    icon,
    ...props
}: EmptyStateProps) => {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 p-8 text-center bg-slate-950/20 backdrop-blur-sm",
                className
            )}
            {...props}
        >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-400 mb-4 shadow-inner">
                {icon || <Inbox className="h-6 w-6" />}
            </div>
            <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
            <p className="text-sm text-slate-400 max-w-sm mb-6">{description}</p>
            {actionText && onAction && (
                <Button variant="outline" size="sm" onClick={onAction}>
                    {actionText}
                </Button>
            )}
        </div>
    );
};
export default EmptyState;
