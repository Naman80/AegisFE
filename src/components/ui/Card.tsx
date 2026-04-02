import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  "rounded-xl border border-outline-variant/10 transition-all duration-200 overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-surface-container shadow-sm hover:border-primary/20 hover:bg-surface-container-high",
        lowest: "bg-surface-container-lowest border-surface-container-high",
        low: "bg-surface-container-low border-surface-container",
        glass: "bg-surface-variant/60 backdrop-blur-xl border border-outline-variant/10",
        ghost: "bg-transparent border-transparent",
      },
      elevation: {
        none: "shadow-none",
        sm: "shadow-sm",
        md: "shadow-md shadow-black/20",
        lg: "shadow-lg shadow-black/40",
      },
    },
    defaultVariants: {
      variant: "default",
      elevation: "none",
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

function Card({ className, variant, elevation, ...props }: CardProps) {
  return (
    <div
      className={cn(cardVariants({ variant, elevation }), className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-6 py-5 border-b border-surface-container-high flex justify-between items-center bg-surface-container-low", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
        className={cn("font-semibold text-on-surface flex items-center gap-2", className)}
        {...props}
    />
  )
}

function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6", className)} {...props} />
}

export { Card, CardHeader, CardTitle, CardContent }
