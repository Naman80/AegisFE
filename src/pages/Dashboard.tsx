import { StatsCard } from "@/components/features/Dashboard/StatsCard";
import { BentoCard } from "@/components/features/Dashboard/BentoCard";
import { QueryListItem } from "@/components/features/Dashboard/QueryListItem";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { Query, TableSummary, PipelineStatus, SystemMetric } from "@/types";

const MOCK_STATS: SystemMetric[] = [
  { label: "Latency", value: "14ms" },
  { label: "Uptime", value: "99.98%" },
];

const MOCK_QUERIES: Query[] = [
  {
    id: "1",
    type: "SELECT",
    content: "SELECT u.id, u.name, COUNT(o.id) as total_orders FROM users u JOIN orders o ON u.id = o.user_id WHERE o.created_at > '2023-01-01' GROUP BY u.id",
    timestamp: "2 mins ago",
  },
  {
    id: "2",
    type: "NATURAL_LANG",
    content: '"Find all users who haven\'t logged in since last month but have a premium subscription."',
    timestamp: "15 mins ago",
  },
];

const MOCK_TABLES: TableSummary[] = [
  { name: "user_analytics_v2", size: "4.2 GB", rows: "1.2M Rows" },
  { name: "global_transactions", size: "12.8 GB", rows: "8.5M Rows" },
  { name: "cache_metadata_store", size: "156 MB", rows: "24k Rows" },
];

const MOCK_PIPELINES: PipelineStatus[] = [
  { name: "ETL_PRODUCTION_SYNC", status: "RUNNING", progress: 75 },
  { name: "MODERN_DATA_EXTRACT", status: "PAUSED", progress: 30 },
];

export default function Dashboard() {
  return (
    <div className="p-10 space-y-10 pr-80">
      {/* Hero / Quick Stats Section */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-3xl font-headline font-bold tracking-tight text-on-surface mb-1">
              System Overview
            </h1>
            <p className="text-on-surface-variant text-sm">
              Real-time status of your AI-native infrastructure.
            </p>
          </div>
          <div className="flex gap-3">
            {MOCK_STATS.map((stat) => (
              <StatsCard key={stat.label} {...stat} />
            ))}
          </div>
        </div>

        {/* Quick Action Cards (Bento) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BentoCard
            title="New Query"
            description="Start a new SQL or natural language inquiry."
            icon="add_box"
            bgIcon="code"
          />
          <BentoCard
            title="New Table"
            description="Define schemas or import external datasets."
            icon="table_view"
            bgIcon="grid_on"
          />
          <BentoCard
            title="Ask AI"
            description="Chat with your data using LLM context."
            icon="auto_awesome"
            bgIcon="psychology"
            variant="bento_primary"
          />
        </div>
      </section>

      {/* Main Data Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Queries (Large) */}
        <Card variant="lowest" className="lg:col-span-8">
          <CardHeader>
            <CardTitle>
              <span className="material-symbols-outlined text-primary text-sm">
                history
              </span>
              Recent Queries
            </CardTitle>
            <Button variant="ghost" size="chip" className="text-xs font-semibold text-primary">
              View All
            </Button>
          </CardHeader>
          <div className="divide-y divide-surface-container-high">
            {MOCK_QUERIES.map((query) => (
              <QueryListItem key={query.id} {...query} />
            ))}
            {/* Skeleton Loading Example */}
            <div className="p-5 opacity-40">
              <div className="flex justify-between items-start mb-2">
                <div className="w-16 h-4 bg-surface-container-highest rounded animate-pulse" />
                <div className="w-10 h-3 bg-surface-container-highest rounded animate-pulse" />
              </div>
              <div className="w-full h-12 bg-surface-container-highest rounded animate-pulse" />
            </div>
          </div>
        </Card>

        {/* Right Column: Tables & Pipelines */}
        <div className="lg:col-span-4 space-y-8">
          {/* Recent Tables */}
          <Card variant="lowest">
            <CardHeader>
              <CardTitle>
                <span className="material-symbols-outlined text-primary text-sm">
                  table_rows
                </span>
                Recent Tables
              </CardTitle>
            </CardHeader>
            <div className="p-4 space-y-3">
              {MOCK_TABLES.map((table) => (
                <div
                  key={table.name}
                  className="flex items-center justify-between p-2 hover:bg-surface-container rounded-lg transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-surface-container-high flex items-center justify-center">
                      <span className="material-symbols-outlined text-lg text-outline">
                        storage
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-on-surface">
                        {table.name}
                      </div>
                      <div className="text-[10px] text-outline">
                        {table.size} • {table.rows}
                      </div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-sm text-outline opacity-0 group-hover:opacity-100 transition-opacity">
                    arrow_forward_ios
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Pipeline Status */}
          <Card variant="lowest">
            <CardHeader>
              <CardTitle>
                <span className="material-symbols-outlined text-primary text-sm">
                  hub
                </span>
                Pipeline Status
              </CardTitle>
            </CardHeader>
            <div className="p-5 space-y-4">
              {MOCK_PIPELINES.map((pipeline) => (
                <div key={pipeline.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-on-surface-variant">
                      {pipeline.name}
                    </div>
                    {pipeline.status === "RUNNING" ? (
                      <span className="flex items-center gap-1.5 text-[10px] text-tertiary bg-tertiary/10 px-2 py-0.5 rounded-full font-bold uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
                        Running
                      </span>
                    ) : (
                      <span className="text-[10px] text-outline bg-surface-container px-2 py-0.5 rounded-full font-bold uppercase">
                        Paused
                      </span>
                    )}
                  </div>
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                    <div
                      className={pipeline.status === "RUNNING" ? "bg-tertiary h-full rounded-full" : "bg-outline h-full rounded-full"}
                      style={{ width: `${pipeline.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
