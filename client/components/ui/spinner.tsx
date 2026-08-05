import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Spinner = ({ className, size = 'md', ...props }: SpinnerProps) => {
    return (
        <div className={cn("flex items-center justify-center", className)} {...props}>
            <Loader2
                className={cn("text-primary animate-spin", {
                    "h-4 w-4": size === 'sm',
                    "h-8 w-8": size === 'md',
                    "h-12 w-12": size === 'lg',
                    "h-16 w-16": size === 'xl',
                })}
            />
        </div>
    );
};
export default Spinner;
