"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  Dialog,
  DialogBackdrop,
  DialogPopup,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import { APP_SHELL_COPY } from "./copy";

interface NavLink {
  href: string;
  label: string;
}

const PRIMARY_LINKS: NavLink[] = [
  { href: "/reconcile", label: APP_SHELL_COPY.linkReconcile },
  { href: "/ledgers", label: APP_SHELL_COPY.linkLedgers },
  { href: "/goals", label: APP_SHELL_COPY.linkGoals },
  { href: "/investments", label: APP_SHELL_COPY.linkInvestments },
  { href: "/annuities", label: APP_SHELL_COPY.linkAnnuities },
  { href: "/accounts", label: APP_SHELL_COPY.linkAccounts },
  { href: "/profile", label: APP_SHELL_COPY.linkProfile },
];

const MOBILE_TABS: NavLink[] = [
  { href: "/reconcile", label: APP_SHELL_COPY.linkReconcile },
  { href: "/ledgers", label: APP_SHELL_COPY.linkLedgers },
  { href: "/goals", label: APP_SHELL_COPY.linkGoals },
  { href: "/investments", label: APP_SHELL_COPY.linkInvest },
];

const OVERFLOW_LINKS: NavLink[] = [
  { href: "/annuities", label: APP_SHELL_COPY.linkAnnuities },
  { href: "/accounts", label: APP_SHELL_COPY.linkAccounts },
  { href: "/profile", label: APP_SHELL_COPY.linkProfile },
];

function isActiveRoute(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export interface AppShellNavViewProps {
  pathname: string;
  children: React.ReactNode;
}

export function AppShellNavView({ pathname, children }: AppShellNavViewProps) {
  const [overflowOpen, setOverflowOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="hidden border-b bg-background md:flex">
        <nav className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
          <Link
            href="/reconcile"
            className="text-base font-bold tracking-tight"
          >
            {APP_SHELL_COPY.brand}
          </Link>
          <ul className="flex items-center gap-1">
            {PRIMARY_LINKS.map((link) => {
              const active = isActiveRoute(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted",
                      active && "font-semibold",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            aria-label={APP_SHELL_COPY.userMenuLabel}
            className="grid size-8 place-items-center rounded-full bg-muted text-xs font-medium"
          >
            RM
          </button>
        </nav>
      </header>

      <header className="flex h-14 items-center justify-between border-b bg-background px-4 md:hidden">
        <button
          type="button"
          aria-label={APP_SHELL_COPY.menuButtonLabel}
          onClick={() => {
            setOverflowOpen(true);
          }}
          className="grid size-9 place-items-center rounded-md hover:bg-muted"
        >
          <Menu aria-hidden="true" className="size-5" />
        </button>
        <span className="text-base font-bold tracking-tight">
          {APP_SHELL_COPY.brand}
        </span>
        <button
          type="button"
          aria-label={APP_SHELL_COPY.userMenuLabel}
          className="grid size-8 place-items-center rounded-full bg-muted text-xs font-medium"
        >
          RM
        </button>
      </header>

      <main className="flex-1 pb-20 md:pb-0">{children}</main>

      <nav
        aria-label={APP_SHELL_COPY.mobileNavLabel}
        className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-stretch border-t bg-background md:hidden"
      >
        {MOBILE_TABS.map((tab) => {
          const active = isActiveRoute(pathname, tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-1 items-center justify-center text-xs",
                active ? "font-semibold" : "text-muted-foreground",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => {
            setOverflowOpen(true);
          }}
          className="flex flex-1 items-center justify-center text-xs text-muted-foreground"
        >
          {APP_SHELL_COPY.moreLabel}
        </button>
      </nav>

      <Dialog open={overflowOpen} onOpenChange={setOverflowOpen}>
        <DialogPortal>
          <DialogBackdrop className="z-50" />
          <DialogPopup className="max-w-sm">
            <DialogTitle>{APP_SHELL_COPY.moreOverflowTitle}</DialogTitle>
            <ul className="mt-4 flex flex-col gap-1">
              {OVERFLOW_LINKS.map((link) => {
                const active = isActiveRoute(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => {
                        setOverflowOpen(false);
                      }}
                      className={cn(
                        "block rounded-md px-3 py-2 text-sm hover:bg-muted",
                        active && "font-semibold",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </DialogPopup>
        </DialogPortal>
      </Dialog>
    </div>
  );
}

export function AppShellNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return <AppShellNavView pathname={pathname}>{children}</AppShellNavView>;
}
