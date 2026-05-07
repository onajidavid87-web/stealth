import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Clock3,
  Command,
  Filter,
  Paperclip,
  Search,
  Settings,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

const quickActions: { label: string; value: string; icon: LucideIcon }[] = [
  { label: "Proofs", value: "2", icon: ShieldCheck },
  { label: "Later", value: "5", icon: Clock3 },
  { label: "Files", value: "9", icon: Paperclip },
];

export function Topbar({ onOpenPalette }: { onOpenPalette: () => void }) {
  const [focused, setFocused] = useState(false);

  return (
    <header className="glass relative m-0 flex h-14 items-center gap-2 rounded-none border-t-0 px-3">
      <motion.div
        animate={{ width: focused ? "min(34vw, 430px)" : "min(28vw, 360px)" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative flex h-9 min-w-[170px] max-w-[430px] shrink-0 items-center sm:min-w-[230px]"
      >
        <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
        <input
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onClick={onOpenPalette}
          placeholder="Search messages, people, proofs, attachments..."
          className="glow-ring h-9 w-full rounded-md border border-white/[0.07] bg-white/[0.035] pl-9 pr-20 text-[13px] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.045)] placeholder:text-muted-foreground/70 transition focus:bg-white/[0.06]"
        />
        <button
          onClick={onOpenPalette}
          className="absolute right-1.5 flex items-center gap-1 rounded border border-white/10 bg-black/30 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
        >
          <Command className="h-3 w-3" /> K
        </button>
      </motion.div>

      <div className="hidden items-center gap-1.5 lg:flex">
        {quickActions.map((action) => (
          <QuickAction key={action.label} {...action} />
        ))}
      </div>

      <div className="ml-auto flex items-center gap-1">
        <IconBtn label="Filter" className="hidden sm:flex">
          <Filter className="h-4 w-4" />
        </IconBtn>
        <IconBtn label="Notifications">
          <span className="relative">
            <Bell className="h-4 w-4" />
            <span className="pulse-dot absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-[oklch(0.85_0.005_270)]" />
          </span>
        </IconBtn>
        <IconBtn label="Settings" className="hidden sm:flex">
          <Settings className="h-4 w-4" />
        </IconBtn>
        <div className="mx-2 hidden h-6 w-px bg-white/10 sm:block" />
        <button className="flex items-center gap-2 rounded-md border border-white/5 bg-white/[0.04] px-2 py-1.5 text-xs text-foreground transition hover:bg-white/[0.08]">
          <span className="h-5 w-5 rounded-full" style={{ background: "linear-gradient(135deg,#7a8290,#2b2b31)" }} />
          <span className="hidden sm:inline">Personal</span>
        </button>
      </div>

      <AnimatePresence>
        {focused && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="pointer-events-none absolute left-3 top-full mt-2 px-1 text-[11px] text-muted-foreground"
          >
            Press <kbd className="rounded border border-white/10 bg-black/40 px-1">Ctrl+K</kbd> for the command palette
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function QuickAction({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      aria-label={label}
      className="group flex h-9 items-center gap-2 rounded-md border border-white/[0.07] bg-white/[0.035] px-2.5 text-xs text-muted-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.045)] transition hover:border-white/[0.12] hover:bg-white/[0.07] hover:text-foreground"
    >
      <Icon className="h-4 w-4" />
      <span className="hidden lg:inline">{label}</span>
      <span className="rounded border border-white/[0.08] bg-black/20 px-1.5 py-0.5 font-mono text-[10px] text-foreground/80">
        {value}
      </span>
    </motion.button>
  );
}

function IconBtn({
  children,
  label,
  className = "",
}: {
  children: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      aria-label={label}
      className={`${className} rounded-md p-2 text-muted-foreground transition hover:bg-white/[0.06] hover:text-foreground`}
    >
      {children}
    </motion.button>
  );
}
