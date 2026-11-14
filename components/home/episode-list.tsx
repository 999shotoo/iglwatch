"use client";

import Link from "next/link";
import { ArrowRight, Clapperboard, Sparkles, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { EpisodeCard } from "@/components/ui/episode-card";
import type { Episode } from "@/lib/types";

function byAirDateDesc(first: Episode, second: Episode) {
    const dateA = first.meta?.airDate ? new Date(first.meta.airDate).getTime() : 0;
    const dateB = second.meta?.airDate ? new Date(second.meta.airDate).getTime() : 0;
    return dateB - dateA;
}

function SectionHeading({
    title,
    countLabel,
    href,
    icon: Icon,
}: {
    title: string;
    countLabel: string;
    href: string;
    icon: LucideIcon;
}) {
    return (
        <div className="mb-5 flex items-end justify-between gap-4">
            <div className="flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-foreground">
                    <Icon className="size-4" />
                </span>
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
                        {title}
                    </h2>
                    <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                        {countLabel}
                    </span>
                </div>
            </div>
            <Link
                href={href}
                className="flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-muted/40 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-foreground/25 hover:bg-muted hover:text-foreground"
            >
                View all <ArrowRight className="size-3.5" />
            </Link>
        </div>
    );
}

export default function EpisodeList({ episodes }: { episodes: Episode[] }) {
    const season1Episodes = episodes
        .filter((episode) => episode.season === 1)
        .sort(byAirDateDesc);
    const season2Episodes = episodes
        .filter((episode) => episode.season === 2)
        .sort(byAirDateDesc);
    const specialEpisodes = episodes
        .filter((episode) => episode.season === "Specials")
        .sort(byAirDateDesc);

    return (
        <section className="mb-8">
            {/* Season 2 - 2 rows (8 episodes total) */}
            {season2Episodes.length > 0 && (
                <div>
                    <SectionHeading
                        title="Season 2"
                        countLabel={`${season2Episodes.length} episodes`}
                        href="/season-2"
                        icon={Clapperboard}
                    />
                    <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {season2Episodes.slice(0, 8).map((episode, index) => (
                            <EpisodeCard key={episode.id} episode={episode} index={index} />
                        ))}
                    </div>
                </div>
            )}

            {/* Specials & Announcements */}
            {specialEpisodes.length > 0 && (
                <div className="mt-12">
                    <SectionHeading
                        title="Specials"
                        countLabel={`${specialEpisodes.length} playable episodes`}
                        href="/specials"
                        icon={Star}
                    />
                    <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {specialEpisodes.slice(0, 4).map((episode, index) => (
                            <EpisodeCard key={episode.id} episode={episode} index={index} />
                        ))}
                    </div>
                </div>
            )}

            {/* Season 1 */}
            {season1Episodes.length > 0 && (
                <div className="mt-12">
                    <SectionHeading
                        title="Season 1"
                        countLabel={`${season1Episodes.length} playable episodes`}
                        href="/season-1"
                        icon={Sparkles}
                    />
                    <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {season1Episodes.slice(0, 4).map((episode, index) => (
                            <EpisodeCard key={episode.id} episode={episode} index={index} />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
