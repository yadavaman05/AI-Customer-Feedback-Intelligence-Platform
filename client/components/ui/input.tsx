import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type = "text", label, error, icon, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            {icon}
                        </div>
                    )}
                    <input
                        type={type}
                        ref={ref}
                        className={cn(
                            "w-full bg-slate-900/60 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:pointer-events-none transition-all",
                            icon ? "pl-10" : "pl-3.5",
                            error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "",
                            "h-10",
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";
export default Input;
