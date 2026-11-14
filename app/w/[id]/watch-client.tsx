"use client";

import { useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock3,
  Flag,
  ListVideo,
  MessageCircle,
  Play,
  RadioTower,
  Share2,
  Star,
  UserRound,
  UsersRound,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ReportDialog } from "@/components/report-dialog";
import { formatAirDate } from "@/lib/format";
import type { Episode, EpisodeServer } from "@/lib/types";
import { cn } from "@/lib/utils";

type WatchClientProps = {
  episode: Episode;
  queue: Episode[];
};

export default function WatchClient({ episode, queue }: WatchClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const servers = episode.servers ?? [];
  const requestedServerId = searchParams.get("server");

  const selectedServer =
    servers.find((server: EpisodeServer) => server.id === requestedServerId) || servers[0];

  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const airDate = formatAirDate(episode.meta?.airDate);
  const rating = episode.meta?.rating ?? 0;
  const seasonHref =
    typeof episode.season === "number" ? `/season-${episode.season}` : "/specials";
  const seasonLabel =
    typeof episode.season === "number" ? `Season ${episode.season}` : String(episode.season);
  const episodeLabel =
    typeof episode.eps_no === "number"
      ? `EP ${String(episode.eps_no).padStart(2, "0")}`
      : String(episode.eps_no).replace(/-/g, " ").toUpperCase();

  const guestNames =
    episode.guests && episode.guests.length > 0
      ? episode.guests
      : (episode.meta?.guestStars ?? [])
          .map((guest) => guest.name)
          .filter((name) => !(episode.hosts ?? []).includes(name));

  if (!selectedServer) return null;

  const selectServer = (server: EpisodeServer) => {
    if (selectedServer.id === server.id) return;
    setIsIframeLoaded(false);
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("server", server.id);
    router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: episode.title,
          text: episode.description,
          url,
        });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Sharing was cancelled or the clipboard is unavailable.
    }
  };

  return (
    <div className="w-full animate-in fade-in duration-500">
      {/* Breadcrumb + actions */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 pt-4">
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/50" />
          <Link href={seasonHref} className="transition-colors hover:text-foreground">
            {seasonLabel}
          </Link>
          <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/50" />
          <span className="truncate font-semibold text-foreground/80">{episodeLabel}</span>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-muted/40 px-3 text-xs font-semibold text-muted-foreground transition-colors hover:border-foreground/25 hover:bg-muted hover:text-foreground"
          >
            {copied ? <Check className="size-3.5" /> : <Share2 className="size-3.5" />}
            {copied ? "Link copied" : "Share"}
          </button>
          <ReportDialog
            context={`Episode: ${episode.title} (${episode.id})`}
            trigger={
              <button
                type="button"
                className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-3 text-xs font-semibold text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
              >
                <Flag className="size-3.5" />
                Report
              </button>
            }
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="flex min-w-0 flex-col gap-5">
          {/* Player */}
          <div className="group relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-black sm:rounded-2xl">
            {!isIframeLoaded && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
                <div className="flex flex-col items-center gap-4">
                  <div className="grid size-14 place-items-center rounded-full border border-white/20 bg-white/5">
                    <Play className="size-5 fill-white text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/90">
                      {selectedServer.name}
                    </p>
                    <p className="mt-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                      Connecting to stream…
                    </p>
                  </div>
                </div>
              </div>
            )}
            <iframe
              key={selectedServer.id}
              src={selectedServer.link}
              title={`${episode.title} — ${selectedServer.name}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className={cn(
                "absolute inset-0 h-full w-full border-0 transition-opacity duration-700",
                isIframeLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setIsIframeLoaded(true)}
            />
          </div>

          {/* Source selector */}
          <section className="rounded-xl border border-border bg-card p-3.5 sm:rounded-2xl sm:p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-md bg-muted text-foreground">
                  <RadioTower className="size-3.5" />
                </span>
                <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-foreground">
                  Streaming servers
                </h2>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                  {servers.length}
                </span>
              </div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
                Switch if playback stalls
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
              {servers.map((server: EpisodeServer, index: number) => {
                const active = selectedServer.id === server.id;
                return (
                  <button
                    key={server.id}
                    type="button"
                    onClick={() => selectServer(server)}
                    aria-pressed={active}
                    className={cn(
                      "group/server flex h-10 min-w-0 items-center gap-2 rounded-lg border px-2.5 text-left text-xs font-semibold transition-all duration-150",
                      active
                        ? "border-foreground/50 bg-muted text-foreground"
                        : "border-border bg-muted/30 text-muted-foreground hover:border-foreground/25 hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-5 shrink-0 place-items-center rounded",
                        active ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
                      )}
                    >
                      {active ? (
                        <Play className="size-2.5 fill-current" />
                      ) : (
                        <span className="text-[9px] font-bold leading-none">{index + 1}</span>
                      )}
                    </span>
                    <span className="truncate">{server.name}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Episode details */}
          <section className="rounded-xl border border-border bg-card p-4 sm:rounded-2xl sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground">
                    <span className="size-1.5 rounded-full bg-foreground" />
                    Now playing
                  </span>
                  <span className="rounded-md border border-border bg-muted/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {seasonLabel} · {episodeLabel}
                  </span>
                </div>
                <h1 className="text-balance text-xl font-bold leading-tight tracking-tight text-foreground sm:text-2xl lg:text-[28px]">
                  {episode.title}
                </h1>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-muted-foreground">
              {episode.duration && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="size-3.5 text-muted-foreground" />
                  {episode.duration}
                </span>
              )}
              {rating > 0 && (
                <span className="inline-flex items-center gap-1.5">
                  <Star className="size-3.5 fill-foreground text-foreground" />
                  {rating.toFixed(1)}
                  <span className="font-medium text-muted-foreground/60">/ 10</span>
                </span>
              )}
              {airDate && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-3.5 text-muted-foreground" />
                  {airDate}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <RadioTower className="size-3.5 text-muted-foreground" />
                {servers.length} source{servers.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="mt-5 border-t border-border/50 pt-4">
              <p
                className={cn(
                  "text-sm leading-relaxed text-muted-foreground",
                  isExpanded ? "" : "line-clamp-3"
                )}
              >
                {episode.description}
              </p>
              <button
                type="button"
                onClick={() => setIsExpanded((open) => !open)}
                className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              >
                {isExpanded ? (
                  <>
                    Show less <ChevronUp className="size-3.5" />
                  </>
                ) : (
                  <>
                    Read more <ChevronDown className="size-3.5" />
                  </>
                )}
              </button>
            </div>

            <div
              className={cn(
                "grid gap-5 border-t border-border/50 transition-all",
                isExpanded ? "mt-5 pt-5" : "hidden"
              )}
            >
              {episode.hosts && episode.hosts.length > 0 && (
                <div>
                  <div className="mb-2.5 flex items-center gap-2 text-muted-foreground">
                    <UserRound className="size-3.5 text-muted-foreground" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em]">Hosts</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {episode.hosts.map((host: string) => (
                      <span
                        key={host}
                        className="rounded-lg border border-border/60 bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground"
                      >
                        {host}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {guestNames.length > 0 && (
                <div>
                  <div className="mb-2.5 flex items-center gap-2 text-muted-foreground">
                    <UsersRound className="size-3.5 text-muted-foreground" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em]">Guests</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {guestNames.map((guest) => (
                      <span
                        key={guest}
                        className="rounded-lg border border-border/60 bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground"
                      >
                        {guest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {episode.metadata?.tags && episode.metadata.tags.length > 0 && (
                <div>
                  <div className="mb-2.5 flex items-center gap-2 text-muted-foreground">
                    <ListVideo className="size-3.5 text-muted-foreground" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em]">Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {episode.metadata.tags.slice(0, 10).map((tag) => (
                      <Link
                        key={tag}
                        href={`/search?q=${encodeURIComponent(tag)}`}
                        className="rounded-md border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Discussion placeholder */}
          <section className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-card/25 px-6 py-9 text-center sm:rounded-2xl">
            <div className="grid size-11 place-items-center rounded-full border border-border/60 bg-muted/50">
              <MessageCircle className="size-5 text-muted-foreground/70" />
            </div>
            <h2 className="mt-3 text-sm font-bold tracking-tight text-foreground">Discussion</h2>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
              Comments are coming soon
            </p>
          </section>
        </div>

        {/* Episode queue */}
        <aside className="h-fit lg:sticky lg:top-[4.5rem]">
          <div className="overflow-hidden rounded-xl border border-border/60 bg-card/40 sm:rounded-2xl">
            <div className="flex items-center justify-between gap-2 border-b border-border/50 px-4 py-3.5">
              <div className="flex items-center gap-2">
                <ListVideo className="size-4 text-primary" />
                <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-foreground">
                  {seasonLabel}
                </h2>
              </div>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                {queue.length}
              </span>
            </div>

            <div className="scrollbar-none max-h-[560px] overflow-y-auto p-2">
              <ul className="space-y-1">
                {queue.map((item) => {
                  const active = item.id === episode.id;
                  const label =
                    typeof item.eps_no === "number"
                      ? `EP ${String(item.eps_no).padStart(2, "0")}`
                      : String(item.eps_no).replace(/-/g, " ").toUpperCase();

                  return (
                    <li key={item.id}>
                      <Link
                        href={`/w/${item.id}${
                          selectedServer ? `?server=${encodeURIComponent(selectedServer.id)}` : ""
                        }`}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group flex items-center gap-3 rounded-xl border p-1.5 transition-colors",
                          active
                            ? "border-border bg-muted"
                            : "border-transparent hover:border-border hover:bg-muted/50"
                        )}
                      >
                        <span className="relative aspect-video w-24 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                          <Image
                            src={item.thumbnail}
                            alt=""
                            fill
                            sizes="96px"
                            className="object-cover opacity-85 transition-opacity group-hover:opacity-100"
                          />
                          <span className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                            <Play className="size-4 fill-white text-white" />
                          </span>
                          {active && (
                            <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-foreground py-0.5 text-[8px] font-bold uppercase tracking-wider text-background">
                              Playing
                            </span>
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span
                            className={cn(
                              "block text-[10px] font-bold uppercase tracking-wider",
                              active ? "text-foreground" : "text-muted-foreground/70"
                            )}
                          >
                            {label}
                          </span>
                          <span className="mt-0.5 line-clamp-2 text-xs font-semibold leading-snug text-foreground">
                            {item.title}
                          </span>
                          {item.duration && (
                            <span className="mt-1 block text-[10px] font-medium text-muted-foreground/60">
                              {item.duration}
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
