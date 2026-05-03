import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import TopNavBar from "@/components/layout/TopNavBar";
import { useDatasource } from "@/contexts/DatasourceContext";
import { useNamespaces } from "@/hooks/queries/useExplorerQueries";
import { useAllEntitySchema } from "@/hooks/queries/useEntityQueries";
import { useEntityPreview } from "@/hooks/queries/useQueryQueries";
import type { Namespace, Entity, QueryResult, Field } from "@/types/normalization";

// View header component
function ViewHeader({
  namespaces,
  selectedNamespace,
  onNamespaceChange,
  entityLabel,
  isLoadingNamespaces,
  isLoadingEntities,
  isLoadingRows,
  onRefreshList,
  onRefreshData,
  canRefreshData
}: {
  namespaces: Namespace[];
  selectedNamespace: string;
  onNamespaceChange: (ns: string) => void;
  entityLabel: string;
  isLoadingNamespaces: boolean;
  isLoadingEntities: boolean;
  isLoadingRows: boolean;
  onRefreshList: () => void;
  onRefreshData: () => void;
  canRefreshData: boolean;
}) {
  return (
    <section className="px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-surface-container-high bg-background shrink-0">
      <div className="flex items-center gap-3">
        <Select
          value={selectedNamespace}
          onValueChange={onNamespaceChange}
          disabled={isLoadingNamespaces}
        >
          <SelectTrigger className="h-9 min-w-[140px] rounded-xl bg-surface-container-low border-none">
            <SelectValue placeholder={'Loading...'} />
          </SelectTrigger>
          <SelectContent>
            {namespaces.map((ns) => (
              <SelectItem key={ns.name} value={ns.name}>
                {ns.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="h-6 w-px bg-surface-container-high mx-1" />

        <div className="text-sm text-on-surface-variant font-medium">
          {entityLabel}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="chip"
          onClick={onRefreshList}
          disabled={isLoadingEntities}
        >
          Refresh List
        </Button>
        <Button
          variant="primary"
          size="chip"
          disabled={!canRefreshData || isLoadingRows}
          onClick={onRefreshData}
        >
          Refresh Data
        </Button>
      </div>
    </section>
  );
}

// Entity list component
function EntitySidebar({
  entities,
  selectedEntity,
  onEntityClick,
  isLoading
}: {
  entities: Entity[];
  selectedEntity: string | null;
  onEntityClick: (name: string) => void;
  isLoading: boolean;
}) {
  return (
    <Card variant="default" className="min-h-0 overflow-hidden flex flex-col border-surface-container-high bg-surface rounded-xl p-0 shadow-sm">
      <div className="border-b border-surface-container-high px-4 py-3 bg-surface-container-lowest">
        <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
          Entities
        </h2>
      </div>
      <div className="flex-1 overflow-auto divide-y divide-surface-container-high/30">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-10 bg-surface-container-high rounded animate-pulse" />
            ))}
          </div>
        ) : entities.length === 0 ? (
          <div className="p-4 text-sm text-on-surface-variant italic">No entities found.</div>
        ) : (
          entities.map((entity) => (
            <button
              key={`${entity.namespace}.${entity.name}`}
              className={`w-full px-4 py-3 text-left transition-all ${selectedEntity === entity.name
                ? "bg-primary/5 text-primary border-l-4 border-primary"
                : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface border-l-4 border-transparent"
                }`}
              onClick={() => onEntityClick(entity.name)}
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
  );
}

// Data table component
function DataTable({
  entityName,
  rowsResult,
  fields,
  isLoading,
  activeDatasourceId,
}: {
  entityName: string | null;
  rowsResult: QueryResult | null;
  fields: Field[];
  isLoading: boolean;
  activeDatasourceId: string | null;
}) {
  return (
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
        {!entityName ? (
          <div className="p-12 flex flex-col items-center justify-center gap-4 text-outline opacity-40">
            <span className="material-symbols-outlined text-5xl">table_chart</span>
            <span className="text-sm font-medium">Select an entity to view data</span>
          </div>
        ) : isLoading && fields.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center gap-4 text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl animate-spin text-primary/40">progress_activity</span>
            <span className="text-sm font-medium animate-pulse">Fetching structure...</span>
          </div>
        ) : (
          <div className="relative">
            <table className="w-full min-w-full border-collapse text-left text-xs">
              <thead className="sticky top-0 bg-surface-container-lowest z-10 border-b border-surface-container-high shadow-sm">
                <tr>
                  {(rowsResult?.columns || fields.map(f => f.name)).map((column) => (
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
                {isLoading ? (
                  [...Array(12)].map((_, i) => (
                    <tr key={i} className="hover:bg-primary/[0.01] transition-colors">
                      {(rowsResult?.columns || fields.map(f => f.name)).map((column) => (
                        <td key={`${i}-${column}`} className="px-4 py-3 border-r border-surface-container-high/20 last:border-r-0">
                          <div className="h-3 bg-surface-container-high rounded-full animate-pulse w-full opacity-60" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : !rowsResult || rowsResult.rows.length === 0 ? (
                  <tr>
                    <td colSpan={rowsResult?.columns.length || fields.length} className="p-12 text-center text-on-surface-variant italic">
                      No data available for this entity.
                    </td>
                  </tr>
                ) : (
                  rowsResult.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-primary/[0.02] transition-colors">
                      {rowsResult.columns.map((column) => (
                        <td key={`${rowIndex}-${column}`} className="px-4 py-2.5 align-top text-on-surface font-medium border-r border-surface-container-high/20 last:border-r-0 max-w-[240px] truncate">
                          {formatCellValue(row[column])}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
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

// --- Main Component ---
// Table view component main container

export default function TableView() {
  const { activeDatasourceId } = useDatasource();

  const {
    data: namespaces = [],
    isLoading: isLoadingNamespaces,
    error: namespaceError
  } = useNamespaces(activeDatasourceId);

  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);

  const [selectedNamespace, setSelectedNamespace] = useState(namespaces?.[0]?.name);

  const {
    data: allSchema = {},
    isLoading: isLoadingSchema,
    error: schemaError,
    refetch: refetchSchema
  } = useAllEntitySchema(activeDatasourceId, selectedNamespace);

  const {
    data: rowsResult = null,
    isLoading: isLoadingRows,
    error: rowError,
    refetch: refetchRows
  } = useEntityPreview(activeDatasourceId, selectedNamespace, selectedEntity);

  // Derive entities from allSchema
  const entities = useMemo(() => {
    return Object.entries(allSchema).map(([name, data]) => ({
      name,
      namespace: selectedNamespace,
      type: data.type as any
    }));
  }, [allSchema, selectedNamespace]);

  // Labels
  const entityLabel = useMemo(
    () => (selectedEntity ? `${selectedNamespace}.${selectedEntity}` : "No entity selected"),
    [selectedNamespace, selectedEntity],
  );

  const fields = useMemo(() => {
    return selectedEntity ? allSchema[selectedEntity]?.fields || [] : [];
  }, [allSchema, selectedEntity]);

  // Auto-selection Logic
  useEffect(() => {
    if (namespaces.length > 0 && !selectedNamespace) {
      setSelectedNamespace(namespaces[0].name);
    }
  }, [namespaces, selectedNamespace]);

  useEffect(() => {
    if (entities.length > 0 && !selectedEntity) {
      setSelectedEntity(entities[0].name);
    } else if (entities.length === 0) {
      setSelectedEntity(null);
    }
  }, [entities, selectedEntity]);

  // Reset selection on datasource change
  useEffect(() => {
    setSelectedNamespace("");
    setSelectedEntity(null);
  }, [activeDatasourceId]);

  const error = namespaceError || schemaError || rowError;

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      <TopNavBar />

      <ViewHeader
        namespaces={namespaces}
        selectedNamespace={selectedNamespace}
        onNamespaceChange={setSelectedNamespace}
        entityLabel={entityLabel}
        isLoadingNamespaces={isLoadingNamespaces}
        isLoadingEntities={isLoadingSchema}
        isLoadingRows={isLoadingRows}
        onRefreshList={() => refetchSchema()}
        onRefreshData={() => refetchRows()}
        canRefreshData={!!selectedEntity}
      />

      {error && (
        <div className="mx-6 mt-6 rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {(error as Error).message || "An error occurred while fetching data."}
        </div>
      )}

      <div className="flex-1 min-h-0 grid grid-cols-[280px_1fr] gap-6 px-6 py-6 bg-surface overflow-hidden">
        <EntitySidebar
          entities={entities}
          selectedEntity={selectedEntity}
          onEntityClick={setSelectedEntity}
          isLoading={isLoadingSchema}
        />

        <DataTable
          rowsResult={rowsResult}
          entityName={selectedEntity}
          fields={fields}
          isLoading={isLoadingRows}
          activeDatasourceId={activeDatasourceId}
        />
      </div>
    </div>
  );
}
