import { cn } from "@/lib/utils";

type BrandMarkProps = {
  /** Size and radius utilities, e.g. `size-9 rounded-lg`. */
  className?: string;
};

/**
 * Flat monochrome app mark: a solid tile with a simple play glyph.
 * No gradients, rings, or shadows so it stays matte at every size.
 */
export function BrandMark({ className }: BrandMarkProps) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-lg bg-foreground text-background",
        className
      )}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[58%]">
        <path
          d="M8.6 6.4c0-.94 1.03-1.5 1.81-1l8.1 5.6c.7.48.7 1.52 0 2l-8.1 5.6c-.78.5-1.81-.06-1.81-1V6.4Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}
