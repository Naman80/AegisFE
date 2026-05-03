import { useQuery } from "@tanstack/react-query";
import { getEntitySchema, getAllEntitySchema } from "@/services/entity.service";

export const useEntityFields = (
  datasourceId: string | null,
  namespace: string | null,
  entity: string | null
) => {
  return useQuery({
    queryKey: ["schema", "fields", datasourceId, namespace, entity],
    queryFn: () => getEntitySchema(datasourceId!, namespace!, entity!),
    enabled: !!datasourceId && !!namespace && !!entity,
  });
};

export const useAllEntitySchema = (datasourceId: string | null, namespace: string | null) => {
  return useQuery({
    queryKey: ["schema", "all", datasourceId, namespace],
    queryFn: () => getAllEntitySchema(datasourceId!, namespace!),
    enabled: !!datasourceId && !!namespace,
  });
};
