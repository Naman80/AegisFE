import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface BentoCardProps {
  title: string;
  description: string;
  icon: string;
  bgIcon: string;
  variant?: "bento" | "bento_primary";
}

export function BentoCard({ title, description, icon, bgIcon, variant = "bento" }: BentoCardProps) {
  return (
    <Button
      variant={variant}
      size="bento"
      className="flex flex-col items-start h-auto"
    >
      <div className={cn(
        "w-10 h-10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform",
        variant === "bento" ? "bg-primary/10 text-primary" : "bg-white/20 text-white"
      )}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <h3 className={cn("font-semibold text-lg", variant === "bento" ? "text-on-surface" : "text-white")}>
        {title}
      </h3>
      <p className={cn("text-sm mt-1", variant === "bento" ? "text-on-surface-variant" : "text-white/80")}>
        {description}
      </p>
      <div className={cn(
        "absolute -right-4 -bottom-4 transition-opacity",
        variant === "bento" ? "opacity-5 group-hover:opacity-10" : "opacity-10 group-hover:opacity-20"
      )}>
        <span className="material-symbols-outlined text-8xl">{bgIcon}</span>
      </div>
    </Button>
  );
}
