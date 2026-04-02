import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-50 duration-200",
  {
    variants: {
      variant: {
        primary: "bg-primary-container text-on-primary-container hover:brightness-110 shadow-lg shadow-primary/20",
        secondary: "bg-surface-container-high text-on-surface hover:bg-surface-container-highest border border-outline-variant/10",
        ghost: "p-1.5 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface hover:bg-surface-container/50",
        outline: "border border-surface-container-high text-on-surface hover:bg-surface-container transition-all",
        accent: "bg-primary/20 text-primary hover:bg-primary/30",
        tertiary: "bg-tertiary/20 text-tertiary hover:bg-tertiary/30 uppercase text-[10px] font-bold p-1.5",
        glass: "bg-surface-variant/60 backdrop-blur-xl border border-outline-variant/10 text-on-surface",
        bento: "group bg-surface-container rounded-xl border border-outline-variant/10 hover:border-primary/40 hover:bg-surface-container-high transition-all duration-200 text-left relative overflow-hidden",
        bento_primary: "group bg-primary-container rounded-xl border border-primary/20 hover:shadow-[0_0_40px_rgba(0,113,238,0.2)] transition-all duration-200 text-left relative overflow-hidden",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-9 w-9",
        bento: "p-6",
        chip: "px-3 py-1.5",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
