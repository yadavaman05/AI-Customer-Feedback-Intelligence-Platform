import * as React from "react";
import { cn } from "@/lib/utils";

export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
    ({ className, ...props }, ref) => (
        <div className="w-full overflow-auto rounded-lg border border-slate-800 bg-slate-950/20">
            <table ref={ref} className={cn("w-full caption-bottom text-xs md:text-sm", className)} {...props} />
        </div>
    )
);
Table.displayName = "Table";

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    ({ className, ...props }, ref) => (
        <thead ref={ref} className={cn("bg-slate-950/60 border-b border-slate-800", className)} {...props} />
    )
);
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    ({ className, ...props }, ref) => (
        <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
    )
);
TableBody.displayName = "TableBody";

export const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    ({ className, ...props }, ref) => (
        <tfoot ref={ref} className={cn("bg-slate-950/30 border-t border-slate-800 font-medium [&>tr]:last:border-b-0", className)} {...props} />
    )
);
TableFooter.displayName = "TableFooter";

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
    ({ className, ...props }, ref) => (
        <tr
            ref={ref}
            className={cn(
                "border-b border-slate-850 transition-colors hover:bg-slate-950/40 data-[state=selected]:bg-slate-900/40",
                className
            )}
            {...props}
        />
    )
);
TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
    ({ className, ...props }, ref) => (
        <th
            ref={ref}
            className={cn(
                "h-10 px-4 text-left align-middle font-semibold text-slate-400 [&:has([role=checkbox])]:pr-0",
                className
            )}
            {...props}
        />
    )
);
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
    ({ className, ...props }, ref) => (
        <td ref={ref} className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0 text-slate-350", className)} {...props} />
    )
);
TableCell.displayName = "TableCell";
