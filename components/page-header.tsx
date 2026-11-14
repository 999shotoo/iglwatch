import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  meta,
  icon: Icon,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "relative mb-8 overflow-hidden rounded-xl border border-border bg-card px-5 py-6 sm:px-7 md:py-8",
        className
      )}
    >
      <div className="relative">
        {eyebrow && (
          <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-border bg-muted/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            {Icon && <Icon className="size-3.5" />}
            {eyebrow}
          </div>
        )}
        <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {description}
          </p>
        )}
        {meta && (
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-semibold text-muted-foreground">
            {meta}
          </div>
        )}
      </div>
    </header>
  );
}
