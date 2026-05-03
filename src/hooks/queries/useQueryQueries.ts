import { useQuery, useMutation } from "@tanstack/react-query";
import { previewEntity, executeQuery } from "@/services/query.service";

export const useEntityPreview = (
  datasourceId: string | null,
  namespace: string | null,
  entity: string | null,
  page = 1,
  pageSize = 50
) => {
  return useQuery({
    queryKey: ["query", "preview", datasourceId, namespace, entity, page, pageSize],
    queryFn: () => previewEntity(datasourceId!, namespace!, entity!, page, pageSize),
    enabled: !!datasourceId && !!namespace && !!entity,
  });
};

export const useExecuteQuery = () => {
  return useMutation({
    mutationFn: ({ datasourceId, input }: { datasourceId: string; input: any }) =>
      executeQuery(datasourceId, input),
  });
};
