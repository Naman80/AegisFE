import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", icon: "dashboard", label: "Dashboard" },
  { path: "/query", icon: "code", label: "Query Editor" },
  { path: "/schema", icon: "schema", label: "Schema" },
  { path: "/tables", icon: "table_chart", label: "Tables" },
  { path: "/pipelines", icon: "account_tree", label: "Pipelines" },
  { path: "/settings", icon: "settings", label: "Settings" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="h-full w-64 border-r border-surface-container-high bg-surface-container-lowest flex flex-col py-4 space-y-2 font-body text-sm font-medium tracking-wide z-10 shrink-0">
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary-container flex items-center justify-center text-on-primary-container font-black">
            A
          </div>
          <div>
            <div className="text-xl font-black text-on-surface">Aegis Studio</div>
            <div className="text-[10px] uppercase tracking-widest text-on-surface-variant opacity-70">
              AI-Native DB
            </div>
          </div>
        </div>
      </div>
      <div className="px-3 flex-1 flex flex-col space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 transition-all duration-200",
                isActive
                  ? "text-primary border-r-2 border-primary-container bg-surface"
                  : "text-on-surface-variant opacity-70 hover:bg-surface-container hover:text-on-surface"
              )}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
      <div className="px-6 py-4">
        <button className="w-full py-2 bg-primary-container text-on-primary-container rounded-lg font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform duration-150">
          <span className="material-symbols-outlined text-sm">add</span>
          New Query
        </button>
      </div>
      <div className="px-3 border-t border-surface-container-high pt-4 space-y-1">
        <a
          className="flex items-center gap-3 px-4 py-2 text-on-surface-variant opacity-70 hover:bg-surface-container hover:text-on-surface transition-all duration-200"
          href="#"
        >
          <span className="material-symbols-outlined">menu_book</span>
          <span>Docs</span>
        </a>
        <a
          className="flex items-center gap-3 px-4 py-2 text-on-surface-variant opacity-70 hover:bg-surface-container hover:text-on-surface transition-all duration-200"
          href="#"
        >
          <span className="material-symbols-outlined">logout</span>
          <span>Logout</span>
        </a>
      </div>
    </aside>
  );
}
