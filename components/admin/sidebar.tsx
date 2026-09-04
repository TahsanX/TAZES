"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Trophy,
  CalendarDays,
  FileText,
  Home,
  Settings,
  LogOut,
} from "lucide-react";
import { logout } from "@/app/actions/auth";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/home", label: "Home Page", icon: Home },
  { href: "/admin/committee", label: "Committee", icon: Users },
  { href: "/admin/alumni", label: "Alumni", icon: UserCheck },
  { href: "/admin/achievements", label: "Achievements", icon: Trophy },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/certificates", label: "Certificates", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ pendingCount }: { pendingCount: number }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border bg-card">
      <div className="border-b border-border p-5 font-bold text-foreground">Admin Panel</div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {LINKS.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              )}
            >
              <span className="flex items-center gap-2">
                <Icon className="h-4 w-4" /> {link.label}
              </span>
              {link.href === "/admin/alumni" && pendingCount > 0 && (
                <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                  {pendingCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="flex items-center gap-2 border-t border-border p-3">
        <form action={logout} className="flex-1">
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </form>
        <ThemeToggle />
      </div>
    </aside>
  );
}
