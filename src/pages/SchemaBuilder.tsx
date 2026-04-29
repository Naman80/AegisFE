import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import TopNavBar from "@/components/layout/TopNavBar";
import { getTableDetails, listSchemas, listTables } from "@/lib/database-api";
import type { DatabaseSchema, DatabaseTableDetails, DatabaseTableSummary } from "@/types";

export default function SchemaBuilder() {
  const [schemas, setSchemas] = useState<DatabaseSchema[]>([]);
  const [tables, setTables] = useState<DatabaseTableSummary[]>([]);
  const [selectedSchema, setSelectedSchema] = useState("public");
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [details, setDetails] = useState<DatabaseTableDetails | null>(null);
  const [isLoadingSchemas, setIsLoadingSchemas] = useState(true);
  const [isLoadingTables, setIsLoadingTables] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const relationCount = useMemo(() => details?.relations.length ?? 0, [details]);

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
    if (!selectedTable) {
      return;
    }

    void loadDetails(selectedSchema, selectedTable);
  }, [selectedSchema, selectedTable]);

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
      setDetails(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load tables.");
    } finally {
      setIsLoadingTables(false);
    }
  }

  async function loadDetails(schema: string, table: string) {
    setIsLoadingDetails(true);
    setError(null);

    try {
      setDetails(await getTableDetails(schema, table));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load table details.");
    } finally {
      setIsLoadingDetails(false);
    }
  }

  return (
    <div className="flex flex-col w-full h-full relative">
      <TopNavBar />

      {error && (
        <div className="mx-6 mt-6 rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

      <div className="flex-1 grid grid-cols-[280px_1fr_360px] overflow-hidden">
        <aside className="bg-surface-container-lowest flex flex-col border-r border-surface-container-high">
          <div className="p-4 border-b border-surface-container-high">
            <div className="text-[10px] font-bold uppercase tracking-widest text-outline mb-2">
              Schema
            </div>
            <select
              className="w-full rounded-lg bg-surface-container px-3 py-2 text-sm text-on-surface focus:ring-1 focus:ring-primary/30"
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
          </div>

          <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
            {isLoadingTables ? (
              <div className="px-3 py-2 text-sm text-on-surface-variant">Loading tables...</div>
            ) : tables.length === 0 ? (
              <div className="px-3 py-2 text-sm text-on-surface-variant">No tables found.</div>
            ) : (
              tables.map((table) => (
                <button
                  key={`${table.schema}.${table.name}`}
                  className={`w-full rounded-sm px-3 py-2.5 text-left transition-all ${
                    selectedTable === table.name
                      ? "bg-surface border-r-2 border-primary text-primary"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }`}
                  onClick={() => setSelectedTable(table.name)}
                >
                  <div className="font-medium">{table.name}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-wider opacity-70">{table.type}</div>
                </button>
              ))
            )}
          </div>
        </aside>

        <main className="relative overflow-auto bg-surface-container-lowest">
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(var(--surface-container-high) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          <div className="relative z-10 p-10">
            {!selectedTable ? (
              <div className="rounded-xl border border-surface-container-high bg-surface p-8 text-sm text-on-surface-variant">
                Pick a table to inspect its structure.
              </div>
            ) : isLoadingDetails || !details ? (
              <div className="rounded-xl border border-surface-container-high bg-surface p-8 text-sm text-on-surface-variant">
                Loading table metadata...
              </div>
            ) : (
              <div className="max-w-2xl rounded-xl border-t-2 border-t-primary bg-surface shadow-[0_8px_32px_rgba(0,0,0,0.35)] overflow-hidden">
                <div className="bg-surface-container-high px-5 py-4 border-b border-surface-container/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-on-surface">{details.name}</div>
                      <div className="mt-1 text-xs font-mono text-on-surface-variant">
                        {details.schema}.{details.name}
                      </div>
                    </div>
                    <Button variant="outline" size="chip" onClick={() => void loadDetails(selectedSchema, details.name)}>
                      Refresh
                    </Button>
                  </div>
                </div>

                <div>
                  {details.columns.map((column) => (
                    <div
                      key={column.name}
                      className="flex items-center justify-between px-5 py-3 border-b border-surface-container-high/50 hover:bg-surface-container transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {column.keyType ? (
                          <Badge variant={column.keyType === "PK" ? "default" : "outline"} className="py-0.5 px-1 rounded-[4px] text-[9px]">
                            {column.keyType}
                          </Badge>
                        ) : (
                          <span className="w-8" />
                        )}
                        <div>
                          <div className="font-mono text-sm text-on-surface">{column.name}</div>
                          <div className="text-[11px] text-outline">
                            {column.isNullable ? "Nullable" : "Required"}
                            {column.defaultValue ? ` • Default: ${column.defaultValue}` : ""}
                          </div>
                        </div>
                      </div>

                      <span className="font-mono text-xs text-on-surface-variant">{column.dataType}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        <aside className="bg-surface flex flex-col border-l border-surface-container-high shadow-[-10px_0_40px_rgba(0,0,0,0.2)]">
          <div className="p-5 border-b border-surface-container-high">
            <div className="text-[10px] font-bold uppercase tracking-widest text-tertiary mb-4">
              Properties
            </div>
            <h2 className="text-on-surface font-bold">{selectedTable ?? "No selection"}</h2>
            <p className="text-outline text-xs mt-1">
              {details ? `${details.columns.length} columns • ${relationCount} relations` : "Waiting for table metadata"}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            <section className="space-y-3">
              <div className="text-[10px] font-bold text-outline uppercase tracking-widest">Columns</div>
              <div className="space-y-2">
                {details?.columns.map((column) => (
                  <div
                    key={column.name}
                    className="rounded-xl border border-surface-container-high bg-surface-container p-3"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[13px] font-bold text-on-surface font-mono">{column.name}</span>
                      <span className="text-[11px] text-outline-variant font-mono">{column.dataType}</span>
                    </div>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-on-surface-variant">
                      {column.keyType ?? (column.isNullable ? "Nullable" : "Required")}
                    </span>
                  </div>
                )) ?? (
                  <div className="text-sm text-on-surface-variant">No column data yet.</div>
                )}
              </div>
            </section>

            <section className="space-y-3">
              <div className="text-[10px] font-bold text-outline uppercase tracking-widest">Relations</div>
              <div className="space-y-2">
                {details?.relations.length ? (
                  details.relations.map((relation) => (
                    <div
                      key={relation.constraintName}
                      className="rounded-xl border border-surface-container-high bg-surface-container p-3"
                    >
                      <div className="text-xs font-semibold text-on-surface">
                        {relation.columnName} → {relation.referencedTable}.{relation.referencedColumn}
                      </div>
                      <div className="mt-1 text-[11px] font-mono text-on-surface-variant">
                        {relation.referencedSchema}.{relation.referencedTable}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-on-surface-variant">No foreign key relations found.</div>
                )}
              </div>
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
}
