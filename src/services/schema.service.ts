import { request } from '../lib/api';
import type { Field } from '../types/normalization';

export const getEntitySchema = (datasourceId: string, namespace: string, entity: string) => {
  return request<Field[]>(
    `/datasources/${datasourceId}/namespaces/${namespace}/entities/${entity}/schema`
  );
};

export const getBulkSchema = (datasourceId: string, namespace: string) => {
  return request<Record<string, Field[]>>(
    `/datasources/${datasourceId}/namespaces/${namespace}/entities/schema/bulk`
  );
};

export const createEntity = (datasourceId: string, namespace: string, name: string, fields: any[]) => {
  return request<void>(`/datasources/${datasourceId}/namespaces/${namespace}/entities`, {
    method: 'POST',
    body: JSON.stringify({ name, fields }),
  });
};

export const alterEntity = (datasourceId: string, namespace: string, entity: string, changes: any) => {
  return request<void>(`/datasources/${datasourceId}/namespaces/${namespace}/entities/${entity}`, {
    method: 'PATCH',
    body: JSON.stringify(changes),
  });
};

export const dropEntity = (datasourceId: string, namespace: string, entity: string) => {
  return request<void>(`/datasources/${datasourceId}/namespaces/${namespace}/entities/${entity}`, {
    method: 'DELETE',
  });
};
