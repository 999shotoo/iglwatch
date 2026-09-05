"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, ArrowRight } from "lucide-react";
import { episodes } from "@/lib/data";
import { EpisodeCard } from "@/components/ui/episode-card";

export default function EpisodeList() {
    const season1Episodes = episodes.filter((ep) => ep.season === 1);
    const season2Episodes = episodes.filter((ep) => ep.season === 2);
    const specialEpisodes = episodes.filter((ep) => ep.season === "Specials");

    // Season 2: newest main episodes first (EP6, EP5, ...), extras after.
    const sortedSeason2 = [...season2Episodes].sort((a, b) => {
        const aNum = typeof a.eps_no === "number";
        const bNum = typeof b.eps_no === "number";
        if (aNum && bNum) return (b.eps_no as number) - (a.eps_no as number);
        if (aNum) return -1;
        if (bNum) return 1;
        return 0;
    });

    return (
        <section className="mt-4 mb-20 px-1 md:px-0">
            {/* Season 2 */}
            {season2Episodes.length > 0 ? (
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
                                Season 2
                            </h2>
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest mt-1 block">
                                {season2Episodes.length} Episodes
                            </span>
                        </div>
                        <Link href="/season-2" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                        {sortedSeason2.slice(0, 4).map((episode, index) => (
                            <EpisodeCard key={episode.id} episode={episode} index={index} />
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    {/* Season 2 - Coming Soon fallback */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
                                Season 2
                            </h2>
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest mt-1 block">
                                Status: Pending
                            </span>
                        </div>
                        <Link href="/season-2" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="relative w-full aspect-[21/16] md:aspect-[32/9] rounded-lg overflow-hidden bg-card border border-border shadow-sm flex flex-col items-center justify-center group cursor-not-allowed">
                        {/* Dark gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/50 to-background opacity-90 group-hover:opacity-100 transition-opacity duration-700" />

                        {/* Animated grid lines or noise could go here, simulating static */}
                        <div className="absolute inset-0 opacity-[0.03] text-foreground pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                        <div className="z-10 text-center transform transition-transform duration-700 group-hover:scale-105">
                            <h3 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-b from-foreground/80 to-foreground/10">
                                Coming Soon
                            </h3>
                            <p className="text-xs md:text-sm text-muted-foreground mt-4 md:mt-6 font-medium uppercase tracking-widest">
                                New Talents. New Chaos. Same Latent Energy.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Specials & Announcements */}
            {specialEpisodes.length > 0 && (
                <div className="mt-16">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
                                Specials
                            </h2>
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest mt-1 block">
                                {specialEpisodes.length} Episodes
                            </span>
                        </div>
                        <Link href="/specials" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                        {specialEpisodes.slice(0, 4).map((episode, index) => (
                            <EpisodeCard key={episode.id} episode={episode} index={index} />
                        ))}
                    </div>
                </div>
            )}

            {/* Season 1 */}
            <div className="mt-16">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
                            Season 1
                        </h2>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest mt-1 block">
                            {season1Episodes.length} Episodes
                        </span>
                    </div>
                    <Link href="/season-1" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                    {season1Episodes.slice(0, 4).map((episode, index) => (
                        <EpisodeCard key={episode.id} episode={episode} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}