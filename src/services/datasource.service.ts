import { request } from '../lib/api';
import type { DatabaseConnection } from '../types';

export const listDatasources = () => {
  return request<DatabaseConnection[]>('/datasources');
};

export const getDatasource = (id: string) => {
  return request<DatabaseConnection>(`/datasources/${id}`);
};

export const createDatasource = (payload: any) => {
  return request<DatabaseConnection>('/datasources', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const updateDatasource = (id: string, payload: any) => {
  return request<DatabaseConnection>(`/datasources/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
};

export const deleteDatasource = (id: string) => {
  return request<void>(`/datasources/${id}`, {
    method: 'DELETE',
  });
};

export const testDatasourceConnection = (id: string) => {
  return request<{ success: boolean; message: string }>(`/datasources/${id}/test`, {
    method: 'POST',
  });
};

export const activateDatasource = (id: string) => {
  return request<DatabaseConnection>(`/datasources/${id}/activate`, {
    method: 'POST',
  });
};
