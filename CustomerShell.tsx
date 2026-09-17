"use client";

import { LanguageProvider, useLanguage } from "@/components/customer/LanguageProvider";
import { clearDemoSession, getDemoSession, type DemoSession } from "@/lib/demo-session";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type NavItem = {
  href: string;
  icon: string;
  labelKey:
    | "dashboard"
    | "requestPickup"
    | "waste"
    | "prices"
    | "transactions"
    | "receipts"
    | "profile"
    | "settings"
    | "notifications"
    | "help";
};

const desktopNavigation: NavItem[] = [
  { href: "/customer/dashboard", icon: "⌂", labelKey: "dashboard" },
  { href: "/customer/request-pickup", icon: "♻", labelKey: "requestPickup" },
  { href: "/customer/waste", icon: "◈", labelKey: "waste" },
  { href: "/customer/price-estimate", icon: "₹", labelKey: "prices" },
  { href: "/customer/transactions", icon: "▤", labelKey: "transactions" },
  { href: "/customer/receipts", icon: "▧", labelKey: "receipts" },
  { href: "/customer/notifications", icon: "♧", labelKey: "notifications" },
  { href: "/customer/profile", icon: "◉", labelKey: "profile" },
  { href: "/customer/settings", icon: "⚙", labelKey: "settings" },
  { href: "/customer/help", icon: "?", labelKey: "help" }
];

const mobileNavigation: NavItem[] = [
  { href: "/customer/dashboard", icon: "⌂", labelKey: "dashboard" },
  { href: "/customer/request-pickup", icon: "♻", labelKey: "requestPickup" },
  { href: "/customer/transactions", icon: "▤", labelKey: "transactions" },
  { href: "/customer/receipts", icon: "▧", labelKey: "receipts" },
  { href: "/customer/profile", icon: "◉", labelKey: "profile" }
];

function Navigation({
  items,
  compact = false
}: {
  items: NavItem[];
  compact?: boolean;
}) {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <nav
      className={compact ? "grid grid-cols-5" : "space-y-1"}
      aria-label={compact ? "Mobile customer navigation" : "Customer navigation"}
    >
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            className={
              compact
                ? "flex flex-col items-center gap-1 px-1 py-2 text-[10px] font-semibold " +
                  (active ? "text-forest-700" : "text-slate-500")
                : "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition " +
                  (active
                    ? "bg-forest-50 text-forest-800"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950")
            }
            href={item.href}
            key={item.href}
          >
            <span aria-hidden="true" className={compact ? "text-lg" : "text-xl"}>
              {item.icon}
            </span>
            <span className={compact ? "truncate" : ""}>{t(item.labelKey)}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function ShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<DemoSession | null>(null);
  const [ready, setReady] = useState(false);
  const isAuthRoute = pathname === "/customer/login" || pathname === "/customer/register";

  useEffect(() => {
    const savedSession = getDemoSession();
    setSession(savedSession);
    setReady(true);
    if (!isAuthRoute && !savedSession) router.replace("/customer/login");
  }, [isAuthRoute, router, pathname]);

  const logOut = () => {
    clearDemoSession();
    setSession(null);
    router.push("/customer/login");
  };

  if (!ready && !isAuthRoute) {
    return (
      <div className="grid min-h-screen place-items-center bg-forest-50 text-sm font-medium text-forest-800">
        Checking your demo session…
      </div>
    );
  }

  if (isAuthRoute) {
    return <main className="min-h-screen bg-forest-50">{children}</main>;
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-slate-200 bg-white p-5 lg:block">
        <Link className="flex items-center gap-3 px-2" href="/customer/dashboard">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-forest-700 text-xl text-white">♻</span>
          <span>
            <span className="block font-bold tracking-tight text-slate-950">Kabadiwala</span>
            <span className="block text-xs font-medium text-forest-700">CONNECT</span>
          </span>
        </Link>
        <p className="mt-8 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
          Customer menu
        </p>
        <div className="mt-3">
          <Navigation items={desktopNavigation} />
        </div>
        <div className="absolute inset-x-5 bottom-5 rounded-2xl bg-forest-50 p-4">
          <p className="text-sm font-bold text-forest-900">{session.name}</p>
          <p className="mt-1 truncate text-xs text-forest-700">{session.emailOrPhone}</p>
          <button
            className="mt-3 text-xs font-bold text-forest-800 underline underline-offset-4"
            onClick={logOut}
            type="button"
          >
            Log out
          </button>
        </div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-7">
          <Link className="flex items-center gap-2 lg:hidden" href="/customer/dashboard">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-forest-700 text-white">♻</span>
            <span className="font-bold text-slate-950">Kabadiwala Connect</span>
          </Link>
          <p className="hidden text-sm font-medium text-slate-600 lg:block">Household customer portal</p>
          <div className="flex items-center gap-3">
            <Link
              aria-label="Open notifications"
              className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-lg hover:bg-slate-50"
              href="/customer/notifications"
            >
              ♧
            </Link>
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-extrabold tracking-wide text-amber-800">
              DEMO MODE
            </span>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 pb-24 sm:px-7 sm:py-8 lg:pb-8">{children}</main>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white lg:hidden">
        <Navigation compact items={mobileNavigation} />
      </div>
    </div>
  );
}

export function CustomerShell({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ShellContent>{children}</ShellContent>
    </LanguageProvider>
  );
}
