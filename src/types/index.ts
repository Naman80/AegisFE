export type Status = 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'RUNNING' | 'PAUSED';
export type DatabaseType = 'POSTGRES';
export type ConnectionEntryMode = 'manual' | 'url';
export type SslMode =
  | 'disable'
  | 'allow'
  | 'prefer'
  | 'require'
  | 'verify_ca'
  | 'verify_full';

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

export interface DatabaseConnection {
  id: string;
  name: string;
  type: DatabaseType;
  connectionUrl?: string | null;
  host: string;
  port: number;
  database: string;
  username: string;
  sslMode: SslMode;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ManualConnectionPayload {
  name: string;
  type: DatabaseType;
  mode: 'manual';
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  sslMode: SslMode;
}

export interface UrlConnectionPayload {
  name: string;
  type: DatabaseType;
  mode: 'url';
  connectionUrl: string;
}

export type ConnectionPayload = ManualConnectionPayload | UrlConnectionPayload;

export interface ParsedConnectionPreview {
  host: string;
  port: number;
  database: string;
  username: string;
  sslMode: SslMode;
}

export interface ConnectionTestResult {
  success: boolean;
  message: string;
}

export interface DatabaseSchema {
  name: string;
}

export interface DatabaseTableSummary {
  schema: string;
  name: string;
  type: string;
}

export interface DatabaseTableColumn {
  name: string;
  dataType: string;
  isNullable: boolean;
  defaultValue: string | null;
  keyType?: 'PK' | 'FK' | 'UN';
}

export interface DatabaseTableRelation {
  constraintName: string;
  columnName: string;
  referencedSchema: string;
  referencedTable: string;
  referencedColumn: string;
}

export interface DatabaseTableDetails {
  schema: string;
  name: string;
  columns: DatabaseTableColumn[];
  relations: DatabaseTableRelation[];
}

export interface RowPreviewResult {
  columns: string[];
  rows: Record<string, unknown>[];
  totalCount: number;
  limit: number;
  offset: number;
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
