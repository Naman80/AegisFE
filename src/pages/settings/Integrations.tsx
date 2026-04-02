export default function Integrations() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header className="mb-10">
        <h1 className="text-2xl font-bold text-on-surface mb-2">Integrations</h1>
        <p className="text-on-surface-variant">Connect Aegis Studio with third-party tools.</p>
      </header>

      <div className="bg-surface-container-low rounded-xl p-6 border border-surface-container-high flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-surface-container-high rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">webhook</span>
          </div>
          <div>
            <h3 className="font-bold text-on-surface text-sm">Slack Alerts</h3>
            <p className="text-xs text-on-surface-variant">Send query alerts directly to Slack channels.</p>
          </div>
        </div>
        <button className="px-4 py-2 border border-outline-variant/30 text-on-surface-variant text-xs font-bold rounded-lg hover:bg-surface-container-high transition-all">
          Connect
        </button>
      </div>
    </div>
  );
}
