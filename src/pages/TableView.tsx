import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import TopNavBar from "@/components/layout/TopNavBar";
import { listSchemas, listTables, previewTableRows } from "@/lib/database-api";
import type { DatabaseSchema, DatabaseTableSummary, RowPreviewResult } from "@/types";

export default function TableView() {
  const [schemas, setSchemas] = useState<DatabaseSchema[]>([]);
  const [tables, setTables] = useState<DatabaseTableSummary[]>([]);
  const [selectedSchema, setSelectedSchema] = useState("");
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [rowsResult, setRowsResult] = useState<RowPreviewResult | null>(null);
  const [isLoadingSchemas, setIsLoadingSchemas] = useState(true);
  const [isLoadingTables, setIsLoadingTables] = useState(false);
  const [isLoadingRows, setIsLoadingRows] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tableLabel = useMemo(
    () => (selectedTable ? `${selectedSchema}.${selectedTable}` : "No table selected"),
    [selectedSchema, selectedTable],
  );

  useEffect(() => {
    void loadSchemas();
  }, []);

  useEffect(() => {
    if (!selectedSchema) {
      return;
    }

    void loadTables(selectedSchema);
  }, [selectedSchema]);

  useEffect(() => {
    if (!selectedTable || !selectedSchema) {
      return;
    }

    void loadRows(selectedSchema, selectedTable, 25, 0);
  }, [selectedTable]);

  async function loadSchemas() {
    setIsLoadingSchemas(true);
    setError(null);

    try {
      const nextSchemas = await listSchemas();
      setSchemas(nextSchemas);

      if (nextSchemas.length > 0) {
        setSelectedSchema(nextSchemas[0].name);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load schemas.");
    } finally {
      setIsLoadingSchemas(false);
    }
  }

  async function loadTables(schema: string) {
    setIsLoadingTables(true);
    setError(null);

    try {
      const nextTables = await listTables(schema);
      setTables(nextTables);
      setSelectedTable(nextTables[0]?.name ?? null);
      setRowsResult(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load tables.");
    } finally {
      setIsLoadingTables(false);
    }
  }

  async function loadRows(schema: string, table: string, limit: number, offset: number) {
    setIsLoadingRows(true);
    setError(null);

    try {
      setRowsResult(await previewTableRows(schema, table, limit, offset));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load rows.");
    } finally {
      setIsLoadingRows(false);
    }
  }

  async function goToPage(nextOffset: number) {
    if (!selectedTable || !rowsResult) {
      return;
    }

    await loadRows(selectedSchema, selectedTable, rowsResult.limit, nextOffset);
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      <TopNavBar />

      <section className="px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-surface-container-high bg-background shrink-0">
        <div className="flex items-center gap-3">
          <select
            className="rounded-lg bg-surface-container-low px-3 py-2 text-sm text-on-surface focus:ring-1 focus:ring-primary/30"
            value={selectedSchema}
            onChange={(event) => setSelectedSchema(event.target.value)}
            disabled={isLoadingSchemas}
          >
            {schemas.map((schema) => (
              <option key={schema.name} value={schema.name}>
                {schema.name}
              </option>
            ))}
          </select>

          <div className="h-6 w-px bg-surface-container-high mx-1" />

          <div className="text-sm text-on-surface-variant">
            {tableLabel}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="chip" onClick={() => void loadTables(selectedSchema)}>
            Refresh Tables
          </Button>
          <Button
            variant="primary"
            size="chip"
            disabled={!selectedTable || isLoadingRows}
            onClick={() =>
              selectedTable ? void loadRows(selectedSchema, selectedTable, rowsResult?.limit ?? 25, 0) : undefined
            }
          >
            Refresh Rows
          </Button>
        </div>
      </section>

      {error && (
        <div className="mx-6 mt-6 rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

      <div className="flex-1 min-h-0 grid grid-cols-[280px_1fr] gap-6 px-6 py-6 bg-surface overflow-hidden">
        <Card variant="default" className="min-h-0 overflow-hidden flex flex-col border-surface-container-high bg-surface rounded-xl p-0">
          <div className="border-b border-surface-container-high px-4 py-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Tables
            </h2>
          </div>
          <div className="flex-1 overflow-auto">
            {isLoadingTables ? (
              <div className="p-4 text-sm text-on-surface-variant">Loading tables...</div>
            ) : tables.length === 0 ? (
              <div className="p-4 text-sm text-on-surface-variant">No tables found in this schema.</div>
            ) : (
              tables.map((table) => (
                <button
                  key={`${table.schema}.${table.name}`}
                  className={`w-full border-b border-surface-container-high/40 px-4 py-3 text-left transition-colors ${
                    selectedTable === table.name
                      ? "bg-primary/10 text-primary"
                      : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                  }`}
                  onClick={() => setSelectedTable(table.name)}
                >
                  <div className="font-medium">{table.name}</div>
                  <div className="mt-1 text-[11px] uppercase tracking-wider opacity-70">
                    {table.type}
                  </div>
                </button>
              ))
            )}
          </div>
        </Card>

        <Card variant="default" className="min-h-0 overflow-hidden flex flex-col border-surface-container-high bg-surface rounded-xl p-0">
          <div className="border-b border-surface-container-high px-4 py-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-on-surface">Row Preview</h2>
              <p className="text-xs text-on-surface-variant mt-1">
                Read-only preview from the active PostgreSQL connection.
              </p>
            </div>
            {rowsResult && (
              <div className="text-[11px] font-mono text-on-surface-variant">
                {rowsResult.totalCount} rows total
              </div>
            )}
          </div>

          <div className="flex-1 overflow-auto">
            {isLoadingRows ? (
              <div className="p-6 text-sm text-on-surface-variant">Loading rows...</div>
            ) : !selectedTable ? (
              <div className="p-6 text-sm text-on-surface-variant">Select a table to preview its rows.</div>
            ) : !rowsResult || rowsResult.columns.length === 0 ? (
              <div className="p-6 text-sm text-on-surface-variant">No rows returned for this table.</div>
            ) : (
              <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                <thead className="sticky top-0 bg-surface z-10 border-b border-surface-container-high">
                  <tr>
                    {rowsResult.columns.map((column) => (
                      <th
                        key={column}
                        className="px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high/50">
                  {rowsResult.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-surface-container-low transition-colors">
                      {rowsResult.columns.map((column) => (
                        <td key={`${rowIndex}-${column}`} className="px-4 py-3 align-top text-on-surface-variant">
                          {formatCellValue(row[column])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {rowsResult && (
            <footer className="border-t border-surface-container-high px-4 py-3 flex items-center justify-between">
              <div className="text-xs text-on-surface-variant">
                Showing {rowsResult.offset + 1}-
                {Math.min(rowsResult.offset + rowsResult.rows.length, rowsResult.totalCount)} of {rowsResult.totalCount}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="chip"
                  disabled={rowsResult.offset === 0 || isLoadingRows}
                  onClick={() => void goToPage(Math.max(rowsResult.offset - rowsResult.limit, 0))}
                >
                  Previous
                </Button>
                <Button
                  variant="ghost"
                  size="chip"
                  disabled={rowsResult.offset + rowsResult.limit >= rowsResult.totalCount || isLoadingRows}
                  onClick={() => void goToPage(rowsResult.offset + rowsResult.limit)}
                >
                  Next
                </Button>
              </div>
            </footer>
          )}
        </Card>
      </div>
    </div>
  );
}

function formatCellValue(value: unknown) {
  if (value === null) {
    return <span className="italic text-outline">null</span>;
  }

  if (typeof value === "object") {
    return <span className="font-mono text-xs">{JSON.stringify(value)}</span>;
  }

  return String(value);
}
