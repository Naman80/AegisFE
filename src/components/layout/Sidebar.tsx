import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";

const navItems = [
  { path: "/", icon: "dashboard", label: "Dashboard" },
  { path: "/query", icon: "code", label: "Query Editor" },
  { path: "/schema", icon: "schema", label: "Schema" },
  { path: "/tables", icon: "table_chart", label: "Tables" },
  { path: "/pipelines", icon: "account_tree", label: "Pipelines" },
  { path: "/settings", icon: "settings", label: "Settings" },
];

export default function Sidebar({ isCollapsed, onToggle }: { isCollapsed: boolean; onToggle: () => void }) {
  const location = useLocation();

  return (
    <aside className={cn(
      "h-full border-r border-surface-container-high bg-surface-container-lowest flex flex-col py-4 space-y-2 font-body text-sm font-medium tracking-wide z-20 shrink-0 transition-all duration-300 relative",
      isCollapsed ? "w-20" : "w-64"
    )}>
      {/* Collapse Toggle Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onToggle}
            className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-surface border border-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary shadow-sm z-50 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">
              {isCollapsed ? "chevron_right" : "chevron_left"}
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">
          {isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        </TooltipContent>
      </Tooltip>

      <div className={cn("px-6 mb-8 transition-all")}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary-container flex items-center justify-center text-on-primary-container font-black shrink-0">
            A
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden whitespace-nowrap">
              <div className="text-xl font-black text-on-surface">Aegis Studio</div>
              <div className="text-[10px] uppercase tracking-widest text-on-surface-variant opacity-70">
                AI-Native DB
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="px-3 flex-1 flex flex-col space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Tooltip key={item.path}>
              <TooltipTrigger asChild>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 transition-all duration-200 rounded-lg",
                    isActive
                      ? "text-primary bg-primary/5"
                      : "text-on-surface-variant opacity-70 hover:bg-surface-container hover:text-on-surface",
                    isCollapsed && "justify-center px-0"
                  )}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
            </Tooltip>
          );
        })}
      </div>
      <div className={cn("px-6 py-4 transition-all", isCollapsed && "px-4")}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className={cn(
              "w-full py-2 bg-primary-container text-on-primary-container rounded-lg font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all duration-150 overflow-hidden",
              isCollapsed ? "h-10 w-10 p-0 rounded-full" : "px-4"
            )}>
              <span className="material-symbols-outlined text-sm">add</span>
              {!isCollapsed && <span className="whitespace-nowrap text-xs">New Query</span>}
            </button>
          </TooltipTrigger>
          {isCollapsed && <TooltipContent side="right">New Query</TooltipContent>}
        </Tooltip>
      </div>
      <div className="px-3 border-t border-surface-container-high pt-4 space-y-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              className={cn(
                "flex items-center gap-3 px-4 py-2 text-on-surface-variant opacity-70 hover:bg-surface-container hover:text-on-surface transition-all duration-200 rounded-lg",
                isCollapsed && "justify-center px-0"
              )}
              href="#"
            >
              <span className="material-symbols-outlined">menu_book</span>
              {!isCollapsed && <span>Docs</span>}
            </a>
          </TooltipTrigger>
          {isCollapsed && <TooltipContent side="right">Docs</TooltipContent>}
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              className={cn(
                "flex items-center gap-3 px-4 py-2 text-on-surface-variant opacity-70 hover:bg-surface-container hover:text-on-surface transition-all duration-200 rounded-lg",
                isCollapsed && "justify-center px-0"
              )}
              href="#"
            >
              <span className="material-symbols-outlined">logout</span>
              {!isCollapsed && <span>Logout</span>}
            </a>
          </TooltipTrigger>
          {isCollapsed && <TooltipContent side="right">Logout</TooltipContent>}
        </Tooltip>
      </div>
    </aside>
  );
}
