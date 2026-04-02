import { useState } from "react";

const mockConnections = [
  {
    id: "prod-pg",
    name: "Production PostgreSQL",
    type: "postgres",
    connectedSince: "Oct 12, 2023",
    status: "Active",
    host: "db.aegis-prod.internal",
    port: "5432",
    dbName: "analytics_v3",
    ssl: "require",
    aiSchema: true,
  },
  {
    id: "bq-warehouse",
    name: "BigQuery Warehouse",
    type: "bigquery",
    connectedSince: "Jan 05, 2024",
    status: "Standby",
    aiSchema: false,
  }
];

export default function DatabaseConnections() {
  const [connections] = useState(mockConnections);

  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-10">
        <h1 className="text-2xl font-bold text-on-surface mb-2">Database Connections</h1>
        <p className="text-on-surface-variant">Manage your data sources and AI-context connections.</p>
      </header>

      <div className="space-y-6">
        {/* Postgres Connection */}
        <div className="bg-surface-container-low rounded-xl p-6 border border-transparent hover:border-surface-container-highest transition-all">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#336791]/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#336791] text-3xl">storage</span>
              </div>
              <div>
                <h3 className="font-bold text-on-surface">{connections[0].name}</h3>
                <p className="text-xs text-on-surface-variant">Connected since {connections[0].connectedSince}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-tertiary/10 text-tertiary border border-tertiary/20">
                {connections[0].status}
              </span>
              <button className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors">
                <span className="material-symbols-outlined text-xl">more_vert</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant">Host</label>
              <input 
                className="w-full bg-surface-container border-none rounded-lg px-4 py-2.5 text-sm font-mono text-on-surface focus:ring-1 focus:ring-primary/30" 
                type="text" 
                defaultValue={connections[0].host} 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant">Port</label>
              <input 
                className="w-full bg-surface-container border-none rounded-lg px-4 py-2.5 text-sm font-mono text-on-surface focus:ring-1 focus:ring-primary/30" 
                type="text" 
                defaultValue={connections[0].port} 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant">Database Name</label>
              <input 
                className="w-full bg-surface-container border-none rounded-lg px-4 py-2.5 text-sm font-mono text-on-surface focus:ring-1 focus:ring-primary/30" 
                type="text" 
                defaultValue={connections[0].dbName} 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant">SSL Mode</label>
              <select 
                className="w-full bg-surface-container border-none rounded-lg px-4 py-2.5 text-sm text-on-surface focus:ring-1 focus:ring-primary/30"
                defaultValue={connections[0].ssl}
              >
                <option>require</option>
                <option>disable</option>
                <option>prefer</option>
              </select>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-surface-container-high flex items-center justify-between">
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={connections[0].aiSchema} className="sr-only peer" />
                <div className="w-9 h-5 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-container"></div>
              </label>
              <span className="text-sm font-medium text-on-surface-variant">AI Schema Analysis</span>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors">Test Connection</button>
              <button className="px-4 py-2 bg-primary-container text-on-primary-container text-xs font-bold rounded-lg hover:brightness-110 transition-all">Save Changes</button>
            </div>
          </div>
        </div>

        {/* BigQuery Connection */}
        <div className="bg-surface-container-low rounded-xl p-6 border border-transparent hover:border-surface-container-highest transition-all opacity-80 group">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#4285F4]/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#4285F4] text-3xl">cloud_queue</span>
              </div>
              <div>
                <h3 className="font-bold text-on-surface">{connections[1].name}</h3>
                <p className="text-xs text-on-surface-variant">Connected since {connections[1].connectedSince}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-surface-container-highest text-on-surface-variant border border-surface-container-high">
                {connections[1].status}
              </span>
              <button className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors">
                <span className="material-symbols-outlined text-xl">more_vert</span>
              </button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant">Service Account JSON</label>
              <div className="bg-surface-container rounded-lg p-3 border border-dashed border-surface-container-highest flex items-center justify-between">
                <span className="text-xs font-mono text-on-surface-variant italic">aegis-production-credentials.json</span>
                <button className="text-xs font-bold text-primary hover:underline">Replace</button>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-surface-container-high flex items-center justify-between">
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={connections[1].aiSchema} className="sr-only peer" />
                <div className="w-9 h-5 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-container"></div>
              </label>
              <span className="text-sm font-medium text-on-surface-variant">AI Schema Analysis</span>
            </div>
            <button className="px-4 py-2 bg-surface-container-highest text-on-surface text-xs font-bold rounded-lg hover:bg-surface-variant transition-all">Update Config</button>
          </div>
        </div>

        {/* Add New Connection Ghost Card */}
        <button className="w-full py-8 rounded-xl border-2 border-dashed border-surface-container-high hover:border-primary/50 hover:bg-surface-container-low transition-all group flex flex-col items-center justify-center gap-2">
          <span className="material-symbols-outlined text-3xl text-on-surface-variant group-hover:text-primary transition-colors">add_circle</span>
          <span className="text-sm font-bold text-on-surface-variant group-hover:text-on-surface transition-colors">Connect New Data Source</span>
        </button>
      </div>
    </div>
  );
}
