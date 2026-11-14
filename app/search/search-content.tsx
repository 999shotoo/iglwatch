"use client";

import { useSearchParams } from "next/navigation";
import { EpisodeCard } from "@/components/ui/episode-card";
import { PageHeader } from "@/components/page-header";
import { Flame, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import type { Episode } from "@/lib/types";

const popularSearches = ["Samay", "Bonus", "Finale", "Raghu", "BTS", "Guests"];

export default function SearchContent({ episodes }: { episodes: Episode[] }) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const lowercaseQuery = query.toLowerCase();

  const searchResults = episodes.filter((ep) => {
    if (!query) return false;

    const inTitle = ep.title?.toLowerCase().includes(lowercaseQuery);
    const inDesc = ep.description?.toLowerCase().includes(lowercaseQuery);
    const inTags = ep.metadata?.tags?.some((tag) => tag.toLowerCase().includes(lowercaseQuery));
    const inKeywords = ep.metadata?.keywords?.some((keyword) => keyword.toLowerCase().includes(lowercaseQuery));
    const inGuests = ep.guests?.some((guest) => guest.toLowerCase().includes(lowercaseQuery));
    const inHosts = ep.hosts?.some((host) => host.toLowerCase().includes(lowercaseQuery));
    const inOverview = ep.meta?.overview?.toLowerCase().includes(lowercaseQuery);
    const inMetaGuests = ep.meta?.guestStars.some((guest) =>
      guest.name.toLowerCase().includes(lowercaseQuery)
    );

    return (
      inTitle ||
      inDesc ||
      inTags ||
      inKeywords ||
      inGuests ||
      inHosts ||
      inOverview ||
      inMetaGuests
    );
  });

  return (
    <div className="min-h-[60vh] animate-in fade-in duration-500 py-5 md:py-7">
      <PageHeader
        eyebrow="Search results"
        icon={Search}
        title={
          query ? (
            <>
              Results for &quot;<span className="text-primary">{query}</span>&quot;
            </>
          ) : (
            "Search Episodes"
          )
        }
        description={
          query
            ? `Found ${searchResults.length} episode${searchResults.length === 1 ? "" : "s"} matching your search.`
            : "Enter a search term to find episodes, guests, or special moments."
        }
      />

      {query && searchResults.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {searchResults.map((episode, index) => (
            <EpisodeCard key={episode.id} episode={episode} index={index} />
          ))}
        </div>
      ) : query ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-5 grid size-16 place-items-center rounded-full border border-border/60 bg-muted/50">
            <Search className="size-7 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground">No results found</h2>
          <p className="mb-7 mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            We couldn&apos;t find any episodes matching &quot;{query}&quot;. Try checking for typos or using broader keywords like &quot;Samay&quot;, &quot;Bonus&quot;, or &quot;Finale&quot;.
          </p>
          <Link href="/" className={buttonVariants()}>
            Go back home
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
            <Flame className="size-4 text-muted-foreground" />
            Popular searches
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {popularSearches.map((term) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-foreground/25 hover:bg-muted"
              >
                <Sparkles className="size-3.5 text-muted-foreground" />
                {term}
              </Link>
            ))}
          </div>
          <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
            Search across episode titles, descriptions, hosts, guests, tags, and keywords.
          </p>
        </div>
      )}
    </div>
  );
}
