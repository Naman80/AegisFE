export default function ApiKeys() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header className="mb-10 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-on-surface mb-2">API Keys</h1>
          <p className="text-on-surface-variant">Manage programatic access to your Aegis instances.</p>
        </div>
        <button className="px-4 py-2 bg-primary-container text-on-primary-container text-xs font-bold rounded-lg hover:brightness-110 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span>
          Generate New Key
        </button>
      </header>

      <div className="bg-surface-container-low rounded-xl p-6 border border-surface-container-high flex justify-between items-center opacity-70">
        <div>
          <h3 className="font-bold text-on-surface text-sm">Production CI/CD</h3>
          <p className="text-xs text-on-surface-variant font-mono mt-1">aegis_live_x89...4nf</p>
        </div>
        <span className="text-xs text-on-surface-variant">Used 2 hours ago</span>
      </div>
    </div>
  );
}
