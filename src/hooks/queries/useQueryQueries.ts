import { useQuery } from "@tanstack/react-query";
import { previewEntity } from "@/services/query.service";

export const useEntityPreview = (
  datasourceId: string | null,
  namespace: string | null,
  entity: string | null,
  limit = 50,
  offset = 0
) => {
  return useQuery({
    queryKey: ["query", "preview", datasourceId, namespace, entity, limit, offset],
    queryFn: () => previewEntity(datasourceId!, namespace!, entity!, limit, offset),
    enabled: !!datasourceId && !!namespace && !!entity,
  });
};
