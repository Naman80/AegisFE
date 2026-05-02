import { useState, useCallback, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/Button";
import {
  Play, Download, ExternalLink, RefreshCw,
  ChevronRight, ChevronDown, TableProperties, Loader2,
} from "lucide-react";
import * as monaco from "monaco-editor";
import { Group, Panel } from "react-resizable-panels";
import TopNavBar from "@/components/layout/TopNavBar";
import ResultsTable from "@/components/features/QueryEditor/ResultsTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { useDatasource } from "@/contexts/DatasourceContext";
import { listNamespaces } from "@/services/explorer.service";
import { getBulkSchema } from "@/services/schema.service";
import { executeQuery } from "@/services/query.service";
import type { QueryTab } from "@/types";
import type { Field } from "@/types/normalization";

function createTab(name?: string): QueryTab {
  return {
    id: uuidv4(),
    name: name ?? `query_${Math.floor(Math.random() * 9000 + 1000)}.sql`,
    content: "SELECT * FROM users LIMIT 100;",
    isDirty: false,
    executionState: "idle",
  };
}

export default function QueryEditor() {
  const { activeDatasourceId } = useDatasource();
  const [tabs, setTabs] = useState<QueryTab[]>(() => [createTab("main_query.sql")]);
  const [activeTabId, setActiveTabId] = useState(tabs[0].id);
  
  const [namespaces, setNamespaces] = useState<string[]>([]);
  const [selectedNamespace, setSelectedNamespace] = useState("");
  const [bulkSchema, setBulkSchema] = useState<Record<string, Field[]>>({});
  const [expandedTables, setExpandedTables] = useState<string[]>([]);
  const [isLoadingSchema, setIsLoadingSchema] = useState(false);
  
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];

  // Load Namespaces
  useEffect(() => {
    if (activeDatasourceId) {
      listNamespaces(activeDatasourceId).then(data => {
        setNamespaces(data.map(n => n.name));
        if (data.length > 0) setSelectedNamespace(data[0].name);
      });
    }
  }, [activeDatasourceId]);

  // Load Bulk Schema
  useEffect(() => {
    if (activeDatasourceId && selectedNamespace) {
      setIsLoadingSchema(true);
      getBulkSchema(activeDatasourceId, selectedNamespace)
        .then(setBulkSchema)
        .finally(() => setIsLoadingSchema(false));
    }
  }, [activeDatasourceId, selectedNamespace]);

  const updateTab = useCallback((id: string, updates: Partial<QueryTab>) => {
    setTabs((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  const addTab = useCallback(() => {
    const t = createTab();
    setTabs((prev) => [...prev, t]);
    setActiveTabId(t.id);
  }, []);

  const closeTab = useCallback((id: string) => {
    setTabs((prev) => {
      if (prev.length === 1) return prev;
      const idx = prev.findIndex((t) => t.id === id);
      const next = prev.filter((t) => t.id !== id);
      if (id === activeTabId) {
        const newActive = next[Math.min(idx, next.length - 1)];
        setActiveTabId(newActive.id);
      }
      return next;
    });
  }, [activeTabId]);

  const handleEditorChange = useCallback((value: string | undefined) => {
    updateTab(activeTabId, { content: value ?? "", isDirty: true });
  }, [activeTabId, updateTab]);

  const runQuery = useCallback(async () => {
    if (!activeDatasourceId || !selectedNamespace || !activeTab) return;
    
    updateTab(activeTabId, { executionState: "running" });
    const startTime = Date.now();
    
    try {
      const result = await executeQuery(activeDatasourceId, {
        namespace: selectedNamespace,
        query: activeTab.content
      });
      
      updateTab(activeTabId, {
        executionState: "success",
        result: {
          ...result,
          timeMs: Date.now() - startTime
        } as any, // Temporary cast to match legacy QueryTab result type if needed
        lastExecutedAt: new Date().toLocaleTimeString(),
      });
    } catch (error: any) {
      updateTab(activeTabId, {
        executionState: "error",
        errorMessage: error.message || "Query failed"
      });
    }
  }, [activeTabId, activeDatasourceId, selectedNamespace, activeTab, updateTab]);

  const handleEditorMount = useCallback((editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      runQuery();
    });
  }, [runQuery]);

  const toggleTable = (tableName: string) => {
    setExpandedTables((prev) =>
      prev.includes(tableName) ? prev.filter((t) => t !== tableName) : [...prev, tableName]
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background font-body">
      <TopNavBar />
      <Group orientation="horizontal" className="flex-1 w-full">
        {/* Left Pane: Schema Explorer */}
        <Panel collapsible defaultSize={20} minSize={"15%"} maxSize={"30%"} className="border-r border-surface-container-high bg-surface-container-lowest">
          <div className="p-4 space-y-4">
             <div className="space-y-1">
                <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] px-1">
                  Namespace
                </span>
                <Select
                  value={selectedNamespace}
                  onValueChange={setSelectedNamespace}
                >
                  <SelectTrigger className="h-9 rounded-xl bg-surface-container-low text-xs">
                    <SelectValue placeholder="Namespace" />
                  </SelectTrigger>
                  <SelectContent>
                    {namespaces.map((ns) => (
                      <SelectItem key={ns} value={ns}>
                        {ns}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto px-2 pb-4">
            <div className="flex items-center justify-between px-3 mb-4">
              <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">
                Entities
              </span>
              <RefreshCw 
                className={`w-3 h-3 text-outline cursor-pointer hover:text-primary transition-all ${isLoadingSchema ? 'animate-spin' : ''}`} 
                onClick={() => activeDatasourceId && selectedNamespace && getBulkSchema(activeDatasourceId, selectedNamespace).then(setBulkSchema)}
              />
            </div>

            <div className="space-y-1">
              {Object.entries(bulkSchema).map(([tableName, fields]) => {
                const isExpanded = expandedTables.includes(tableName);
                return (
                  <div key={tableName} className="group">
                    <div
                      className={`flex items-center gap-2 px-3 py-2 hover:bg-surface-container rounded-xl transition-all cursor-pointer ${isExpanded ? 'bg-surface-container text-primary' : 'text-on-surface-variant'}`}
                      onClick={() => toggleTable(tableName)}
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-3 h-3" />
                      ) : (
                        <ChevronRight className="w-3 h-3" />
                      )}
                      <TableProperties className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-bold truncate">
                        {tableName}
                      </span>
                    </div>

                    {isExpanded && (
                      <div className="pl-8 pr-2 py-1.5 space-y-1 border-l-2 border-primary/20 ml-4.5 mt-1">
                        {fields.map((field) => (
                          <div
                            key={field.name}
                            className="flex items-center justify-between py-1 group/col cursor-default"
                          >
                            <div className="flex items-center gap-2 text-on-surface-variant/80">
                              <span className={field.isPrimaryKey ? "material-symbols-outlined text-[12px] text-primary" : "material-symbols-outlined text-[12px] opacity-40"}>
                                {field.isPrimaryKey ? "key" : "view_column"}
                              </span>
                              <span className="text-[11px] font-medium">{field.name}</span>
                            </div>
                            <span className="text-[9px] font-black uppercase text-outline/50 font-mono">
                              {field.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Panel>

        {/* Middle/Main Pane: Editor & Results */}
        <Panel defaultSize={80}>
          <Group orientation="vertical">
            {/* Top Half: Editor */}
            <Panel defaultSize={60} className="flex flex-col bg-surface overflow-hidden">
              {/* Tabs */}
              <div className="flex h-11 border-b border-surface-container-high bg-surface-container-lowest text-[11px] font-bold overflow-x-auto shrink-0 select-none items-center px-2 gap-1">
                {tabs.map((tab) => (
                  <div
                    key={tab.id}
                    className={`flex items-center gap-2 px-4 h-8 cursor-pointer rounded-lg group/tab min-w-0 transition-all ${
                      tab.id === activeTabId
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                    }`}
                    onClick={() => setActiveTabId(tab.id)}
                  >
                    <span className="material-symbols-outlined text-sm">code</span>
                    <span className="truncate max-w-[120px]">{tab.name}</span>
                    {tab.isDirty && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 shadow-glow" />
                    )}
                    <span
                      className="w-4 h-4 ml-1 items-center justify-center flex rounded-full hover:bg-primary/20 transition-all opacity-0 group-hover/tab:opacity-100 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        closeTab(tab.id);
                      }}
                    >
                      &times;
                    </span>
                  </div>
                ))}
                <button
                  className="w-8 h-8 flex items-center justify-center text-outline hover:text-primary hover:bg-primary/5 rounded-full transition-all shrink-0"
                  onClick={addTab}
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>

              {/* Monaco Editor */}
              <div className="flex-1 relative bg-surface">
                <Editor
                  height="100%"
                  defaultLanguage="sql"
                  theme="vs-dark"
                  value={activeTab?.content ?? ""}
                  onChange={handleEditorChange}
                  onMount={handleEditorMount}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    lineNumbers: "on",
                    renderLineHighlight: "all",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 20, bottom: 20 },
                    wordWrap: "on",
                    tabSize: 2,
                    bracketPairColorization: { enabled: true },
                    smoothScrolling: true,
                    cursorBlinking: "expand",
                    cursorSmoothCaretAnimation: "on",
                    formatOnPaste: true,
                    formatOnType: true,
                  }}
                />

                {/* Floating Run Button */}
                <div className="absolute bottom-8 right-8 z-20">
                  <Button
                    variant="primary"
                    className="shadow-[0_8px_24px_rgba(0,0,0,0.5)] font-black gap-2 px-6 py-6 rounded-2xl active:scale-95 transition-all border-none"
                    onClick={runQuery}
                    disabled={activeTab?.executionState === "running" || !activeDatasourceId}
                  >
                    {activeTab?.executionState === "running" ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Play className="w-5 h-5 fill-current" />
                    )}
                    {activeTab?.executionState === "running" ? "EXECUTING..." : "RUN QUERY"}
                  </Button>
                </div>
              </div>
            </Panel>

            {/* Bottom Half: Results */}
            <Panel
              collapsible
              defaultSize={40}
              minSize={"15%"}
              maxSize={"70%"}
              className="flex flex-col bg-surface-container-lowest z-10"
            >
              <div className="h-12 border-y border-surface-container-high bg-surface-container-lowest flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-primary">analytics</span>
                    <span className="text-[10px] font-black text-on-surface uppercase tracking-[0.2em]">Results</span>
                  </div>
                  
                  {activeTab?.result && (
                    <div className="flex items-center gap-3">
                       <span className="w-px h-3 bg-outline/20" />
                       <span className="text-[10px] text-on-surface-variant font-bold font-mono bg-surface-container px-2 py-0.5 rounded">
                        {activeTab.result.rows.length} ROWS • {activeTab.result.timeMs}ms
                      </span>
                    </div>
                  )}
                  {activeTab?.executionState === "running" && (
                    <span className="text-[10px] text-primary font-bold animate-pulse tracking-widest">
                       EXECUTING...
                    </span>
                  )}
                </div>
                
                {activeTab?.result && (
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-outline hover:text-primary rounded-xl">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-outline hover:text-primary rounded-xl">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="flex-1 overflow-hidden relative">
                {activeTab?.executionState === "error" ? (
                   <div className="p-8 flex flex-col items-center justify-center gap-4 text-error bg-error/5 h-full">
                      <span className="material-symbols-outlined text-4xl">error</span>
                      <div className="text-center">
                        <div className="text-sm font-black uppercase tracking-widest mb-1">Execution Failed</div>
                        <div className="text-xs font-mono opacity-80 max-w-lg">{activeTab.errorMessage}</div>
                      </div>
                   </div>
                ) : activeTab?.result ? (
                  <ResultsTable result={activeTab.result as any} />
                ) : activeTab?.executionState === "running" ? (
                  <div className="flex flex-col items-center justify-center h-full text-primary gap-4 bg-surface-container-lowest/50">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="text-xs font-black uppercase tracking-[0.3em]">Processing Dataset</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-outline/30 gap-4">
                    <span className="material-symbols-outlined text-6xl">database_search</span>
                    <span className="text-xs font-black uppercase tracking-[0.2em]">Ready for execution</span>
                  </div>
                )}
              </div>
            </Panel>
          </Group>
        </Panel>
      </Group>
    </div>
  );
}
