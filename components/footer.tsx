import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
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
    <footer className="relative mt-12 border-t border-border py-8">
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-3">
          <Link href="/" className="flex w-fit items-center gap-2" aria-label={`${siteConfig.name} home`}>
            <BrandMark className="size-7 rounded-lg" />
            <span className="text-base font-bold tracking-tight text-foreground">
              {siteConfig.name}
            </span>
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            A fan-made archive for India&apos;s Got Latent full episodes, bonus clips, and
            exclusive footage.
          </p>
        </div>

        <div className="flex flex-col gap-4 md:items-end">
          <div className="flex flex-wrap items-center gap-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="rounded-md border border-border bg-muted/40 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-foreground/25 hover:bg-muted hover:text-foreground"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {legal.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-xs font-medium text-muted-foreground/70 transition-colors hover:text-foreground"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-8 max-w-3xl text-xs leading-relaxed text-muted-foreground/60">
        © {new Date().getFullYear()} {siteConfig.name}. Not affiliated with the official
        production. All episodes, artwork, and trademarks belong to their respective owners.
      </p>
    </footer>
  );
}
