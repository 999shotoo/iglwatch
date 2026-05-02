"use client";

import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";

export function EpisodeCard({ episode, index = 0 }: { episode: any, index?: number }) {
    return (
        <div
            className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both h-full"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <Link href={`/w/${episode.id}`}>
                <div className="group relative flex flex-col cursor-pointer h-full">
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-border group-hover:border-primary/50 shadow-sm transition-all duration-700">
                        <Image
                            src={episode.thumbnail}
                            alt={episode.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.2,1,0.2,1)] group-hover:scale-110 opacity-80 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90" />

                        <div className="absolute top-3 right-3 bg-black/60 border border-white/10 px-2.5 py-1 rounded-md shadow-sm">
                            <span className="text-[10px] font-bold text-white/90 uppercase tracking-widest">
                                {typeof episode.eps_no === 'number' ? `EP ${episode.eps_no.toString().padStart(2, '0')}` : episode.eps_no}
                            </span>
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="flex items-center justify-center w-14 h-14 rounded-full border border-white/20 bg-black/40 shadow-[0_0_40px_rgba(255,255,255,0.05)] transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out backdrop-blur-sm">
                                <Play className="w-5 h-5 ml-1 text-white fill-white/80" />
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 px-1 flex-1 flex flex-col">
                        <h3 className="font-semibold text-sm md:text-base text-foreground/80 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                            {episode.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-auto pt-2">
                            <span className="text-xs text-muted-foreground font-medium">Season {episode.season}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
