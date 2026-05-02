import { request } from '../lib/api';
import type { Field } from '../types/normalization';

const ENDPOINTS = {
  ENTITY_SCHEMA: (datasourceId: string, namespace: string, entity: string) => 
    `/datasources/${datasourceId}/namespaces/${namespace}/entities/${entity}/schema`,
  BULK_SCHEMA: (datasourceId: string, namespace: string) => 
    `/datasources/${datasourceId}/namespaces/${namespace}/entities/schema/bulk`,
  CREATE: (datasourceId: string, namespace: string) => 
    `/datasources/${datasourceId}/namespaces/${namespace}/entities`,
  ALTER: (datasourceId: string, namespace: string, entity: string) => 
    `/datasources/${datasourceId}/namespaces/${namespace}/entities/${entity}`,
  DROP: (datasourceId: string, namespace: string, entity: string) => 
    `/datasources/${datasourceId}/namespaces/${namespace}/entities/${entity}`,
};

export const getEntitySchema = (datasourceId: string, namespace: string, entity: string) => {
  return request<Field[]>(ENDPOINTS.ENTITY_SCHEMA(datasourceId, namespace, entity));
};

export const getBulkSchema = (datasourceId: string, namespace: string) => {
  return request<Record<string, Field[]>>(ENDPOINTS.BULK_SCHEMA(datasourceId, namespace));
};

export const createEntity = (datasourceId: string, namespace: string, name: string, fields: any[]) => {
  return request<void>(ENDPOINTS.CREATE(datasourceId, namespace), {
    method: 'POST',
    body: JSON.stringify({ name, fields }),
  });
};

export const alterEntity = (datasourceId: string, namespace: string, entity: string, changes: any) => {
  return request<void>(ENDPOINTS.ALTER(datasourceId, namespace, entity), {
    method: 'PATCH',
    body: JSON.stringify(changes),
  });
};

export const dropEntity = (datasourceId: string, namespace: string, entity: string) => {
  return request<void>(ENDPOINTS.DROP(datasourceId, namespace, entity), {
    method: 'DELETE',
  });
};
