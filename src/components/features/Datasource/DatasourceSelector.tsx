import { useDatasource } from "@/contexts/DatasourceContext";

export function DatasourceSelector() {
  const { datasources, activeDatasourceId, setActiveDatasourceId, isLoading } = useDatasource();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 animate-pulse">
        <div className="w-4 h-4 bg-surface-container-high rounded" />
        <div className="w-24 h-4 bg-surface-container-high rounded" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-base text-on-surface-variant">storage</span>
      <select
        className="bg-transparent border-none text-sm font-medium text-on-surface focus:ring-0 cursor-pointer hover:text-primary transition-colors"
        value={activeDatasourceId || ''}
        onChange={(e) => setActiveDatasourceId(e.target.value)}
      >
        {datasources.map((ds) => (
          <option key={ds.id} value={ds.id} className="bg-surface text-on-surface">
            {ds.name}
          </option>
        ))}
      </select>
    </div>
  );
}
