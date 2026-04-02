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
