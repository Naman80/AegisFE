export default function AegisAssistant() {
  return (
    <aside className="hidden xl:flex fixed right-0 top-14 h-[calc(100vh-3.5rem)] w-80 bg-surface-container-lowest border-l border-surface-container-high flex-col custom-glass z-40">
      <div className="p-6 border-b border-outline-variant/10 shrink-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-md font-bold text-tertiary uppercase tracking-widest font-headline">
            Aegis Assistant
          </h3>
          <span className="material-symbols-outlined text-tertiary text-sm">
            bolt
          </span>
        </div>
        <p className="text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider">
          Contextual AI
        </p>
      </div>
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="bg-surface-container p-4 rounded-lg border border-outline-variant/10">
          <p className="text-xs text-on-surface-variant leading-relaxed">
            "I noticed the{" "}
            <span className="text-primary">user_analytics_v2</span> table has
            grown by 20% today. Would you like me to optimize the partitioning
            schema?"
          </p>
          <div className="mt-3 flex gap-2">
            <button className="px-3 py-1.5 bg-tertiary/20 text-tertiary text-[10px] font-bold rounded-md hover:bg-tertiary/30 transition-colors uppercase">
              Optimize Now
            </button>
            <button className="px-3 py-1.5 bg-surface-container-high text-on-surface-variant text-[10px] font-bold rounded-md uppercase">
              Dismiss
            </button>
          </div>
        </div>
        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-outline uppercase tracking-[0.2em]">
            Suggested Insights
          </h4>
          <div className="p-3 bg-surface-container/40 rounded-lg border-l-2 border-primary hover:bg-surface-container transition-colors cursor-pointer group">
            <p className="text-xs text-on-surface font-medium group-hover:text-primary transition-colors">
              Slow Query Detected
            </p>
            <p className="text-[10px] text-on-surface-variant mt-1">
              Order history aggregation taking &gt; 1200ms
            </p>
          </div>
          <div className="p-3 bg-surface-container/40 rounded-lg border-l-2 border-tertiary hover:bg-surface-container transition-colors cursor-pointer group">
            <p className="text-xs text-on-surface font-medium group-hover:text-tertiary transition-colors">
              New Pipeline Insight
            </p>
            <p className="text-[10px] text-on-surface-variant mt-1">
              ETL throughput increased by 15%
            </p>
          </div>
        </div>
      </div>
      <div className="p-6 border-t border-outline-variant/10 shrink-0">
        <div className="relative">
          <input
            className="w-full bg-surface-container-high border-none rounded-lg text-xs py-3 pl-4 pr-10 focus:outline-none focus:ring-1 focus:ring-tertiary/30 transition-all text-on-surface"
            placeholder="Ask Aegis..."
            type="text"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary">
            <span className="material-symbols-outlined text-sm">send</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
