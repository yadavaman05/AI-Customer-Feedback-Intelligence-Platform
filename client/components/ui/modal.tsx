import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "./button";

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal = ({
    isOpen,
    onClose,
    title,
    description,
    children,
    footer,
    size = 'md'
}: ModalProps) => {
    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEscape);
        }
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Content Container */}
            <div
                className={cn(
                    "relative z-50 w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-2xl transition-all",
                    {
                        "max-w-md": size === 'sm',
                        "max-w-lg": size === 'md',
                        "max-w-2xl": size === 'lg',
                        "max-w-4xl": size === 'xl',
                    }
                )}
            >
                {/* Header */}
                <div className="flex items-start justify-between pb-4 border-b border-slate-900">
                    <div>
                        <h3 className="text-base md:text-lg font-semibold text-white leading-none">
                            {title}
                        </h3>
                        {description && (
                            <p className="mt-1.5 text-xs md:text-sm text-slate-400">
                                {description}
                            </p>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-8 w-8 text-slate-400 hover:text-white"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Body */}
                <div className="py-4 max-h-[70vh] overflow-y-auto text-slate-300 text-sm">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-900">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};
export default Modal;
