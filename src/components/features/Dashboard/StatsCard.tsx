import { Card } from "@/components/ui/Card";
import type { SystemMetric } from "@/types";

export function StatsCard({ label, value }: SystemMetric) {
  return (
    <Card variant="default" className="px-4 py-2 bg-surface-container rounded-lg border border-outline-variant/10">
      <span className="text-[10px] uppercase font-semibold text-outline block mb-0.5">
        {label}
      </span>
      <span className="text-tertiary font-bold">{value}</span>
    </Card>
  );
}
