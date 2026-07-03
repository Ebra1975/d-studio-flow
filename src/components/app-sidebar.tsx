import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Package,
  Factory,
  Receipt,
  Boxes,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, exact: true },
  { title: "Anagrafica", url: "/anagrafica", icon: Users },
  { title: "Commesse", url: "/commesse", icon: ClipboardList },
  { title: "Magazzino", url: "/magazzino", icon: Package },
  { title: "Produzione", url: "/produzione", icon: Factory },
  { title: "Amministrazione", url: "/amministrazione", icon: Receipt },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  const isActive = (url: string, exact?: boolean) =>
    exact ? pathname === url : pathname === url || pathname.startsWith(url + "/");

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Boxes className="h-4 w-4" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold">Bottega 3D</span>
          <span className="text-[11px] text-muted-foreground">Gestionale laboratorio</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        <div className="px-2 pb-1 pt-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Uffici virtuali
        </div>
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => {
            const active = isActive(item.url, item.exact);
            return (
              <li key={item.url}>
                <Link
                  to={item.url}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
            AR
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-medium">Artigiano</span>
            <span className="text-[11px] text-muted-foreground">Titolare laboratorio</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
