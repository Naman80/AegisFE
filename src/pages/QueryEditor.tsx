import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Play, Download, ExternalLink, ListFilter, BarChart, Database, RefreshCw, ChevronRight, ChevronDown, Key, FileText, CalendarDays } from "lucide-react";
import { Group, Panel } from "react-resizable-panels";
import TopNavBar from "@/components/layout/TopNavBar";

export default function QueryEditor() {
  const [activeTab, setActiveTab] = useState("user_retention.sql");
  const [expandedTables, setExpandedTables] = useState<string[]>(["users_analytics"]);

  const toggleTable = (tableName: string) => {
    setExpandedTables(prev => 
      prev.includes(tableName) 
        ? prev.filter(t => t !== tableName) 
        : [...prev, tableName]
    );
  };

  const dataBaseSchema = {
    "users_analytics": {
      "id": "uuid",
      "email": "varchar",
      "last_login": "timestamp"
    },
    "transaction_logs": {
      "id": "uuid",
      "email": "varchar",
      "last_login": "timestamp"
    }
  }

  // Mock Result Data
  const results = [
    { id: "d42-f912-4aa", email: "alex.j@aegis.ai", transaction_count: 42, total_spent: "$12,450.00" },
    { id: "e12-b231-1ff", email: "sarah_dev@stack.com", transaction_count: 38, total_spent: "$9,820.50" },
    { id: "a99-c884-3bb", email: "ops_manager@cloud.net", transaction_count: 29, total_spent: "$8,100.00" },
    { id: "c01-d442-9ee", email: "data_sci_12@neural.io", transaction_count: 15, total_spent: "$4,300.20" },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      <TopNavBar />
      <Group orientation="horizontal" className="flex-1 w-full">
        {/* Left Pane: Schema Explorer */}
        <Panel collapsible defaultSize={20} minSize={"20%"} maxSize={"30%"}>
          {/* NEW QUERY */}
          <div className="p-4 shrink-0">
            <Button variant="primary" className="w-full gap-2 font-bold uppercase tracking-wider text-[11px] h-9">
              <span className="material-symbols-outlined text-[16px]">add</span>
              New Query
            </Button>
          </div>
          <div className="flex-1 px-2">
            <div className="flex items-center justify-between px-3 mb-2 mt-2">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Database Schema</span>
              <RefreshCw className="w-3 h-3 text-on-surface-variant cursor-pointer hover:text-primary transition-colors" />
            </div>

            {/* Schema Tree Mock */}
            <div className="space-y-1 mt-4">
              {Object.entries(dataBaseSchema).map(([tableName, columns]) => {
                const isExpanded = expandedTables.includes(tableName);
                return (
                  <div key={tableName} className="group">
                    <div 
                      className="flex items-center gap-2 px-3 py-1.5 hover:bg-surface-container rounded transition-colors cursor-pointer"
                      onClick={() => toggleTable(tableName)}
                    >
                      {isExpanded ? <ChevronDown className="w-3 h-3 text-on-surface-variant" /> : <ChevronRight className="w-3 h-3 text-on-surface-variant" />}
                      <Database className="w-3 h-3 text-tertiary" />
                      <span className="text-on-surface-variant text-xs group-hover:text-on-surface font-medium">{tableName}</span>
                    </div>
                    
                    {isExpanded && (
                      <div className="pl-9 pr-2 py-1 space-y-1">
                        {Object.entries(columns).map(([colName, colType]) => {
                          const Icon = colName === "id" ? Key : (colName === "email" ? FileText : CalendarDays);
                          const isSpecial = colName === "last_login";
                          
                          return (
                            <div 
                              key={colName} 
                              className={`flex items-center justify-between py-1 group/col cursor-pointer transition-colors ${
                                isSpecial ? "bg-primary/10 border-r-2 border-primary pl-1 -ml-1 pr-1 mr-1" : ""
                              }`}
                            >
                              <div className={`flex items-center gap-2 ${isSpecial ? "text-primary font-medium" : "text-on-surface-variant group-hover/col:text-on-surface"}`}>
                                <Icon className="w-3 h-3" />
                                <span className="text-xs">{colName}</span>
                              </div>
                              <span className={`text-[9px] uppercase font-mono tracking-wider ${
                                colName === "id" ? "text-primary font-bold opacity-80" : (isSpecial ? "text-primary" : "text-on-surface-variant opacity-80")
                              }`}>
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
            <Panel defaultSize={65}  className="flex flex-col bg-surface">
              {/* Tabs */}
              <div className="flex h-10 border-b border-surface-container-high bg-surface-container-lowest text-xs font-semibold overflow-x-auto shrink-0 select-none">
                <div 
                  className={`flex items-center gap-2 px-4 py-2 cursor-pointer border-t-2 ${activeTab === 'user_retention.sql' ? 'border-primary bg-surface text-primary' : 'border-transparent text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors'}`}
                  onClick={() => setActiveTab('user_retention.sql')}
                >
                  <Database className="w-3 h-3" />
                  user_retention.sql
                  <span className="w-4 h-4 ml-2 items-center justify-center flex rounded-sm hover:bg-surface-container-highest transition-colors opacity-50 hover:opacity-100">&times;</span>
                </div>
                <div 
                  className={`flex items-center gap-2 px-4 py-2 cursor-pointer border-t-2 ${activeTab === 'revenue_growth.sql' ? 'border-primary bg-surface text-primary' : 'border-transparent text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors'}`}
                  onClick={() => setActiveTab('revenue_growth.sql')}
                >
                  <Database className="w-3 h-3" />
                  revenue_growth.sql
                  <span className="w-4 h-4 ml-2 items-center justify-center flex rounded-sm hover:bg-surface-container-highest transition-colors opacity-50 hover:opacity-100">&times;</span>
                </div>
              </div>

              {/* Editor Workspace */}
              <div className="flex-1 flex relative font-mono text-sm">
                <div className="w-12 bg-surface-container-lowest text-on-surface-variant/40 text-right pr-3 pt-4 select-none border-r border-surface-container-high/50 leading-relaxed text-xs">
                  1<br/>2<br/>3<br/>4<br/>5<br/>6<br/>7<br/>8<br/>9<br/>10<br/>11
                </div>
                <div className="flex-1 p-4 bg-[#0a0a0a] text-secondary whitespace-pre overflow-auto leading-relaxed focus:outline-none" contentEditable suppressContentEditableWarning spellCheck={false}>
                  <span className="text-primary font-semibold">SELECT</span><br/>
                  {"  "}u.id,<br/>
                  {"  "}u.email,<br/>
                  {"  "}<span className="text-tertiary">COUNT</span>(t.id) <span className="text-primary font-semibold">AS</span> transaction_count,<br/>
                  {"  "}<span className="text-tertiary">SUM</span>(t.amount) <span className="text-primary font-semibold">AS</span> total_spent<br/>
                  <span className="text-primary font-semibold">FROM</span> users_analytics u<br/>
                  <span className="text-primary font-semibold">LEFT JOIN</span> transaction_logs t <span className="text-primary font-semibold">ON</span> u.id = t.user_id<br/>
                  <span className="text-primary font-semibold">WHERE</span> u.last_login &gt; <span className="text-tertiary-fixed-dim">'2023-01-01'</span><br/>
                  <span className="text-primary font-semibold">GROUP BY</span> 1, 2<br/>
                  <span className="text-primary font-semibold">ORDER BY</span> 4 <span className="text-primary font-semibold">DESC</span><br/>
                  <span className="text-primary font-semibold">LIMIT</span> <span className="text-tertiary">100</span>;
                </div>

                {/* Floating Actions */}
                <div className="absolute bottom-6 right-6">
                  <Button variant="tertiary" className="shadow-lg font-bold gap-2 pl-3">
                    <Play className="w-4 h-4 fill-current" />
                    Run Query
                  </Button>
                </div>
              </div>
            </Panel>


            {/* Bottom Half: Results Grid */}
            <Panel collapsible defaultSize={35} minSize={"20%"} maxSize={"60%"}  className="flex flex-col bg-surface">
              <div className="h-12 border-b border-surface-container-high bg-surface-container-low flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="flex bg-surface-container p-0.5 rounded-lg border border-outline-variant/10">
                    <button className="px-3 py-1 bg-surface-container-highest shadow text-xs font-bold rounded text-on-surface flex items-center gap-1.5 transition-colors">
                      <ListFilter className="w-3 h-3" /> Results
                    </button>
                    <button className="px-3 py-1 text-on-surface-variant hover:text-on-surface text-xs font-semibold rounded flex items-center gap-1.5 transition-colors">
                      <BarChart className="w-3 h-3" /> Chart
                    </button>
                  </div>
                  <span className="text-[11px] text-on-surface-variant/70 font-mono tracking-wider font-semibold">
                    100 rows returned in 24ms
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-primary">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-primary">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-auto bg-surface relative">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead className="sticky top-0 bg-surface-container-lowest/90 backdrop-blur-md z-10 shadow-sm">
                    <tr>
                      <th className="px-5 py-2.5 border-b border-surface-container-high text-on-surface-variant font-bold uppercase tracking-wider text-[10px]">id</th>
                      <th className="px-5 py-2.5 border-b border-surface-container-high text-on-surface-variant font-bold uppercase tracking-wider text-[10px]">email</th>
                      <th className="px-5 py-2.5 border-b border-surface-container-high text-on-surface-variant font-bold uppercase tracking-wider text-[10px]">transaction_count</th>
                      <th className="px-5 py-2.5 border-b border-surface-container-high text-on-surface-variant font-bold uppercase tracking-wider text-[10px]">total_spent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((row, i) => (
                      <tr key={i} className="hover:bg-surface-container-low transition-colors group">
                        <td className="px-5 py-2.5 border-b border-surface-container-high/30 text-on-surface-variant">{row.id}</td>
                        <td className="px-5 py-2.5 border-b border-surface-container-high/30 text-on-surface-variant">{row.email}</td>
                        <td className="px-5 py-2.5 border-b border-surface-container-high/30 text-on-surface-variant">{row.transaction_count}</td>
                        <td className="px-5 py-2.5 border-b border-surface-container-high/30 text-tertiary">{row.total_spent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </Group>
        </Panel>
      </Group>
    </div>
  );
}
