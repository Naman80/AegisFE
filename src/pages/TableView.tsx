import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/features/TableView/StatusBadge";
import { Card } from "@/components/ui/Card";
import TopNavBar from "@/components/layout/TopNavBar";
import type { UserRow } from "@/types";

const MOCK_USERS: UserRow[] = [
  { id: "USR-00291", name: "Alex Rivera", email: "alex.r@studio.aegis", status: "ACTIVE", ltv: "$12,450.00", date: "Oct 12, 2023" },
  { id: "USR-00292", name: "Sarah Chen", email: "chen.s@gmail.com", status: "PENDING", ltv: "$8,210.50", date: "Oct 14, 2023" },
  { id: "USR-00293", name: "Marcus Thorne", email: "m.thorne@vector.io", status: "ACTIVE", ltv: "$25,000.00", date: "Oct 15, 2023" },
  { id: "USR-00294", name: "Elena Rodriguez", email: "elena.r@neural.ai", status: "SUSPENDED", ltv: "$0.00", date: "Oct 16, 2023" },
  { id: "USR-00295", name: "James Wilson", email: "j.wilson@tech.co", status: "ACTIVE", ltv: "$4,120.00", date: "Oct 18, 2023" },
  { id: "USR-00296", name: "Sophia Varga", email: "s.varga@v-corp.com", status: "ACTIVE", ltv: "$19,200.75", date: "Oct 19, 2023" },
];

export default function TableView() {
  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      <TopNavBar />
      {/* Table Toolbar */}
      <section className="px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-surface-container-high bg-background shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex bg-surface-container-low p-1 rounded-lg">
            <Button variant="secondary" size="chip" className="bg-surface-container-high text-primary">
              <span className="material-symbols-outlined text-sm">table_rows</span>
              Data View
            </Button>
            <Button variant="ghost" size="chip">
              <span className="material-symbols-outlined text-sm">analytics</span>
              Schema View
            </Button>
          </div>
          <div className="h-6 w-px bg-surface-container-high mx-2" />
          <Button variant="outline" size="chip">
            <span className="material-symbols-outlined text-sm">filter_list</span>
            Filter
          </Button>
          <Button variant="outline" size="chip">
            <span className="material-symbols-outlined text-sm">swap_vert</span>
            Sort
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon">
            <span className="material-symbols-outlined text-[20px]">more_horiz</span>
          </Button>
          <Button variant="primary" size="chip">
            <span className="material-symbols-outlined text-sm">add</span>
            Add Row
          </Button>
        </div>
      </section>

      {/* Data Grid Wrapper */}
      <div className="flex-1 px-6 pb-6 pt-6 overflow-hidden flex flex-col min-h-0 bg-surface">
        <Card variant="default" className="flex-1 overflow-hidden flex flex-col border-surface-container-high bg-surface rounded-xl p-0">
          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="sticky top-0 bg-surface z-10 border-b border-surface-container-high">
                <tr>
                  <th className="w-12 px-4 py-3 bg-surface">
                    <input
                      className="w-4 h-4 rounded border-surface-container-high bg-surface-container-lowest text-primary focus:ring-0"
                      type="checkbox"
                    />
                  </th>
                  {[
                    { label: "ID", icon: "tag" },
                    { label: "Customer Name", icon: "person" },
                    { label: "Email", icon: "mail" },
                    { label: "Status", icon: "check_circle" },
                    { label: "LTV", icon: "payments" },
                    { label: "Created At", icon: "calendar_month" },
                  ].map((header) => (
                    <th
                      key={header.label}
                      className="group px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant border-r border-surface-container-high/40 hover:bg-surface-container cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">
                            {header.icon}
                          </span>
                          {header.label}
                        </span>
                        <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          keyboard_arrow_down
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high/50">
                {MOCK_USERS.map((user) => (
                  <tr
                    key={user.id}
                    className="group hover:bg-surface-container-low transition-colors"
                  >
                    <td className="px-4 py-3">
                      <input
                        className="w-4 h-4 rounded border-surface-container-high bg-surface-container-lowest text-primary focus:ring-0"
                        type="checkbox"
                      />
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-on-surface-variant">
                      {user.id}
                    </td>
                    <td className="px-4 py-3 text-sm grid-cell outline-none" contentEditable>
                      {user.name}
                    </td>
                    <td
                      className="px-4 py-3 text-sm grid-cell outline-none text-on-surface-variant"
                      contentEditable
                    >
                      {user.email}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-4 py-3 text-sm font-mono" contentEditable>
                      {user.ltv}
                    </td>
                    <td className="px-4 py-3 text-sm text-on-surface-variant">
                      {user.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Pagination Footer */}
        <footer className="mt-4 flex flex-wrap gap-4 items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <p className="text-xs text-on-surface-variant">
              Showing{" "}
              <span className="text-on-surface font-semibold">1-25</span> of{" "}
              <span className="text-on-surface font-semibold">1,492</span> rows
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                Per Page:
              </span>
              <select className="bg-surface-container-low border-none text-[10px] font-bold rounded-lg px-2 py-1 text-on-surface focus:ring-0 cursor-pointer">
                <option>25</option>
                <option>50</option>
                <option>100</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" disabled>
              <span className="material-symbols-outlined text-lg">first_page</span>
            </Button>
            <Button variant="ghost" size="icon" disabled>
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </Button>
            <div className="flex items-center gap-1 px-4">
              <span className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded cursor-pointer">
                1
              </span>
              <span className="text-xs font-medium px-2 py-1 text-on-surface-variant hover:bg-surface-container rounded cursor-pointer transition-colors">
                2
              </span>
              <span className="text-xs font-medium px-2 py-1 text-on-surface-variant hover:bg-surface-container rounded cursor-pointer transition-colors">
                3
              </span>
              <span className="text-xs font-medium px-2 py-1 text-on-surface-variant">
                ...
              </span>
              <span className="text-xs font-medium px-2 py-1 text-on-surface-variant hover:bg-surface-container rounded cursor-pointer transition-colors">
                60
              </span>
            </div>
            <Button variant="ghost" size="icon">
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </Button>
            <Button variant="ghost" size="icon">
              <span className="material-symbols-outlined text-lg">last_page</span>
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}
