import React, { createContext, useContext, useState, useEffect } from 'react';
import type { DatabaseConnection } from '../types';
import { listDatasources } from '../services/datasource.service';

interface DatasourceContextType {
  activeDatasourceId: string | null;
  setActiveDatasourceId: (id: string | null) => void;
  datasources: DatabaseConnection[];
  refreshDatasources: () => Promise<void>;
  isLoading: boolean;
}

const DatasourceContext = createContext<DatasourceContextType | undefined>(undefined);

export const DatasourceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [datasources, setDatasources] = useState<DatabaseConnection[]>([]);

  const [activeDatasourceId, setActiveDatasourceId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const refreshDatasources = async () => {
    setIsLoading(true);
    try {
      const data = await listDatasources();
      setDatasources(data);

      // Sync active datasource ID with the one marked as active in the backend
      if (data.length > 0) {
        const active = data.find(d => d.isActive) || data[0];
        if (active.id !== activeDatasourceId) {
          setActiveDatasourceId(active.id);
        }
      }
    } catch (error) {
      console.error('Failed to load datasources', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshDatasources();
  }, []);

  return (
    <DatasourceContext.Provider value={{
      activeDatasourceId,
      setActiveDatasourceId,
      datasources,
      refreshDatasources,
      isLoading,
    }}>
      {children}
    </DatasourceContext.Provider>
  );
};

export const useDatasource = () => {
  const context = useContext(DatasourceContext);
  if (context === undefined) {
    throw new Error('useDatasource must be used within a DatasourceProvider');
  }
  return context;
};
