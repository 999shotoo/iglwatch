"use client";

import Link from "next/link";
import { unbounded } from "@/lib/fonts";
import { MonitorPlay } from "lucide-react";
import { siteConfig } from "@/lib/config";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Season 1", href: "/season-1" },
  { name: "Season 2", href: "/season-2" },
  { name: "Specials", href: "/specials" },
];

const legal = [
  { name: "About", href: "/about" },
  { name: "Disclaimer", href: "/disclaimer" },
  { name: "Privacy", href: "/privacy" },
  { name: "Terms", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="w-full pb-6 pt-4 mt-8">
      <div className="flex flex-col md:flex-row items-center justify-between border rounded-2xl bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-6 py-8 md:py-6 gap-6 shadow-sm">
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className={`text-xl md:text-2xl font-black tracking-tight ${unbounded.className} text-primary`}>{siteConfig.name}</span>
          </Link>
          <p className="text-sm text-muted-foreground text-center md:text-left max-w-xs font-medium">
            Your premium destination for watching India's Got Latent episodes.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-4">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-semibold transition-colors hover:text-primary text-muted-foreground"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {legal.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-xs font-medium transition-colors hover:text-foreground text-muted-foreground/80"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center mt-6">
        <p className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-widest">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
