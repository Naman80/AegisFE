export default function GeneralSettings() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header className="mb-10">
        <h1 className="text-2xl font-bold text-on-surface mb-2">General Settings</h1>
        <p className="text-on-surface-variant">Manage your organization's general preferences and defaults.</p>
      </header>

      <div className="bg-surface-container-low rounded-xl p-6 border border-surface-container-high">
        <h3 className="font-bold text-on-surface mb-4">Organization Name</h3>
        <input 
          type="text" 
          defaultValue="Aegis Corporation"
          className="w-full bg-surface-container border-none rounded-lg px-4 py-2 text-sm text-on-surface focus:ring-1 focus:ring-primary/30"
        />
      </div>
    </div>
  );
}
