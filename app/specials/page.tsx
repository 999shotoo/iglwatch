import { episodes } from "@/lib/data";
import { EpisodeCard } from "@/components/ui/episode-card";
import { Star } from "lucide-react";
import { Metadata } from "next";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Specials",
  description: "Watch full-length stand-up performances, live events, and exclusive behind-the-scenes chaos.",
  openGraph: {
    title: `Specials | ${siteConfig.name}`,
    description: "Watch full-length stand-up performances, live events, and exclusive behind-the-scenes chaos.",
    url: `${siteConfig.url}/specials`,
  }
};
export default function SpecialsPage() {
    const specialEpisodes = episodes.filter((ep) => ep.season === "Specials");

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 animate-in fade-in duration-500">
            <div className="relative mb-12 rounded-3xl overflow-hidden bg-card border border-border/50 shadow-sm">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute -bottom-[50%] -right-[10%] w-[70%] h-[150%] rounded-full bg-primary/5 blur-[120px]" />
                    <div className="absolute top-[20%] -left-[20%] w-[60%] h-[120%] rounded-full bg-primary/5 blur-[100px]" />
                </div>

                <div className="relative z-10 px-6 py-12 md:px-12 md:py-16 flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
                        <Star className="w-3.5 h-3.5 fill-primary" /> Exclusive Content
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-foreground mb-6 uppercase">
                        The <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-primary/50">Specials</span>
                    </h1>

                    <p className="text-muted-foreground text-sm md:text-base lg:text-lg max-w-2xl font-medium leading-relaxed">
                        Full-length stand-up performances, live events, and exclusive behind-the-scenes chaos you won't find in the regular season episodes.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                {specialEpisodes.map((episode, index) => (
                    <EpisodeCard key={episode.id} episode={episode} index={index} />
                ))}
            </div>
        </div>
    );
}
