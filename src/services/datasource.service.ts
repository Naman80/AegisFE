import { request } from '../lib/api';
import type { DatabaseConnection } from '../types';

const ENDPOINTS = {
  LIST: '/datasources',
  BY_ID: (id: string) => `/datasources/${id}`,
  CREATE: '/datasources',
  UPDATE: (id: string) => `/datasources/${id}`,
  DELETE: (id: string) => `/datasources/${id}`,
  TEST: (id: string) => `/datasources/${id}/test`,
  ACTIVATE: (id: string) => `/datasources/${id}/activate`,
};

export const listDatasources = () => {
  return request<DatabaseConnection[]>(ENDPOINTS.LIST);
};

export const getDatasource = (id: string) => {
  return request<DatabaseConnection>(ENDPOINTS.BY_ID(id));
};

export const createDatasource = (payload: any) => {
  return request<DatabaseConnection>(ENDPOINTS.CREATE, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const updateDatasource = (id: string, payload: any) => {
  return request<DatabaseConnection>(ENDPOINTS.UPDATE(id), {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
};

export const deleteDatasource = (id: string) => {
  return request<void>(ENDPOINTS.DELETE(id), {
    method: 'DELETE',
  });
};

export const testDatasourceConnection = (id: string) => {
  return request<{ success: boolean; message: string }>(ENDPOINTS.TEST(id), {
    method: 'POST',
  });
};

export const activateDatasource = (id: string) => {
  return request<DatabaseConnection>(ENDPOINTS.ACTIVATE(id), {
    method: 'POST',
  });
};
