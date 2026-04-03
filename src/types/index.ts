export type Status = 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'RUNNING' | 'PAUSED';

export interface Query {
  id: string;
  type: 'SELECT' | 'NATURAL_LANG';
  content: string;
  timestamp: string;
}

export interface TableSummary {
  name: string;
  size: string;
  rows: string;
}

export interface PipelineStatus {
  name: string;
  status: 'RUNNING' | 'PAUSED';
  progress: number;
}

export interface UserRow {
  id: string;
  name: string;
  email: string;
  status: Status;
  ltv: string;
  date: string;
}

export interface SystemMetric {
  label: string;
  value: string;
}

export interface SchemaColumn {
  name: string;
  type: string;
  keyType?: 'PK' | 'FK' | 'UN';
}

export interface SchemaTable {
  name: string;
  description?: string;
  columns: SchemaColumn[];
}

export interface ChatMessage {
  role: 'assistant' | 'user';
  content: string;
  actions?: string[];
}

export interface QueryResultColumn {
  field: string;
}

export interface QueryResult {
  columns: QueryResultColumn[];
  rows: Record<string, any>[];
  timeMs?: number;
  rowCount?: number;
}

// React Flow Compatible Types for Pipelines
export interface PipelineNode<T = any> {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: T;
}

export interface PipelineEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
  style?: React.CSSProperties;
}

export interface QueryTab {
  id: string;
  name: string;
  content: string;
  isDirty: boolean;
  executionState: 'idle' | 'running' | 'success' | 'error';
  result?: QueryResult;
  errorMessage?: string;
  lastExecutedAt?: string;
}
