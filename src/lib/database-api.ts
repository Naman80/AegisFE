import { request } from './api';
import type {
  ConnectionPayload,
  ConnectionTestResult,
  DatabaseConnection,
  DatabaseSchema,
  DatabaseTableDetails,
  DatabaseTableSummary,
  RowPreviewResult,
} from '@/types';

export function listConnections() {
  return request<DatabaseConnection[]>('/connections');
}

export function getActiveConnection() {
  return request<DatabaseConnection>('/connections/active');
}

export function testConnection(payload: ConnectionPayload) {
  return request<ConnectionTestResult>('/connections/test', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function createConnection(payload: ConnectionPayload) {
  return request<DatabaseConnection>('/connections', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function activateConnection(id: string) {
  return request<DatabaseConnection>(`/connections/${id}/activate`, {
    method: 'PATCH',
  });
}

export function listSchemas() {
  return request<DatabaseSchema[]>('/introspection/schemas');
}

export function listTables(schema: string) {
  return request<DatabaseTableSummary[]>(
    `/introspection/tables?schema=${encodeURIComponent(schema)}`,
  );
}

export function getTableDetails(schema: string, table: string) {
  return request<DatabaseTableDetails>(
    `/introspection/tables/${encodeURIComponent(schema)}/${encodeURIComponent(table)}`,
  );
}

export function previewTableRows(
  schema: string,
  table: string,
  limit = 25,
  offset = 0,
) {
  return request<RowPreviewResult>(
    `/tables/${encodeURIComponent(schema)}/${encodeURIComponent(table)}/rows?limit=${limit}&offset=${offset}`,
  );
}
