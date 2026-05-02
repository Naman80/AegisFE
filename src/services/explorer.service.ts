import { request } from '../lib/api';
import type { Namespace, Entity } from '../types/normalization';

export const listNamespaces = (datasourceId: string) => {
  return request<Namespace[]>(`/datasources/${datasourceId}/namespaces`);
};

export const listEntities = (datasourceId: string, namespace: string) => {
  return request<Entity[]>(`/datasources/${datasourceId}/namespaces/${namespace}/entities`);
};
