import { Panel, Group, Separator } from "react-resizable-panels"
import { cn } from "@/lib/utils"

export const ResizablePanelGroup = ({ className, ...props }: React.ComponentProps<typeof Group>) => (
  <Group className={cn("flex h-full w-full", className)} {...props} />
)

export const ResizablePanel = Panel

export const ResizableHandle = ({ className, ...props }: React.ComponentProps<typeof Separator>) => (
  <Separator
    className={cn(
      "relative flex w-px items-center justify-center bg-surface-container-high after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 transition-colors hover:bg-outline-variant",
      className
    )}
    {...props}
  >
    <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border border-surface-container-high bg-surface-container-lowest shadow-sm hover:border-outline-variant transition-colors group">
      <div className="h-2 w-0.5 bg-outline-variant/50 rounded-full group-hover:bg-outline-variant transition-colors" />
    </div>
  </Separator>
)
