export interface Namespace {
  name: string;
}

export interface Entity {
  name: string;
  namespace: string;
  type: 'table' | 'view' | 'collection';
}

export interface Field {
  name: string;
  type: string;
  isNullable: boolean;
  defaultValue?: string;
  isPrimaryKey?: boolean;
}

export type Record = any;

export interface QueryResult {
  columns: string[];
  rows: Record[];
  totalCount: number;
  timeMs?: number;
}
