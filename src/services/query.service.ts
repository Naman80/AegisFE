import { request } from '../lib/api';
import type { QueryResult } from '../types/normalization';

const ENDPOINTS = {
  EXECUTE: (datasourceId: string) => `/datasources/${datasourceId}/query`,
  PREVIEW: (datasourceId: string, namespace: string, entity: string) => 
    `/datasources/${datasourceId}/namespaces/${namespace}/entities/${entity}/preview`,
};

export const executeQuery = (datasourceId: string, input: {
  namespace: string;
  entity?: string;
  query: string;
  limit?: number;
  offset?: number;
}) => {
  return request<QueryResult>(ENDPOINTS.EXECUTE(datasourceId), {
    method: 'POST',
    body: JSON.stringify(input),
  });
};

export const previewEntity = (
  datasourceId: string,
  namespace: string,
  entity: string,
  limit = 50,
  offset = 0
) => {
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });
  return request<QueryResult>(
    `${ENDPOINTS.PREVIEW(datasourceId, namespace, entity)}?${params.toString()}`
  );
};
