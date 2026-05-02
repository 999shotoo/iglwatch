"use client";

import Link from "next/link";
import { ArrowRight, Menu, Search, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { ModeToggle } from "./theme-toggle";
import { Input } from "./ui/input";
import { unbounded } from "@/lib/fonts";
import { siteConfig } from "@/lib/config";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Season 1", href: "/season-1" },
  { name: "Season 2", href: "/season-2" },
  { name: "Specials", href: "/specials" },
];

export function SearchBar() {
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/search?q=${(e.target as HTMLFormElement).query.value}`)
  }

  return (
    <div className="relative hidden lg:flex w-64">
      <form onSubmit={handleSearch} className="w-full" id="search-form">
        <Input
          id="input-26"
          name="query"
          className="peer pe-9 ps-9 border-border/50 bg-muted/30 focus-visible:bg-background transition-colors"
          placeholder="Search..."
          type="search"
        />
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
          <Search size={16} strokeWidth={2} />
        </div>
        <button
          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 hover:text-foreground transition-colors"
          aria-label="Submit search"
          type="submit"
        >
          <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    router.push(`/search?q=${(e.target as HTMLFormElement).query.value}`);
  }

  return (
    <>
      <nav className="sticky top-0 z-50 w-full py-2">
        <div className="flex h-16 items-center justify-between border rounded-2xl bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/60 px-4 shadow-sm">
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <span className={`text-lg sm:text-xl md:text-2xl font-black tracking-tight ${unbounded.className} text-primary`}>{siteConfig.name}</span>
          </Link>

          {/* Desktop Nav - Flex naturally */}
          <div className="hidden lg:flex flex-1 justify-center items-center space-x-4 xl:space-x-8 px-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-bold tracking-wide transition-colors hover:text-primary whitespace-nowrap ${pathname === item.href ? "text-primary" : "text-muted-foreground"}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-end gap-3 shrink-0">
            <SearchBar />
            <ModeToggle />

            {/* Mobile Hamburger Button */}
            <button
              className="lg:hidden p-2 -mr-2 text-foreground hover:text-primary transition-colors focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-background/85 backdrop-blur-3xl xl:hidden pt-28 px-6 pb-6 flex flex-col"
          >
            <div className="flex flex-col space-y-2 mt-2">
              {navigation.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center justify-between py-5 border-b border-border/40 text-2xl sm:text-3xl font-black tracking-tight transition-all duration-300 ${pathname === item.href ? "text-primary pl-2 border-primary/20" : "text-foreground hover:text-primary hover:pl-2"}`}
                  >
                    {item.name}
                    <ArrowRight size={24} className={`transition-transform duration-300 ${pathname === item.href ? "text-primary transform translate-x-1" : "text-muted-foreground/20 -translate-x-2"}`} strokeWidth={3} />
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-auto pb-6"
            >
              <form onSubmit={handleMobileSearch} className="relative w-full shadow-sm">
                <Input
                  name="query"
                  className="w-full h-14 text-base rounded-2xl pe-12 ps-12 bg-card border-border/60 focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-primary"
                  placeholder="Search episodes..."
                  type="search"
                />
                <div className="absolute inset-y-0 start-0 flex items-center justify-center ps-4 text-muted-foreground">
                  <Search size={18} strokeWidth={2.5} />
                </div>
                <button
                  className="absolute inset-y-0 end-0 flex h-full w-12 items-center justify-center rounded-e-2xl text-primary hover:text-primary/80 transition-colors"
                  type="submit"
                >
                  <ArrowRight size={18} strokeWidth={2.5} />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
