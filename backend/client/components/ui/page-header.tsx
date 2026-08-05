import * as React from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    description?: string;
    actions?: React.ReactNode;
}

export const PageHeader = ({
    className,
    title,
    description,
    actions,
    ...props
}: PageHeaderProps) => {
    return (
        <div
            className={cn(
                "flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-900 mb-6 gap-4",
                className
            )}
            {...props}
        >
            <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white glow-text-emerald">
                    {title}
                </h1>
                {description && (
                    <p className="text-xs md:text-sm text-slate-400 mt-1">
                        {description}
                    </p>
                )}
            </div>
            {actions && (
                <div className="flex items-center gap-3">
                    {actions}
                </div>
            )}
        </div>
    );
};
export default PageHeader;
