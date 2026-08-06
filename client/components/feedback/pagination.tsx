import * as React from "react";
import Button from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    itemsPerPage: number;
    onItemsPerPageChange: (size: number) => void;
    totalItems: number;
}

export const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage,
    onItemsPerPageChange,
    totalItems,
}: PaginationProps) => {
    return (
        <div className="px-6 py-4 border-t border-slate-905 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs bg-slate-955/20 text-slate-400">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                    <span>Show</span>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                        className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-350 outline-none focus:border-emerald-500/50 cursor-pointer"
                    >
                        <option value={5} className="bg-slate-950 text-slate-300">5</option>
                        <option value={10} className="bg-slate-950 text-slate-300">10</option>
                        <option value={20} className="bg-slate-950 text-slate-300">20</option>
                        <option value={30} className="bg-slate-950 text-slate-300">30</option>
                    </select>
                    <span>rows per page</span>
                </div>
                <span className="hidden sm:inline text-slate-800">|</span>
                <span>
                    Showing{" "}
                    <span className="text-slate-200 font-semibold font-mono">
                        {totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
                    </span>{" "}
                    to{" "}
                    <span className="text-slate-200 font-semibold font-mono">
                        {Math.min(currentPage * itemsPerPage, totalItems)}
                    </span>{" "}
                    of{" "}
                    <span className="text-slate-200 font-semibold font-mono">{totalItems}</span>{" "}
                    matching items
                </span>
            </div>

            <div className="flex items-center gap-3">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                    className="h-8 py-0.5 px-2.5 flex items-center gap-1 text-xs font-medium cursor-pointer"
                >
                    <ChevronLeft className="h-3.5 w-3.5" /> Previous
                </Button>
                <span className="text-slate-400 font-mono">
                    Page <span className="text-slate-200 font-semibold">{currentPage}</span> of{" "}
                    <span className="text-slate-200 font-semibold">{totalPages}</span>
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                    className="h-8 py-0.5 px-2.5 flex items-center gap-1 text-xs font-medium cursor-pointer"
                >
                    Next <ChevronRight className="h-3.5 w-3.5" />
                </Button>
            </div>
        </div>
    );
};

export default Pagination;
