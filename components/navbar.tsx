"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  Clapperboard,
  House,
  Menu,
  MessageSquare,
  Play,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { BrandMark } from "./brand-mark";
import { ModeToggle } from "./theme-toggle";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

type NavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  /** Small number rendered on the icon tile, e.g. season number. */
  marker?: string;
  description: string;
};

const navigation: NavItem[] = [
  {
    name: "Home",
    href: "/",
    icon: House,
    description: "Featured picks and the latest episodes",
  },
  {
    name: "Season 1",
    href: "/season-1",
    icon: Clapperboard,
    marker: "1",
    description: "Where the latent talent began",
  },
  {
    name: "Season 2",
    href: "/season-2",
    icon: Clapperboard,
    marker: "2",
    description: "The next chapter of chaos",
  },
  {
    name: "Specials",
    href: "/specials",
    icon: Sparkles,
    description: "Bonus clips and exclusive footage",
  },
];

function NavGlyph({ item, className }: { item: NavItem; className?: string }) {
  const Icon = item.icon;

  return (
    <span className="relative grid place-items-center">
      <Icon className={cn("shrink-0", className)} strokeWidth={1.9} />
      {item.marker && (
        <span className="absolute -right-2.5 -top-2 grid size-3.5 place-items-center rounded-full bg-primary text-[8px] font-black leading-none text-primary-foreground ring-2 ring-background">
          {item.marker}
        </span>
      )}
    </span>
  );
}

