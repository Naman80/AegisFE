import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import TopNavBar from "@/components/layout/TopNavBar";
import { useDatasource } from "@/contexts/DatasourceContext";
import { listNamespaces, listEntities } from "@/services/explorer.service";
import { previewEntity } from "@/services/query.service";
import type { Namespace, Entity, QueryResult } from "@/types/normalization";

export default function TableView() {
  const { activeDatasourceId } = useDatasource();
  const [namespaces, setNamespaces] = useState<Namespace[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [selectedNamespace, setSelectedNamespace] = useState("");
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [rowsResult, setRowsResult] = useState<QueryResult | null>(null);
  
  const [isLoadingNamespaces, setIsLoadingNamespaces] = useState(false);
  const [isLoadingEntities, setIsLoadingEntities] = useState(false);
  const [isLoadingRows, setIsLoadingRows] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const entityLabel = useMemo(
    () => (selectedEntity ? `${selectedNamespace}.${selectedEntity}` : "No entity selected"),
    [selectedNamespace, selectedEntity],
  );

  useEffect(() => {
    if (activeDatasourceId) {
      void loadNamespaces(activeDatasourceId);
    }
  }, [activeDatasourceId]);

  useEffect(() => {
    if (!selectedNamespace || !activeDatasourceId) {
      return;
    }
    void loadEntities(activeDatasourceId, selectedNamespace);
  }, [selectedNamespace, activeDatasourceId]);

  useEffect(() => {
    if (!selectedEntity || !selectedNamespace || !activeDatasourceId) {
      return;
    }
    void loadRows(activeDatasourceId, selectedNamespace, selectedEntity, 50, 0);
  }, [selectedEntity, selectedNamespace, activeDatasourceId]);

  async function loadNamespaces(dsId: string) {
    setIsLoadingNamespaces(true);
    setError(null);
    try {
      const data = await listNamespaces(dsId);
      setNamespaces(data);
      if (data.length > 0) {
        setSelectedNamespace(data[0].name);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load namespaces");
    } finally {
      setIsLoadingNamespaces(false);
    }
  }

  async function loadEntities(dsId: string, ns: string) {
    setIsLoadingEntities(true);
    setError(null);
    try {
      const data = await listEntities(dsId, ns);
      setEntities(data);
      setSelectedEntity(data[0]?.name ?? null);
      setRowsResult(null);
    } catch (err: any) {
      setError(err.message || "Failed to load entities");
    } finally {
      setIsLoadingEntities(false);
    }
  }

  async function loadRows(dsId: string, ns: string, entity: string, limit: number, offset: number) {
    setIsLoadingRows(true);
    setError(null);
    try {
      const result = await previewEntity(dsId, ns, entity, limit, offset);
      setRowsResult(result);
    } catch (err: any) {
      setError(err.message || "Failed to load rows");
    } finally {
      setIsLoadingRows(false);
    }
  }

  const handleEntityClick = (entityName: string) => {
    setSelectedEntity(entityName);
  };

  const handleNamespaceChange = (ns: string) => {
    setSelectedNamespace(ns);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      <TopNavBar />

      <section className="px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-surface-container-high bg-background shrink-0">
        <div className="flex items-center gap-3">
          <select
            className="rounded-lg bg-surface-container-low px-3 py-2 text-sm text-on-surface focus:ring-1 focus:ring-primary/30"
            value={selectedNamespace}
            onChange={(e) => handleNamespaceChange(e.target.value)}
            disabled={isLoadingNamespaces}
          >
            {namespaces.map((ns) => (
              <option key={ns.name} value={ns.name}>
                {ns.name}
              </option>
            ))}
          </select>

          <div className="h-6 w-px bg-surface-container-high mx-1" />

          <div className="text-sm text-on-surface-variant font-medium">
            {entityLabel}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="chip" 
            onClick={() => activeDatasourceId && loadEntities(activeDatasourceId, selectedNamespace)}
            disabled={!activeDatasourceId || isLoadingEntities}
          >
            Refresh List
          </Button>
          <Button
            variant="primary"
            size="chip"
            disabled={!selectedEntity || !activeDatasourceId || isLoadingRows}
            onClick={() =>
              selectedEntity && activeDatasourceId && loadRows(activeDatasourceId, selectedNamespace, selectedEntity, 50, 0)
            }
          >
            Refresh Data
          </Button>
        </div>
      </section>

      {error && (
        <div className="mx-6 mt-6 rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

      <div className="flex-1 min-h-0 grid grid-cols-[280px_1fr] gap-6 px-6 py-6 bg-surface overflow-hidden">
        <Card variant="default" className="min-h-0 overflow-hidden flex flex-col border-surface-container-high bg-surface rounded-xl p-0 shadow-sm">
          <div className="border-b border-surface-container-high px-4 py-3 bg-surface-container-lowest">
            <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Entities
            </h2>
          </div>
          <div className="flex-1 overflow-auto divide-y divide-surface-container-high/30">
            {isLoadingEntities ? (
              <div className="p-4 text-sm text-on-surface-variant animate-pulse">Loading entities...</div>
            ) : entities.length === 0 ? (
              <div className="p-4 text-sm text-on-surface-variant italic">No entities found.</div>
            ) : (
              entities.map((entity) => (
                <button
                  key={`${entity.namespace}.${entity.name}`}
                  className={`w-full px-4 py-3 text-left transition-all ${
                    selectedEntity === entity.name
                      ? "bg-primary/5 text-primary border-l-4 border-primary"
                      : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface border-l-4 border-transparent"
                  }`}
                  onClick={() => handleEntityClick(entity.name)}
                >
                  <div className="font-semibold text-sm">{entity.name}</div>
                  <div className="mt-0.5 text-[10px] uppercase tracking-wider opacity-60 font-bold">
                    {entity.type}
                  </div>
                </button>
              ))
            )}
          </div>
        </Card>

        <Card variant="default" className="min-h-0 overflow-hidden flex flex-col border-surface-container-high bg-surface rounded-xl p-0 shadow-sm">
          <div className="border-b border-surface-container-high px-4 py-3 flex items-center justify-between bg-surface-container-lowest">
            <div>
              <h2 className="text-sm font-bold text-on-surface">Data Preview</h2>
              <p className="text-[11px] text-on-surface-variant mt-0.5 font-medium">
                Normalized view from {activeDatasourceId ? 'active provider' : 'no datasource'}
              </p>
            </div>
            {rowsResult && (
              <div className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                {rowsResult.totalCount} RECORDS
              </div>
            )}
          </div>

          <div className="flex-1 overflow-auto">
            {isLoadingRows ? (
              <div className="p-12 flex flex-col items-center justify-center gap-4 text-on-surface-variant animate-pulse">
                <span className="material-symbols-outlined text-4xl animate-spin">progress_activity</span>
                <span className="text-sm font-medium">Fetching records...</span>
              </div>
            ) : !selectedEntity ? (
              <div className="p-12 flex flex-col items-center justify-center gap-4 text-outline">
                <span className="material-symbols-outlined text-5xl">table_chart</span>
                <span className="text-sm font-medium">Select an entity to view data</span>
              </div>
            ) : !rowsResult || rowsResult.columns.length === 0 ? (
              <div className="p-12 text-center text-on-surface-variant italic">No data available for this entity.</div>
            ) : (
              <div className="relative">
                <table className="w-full min-w-full border-collapse text-left text-xs">
                  <thead className="sticky top-0 bg-surface-container-lowest z-10 border-b border-surface-container-high shadow-sm">
                    <tr>
                      {rowsResult.columns.map((column) => (
                        <th
                          key={column}
                          className="px-4 py-3 font-bold uppercase tracking-widest text-on-surface-variant border-r border-surface-container-high/50 last:border-r-0"
                        >
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-high/30">
                    {rowsResult.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="hover:bg-primary/[0.02] transition-colors">
                        {rowsResult.columns.map((column) => (
                          <td key={`${rowIndex}-${column}`} className="px-4 py-2.5 align-top text-on-surface font-medium border-r border-surface-container-high/20 last:border-r-0 max-w-xs truncate">
                            {formatCellValue(row[column])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function formatCellValue(value: unknown) {
  if (value === null) {
    return <span className="italic text-outline opacity-50">null</span>;
  }

  if (typeof value === "object") {
    return <span className="font-mono text-[10px] text-primary/80 bg-primary/5 px-1 rounded">{JSON.stringify(value)}</span>;
  }
  
  if (typeof value === "boolean") {
     return <span className={`font-bold text-[10px] uppercase px-1.5 py-0.5 rounded ${value ? 'text-tertiary bg-tertiary/10' : 'text-error bg-error/10'}`}>{String(value)}</span>;
  }

  return String(value);
}
