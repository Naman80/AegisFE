import { useQuery } from "@tanstack/react-query";
import { getEntitySchema } from "@/services/schema.service";

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
