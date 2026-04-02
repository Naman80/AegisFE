export default function Billing() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header className="mb-10">
        <h1 className="text-2xl font-bold text-on-surface mb-2">Billing & Limits</h1>
        <p className="text-on-surface-variant">Manage your subscription and compute resources.</p>
      </header>

      <div className="bg-surface-container-low rounded-xl p-6 border border-surface-container-high">
        <h3 className="text-sm font-bold text-on-surface mb-2">Current Plan: Enterprise</h3>
        <p className="text-xs text-on-surface-variant mb-6">Unlimited queries, advanced AI capabilities.</p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-on-surface-variant">Compute Hours (This month)</span>
            <span className="text-primary">145 / ∞</span>
          </div>
          <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
            <div className="h-full bg-primary w-1/4"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
