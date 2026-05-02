import { request } from '../lib/api';
import type { Namespace, Entity } from '../types/normalization';

const ENDPOINTS = {
  NAMESPACES: (datasourceId: string) => `/datasources/${datasourceId}/namespaces`,
  ENTITIES: (datasourceId: string, namespace: string) => `/datasources/${datasourceId}/namespaces/${namespace}/entities`,
};

export const listNamespaces = (datasourceId: string) => {
  return request<Namespace[]>(ENDPOINTS.NAMESPACES(datasourceId));
};

export const listEntities = (datasourceId: string, namespace: string) => {
  return request<Entity[]>(ENDPOINTS.ENTITIES(datasourceId, namespace));
};
