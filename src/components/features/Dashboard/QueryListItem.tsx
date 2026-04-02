import { Badge } from "@/components/ui/Badge";
import type { Query } from "@/types";
import { cn } from "@/lib/utils";

export function QueryListItem({ id, type, content, timestamp }: Query) {
  return (
    <div key={id} className="p-5 hover:bg-surface transition-colors cursor-pointer group">
      <div className="flex justify-between items-start mb-2">
        <Badge variant={type === "SELECT" ? "mono" : "primary_mono"}>
          {type}
        </Badge>
        <span className="text-[10px] text-outline font-medium uppercase">
          {timestamp}
        </span>
      </div>
      <p className={cn(
          "text-sm text-on-surface-variant line-clamp-2 bg-surface-container rounded p-3 border border-outline-variant/5",
          type === "SELECT" ? "font-mono" : "italic"
      )}>
        {content}
      </p>
    </div>
  );
}
