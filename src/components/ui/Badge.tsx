import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary",
        active: "bg-tertiary-container/20 text-tertiary",
        pending: "bg-secondary-container/20 text-secondary",
        suspended: "bg-error-container/20 text-error",
        running: "bg-tertiary/10 text-tertiary",
        paused: "bg-surface-container text-outline",
        outline: "text-on-surface-variant border border-outline-variant/30",
        mono: "bg-tertiary/10 text-tertiary-fixed-dim font-mono",
        primary_mono: "bg-primary/10 text-primary font-mono",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
