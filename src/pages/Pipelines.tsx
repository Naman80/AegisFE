import { useState } from "react";
import { Group, Panel } from "react-resizable-panels";

import type { PipelineNode, PipelineEdge } from "@/types";

// Mock Data
const mockNodes: PipelineNode[] = [
  {
    id: "trigger_1",
    type: "trigger",
    position: { x: 200, y: 160 },
    data: { name: "Daily Cron", desc: "00:00 UTC Daily" }
  },
  {
    id: "query_1",
    type: "query",
    position: { x: 520, y: 260 },
    data: { name: "Fetch churn risk", desc: "Source: Main_Warehouse" }
  },
  {
    id: "ai_1",
    type: "ai",
    position: { x: 880, y: 160 },
    data: { name: "Predict sentiment", desc: "Model: GPT-4-T" }
  },
  {
    id: "action_1",
    type: "action",
    position: { x: 880, y: 360 },
    data: { name: "Send Retention", desc: "Target: Marketing_API" }
  }
];

export const mockEdges: PipelineEdge[] = [
  { id: "e1", source: "trigger_1", target: "query_1", type: "smoothstep" },
  { id: "e2", source: "query_1", target: "ai_1", type: "smoothstep" },
  { id: "e3", source: "query_1", target: "action_1", type: "smoothstep" },
];

