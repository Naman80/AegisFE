import { useState } from "react";
import SettingsLayout from "./settings/SettingsLayout";
import AegisAssistant from "@/components/layout/AegisAssistant";

export default function Settings() {
  const [showAssistant, setShowAssistant] = useState(false);

  return (
    <div className="flex w-full h-full relative">
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* TopNavBar mapped from html */}
        <header className="w-full h-14 bg-surface border-b border-surface-container-high flex justify-between items-center px-6 shrink-0 z-50">
          <div className="flex items-center gap-4">
            <span className="text-on-surface-variant text-sm font-medium">Settings</span>
            <span className="text-surface-container-highest">/</span>
            <span className="text-on-surface text-sm font-semibold">User Dashboard</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
              <input 
                type="text" 
                placeholder="Search settings..." 
                className="bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-1.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:ring-1 focus:ring-primary/30 w-64"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                className={`transition-colors ${showAssistant ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                onClick={() => setShowAssistant(!showAssistant)}
                title="Toggle Assistant"
              >
                <span className="material-symbols-outlined">auto_awesome</span>
              </button>
              <button className="text-on-surface-variant hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button className="text-on-surface-variant hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined">help_outline</span>
              </button>
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                A
              </div>
            </div>
          </div>
        </header>

        <SettingsLayout />
      </div>

      {showAssistant && (
        <div className="w-80 shrink-0 border-l border-surface-container-high bg-surface-container-lowest relative z-40 shadow-[-10px_0_40px_rgba(0,0,0,0.3)]">
          <AegisAssistant />
        </div>
      )}
    </div>
  );
}
