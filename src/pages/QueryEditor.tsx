import { useState, useCallback, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/Button";
import {
  Play, Download, ExternalLink, ListFilter, Database, RefreshCw,
  ChevronRight, ChevronDown, Key, FileText, CalendarDays, Loader2,
} from "lucide-react";
import * as monaco from "monaco-editor";
import { Group, Panel } from "react-resizable-panels";
import TopNavBar from "@/components/layout/TopNavBar";
import ResultsTable from "@/components/features/QueryEditor/ResultsTable";
import type { QueryTab, QueryResult } from "@/types";

const DEFAULT_SQL = `SELECT
  u.id,
  u.email,
  COUNT(t.id) AS transaction_count,
  SUM(t.amount) AS total_spent
FROM users_analytics u
LEFT JOIN transaction_logs t ON u.id = t.user_id
WHERE u.last_login > '2023-01-01'
GROUP BY 1, 2
ORDER BY 4 DESC
LIMIT 100;`;

const MOCK_RESULT: QueryResult = {
  columns: [
    { field: "id" },
    { field: "email" },
    { field: "transaction_count" },
    { field: "total_spent" },
  ],
  rows: [
    { id: "d42-f912-4aa", email: "alex.j@aegis.ai", transaction_count: 42, total_spent: "$12,450.00" },
    { id: "e12-b231-1ff", email: "sarah_dev@stack.com", transaction_count: 38, total_spent: "$9,820.50" },
    { id: "a99-c884-3bb", email: "ops_manager@cloud.net", transaction_count: 29, total_spent: "$8,100.00" },
    { id: "c01-d442-9ee", email: "data_sci_12@neural.io", transaction_count: 15, total_spent: "$4,300.20" },
  ],
  timeMs: 24,
  rowCount: 100,
};

const dataBaseSchema = {
  users_analytics: {
    id: "uuid",
    email: "varchar",
    last_login: "timestamp",
  },
  transaction_logs: {
    id: "uuid",
    email: "varchar",
    last_login: "timestamp",
  },
};

function createTab(name?: string): QueryTab {
  return {
    id: uuidv4(),
    name: name ?? `query_${Math.floor(Math.random() * 9000 + 1000)}.sql`,
    content: "",
    isDirty: false,
    executionState: "idle",
  };
}

export default function QueryEditor() {
  const [tabs, setTabs] = useState<QueryTab[]>(() => {
    const t = createTab("user_retention.sql");
    t.content = DEFAULT_SQL;
    return [t];
  });
  const [activeTabId, setActiveTabId] = useState(tabs[0].id);
  const [expandedTables, setExpandedTables] = useState<string[]>(["users_analytics"]);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];

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

  const handleEditorMount = useCallback((editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      runQuery();
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTabId]);

  const runQuery = useCallback(() => {
    updateTab(activeTabId, { executionState: "running" });
    setTimeout(() => {
      updateTab(activeTabId, {
        executionState: "success",
        result: MOCK_RESULT,
        lastExecutedAt: new Date().toLocaleTimeString(),
      });
    }, 800);
  }, [activeTabId, updateTab]);

  const toggleTable = (tableName: string) => {
    setExpandedTables((prev) =>
      prev.includes(tableName) ? prev.filter((t) => t !== tableName) : [...prev, tableName]
    );
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        runQuery();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [runQuery]);

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      <TopNavBar />
      <Group orientation="horizontal" className="flex-1 w-full">
        {/* Left Pane: Schema Explorer */}
        <Panel collapsible defaultSize={20} minSize={"20%"} maxSize={"30%"}>
          <div className="p-4 shrink-0">
            <Button
              variant="primary"
              className="w-full gap-2 font-bold uppercase tracking-wider text-[11px] h-9"
              onClick={addTab}
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              New Query
            </Button>
          </div>
          <div className="flex-1 px-2">
            <div className="flex items-center justify-between px-3 mb-2 mt-2">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                Database Schema
              </span>
              <RefreshCw className="w-3 h-3 text-on-surface-variant cursor-pointer hover:text-primary transition-colors" />
            </div>

            <div className="space-y-1 mt-4">
              {Object.entries(dataBaseSchema).map(([tableName, columns]) => {
                const isExpanded = expandedTables.includes(tableName);
                return (
                  <div key={tableName} className="group">
                    <div
                      className="flex items-center gap-2 px-3 py-1.5 hover:bg-surface-container rounded transition-colors cursor-pointer"
                      onClick={() => toggleTable(tableName)}
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-3 h-3 text-on-surface-variant" />
                      ) : (
                        <ChevronRight className="w-3 h-3 text-on-surface-variant" />
                      )}
                      <Database className="w-3 h-3 text-tertiary" />
                      <span className="text-on-surface-variant text-xs group-hover:text-on-surface font-medium">
                        {tableName}
                      </span>
                    </div>

                    {isExpanded && (
                      <div className="pl-9 pr-2 py-1 space-y-1">
                        {Object.entries(columns).map(([colName, colType]) => {
                          const Icon = colName === "id" ? Key : colName === "email" ? FileText : CalendarDays;
                          const isSpecial = colName === "last_login";
                          return (
                            <div
                              key={colName}
                              className={`flex items-center justify-between py-1 group/col cursor-pointer transition-colors ${
                                isSpecial
                                  ? "bg-primary/10 border-r-2 border-primary pl-1 -ml-1 pr-1 mr-1"
                                  : ""
                              }`}
                            >
                              <div
                                className={`flex items-center gap-2 ${
                                  isSpecial
                                    ? "text-primary font-medium"
                                    : "text-on-surface-variant group-hover/col:text-on-surface"
                                }`}
                              >
                                <Icon className="w-3 h-3" />
                                <span className="text-xs">{colName}</span>
                              </div>
                              <span
                                className={`text-[9px] uppercase font-mono tracking-wider ${
                                  colName === "id"
                                    ? "text-primary font-bold opacity-80"
                                    : isSpecial
                                    ? "text-primary"
                                    : "text-on-surface-variant opacity-80"
                                }`}
                              >
                                {colType}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Panel>

        {/* Middle/Main Pane: Editor & Results */}
        <Panel defaultSize={60}>
          <Group orientation="vertical">
            {/* Top Half: Editor */}
            <Panel defaultSize={65} className="flex flex-col bg-surface">
              {/* Tabs */}
              <div className="flex h-10 border-b border-surface-container-high bg-surface-container-lowest text-xs font-semibold overflow-x-auto shrink-0 select-none">
                {tabs.map((tab) => (
                  <div
                    key={tab.id}
                    className={`flex items-center gap-2 px-4 py-2 cursor-pointer border-t-2 group/tab min-w-0 ${
                      tab.id === activeTabId
                        ? "border-primary bg-surface text-primary"
                        : "border-transparent text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                    }`}
                    onClick={() => setActiveTabId(tab.id)}
                  >
                    <Database className="w-3 h-3 shrink-0" />
                    <span className="truncate">{tab.name}</span>
                    {tab.isDirty && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    )}
                    <span
                      className="w-4 h-4 ml-1 items-center justify-center flex rounded-sm hover:bg-surface-container-highest transition-colors opacity-0 group-hover/tab:opacity-100 shrink-0"
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
                  className="flex items-center justify-center px-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors shrink-0"
                  onClick={addTab}
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>

              {/* Monaco Editor */}
              <div className="flex-1 relative">
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
                    renderLineHighlight: "line",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 16, bottom: 16 },
                    wordWrap: "off",
                    tabSize: 2,
                    bracketPairColorization: { enabled: true },
                    smoothScrolling: true,
                    cursorBlinking: "smooth",
                    cursorSmoothCaretAnimation: "on",
                    formatOnPaste: true,
                    formatOnType: true,
                  }}
                />

                {/* Floating Run Button */}
                <div className="absolute bottom-6 right-6 z-10">
                  <Button
                    variant="tertiary"
                    className="shadow-lg font-bold gap-2 pl-3"
                    onClick={runQuery}
                    disabled={activeTab?.executionState === "running"}
                  >
                    {activeTab?.executionState === "running" ? (
                      <Loader2 className="w-4 h-4 animate-spin fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current" />
                    )}
                    {activeTab?.executionState === "running" ? "Running..." : "Run Query"}
                  </Button>
                </div>
              </div>
            </Panel>

            {/* Bottom Half: Results */}
            <Panel
              collapsible
              defaultSize={35}
              minSize={"20%"}
              maxSize={"60%"}
              className="flex flex-col bg-surface"
            >
              <div className="h-12 border-b border-surface-container-high bg-surface-container-low flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="flex bg-surface-container p-0.5 rounded-lg border border-outline-variant/10">
                    <button className="px-3 py-1 bg-surface-container-highest shadow text-xs font-bold rounded text-on-surface flex items-center gap-1.5 transition-colors">
                      <ListFilter className="w-3 h-3" /> Results
                    </button>
                  </div>
                  {activeTab?.result && (
                    <span className="text-[11px] text-on-surface-variant/70 font-mono tracking-wider font-semibold">
                      {activeTab.result.rowCount ?? activeTab.result.rows.length} rows returned in{" "}
                      {activeTab.result.timeMs}ms
                    </span>
                  )}
                  {activeTab?.executionState === "running" && (
                    <span className="text-[11px] text-primary font-mono tracking-wider font-semibold flex items-center gap-1.5">
                      <Loader2 className="w-3 h-3 animate-spin" /> Executing...
                    </span>
                  )}
                  {activeTab?.executionState === "idle" && !activeTab?.result && (
                    <span className="text-[11px] text-on-surface-variant/50 font-mono tracking-wider">
                      Run a query to see results
                    </span>
                  )}
                </div>
                {activeTab?.result && (
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-primary">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-primary">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-hidden bg-surface relative">
                {activeTab?.result ? (
                  <ResultsTable result={activeTab.result} />
                ) : activeTab?.executionState === "running" ? (
                  <div className="flex items-center justify-center h-full text-on-surface-variant">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    <span className="text-sm">Executing query...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-on-surface-variant/40">
                    <span className="text-sm">No results yet</span>
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