export default function Pipelines() {
  const [selectedNodeId, setSelectedNodeId] = useState<string>("trigger_1");

  // Get edge path (Naive straight/curved path for mock UI, mimicking typical dagre/reactflow behavior)
  const renderMockEdges = () => {
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <path d="M 380 200 C 450 200, 450 300, 520 300" fill="none" stroke="#414754" strokeWidth="2" strokeDasharray="8" className="animate-[flow_20s_linear_infinite]" />
        <path d="M 720 300 C 800 300, 800 200, 880 200" fill="none" stroke="#414754" strokeWidth="2" strokeDasharray="8" className="animate-[flow_20s_linear_infinite]" />
        <path d="M 720 300 C 800 300, 800 400, 880 400" fill="none" stroke="#414754" strokeWidth="2" strokeDasharray="8" className="animate-[flow_20s_linear_infinite]" />
      </svg>
    );
  };

  return (
    <div className="flex w-full h-[calc(100vh-3.5rem)] relative overflow-hidden bg-background">
      <Group orientation="vertical">
        {/* Top Half: Main Canvas with absolute positioned Nodes */}
        <Panel defaultSize={70} className="relative bg-surface-container-lowest" style={{
          backgroundImage: 'radial-gradient(#2a2a2a 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}>
          
          <header className="absolute top-0 left-0 w-full h-14 bg-surface/50 backdrop-blur-md border-b border-surface-container-high flex justify-between items-center px-6 z-40">
             <div className="flex items-center gap-6">
                <span className="text-primary font-medium text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">folder</span>
                    Workspaces
                </span>
                <span className="text-outline-variant">/</span>
                <span className="text-on-surface font-semibold text-sm">Customer Analysis Flow</span>
             </div>
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 mr-4">
                    <button className="px-4 py-1.5 rounded-lg border border-outline-variant text-on-surface-variant text-sm font-medium hover:bg-surface-container-high transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">play_arrow</span> Run
                    </button>
                    <button className="px-4 py-1.5 rounded-lg bg-primary-container text-on-primary-container text-sm font-bold hover:opacity-90 transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">check_circle</span> Activate
                    </button>
                </div>
             </div>
          </header>

          {/* Node Library Overlay */}
          <div className="absolute top-20 left-6 w-56 bg-surface-container/60 backdrop-blur-xl rounded-xl border border-outline-variant/20 p-4 z-40 shadow-2xl">
            <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4 flex items-center gap-2">
               <span className="material-symbols-outlined text-xs">extension</span> Node Library
            </h3>
            <div className="space-y-3">
              <div className="group cursor-grab p-3 rounded-lg border border-outline-variant/30 bg-surface-container/50 hover:bg-surface-container hover:border-primary/50 transition-all flex items-center gap-3">
                 <span className="w-2 h-2 rounded-full bg-yellow-400"></span><span className="text-xs font-medium">HTTP Trigger</span>
              </div>
              <div className="group cursor-grab p-3 rounded-lg border border-outline-variant/30 bg-surface-container/50 hover:bg-surface-container hover:border-primary/50 transition-all flex items-center gap-3">
                 <span className="w-2 h-2 rounded-full bg-blue-400"></span><span className="text-xs font-medium">SQL Query</span>
              </div>
              <div className="group cursor-grab p-3 rounded-lg border border-outline-variant/30 bg-surface-container/50 hover:bg-surface-container hover:border-primary/50 transition-all flex items-center gap-3">
                 <span className="w-2 h-2 rounded-full bg-purple-400"></span><span className="text-xs font-medium">AI Prompt</span>
              </div>
            </div>
          </div>

          {/* Canvas Elements */}
          {renderMockEdges()}

          {/* Nodes */}
          {mockNodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            let borderColor = "border-outline";
            let colorHex = "text-outline";
            if (node.type === "trigger") { borderColor = "border-yellow-400"; colorHex = "text-yellow-400"; }
            if (node.type === "query") { borderColor = "border-blue-400"; colorHex = "text-blue-400"; }
            if (node.type === "ai") { borderColor = "border-purple-400"; colorHex = "text-purple-400"; }
            if (node.type === "action") { borderColor = "border-green-400"; colorHex = "text-green-400"; }

            return (
              <div 
                key={node.id} 
                className={`absolute z-20 transition-all ${isSelected ? "scale-105 z-30 ring-2 ring-primary bg-surface-container-highest" : "hover:ring-1 hover:ring-primary/40 bg-surface"}`}
                style={{ top: node.position.y, left: node.position.x }}
                onClick={() => setSelectedNodeId(node.id)}
              >
                <div className={`w-[200px] border-l-4 ${borderColor} rounded-lg shadow-xl p-4 flex flex-col gap-2 cursor-pointer`}>
                  <div className="flex justify-between items-start">
                    <span className={`text-[10px] font-bold ${colorHex} uppercase tracking-tighter`}>{node.type}</span>
                    <span className="material-symbols-outlined text-tertiary text-sm">check_circle</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{node.data.name}</span>
                  </div>
                  <div className="text-[10px] text-on-surface-variant mt-1">{node.data.desc}</div>
                </div>
              </div>
            );
          })}

          {/* Right Config Sidebar (Absolute inside the canvas, replacing the traditional panel approach to match design's floating aspect better) */}
          {selectedNodeId === 'query_1' && (
             <div className="absolute top-14 right-0 w-80 h-[calc(100%-3.5rem)] bg-surface/80 backdrop-blur-xl border-l border-outline-variant/20 flex flex-col z-40">
                <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center">
                    <h2 className="font-bold text-on-surface flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-400">table_chart</span> Query Config
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">SQL Query Editor</label>
                        <div className="bg-[#0e0e0e] p-4 rounded-lg font-mono text-xs text-primary leading-relaxed border border-outline-variant/10 h-48">
                            SELECT * <br/> FROM analytics.risk <br/> WHERE score &gt; 0.8
                        </div>
                    </div>
                </div>
             </div>
          )}

        </Panel>


        {/* Bottom Half: Execution Logs */}
        <Panel collapsible defaultSize={30} minSize={"15%"} className="bg-[#131313] flex flex-col z-50">
           <div className="px-6 py-2 border-b border-[#2a2a2a] flex justify-between items-center bg-surface-container-low">
              <div className="flex gap-4">
                  <button className="text-xs font-bold text-primary border-b-2 border-primary pb-1">EXECUTION LOGS</button>
              </div>
              <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-[10px] text-tertiary">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                      Live Monitoring
                  </span>
              </div>
           </div>
           <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] space-y-1.5">
               <div className="flex gap-4 opacity-60">
                   <span className="text-on-surface-variant shrink-0">[10:00:01]</span>
                   <span className="text-tertiary shrink-0">SUCCESS</span>
                   <span className="text-on-surface">Trigger 'Daily Cron' initiated successfully.</span>
               </div>
               <div className="flex gap-4">
                   <span className="text-on-surface-variant shrink-0">[10:00:02]</span>
                   <span className="text-blue-400 shrink-0">QUERY</span>
                   <span className="text-on-surface">Executing 'Fetch churn risk'...</span>
               </div>
               <div className="flex gap-4">
                   <span className="text-on-surface-variant shrink-0">[10:00:06]</span>
                   <span className="text-error shrink-0">ERROR</span>
                   <span className="text-error">AI Block failed: Rate limit exceeded.</span>
               </div>
           </div>
        </Panel>
      </Group>

      {/* Global AI Assistant */}
      {/* <AegisAssistant /> */}

      {/* Adding required pipeline animation frames to global scope quickly */}
      <style>{`
        @keyframes flow {
            from { stroke-dashoffset: 200; }
            to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
