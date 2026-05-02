import { useQuery } from "@tanstack/react-query";
import { listNamespaces, listEntities } from "@/services/explorer.service";

export const useNamespaces = (datasourceId: string | null) => {
  return useQuery({
    queryKey: ["explorer", "namespaces", datasourceId],
    queryFn: () => listNamespaces(datasourceId!),
    enabled: !!datasourceId,
  });
};

export const useEntities = (datasourceId: string | null, namespace: string | null) => {
  return useQuery({
    queryKey: ["explorer", "entities", datasourceId, namespace],
    queryFn: () => listEntities(datasourceId!, namespace!),
    enabled: !!datasourceId && !!namespace,
  });
};
