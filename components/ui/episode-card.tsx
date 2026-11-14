"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Star } from "lucide-react";
import type { Episode } from "@/lib/types";
import { yearOf } from "@/lib/format";

export function EpisodeCard({ episode, index = 0 }: { episode: Episode; index?: number }) {
    const label =
        typeof episode.eps_no === "number"
            ? `EP ${String(episode.eps_no).padStart(2, "0")}`
            : String(episode.eps_no).replace(/-/g, " ").toUpperCase();
    const rating = episode.meta?.rating ?? 0;
    const year = yearOf(episode.meta?.airDate);

    return (
        <div
            className="animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both h-full"
            style={{ animationDelay: `${index * 40}ms` }}
        >
            <Link href={`/w/${episode.id}`} className="group/card block h-full">
                <div className="flex h-full flex-col">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted transition-colors duration-300 group-hover/card:border-foreground/25">
                        <Image
                            src={episode.thumbnail}
                            alt={episode.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, (max-width: 1280px) 33vw, 25vw"
                            className="object-cover opacity-90 transition-opacity duration-300 group-hover/card:opacity-100"
                        />

                        <div className="absolute left-2.5 top-2.5 rounded-md bg-black/75 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                            {label}
                        </div>

                        {rating > 0 && (
                            <div
                                className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-md bg-black/75 px-1.5 py-0.5 text-[10px] font-bold text-white"
                                title={`Rating ${rating.toFixed(1)} / 10`}
                            >
                                <Star className="size-2.5 fill-white text-white" />
                                {rating.toFixed(1)}
                            </div>
                        )}

                        {episode.duration && (
                            <div className="absolute bottom-2.5 right-2.5 rounded-md bg-black/75 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white/90">
                                {episode.duration}
                            </div>
                        )}

                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover/card:opacity-100">
                            <div className="grid size-11 place-items-center rounded-full border border-white/25 bg-black/65">
                                <Play className="ml-0.5 size-4 fill-white text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 flex flex-1 flex-col px-0.5">
                        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground md:text-[15px]">
                            {episode.title}
                        </h3>
                        <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-2 text-[11px] font-medium text-muted-foreground">
                            <span className="rounded-md bg-muted/60 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                                {typeof episode.season === "number"
                                    ? `S${episode.season}`
                                    : episode.season}
                            </span>
                            {year && (
                                <>
                                    <span className="size-1 rounded-full bg-muted-foreground/40" />
                                    <span>{year}</span>
                                </>
                            )}
                            {(episode.servers?.length ?? 0) > 1 && (
                                <>
                                    <span className="size-1 rounded-full bg-muted-foreground/40" />
                                    <span>{episode.servers?.length} sources</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
