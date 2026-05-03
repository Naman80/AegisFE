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
  timeout?: number;
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
  page = 1,
  pageSize = 50
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });
  return request<QueryResult>(
    `${ENDPOINTS.PREVIEW(datasourceId, namespace, entity)}?${params.toString()}`
  );
};
