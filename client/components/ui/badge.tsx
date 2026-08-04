import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant = 'default', ...props }, ref) => {
        return (
            <span
                ref={ref}
                className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-2xs md:text-xs font-semibold select-none transition-colors border",
                    {
                        "bg-slate-800 text-slate-200 border-slate-700": variant === 'default',
                        "bg-emerald-500/10 text-emerald-400 border-emerald-500/20": variant === 'success',
                        "bg-amber-500/10 text-amber-400 border-amber-500/20": variant === 'warning',
                        "bg-red-500/10 text-red-100 border-red-500/20": variant === 'error',
                        "bg-blue-500/10 text-blue-400 border-blue-500/20": variant === 'info',
                        "bg-transparent border-slate-700 text-slate-400": variant === 'outline',
                    },
                    className
                )}
                {...props}
            />
        );
    }
);
Badge.displayName = "Badge";
export default Badge;
