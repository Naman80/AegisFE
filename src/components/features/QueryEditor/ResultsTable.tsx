import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import type { QueryResult } from "@/types/normalization";

interface ResultsTableProps {
  result: QueryResult;
}

export default function ResultsTable({ result }: ResultsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 50 });

  const columns = useMemo<ColumnDef<Record<string, unknown>>[]>(() => {
    return result.columns.map((col) => ({
      accessorKey: col,
      header: col,
      cell: ({ getValue }) => {
        const value = getValue();
        if (value === null) return <span className="text-outline-variant italic opacity-50">null</span>;
        if (value === undefined) return "";
        
        if (typeof value === 'object') {
          return <span className="text-[10px] font-mono text-primary/70">{JSON.stringify(value)}</span>;
        }
        
        if (typeof value === 'boolean') {
          return <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${value ? 'text-tertiary bg-tertiary/10' : 'text-error bg-error/10'}`}>{String(value)}</span>;
        }

        return <span className="text-on-surface-variant font-medium">{String(value)}</span>;
      },
    }));
  }, [result.columns]);

  const table = useReactTable({
    data: result.rows,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="flex flex-col h-full bg-surface">
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-xs border-collapse font-body tracking-tight">
          <thead className="sticky top-0 bg-surface-container-lowest/95 backdrop-blur-md z-10 border-b border-surface-container-high shadow-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-5 py-3 text-on-surface-variant font-black uppercase tracking-[0.15em] text-[9px] select-none cursor-pointer hover:bg-primary/5 hover:text-primary transition-all border-r border-surface-container-high/40 last:border-r-0"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center justify-between">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <ArrowUpDown className="w-3 h-3 opacity-30" />
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-surface-container-high/40">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-primary/[0.02] transition-colors group">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-5 py-2.5 border-r border-surface-container-high/20 last:border-r-0 max-w-xs truncate">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between px-6 py-2 border-t border-surface-container-high bg-surface-container-lowest shrink-0">
          <div className="text-[10px] text-on-surface-variant/70 font-black uppercase tracking-widest">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <div className="flex items-center gap-1">
            <button
              className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary disabled:opacity-20 transition-all"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary disabled:opacity-20 transition-all"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary disabled:opacity-20 transition-all"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary disabled:opacity-20 transition-all"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
