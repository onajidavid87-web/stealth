import { motion } from "framer-motion";
import {
  Inbox, Star, FileText, Send, ShieldAlert, Archive, Trash2,
  Hash, Plus, ChevronsLeft, ChevronsRight, Sparkles, Pencil
} from "lucide-react";
import { cn } from "@/lib/utils";

type Folder = "inbox" | "starred" | "drafts" | "sent" | "spam" | "archive" | "trash";

const items: { key: Folder; label: string; icon: any; count?: number }[] = [
  { key: "inbox", label: "Inbox", icon: Inbox, count: 12 },
  { key: "starred", label: "Starred", icon: Star, count: 4 },
  { key: "drafts", label: "Drafts", icon: FileText, count: 2 },
  { key: "sent", label: "Sent", icon: Send },
  { key: "spam", label: "Spam", icon: ShieldAlert },
  { key: "archive", label: "Archive", icon: Archive },
  { key: "trash", label: "Trash", icon: Trash2 },
];

const folders = [
  { name: "Clients", color: "oklch(0.85 0.005 270)" },
  { name: "Investors", color: "oklch(0.75 0.005 270)" },
  { name: "Personal", color: "oklch(0.65 0.005 270)" },
];

export function Sidebar({
  active, onSelect, collapsed, onToggle, onCompose,
}: {
  active: Folder;
  onSelect: (f: Folder) => void;
  collapsed: boolean;
  onToggle: () => void;
  onCompose: () => void;
}) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 76 : 264 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      className="glass relative z-10 m-3 mr-0 hidden h-[calc(100vh-1.5rem)] flex-col rounded-2xl p-3 md:flex"
    >
      {/* Brand */}
      <div className="flex items-center gap-2 px-2 py-2">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          style={{ background: "var(--gradient-silver)" }}
        >
          <Sparkles className="h-4 w-4 text-[oklch(0.2_0.005_270)]" />
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight silver-text">Aether Mail</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">workspace</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="ml-auto rounded-md p-1.5 text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Compose */}
      <motion.button
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.97 }}
        onClick={onCompose}
        className={cn(
          "group mt-3 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium",
          "border border-white/10 bg-white/5 text-foreground",
          "shadow-[0_8px_30px_-10px_rgba(0,0,0,0.6)] transition hover:bg-white/10",
          collapsed && "justify-center px-2"
        )}
      >
        <Pencil className="h-4 w-4" />
        {!collapsed && <span>Compose</span>}
        {!collapsed && (
          <span className="ml-auto rounded-md border border-white/10 bg-black/30 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            ⌘N
          </span>
        )}
      </motion.button>

      {/* Folders */}
      <nav className="scrollbar-thin mt-4 flex-1 overflow-y-auto pr-1">
        <ul className="space-y-0.5">
          {items.map((it) => {
            const isActive = active === it.key;
            const Icon = it.icon;
            return (
              <li key={it.key}>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelect(it.key)}
                  className={cn(
                    "relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                    "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
                    isActive && "text-foreground",
                    collapsed && "justify-center px-2"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-lg"
                      style={{
                        background: "linear-gradient(180deg, oklch(1 0 0 / 0.06), oklch(1 0 0 / 0.02))",
                        boxShadow: "inset 0 0 0 1px oklch(1 0 0 / 0.08)",
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <Icon className="relative h-4 w-4 shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="relative">{it.label}</span>
                      {it.count !== undefined && (
                        <span className="relative ml-auto text-[11px] tabular-nums text-muted-foreground">
                          {it.count}
                        </span>
                      )}
                    </>
                  )}
                </motion.button>
              </li>
            );
          })}
        </ul>

        {!collapsed && (
          <>
            <div className="mt-6 mb-2 flex items-center justify-between px-3">
              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Folders</span>
              <button className="rounded p-1 text-muted-foreground transition hover:bg-white/5 hover:text-foreground">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <ul className="space-y-0.5">
              {folders.map((f) => (
                <li key={f.name}>
                  <button className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-white/[0.04] hover:text-foreground">
                    <Hash className="h-3.5 w-3.5" style={{ color: f.color }} />
                    <span>{f.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </nav>

      {/* Account */}
      <div className={cn("mt-3 flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-2", collapsed && "justify-center")}>
        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full" style={{ background: "linear-gradient(135deg, #4d5560, #232326)" }}>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white/90">EN</span>
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1 leading-tight">
            <div className="truncate text-xs font-medium text-foreground">Eve Navarro</div>
            <div className="truncate text-[11px] text-muted-foreground">eve@aether.app</div>
          </div>
        )}
        {!collapsed && <span className="pulse-dot ml-auto h-1.5 w-1.5 rounded-full bg-[oklch(0.85_0.005_270)]" />}
      </div>
    </motion.aside>
  );
}
