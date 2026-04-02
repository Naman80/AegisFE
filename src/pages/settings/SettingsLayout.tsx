import { useState } from "react";
import GeneralSettings from "./GeneralSettings";
import DatabaseConnections from "./DatabaseConnections";
import Integrations from "./Integrations";
import Billing from "./Billing";
import ApiKeys from "./ApiKeys";
import Profile from "./Profile";
import Preferences from "./Preferences";

export default function SettingsLayout() {
  const [activeTab, setActiveTab] = useState("db-connections");

  const orgItems = [
    { id: "general", label: "General" },
    { id: "db-connections", label: "Database Connections" },
    { id: "integrations", label: "Integrations" },
    { id: "billing", label: "Billing" },
    { id: "api-keys", label: "API Keys" },
  ];

  const personalItems = [
    { id: "profile", label: "Profile" },
    { id: "preferences", label: "Preferences" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "general": return <GeneralSettings />;
      case "db-connections": return <DatabaseConnections />;
      case "integrations": return <Integrations />;
      case "billing": return <Billing />;
      case "api-keys": return <ApiKeys />;
      case "profile": return <Profile />;
      case "preferences": return <Preferences />;
      default: return <DatabaseConnections />;
    }
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Settings Sub-Navigation */}
      <nav className="w-64 bg-surface border-r border-surface-container-high p-6 space-y-1">
        <h2 className="text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant mb-4 px-3">
          Organization
        </h2>
        {orgItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              activeTab === item.id 
                ? "text-primary font-medium bg-surface-container-high" 
                : "text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <span className="text-sm">{item.label}</span>
          </button>
        ))}

        <div className="pt-8">
          <h2 className="text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant mb-4 px-3">
            Personal
          </h2>
          {personalItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                activeTab === item.id 
                  ? "text-primary font-medium bg-surface-container-high" 
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Scrollable Content */}
      <section className="flex-1 overflow-y-auto p-10 bg-surface">
        {renderContent()}
      </section>
    </div>
  );
}
