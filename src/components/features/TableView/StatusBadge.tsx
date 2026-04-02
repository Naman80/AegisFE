import { Badge } from "@/components/ui/Badge";
import type { Status } from "@/types";

interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variantMap: Record<Status, any> = {
    ACTIVE: "active",
    PENDING: "pending",
    SUSPENDED: "suspended",
    RUNNING: "running",
    PAUSED: "paused",
  };

  return (
    <Badge variant={variantMap[status] || "default"}>
      {status}
    </Badge>
  );
}
