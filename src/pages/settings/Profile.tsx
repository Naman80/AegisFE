export default function Profile() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header className="mb-10">
        <h1 className="text-2xl font-bold text-on-surface mb-2">Personal Profile</h1>
        <p className="text-on-surface-variant">Update your photo and personal details.</p>
      </header>

      <div className="bg-surface-container-low rounded-xl p-6 border border-surface-container-high flex gap-6 items-center">
        <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-2xl">
          N
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1 block">Full Name</label>
            <input 
              type="text" 
              defaultValue="Naman Goel"
              className="w-full max-w-sm bg-surface-container border-none rounded-lg px-4 py-2 text-sm text-on-surface focus:ring-1 focus:ring-primary/30"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
