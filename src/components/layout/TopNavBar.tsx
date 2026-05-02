import { DatasourceSelector } from "../features/Datasource/DatasourceSelector";

export default function TopNavBar() {
  return (
    <header className="w-full h-14 shrink-0 border-b border-surface-container-high bg-background flex justify-between items-center px-6 sticky top-0 z-50 font-body antialiased">
      <div className="flex items-center gap-4">
        <div className="text-on-surface-variant text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-base">folder</span>
          <span className="font-medium text-primary">Workspaces</span>
          <span className="text-outline">/</span>
          <DatasourceSelector />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative">
          <input
            className="bg-surface-container-low border-none text-xs rounded-lg pl-9 pr-4 py-1.5 w-64 focus:ring-1 focus:outline-none focus:ring-primary/30 transition-all text-on-surface-variant"
            placeholder="Search resources..."
            type="text"
          />
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-outline">
            search
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
          <div className="h-8 w-8 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden border border-outline-variant cursor-pointer">
            <img
              className="h-full w-full object-cover"
              alt="Avatar"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqsSwjZKRozrQhzxVNX1TCcXuLosZghAxVhCR2kHnUgl_77Y2k90xhLsnaTh1Uj3cniKfyKY__X7P51u5_37b4SEMIhF5bF0qnZE-1aibDNn_3F-0yV1ctn4tfvC0yuky8lgbo3d_WehfQ-VAuQISpPKnBFVukqzCNr81dwkWjyn_kZxNCayPpoC_ttVoHG8TDGWObUcQPHV3HLY0NR8gi7KFWHcd0NwWpOdsGZtipfA6IT1b_9pqiTQ_83x_t4cfUSo89Q-bQ_A"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