export function Navbar({ watchHref }: { watchHref: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Prevent scrolling while the mobile menu is open.
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close overlays with Escape.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const query = String(data.get("q") || "").trim();
    event.currentTarget.reset();
    setIsOpen(false);
    setIsSearchOpen(false);
    router.push(`/search${query ? `?q=${encodeURIComponent(query)}` : ""}`);
  };

  return (
    <>
      {/* Desktop icon rail */}
      <aside className="fixed left-0 top-0 z-50 hidden h-dvh w-16 flex-col items-center border-r border-border bg-background min-[900px]:flex">
        <Link
          href="/"
          aria-label={`${siteConfig.name} home`}
          className="group mt-2.5 flex size-11 items-center justify-center rounded-2xl transition-transform duration-150 active:scale-95"
        >
          <BrandMark className="size-9 rounded-lg" />
        </Link>

        <span className="my-2 h-px w-6 bg-border/60" />

        <nav
          aria-label="Primary navigation"
          className="scrollbar-none flex flex-1 flex-col items-center gap-1.5 overflow-y-auto py-1"
        >
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                aria-label={item.name}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative flex size-11 items-center justify-center rounded-2xl transition-all duration-200 active:scale-95",
                  active
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                )}
              >
                {active && (
                  <span className="absolute -left-2.5 h-5 w-[3px] rounded-full bg-foreground" />
                )}
                <NavGlyph item={item} className="size-5" />
                <span className="pointer-events-none absolute left-[calc(100%+12px)] z-50 hidden whitespace-nowrap rounded-lg border border-border bg-popover px-2.5 py-1.5 text-xs font-semibold text-popover-foreground group-hover:block">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mb-3 flex flex-col items-center gap-2">
          <ModeToggle />
          {/*<a
            href="https://discord.gg/5AGCTmdq82"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Join Discord"
            className="flex size-11 items-center justify-center rounded-2xl text-muted-foreground transition-colors hover:bg-muted hover:text-[#5865F2]"
            title="Join Discord"
          >
            <MessageSquare className="size-5" />
          </a>*/}
        </div>
      </aside>

      {/* Top bar */}
      <header className="fixed inset-x-0 top-0 z-40 h-14 border-b border-border bg-background min-[900px]:left-16">
        <div className="relative flex h-full w-full items-center gap-2 px-3 sm:px-4 min-[900px]:px-6">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 min-[900px]:hidden"
            aria-label={`${siteConfig.name} home`}
          >
            <BrandMark className="size-8 rounded-lg" />
            <span className="text-[15px] font-bold tracking-tight">{siteConfig.name}</span>
          </Link>

          <div className="hidden flex-1 items-center justify-center px-4 min-[900px]:flex">
            <form
              onSubmit={handleSearch}
              role="search"
              className="relative flex w-full max-w-xl items-center"
            >
              <Search className="pointer-events-none absolute left-4 size-4 text-muted-foreground/80" />
              <input
                name="q"
                type="search"
                maxLength={200}
                autoComplete="off"
                placeholder="Search episodes, guests, moments…"
                aria-label="Search episodes"
                className="h-10 w-full rounded-lg border border-border bg-muted/40 pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 hover:bg-muted/60 focus:border-foreground/30 focus:bg-muted/70"
              />
              {/*<div className="absolute right-1.5 flex items-center gap-1">
                <kbd className="hidden rounded-md border border-border bg-background px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground lg:block">
                  Enter
                </kbd>
                <button
                  type="submit"
                  aria-label="Search"
                  className="grid size-8 place-items-center rounded-md bg-foreground text-background transition-colors hover:bg-foreground/85"
                >
                  <Search className="size-3.5" />
                </button>
              </div>*/}
            </form>
          </div>

          <div className="ml-auto flex items-center gap-1.5 min-[900px]:ml-0">
            <Link
              href="https://discord.gg/5AGCTmdq82"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-8 items-center gap-2 rounded-lg bg-[#5865F2] pl-3 pr-4 text-xs font-semibold text-white shadow-sm shadow-[#5865F2]/30 transition-all hover:bg-[#4752C4] hover:shadow-md hover:shadow-[#5865F2]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5865F2] focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] md:inline-flex"
            >
              <svg
                viewBox="0 0 24 24"
                role="img"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                className="size-4 fill-current"
              >
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              Join Discord
            </Link>
            <button
              type="button"
              onClick={() => setIsSearchOpen((open) => !open)}
              aria-label="Search"
              className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground min-[900px]:hidden"
            >
              <Search className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => setIsOpen((open) => !open)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground min-[900px]:hidden"
            >
              {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>

          {/* Mobile expandable search */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute inset-0 z-20 flex items-center gap-2 bg-background px-3 min-[900px]:hidden"
              >
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  aria-label="Close search"
                  className="flex size-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <ArrowLeft className="size-5" />
                </button>
                <form
                  onSubmit={handleSearch}
                  role="search"
                  className="relative flex flex-1 items-center"
                >
                  <Search className="pointer-events-none absolute left-3.5 size-4 text-muted-foreground" />
                  <input
                    name="q"
                    type="search"
                    autoFocus
                    maxLength={200}
                    autoComplete="off"
                    placeholder="Search episodes…"
                    aria-label="Search episodes"
                    className="h-9 min-w-0 flex-1 rounded-lg border border-border bg-muted/50 pl-10 pr-4 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-foreground/30 focus:bg-muted/70"
                  />
                  {/*<button
                    type="submit"
                    aria-label="Search"
                    className="absolute right-1 grid size-7 place-items-center rounded-md bg-foreground text-background transition-colors hover:bg-foreground/85"
                  >
                    <Search className="size-3.5" />
                  </button>*/}
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 top-14 z-40 bg-black/70 min-[900px]:hidden"
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              aria-label="Navigation menu"
              className="fixed inset-y-0 right-0 z-50 flex w-[min(21rem,calc(100vw-2.5rem))] flex-col border-l border-border bg-background min-[900px]:hidden"
            >
              <div className="flex h-14 items-center justify-between border-b border-border/60 px-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-muted-foreground" />
                  <span className="text-sm font-bold tracking-tight">Browse</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                  className="grid size-9 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="scrollbar-none flex-1 overflow-y-auto px-3 py-4">
                <ul className="space-y-1.5">
                  {navigation.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "group flex items-center gap-3 rounded-2xl border px-3 py-3 transition-colors",
                            active
                              ? "border-border bg-muted text-foreground"
                              : "border-transparent text-foreground hover:border-border hover:bg-muted/60"
                          )}
                        >
                          <span
                            className={cn(
                              "grid size-10 shrink-0 place-items-center rounded-lg transition-colors",
                              active
                                ? "bg-foreground text-background"
                                : "bg-muted text-muted-foreground group-hover:text-foreground"
                            )}
                          >
                            <NavGlyph item={item} className="size-5" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-semibold">{item.name}</span>
                            <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                              {item.description}
                            </span>
                          </span>
                          <ChevronRight className="size-4 shrink-0 text-muted-foreground/60" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="border-t border-border/60 p-3">
                <div className="flex items-center justify-between rounded-xl px-2 py-1.5">
                  <span className="text-xs font-medium text-muted-foreground">Appearance</span>
                  <ModeToggle className="size-9 rounded-xl" />
                </div>
                <div className="mt-3">
                  <a
                    href="https://discord.gg/5AGCTmdq82"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 w-full rounded-xl bg-[#5865F2] px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-[#5865F2]/30 transition-all hover:bg-[#4752C4] hover:shadow-md hover:shadow-[#5865F2]/40 active:scale-[0.98]"
                  >
                    <MessageSquare className="size-4 shrink-0" />
                    <span>Join Discord</span>
                  </a>
                </div>
                <p className="mt-2 px-2 text-[10px] font-medium leading-relaxed text-muted-foreground/60">
                  Fan-made archive. All episodes and artwork belong to their respective owners.
                </p>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
