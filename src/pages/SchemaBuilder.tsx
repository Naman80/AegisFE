
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Plus, MoreVertical, Settings, Database,
  ZoomIn, ZoomOut, Maximize,
  Sparkles, X, PlusCircle
} from "lucide-react";
import { Group, Panel, useDefaultLayout } from "react-resizable-panels";

export default function SchemaBuilder() {

  const [showLeftPanel, setShowLeftPanel] = useState(true);

  const { defaultLayout, onLayoutChanged } = useDefaultLayout({
    id: "unique-layout-id",
    panelIds: showLeftPanel ? ["left", "right"] : ["right"],
  });
  // Mock Schema Output for Canvas
  // const tables = [
  //   { name: "users", type: "Table Object", top: 180, left: 200, color: "border-t-primary" },
  //   { name: "organizations", type: "Table Object", top: 180, left: 580, color: "border-t-tertiary" },
  //   { name: "subscriptions", type: "Table Object", top: 180, left: 950, color: "border-t-outline" },
  //   { name: "invoices", type: "Table Object", top: 420, left: 950, color: "border-t-error" },
  // ];

  return (
    <div className="flex w-full h-full relative">
      <Group orientation="horizontal"  defaultLayout={defaultLayout} onLayoutChanged={onLayoutChanged}>
        {/* Left Pane: Tables List */}
        <Panel collapsible defaultSize={20} minSize={"20%"} maxSize={"25%"} className="bg-surface-container-lowest flex flex-col border-r border-surface-container-high z-10 shrink-0">
          <div className="p-4 shrink-0">
            <Button variant="primary" className="w-full gap-2 font-bold text-[13px] h-10 shadow-sm transition-all hover:scale-[1.02]">
              <Plus className="w-4 h-4" />
              New Table
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto px-2 space-y-1">
            <div className="px-2 py-2 text-[10px] font-bold text-outline uppercase tracking-widest mt-2">Database Tables</div>

            {/* Active Table Item */}
            <div className="flex items-center justify-between px-3 py-2.5 bg-surface border-r-2 border-primary text-primary rounded-sm group cursor-pointer shadow-sm">
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4" />
                <span className="text-sm font-medium">users</span>
              </div>
              <MoreVertical className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Inactive Table Items */}
            {["organizations", "subscriptions", "invoices", "billing_cycles"].map(t => (
              <div key={t} className="flex items-center justify-between px-3 py-2.5 text-on-surface-variant hover:bg-surface-container hover:text-on-surface rounded-sm group cursor-pointer transition-all">
                <div className="flex items-center gap-3">
                  <Database className="w-4 h-4" />
                  <span className="text-sm font-medium">{t}</span>
                </div>
                <MoreVertical className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </Panel>



        {/* Middle Pane: Canvas Area */}
        <Panel defaultSize={60} className="relative flex flex-col bg-surface-container-lowest overflow-hidden">
          {/* Grid Background via inline Style (since custom utility isn't generated here) */}
          <div
            className="absolute inset-0 z-0 pointer-events-none opacity-50"
            style={{ backgroundImage: 'radial-gradient(var(--surface-container-high) 1px, transparent 1px)', backgroundSize: '32px 32px' }}
          />

          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 pointer-events-none w-full h-full z-0">
            <path d="M 464 240 L 580 240" stroke="#adc6ff" strokeWidth="2" fill="none" style={{ filter: 'drop-shadow(0 0 4px rgba(0,113,238,0.5))' }} />
            <circle cx="464" cy="240" r="3" fill="#adc6ff" />
            <path d="M 575 235 L 585 240 L 575 245 Z" fill="#adc6ff" />

            <path d="M 820 240 L 950 240" stroke="#414754" strokeWidth="1.5" fill="none" />
            <path d="M 1070 330 L 1070 420" stroke="#414754" strokeWidth="1.5" fill="none" />
          </svg>

          {/* Canvas Interactive Space */}
          <div className="absolute inset-0 p-12 overflow-auto z-10 w-[2000px] h-[2000px]">

            {/* Table: Users */}
            <div className="absolute top-[180px] left-[200px] w-64 bg-surface rounded-xl border-t-2 border-t-primary shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden">
              <div className="bg-surface-container-high px-4 py-3 flex items-center justify-between border-b border-surface-container/50">
                <span className="font-bold text-on-surface text-sm tracking-wide">users</span>
                <Settings className="w-3.5 h-3.5 text-outline cursor-pointer hover:text-primary transition-colors" />
              </div>
              <div className="text-sm">
                <div className="flex justify-between items-center px-4 py-2 hover:bg-surface-container transition-colors group">
                  <span className="flex items-center gap-2"><Badge variant="default" className="py-0.5 px-1 rounded-[4px] text-[9px]">PK</Badge> <span className="font-mono text-xs text-on-surface">id</span></span>
                  <span className="text-outline-variant font-mono text-xs group-hover:text-primary">uuid</span>
                </div>
                <div className="flex justify-between items-center px-4 py-2 hover:bg-surface-container transition-colors group">
                  <span className="flex items-center gap-2"><Badge variant="outline" className="py-0.5 px-1 rounded-[4px] text-[9px] border-outline text-outline">UN</Badge> <span className="font-mono text-xs text-on-surface-variant">email</span></span>
                  <span className="text-outline-variant font-mono text-xs">varchar</span>
                </div>
                <div className="flex justify-between items-center px-4 py-2 bg-surface-container-low border-l-[3px] border-primary group">
                  <span className="flex items-center gap-2 -ml-[3px] pl-2"><Badge variant="outline" className="py-0.5 px-1 rounded-[4px] text-[9px] text-tertiary bg-tertiary/10 border-tertiary/20">FK</Badge> <span className="font-mono text-xs text-on-surface">org_id</span></span>
                  <span className="text-outline-variant font-mono text-xs">uuid</span>
                </div>
              </div>
            </div>

            {/* Table: Organizations */}
            <div className="absolute top-[180px] left-[580px] w-60 bg-surface rounded-xl border-t-2 border-t-tertiary shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden">
              <div className="bg-surface-container-high px-4 py-3 flex items-center justify-between border-b border-surface-container/50">
                <span className="font-bold text-on-surface text-sm tracking-wide">organizations</span>
                <Settings className="w-3.5 h-3.5 text-outline cursor-pointer hover:text-tertiary transition-colors" />
              </div>
              <div className="text-sm">
                <div className="flex justify-between items-center px-4 py-2 hover:bg-surface-container transition-colors group">
                  <span className="flex items-center gap-2"><Badge variant="default" className="py-0.5 px-1 rounded-[4px] text-[9px] bg-tertiary/20 text-tertiary">PK</Badge> <span className="font-mono text-xs text-on-surface">id</span></span>
                  <span className="text-outline-variant font-mono text-xs">uuid</span>
                </div>
                <div className="flex justify-between items-center px-4 py-2 hover:bg-surface-container transition-colors">
                  <span className="text-on-surface-variant font-mono text-xs pl-7">name</span>
                  <span className="text-outline-variant font-mono text-xs">varchar</span>
                </div>
              </div>
            </div>

            {/* Floating Zoom Controls */}
            <div className="fixed bottom-6 right-[22rem] flex flex-col gap-2 z-50">
              <div className="bg-surface-container-high/80 backdrop-blur border border-outline-variant/30 p-1 rounded-lg flex flex-col shadow-xl">
                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-md hover:bg-surface-container-highest">
                  <ZoomIn className="w-4 h-4 text-on-surface" />
                </Button>
                <div className="w-full h-px bg-outline-variant/20 my-0.5" />
                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-md hover:bg-surface-container-highest">
                  <ZoomOut className="w-4 h-4 text-on-surface" />
                </Button>
              </div>
              <Button variant="ghost" size="icon" className="w-11 h-11 rounded-lg bg-surface-container-high/80 flex items-center justify-center border border-outline-variant/30 backdrop-blur shadow-xl hover:bg-surface-container-highest">
                <Maximize className="w-4 h-4 text-on-surface" />
              </Button>
            </div>

            {/* Floating Prompt Bar */}
            <div className="fixed bottom-8 left-1/2 -translate-x-[60%] w-[500px] z-50">
              <div className="bg-surface-container-highest/80 backdrop-blur-xl border border-primary/30 p-3 flex rounded-xl items-center gap-3 shadow-[0_8px_32px_rgba(0,113,238,0.15)] focus-within:border-primary/60 focus-within:shadow-[0_8px_32px_rgba(0,113,238,0.3)] transition-all">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <input
                  type="text"
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium text-on-surface placeholder:text-outline-variant outline-none"
                  placeholder="Ask AI to generate tables..."
                  defaultValue="Create SaaS schema with users, teams, billing"
                />
                <Button variant="primary" className="h-[34px] px-4 font-bold tracking-wide shadow-md flex gap-2">
                  Generate
                  <Sparkles className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

          </div>
        </Panel>


        {showLeftPanel && (
        // Right Pane: Properties Panel 
        <Panel collapsible defaultSize={20} minSize={"20%"} maxSize={"35%"} className="bg-surface flex flex-col z-10 shrink-0 shadow-[-10px_0_40px_rgba(0,0,0,0.3)]">
          <div className="p-5 border-b border-surface-container-high shrink-0">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">Properties</span>
              <X className="w-4 h-4 text-outline cursor-pointer hover:text-on-surface transition-colors" onClick={() => setShowLeftPanel(false)} />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-on-surface font-bold">users</h2>
                <p className="text-outline text-xs">Table Object</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            <div className="space-y-3">
              <div className="text-[10px] font-bold text-outline uppercase tracking-widest">Configuration</div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-outline-variant mb-1.5 pl-1">Table Name</label>
                  <input className="w-full bg-surface-container-low border-transparent rounded-lg text-sm text-on-surface font-mono py-2.5 px-3 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-sm" type="text" defaultValue="users" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-outline-variant mb-1.5 pl-1">Description</label>
                  <textarea className="w-full bg-surface-container-low border-transparent rounded-lg text-sm text-on-surface-variant py-2.5 px-3 h-20 resize-none focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-sm" defaultValue="Stores primary user account details and authentication state." />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-bold text-outline uppercase tracking-widest">Columns <span className="opacity-70">(3)</span></div>
                <Button variant="ghost" size="icon" className="w-6 h-6 rounded-full hover:bg-surface-container hover:text-primary p-0">
                  <PlusCircle className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex flex-col p-3 bg-surface-container-high rounded-xl border border-primary/30 shadow-sm relative overflow-hidden group cursor-pointer hover:border-primary/50 transition-colors">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[13px] font-bold text-on-surface font-mono">id</span>
                    <span className="text-[11px] text-outline-variant font-mono">uuid</span>
                  </div>
                  <span className="text-[9px] text-primary uppercase font-bold tracking-wider">Primary Key</span>
                </div>

                <div className="flex flex-col p-3 bg-surface-container rounded-xl border border-transparent hover:border-outline-variant transition-colors group cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[13px] font-bold text-on-surface font-mono">email</span>
                    <span className="text-[11px] text-outline-variant font-mono">varchar</span>
                  </div>
                  <span className="text-[9px] text-outline uppercase font-bold tracking-wider">Unique</span>
                </div>

                <div className="flex flex-col p-3 bg-surface-container rounded-xl border border-transparent hover:border-outline-variant transition-colors group cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[13px] font-bold text-on-surface font-mono">org_id</span>
                    <span className="text-[11px] text-outline-variant font-mono">uuid</span>
                  </div>
                  <span className="text-[9px] text-tertiary uppercase font-bold tracking-wider">Foreign Key</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-surface-container-high bg-surface-container-lowest shrink-0 flex gap-3">
            <Button variant="outline" className="flex-1 bg-surface hover:bg-surface-container-high font-bold">Discard</Button>
            <Button variant="primary" className="flex-1 shadow-lg shadow-primary/20 font-bold">Save</Button>
          </div>
        </Panel>
        )}

      </Group>


      {/* TODO: Add AI Insights */}
      {/* Sub-pane overlay inside Schema Builder for explicit Insights */}
      {/* <div className="fixed right-[22rem] bottom-10 w-72 bg-surface-container-lowest/90 backdrop-blur-xl border border-tertiary/30 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden opacity-0 translate-y-4 animate-in slide-in-from-bottom flex z-[60]">
        <div className="p-3 border-b border-surface-container flex items-center justify-between bg-surface-container-lowest">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-tertiary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">AI Insights</span>
          </div>
          <X className="w-3.5 h-3.5 text-outline cursor-pointer" />
        </div>
        <div className="p-4 space-y-3">
          <div className="bg-surface-container-low p-3 border-l-2 border-tertiary rounded-lg text-xs text-on-surface-variant leading-relaxed">
            <span className="text-tertiary font-bold mb-1 block">Optimization</span>
            Adding an index on <code className="bg-surface px-1 py-0.5 rounded text-primary font-mono text-[11px]">users.org_id</code> will improve join performance.
          </div>
        </div>
      </div> */}
    </div>
  );
}
