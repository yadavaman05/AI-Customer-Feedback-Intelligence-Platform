import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    "inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
                    {
                        "bg-primary text-primary-foreground hover:bg-primary/95 shadow-lg shadow-primary/10": variant === 'primary',
                        "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === 'secondary',
                        "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground": variant === 'outline',
                        "hover:bg-accent hover:text-accent-foreground bg-transparent": variant === 'ghost',
                        "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/10": variant === 'destructive',
                        "text-primary underline-offset-4 hover:underline bg-transparent p-0 h-auto active:scale-100": variant === 'link',
                    },
                    {
                        "h-9 px-3 text-xs": size === 'sm',
                        "h-10 px-4 py-2 text-sm": size === 'md',
                        "h-11 px-6 text-base": size === 'lg',
                        "h-10 w-10 p-0": size === 'icon',
                    },
                    className
                )}
                {...props}
            >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";
export default Button;
