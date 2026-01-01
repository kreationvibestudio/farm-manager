"use client";

import Link from "next/link";
import { LayoutDashboard, Package, Truck, Settings, Sprout, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Harvest & Deliverables", href: "/harvest", icon: Sprout },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Fleet & Vehicles", href: "/fleet", icon: Truck },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className={cn("flex h-screen w-64 flex-col border-r border-border bg-card", className)}>
      <div className="flex h-16 items-center px-6 border-b border-border">
        <div className="flex items-center gap-2 font-bold text-xl text-primary">
          <Sprout className="h-6 w-6" />
          <span>FarmManager</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} aria-hidden="true" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {session?.user?.name?.[0] || "A"}
          </div>
          <div className="text-sm overflow-hidden">
            <p className="font-medium truncate">{session?.user?.name || "Admin User"}</p>
            <p className="text-xs text-muted-foreground truncate">{session?.user?.email || "admin@plantation.com"}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
