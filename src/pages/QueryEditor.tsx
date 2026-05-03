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
import { useNamespaces } from "@/hooks/queries/useExplorerQueries";
import { useAllEntitySchema } from "@/hooks/queries/useEntityQueries";
import { useExecuteQuery } from "@/hooks/queries/useQueryQueries";
import type { QueryTab } from "@/types";
import type { Namespace, QueryResult } from "@/types/normalization";

// --- Helpers ---

function createTab(name?: string): QueryTab {
  return {
    id: uuidv4(),
    name: name ?? `query_${Math.floor(Math.random() * 9000 + 1000)}.sql`,
    content: "SELECT * FROM users LIMIT 100;",
    isDirty: false,
    executionState: "idle",
  };
}

// --- Sub-components ---

function SchemaExplorer({
  datasourceId,
  namespaces,
  selectedNamespace,
  onNamespaceChange,
  isLoadingNamespaces,
}: {
  datasourceId: string | null;
  namespaces: Namespace[];
  selectedNamespace: string;
  onNamespaceChange: (ns: string) => void;
  isLoadingNamespaces: boolean;
}) {
  const { data: allEntitySchemas = {}, isLoading: isLoadingSchema, refetch: refetchSchema } = useAllEntitySchema(datasourceId, selectedNamespace);

  const [expandedTables, setExpandedTables] = useState<string[]>([]);

  const toggleTable = (tableName: string) => {
    setExpandedTables((prev) =>
      prev.includes(tableName) ? prev.filter((t) => t !== tableName) : [...prev, tableName]
    );
  };

  return (
    <Panel collapsible defaultSize={20} minSize={"15%"} maxSize={"30%"} className="border-r border-surface-container-high bg-surface-container-lowest flex flex-col h-full overflow-hidden">
      <div className="p-4 space-y-4 shrink-0">
        <div className="space-y-1">
          <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] px-1">
            Namespace
          </span>
          <Select
            value={selectedNamespace}
            onValueChange={onNamespaceChange}
            disabled={isLoadingNamespaces}
          >
            <SelectTrigger className="h-9 rounded-xl bg-surface-container-low text-xs">
              <SelectValue placeholder="Loading.." />
            </SelectTrigger>
            <SelectContent>
              {namespaces.map((ns) => (
                <SelectItem key={ns.name} value={ns.name}>
                  {ns.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4">
        <div className="flex items-center justify-between px-3 mb-4 sticky top-0 bg-surface-container-lowest z-10 py-2">
          <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">
            Entities
          </span>
          <RefreshCw
            className={`w-3 h-3 text-outline cursor-pointer hover:text-primary transition-all ${isLoadingSchema ? 'animate-spin' : ''}`}
            onClick={() => refetchSchema()}
          />
        </div>

        <div className="space-y-1">
          {isLoadingSchema ? (
            <div className="px-3 space-y-3">
              {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-8 bg-surface-container rounded-lg animate-pulse" />)}
            </div>
          ) : Object.keys(allEntitySchemas).length === 0 ? (
            <div className="px-3 text-[11px] text-outline italic">No entities found.</div>
          ) : Object.entries(allEntitySchemas).map(([tableName, data]) => {
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
                    {data.fields.map((field) => (
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
  );
}

function TabHeader({
  tabs,
  activeTabId,
  onTabSelect,
  onTabClose,
  onTabAdd
}: {
  tabs: QueryTab[];
  activeTabId: string;
  onTabSelect: (id: string) => void;
  onTabClose: (id: string) => void;
  onTabAdd: () => void;
}) {
  return (
    <div className="flex h-11 border-b border-surface-container-high bg-surface-container-lowest text-[11px] font-bold overflow-x-auto shrink-0 select-none items-center px-2 gap-1">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`flex items-center gap-2 px-4 h-8 cursor-pointer rounded-lg group/tab min-w-0 transition-all ${tab.id === activeTabId
            ? "bg-primary/10 text-primary shadow-sm"
            : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
            }`}
          onClick={() => onTabSelect(tab.id)}
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
              onTabClose(tab.id);
            }}
          >
            &times;
          </span>
        </div>
      ))}
      <button
        className="w-8 h-8 flex items-center justify-center text-outline hover:text-primary hover:bg-primary/5 rounded-full transition-all shrink-0"
        onClick={onTabAdd}
      >
        <span className="material-symbols-outlined text-sm">add</span>
      </button>
    </div>
  );
}

function SqlEditor({
  content,
  executionState,
  onContentChange,
  onEditorMount,
  onRun,
  disabled
}: {
  content: string;
  executionState: string;
  onContentChange: (val: string | undefined) => void;
  onEditorMount: (editor: monaco.editor.IStandaloneCodeEditor) => void;
  onRun: () => void;
  disabled: boolean;
}) {
  return (
    <div className="flex-1 relative bg-surface">
      <Editor
        height="100%"
        defaultLanguage="sql"
        theme="vs-dark"
        value={content}
        onChange={onContentChange}
        onMount={onEditorMount}
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

      <div className="absolute bottom-8 right-8 z-20">
        <Button
          variant="primary"
          className="shadow-[0_8px_24px_rgba(0,0,0,0.5)] font-black gap-2 px-6 py-6 rounded-2xl active:scale-95 transition-all border-none"
          onClick={onRun}
          disabled={executionState === "running" || disabled}
        >
          {executionState === "running" ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Play className="w-5 h-5 fill-current" />
          )}
          {executionState === "running" ? "EXECUTING..." : "RUN QUERY"}
        </Button>
      </div>
    </div>
  );
}

function ResultsPanel({
  activeTab
}: {
  activeTab: QueryTab;
}) {
  return (
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
          <ResultsTable result={activeTab.result} />
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
  );
}

// --- Main Component ---

export default function QueryEditor() {
  const { activeDatasourceId } = useDatasource();

  // Tab State
  const [tabs, setTabs] = useState<QueryTab[]>(() => [createTab("main_query.sql")]);
  const [activeTabId, setActiveTabId] = useState(tabs[0].id);
  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];

  // Queries
  const {
    data: namespaces = [],
    isLoading: isLoadingNamespaces
  } = useNamespaces(activeDatasourceId);

  const [selectedNamespace, setSelectedNamespace] = useState(namespaces?.[0]?.name);

  // Mutations
  const executeMutation = useExecuteQuery();

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

  const runQuery = useCallback(async () => {
    if (!activeDatasourceId || !selectedNamespace || !activeTab) return;

    updateTab(activeTabId, { executionState: "running" });
    const startTime = Date.now();

    executeMutation.mutate({
      datasourceId: activeDatasourceId,
      input: {
        namespace: selectedNamespace,
        query: activeTab.content
      }
    }, {
      onSuccess: (result: QueryResult) => {
        updateTab(activeTabId, {
          executionState: "success",
          result: {
            ...result,
            timeMs: Date.now() - startTime
          },
          lastExecutedAt: new Date().toLocaleTimeString(),
        });
      },
      onError: (error: any) => {
        updateTab(activeTabId, {
          executionState: "error",
          errorMessage: error.message || "Query failed"
        });
      }
    });
  }, [activeTabId, activeDatasourceId, selectedNamespace, activeTab, updateTab, executeMutation]);

  // Auto-selection Logic
  useEffect(() => {
    if (namespaces.length > 0 && !selectedNamespace) {
      setSelectedNamespace(namespaces[0].name);
    }
  }, [namespaces, selectedNamespace]);

  // Reset selection on datasource change
  useEffect(() => {
    setSelectedNamespace("");
  }, [activeDatasourceId]);

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorMount = useCallback((editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      runQuery();
    });
  }, [runQuery]);

  return (
    <div className="flex-1 flex flex-col h-full bg-background font-body">
      <TopNavBar />
      <Group orientation="horizontal" className="flex-1 w-full">
        <SchemaExplorer
          datasourceId={activeDatasourceId}
          namespaces={namespaces}
          selectedNamespace={selectedNamespace}
          onNamespaceChange={setSelectedNamespace}
          isLoadingNamespaces={isLoadingNamespaces}
        />

        <Panel defaultSize={80}>
          <Group orientation="vertical">
            <Panel defaultSize={60} className="flex flex-col bg-surface overflow-hidden">
              <TabHeader
                tabs={tabs}
                activeTabId={activeTabId}
                onTabSelect={setActiveTabId}
                onTabClose={closeTab}
                onTabAdd={addTab}
              />

              <SqlEditor
                content={activeTab?.content ?? ""}
                executionState={activeTab?.executionState}
                onContentChange={(val) => updateTab(activeTabId, { content: val ?? "", isDirty: true })}
                onEditorMount={handleEditorMount}
                onRun={runQuery}
                disabled={!activeDatasourceId}
              />
            </Panel>

            <ResultsPanel activeTab={activeTab} />
          </Group>
        </Panel>
      </Group>
    </div>
  );
}
