import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import TopNavBar from "@/components/layout/TopNavBar";
import { useDatasource } from "@/contexts/DatasourceContext";
import { useNamespaces, useEntities } from "@/hooks/queries/useExplorerQueries";
import { useEntityFields } from "@/hooks/queries/useSchemaQueries";
import type { Namespace, Entity, Field } from "@/types/normalization";

// --- Sub-components ---

function NamespaceSelector({
  namespaces,
  value,
  onChange,
  isLoading
}: {
  namespaces: Namespace[];
  value: string;
  onChange: (val: string) => void;
  isLoading: boolean;
}) {
  return (
    <div className="p-4 border-b border-surface-container-high">
      <div className="text-[10px] font-bold uppercase tracking-widest text-outline mb-2">
        Namespace
      </div>
      <Select
        value={value}
        onValueChange={onChange}
        disabled={isLoading}
      >
        <SelectTrigger className="h-9 rounded-xl bg-surface-container border-none">
          <SelectValue placeholder="Loading.." />
        </SelectTrigger>
        <SelectContent>
          {namespaces.map((ns) => (
            <SelectItem key={ns.name} value={ns.name}>
              {ns.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function EntityList({
  entities,
  selectedEntity,
  onSelect,
  isLoading
}: {
  entities: Entity[];
  selectedEntity: string | null;
  onSelect: (val: string) => void;
  isLoading: boolean;
}) {
  return (
    <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
      {isLoading ? (
        <div className="space-y-2 px-3 py-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-surface-container-high rounded-lg animate-pulse" />
          ))}
        </div>
      ) : entities.length === 0 ? (
        <div className="px-3 py-2 text-sm text-on-surface-variant italic">No entities found.</div>
      ) : (
        entities.map((entity) => (
          <button
            key={`${entity.namespace}.${entity.name}`}
            className={`w-full rounded-lg px-4 py-2.5 text-left transition-all ${selectedEntity === entity.name
              ? "bg-primary/5 text-primary font-semibold"
              : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
              }`}
            onClick={() => onSelect(entity.name)}
          >
            <div className="text-sm">{entity.name}</div>
            <div className="mt-0.5 text-[9px] uppercase tracking-widest opacity-60 font-bold">{entity.type}</div>
          </button>
        ))
      )}
    </div>
  );
}

function EntitySchemaView({
  entityName,
  namespace,
  fields,
  isLoading,
  onRefresh
}: {
  entityName: string | null;
  namespace: string;
  fields: Field[];
  isLoading: boolean;
  onRefresh: () => void;
}) {
  if (!entityName) {
    return (
      <div className="rounded-xl border border-surface-container-high bg-surface p-12 flex flex-col items-center justify-center text-on-surface-variant text-center gap-4 shadow-sm">
        <span className="material-symbols-outlined text-5xl opacity-20">schema</span>
        <p className="text-sm font-medium">Select an entity to inspect its architecture.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="h-24 bg-surface-container-high rounded-2xl animate-pulse" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-surface-container-high rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto rounded-2xl border-t-4 border-t-primary bg-surface shadow-[0_12px_40px_rgba(0,0,0,0.4)] overflow-hidden">
      <div className="bg-surface-container-high/40 px-6 py-5 border-b border-surface-container-high">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-black text-on-surface tracking-tight">{entityName}</div>
            <div className="mt-1 text-[11px] font-bold font-mono text-primary/70 uppercase tracking-widest">
              {namespace}.{entityName}
            </div>
          </div>
          <Button variant="outline" size="chip" onClick={onRefresh}>
            Refresh
          </Button>
        </div>
      </div>

      <div className="divide-y divide-surface-container-high/50">
        {fields.map((field) => (
          <div
            key={field.name}
            className="flex items-center justify-between px-6 py-4 hover:bg-surface-container-lowest transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-surface-container group-hover:bg-primary/5 transition-colors">
                <span className={field.isPrimaryKey ? "material-symbols-outlined text-primary text-lg" : "material-symbols-outlined text-outline text-lg"}>
                  {field.isPrimaryKey ? "key" : "view_column"}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-on-surface">{field.name}</span>
                  {field.isPrimaryKey && (
                    <Badge variant="default" className="text-[9px] py-0 px-1.5 rounded-[4px] font-black tracking-widest uppercase">
                      PK
                    </Badge>
                  )}
                </div>
                <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider opacity-60">
                  {field.isNullable ? "Nullable" : "Required"}
                  {field.defaultValue ? ` • DEFAULT: ${field.defaultValue}` : ""}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="font-mono text-[11px] font-black text-primary px-2 py-0.5 rounded-full bg-primary/10">
                {field.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SchemaSidebar({
  selectedEntity,
  fields
}: {
  selectedEntity: string | null;
  fields: Field[]
}) {
  return (
    <aside className="bg-surface flex flex-col border-l border-surface-container-high shadow-[-15px_0_40px_rgba(0,0,0,0.15)] z-20">
      <div className="p-6 border-b border-surface-container-high">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4">
          Structural Properties
        </div>
        <h2 className="text-xl font-black text-on-surface tracking-tight">{selectedEntity ?? "No selection"}</h2>
        <p className="text-on-surface-variant text-xs mt-1.5 font-medium leading-relaxed">
          {fields.length ? `${fields.length} normalized fields identified.` : "Waiting for metadata introspection"}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <section className="space-y-4">
          <div className="text-[10px] font-black text-outline uppercase tracking-[0.2em]">Summary</div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-container-low rounded-xl p-4 border border-surface-container-high shadow-sm">
              <div className="text-[10px] font-bold text-outline uppercase mb-1">Total Fields</div>
              <div className="text-2xl font-black text-on-surface">{fields.length}</div>
            </div>
            <div className="bg-surface-container-low rounded-xl p-4 border border-surface-container-high shadow-sm">
              <div className="text-[10px] font-bold text-outline uppercase mb-1">Keys</div>
              <div className="text-2xl font-black text-on-surface">{fields.filter(f => f.isPrimaryKey).length}</div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="text-[10px] font-black text-outline uppercase tracking-[0.2em]">Quick Actions</div>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start text-xs font-bold py-5 rounded-xl border-surface-container-high" disabled={!selectedEntity}>
              <span className="material-symbols-outlined text-sm mr-2">edit</span>
              Alter Entity
            </Button>
            <Button variant="outline" className="w-full justify-start text-xs font-bold py-5 rounded-xl border-surface-container-high text-error hover:bg-error/5 hover:text-error hover:border-error/20" disabled={!selectedEntity}>
              <span className="material-symbols-outlined text-sm mr-2">delete</span>
              Drop Entity
            </Button>
          </div>
        </section>
      </div>
    </aside>
  );
}

// --- Main Component ---

export default function SchemaBuilder() {
  const { activeDatasourceId } = useDatasource();
  // Queries
  const {
    data: namespaces = [],
    isLoading: isLoadingNamespaces,
    error: namespaceError
  } = useNamespaces(activeDatasourceId);

  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);

  const [selectedNamespace, setSelectedNamespace] = useState(namespaces?.[0]?.name);

  const {
    data: entities = [],
    isLoading: isLoadingEntities,
    error: entityError
  } = useEntities(activeDatasourceId, selectedNamespace);

  const {
    data: fields = [],
    isLoading: isLoadingFields,
    error: fieldError,
    refetch: refetchFields
  } = useEntityFields(activeDatasourceId, selectedNamespace, selectedEntity);

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

  const error = namespaceError || entityError || fieldError;

  return (
    <div className="flex flex-col w-full h-full relative bg-background">
      <TopNavBar />

      {error && (
        <div className="mx-6 mt-6 rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {(error as Error).message || "An error occurred while fetching data."}
        </div>
      )}

      <div className="flex-1 grid grid-cols-[280px_1fr_360px] overflow-hidden">
        <aside className="bg-surface-container-lowest flex flex-col border-r border-surface-container-high">
          <NamespaceSelector
            namespaces={namespaces}
            value={selectedNamespace}
            onChange={setSelectedNamespace}
            isLoading={isLoadingNamespaces}
          />
          <EntityList
            entities={entities}
            selectedEntity={selectedEntity}
            onSelect={setSelectedEntity}
            isLoading={isLoadingEntities}
          />
        </aside>

        <main className="relative overflow-auto bg-surface-container-lowest">
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(var(--surface-container-high) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative z-10 p-10">
            <EntitySchemaView
              entityName={selectedEntity}
              namespace={selectedNamespace}
              fields={fields}
              isLoading={isLoadingFields}
              onRefresh={() => refetchFields()}
            />
          </div>
        </main>

        <SchemaSidebar
          selectedEntity={selectedEntity}
          fields={fields}
        />
      </div>
    </div>
  );
}
