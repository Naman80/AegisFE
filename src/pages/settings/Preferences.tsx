export default function Preferences() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header className="mb-10">
        <h1 className="text-2xl font-bold text-on-surface mb-2">Preferences</h1>
        <p className="text-on-surface-variant">Customize your editor and application appearance.</p>
      </header>

      <div className="bg-surface-container-low rounded-xl p-6 border border-surface-container-high space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-on-surface">Vim Mode</p>
            <p className="text-xs text-on-surface-variant">Enable Vim keybindings in the Query Editor.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-9 h-5 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-container"></div>
          </label>
        </div>
      </div>
    </div>
  );
}
