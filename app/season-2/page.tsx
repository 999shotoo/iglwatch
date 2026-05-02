import { episodes } from "@/lib/data";
import { EpisodeCard } from "@/components/ui/episode-card";
import { Sparkles } from "lucide-react";
import { Metadata } from "next";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Season 2",
  description: "Watch the latest episodes and exclusive unseen footage from Season 2 of India's Got Latent.",
  openGraph: {
    title: `Season 2 | ${siteConfig.name}`,
    description: "Watch the latest episodes and exclusive unseen footage from Season 2 of India's Got Latent.",
    url: `${siteConfig.url}/season-2`,
  }
};

export default function Season2Page() {
    const season2Episodes = episodes.filter((ep) => ep.season === 2);

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 animate-in fade-in duration-500 min-h-[60vh]">
            <div className="relative mb-12 rounded-3xl overflow-hidden bg-card border border-border/50 shadow-sm">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute -top-[50%] -right-[10%] w-[70%] h-[150%] rounded-full bg-primary/5 blur-[120px]" />
                    <div className="absolute top-[20%] -left-[20%] w-[60%] h-[120%] rounded-full bg-primary/5 blur-[100px]" />
                </div>

                <div className="relative z-10 px-6 py-12 md:px-12 md:py-16 flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
                        <Sparkles className="w-3.5 h-3.5 fill-primary" /> The Next Chapter
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-foreground mb-6 uppercase">
                        Season <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-primary/50">Two</span>
                    </h1>

                    <p className="text-muted-foreground text-sm md:text-base lg:text-lg max-w-2xl font-medium leading-relaxed">
                        New talents. New chaos. Same latent energy. Get ready for an entirely new wave of pointless performances.
                    </p>
                </div>
            </div>

            {season2Episodes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                    {season2Episodes.map((episode, index) => (
                        <EpisodeCard key={episode.id} episode={episode} index={index} />
                    ))}
                </div>
            ) : (
                <div className="relative w-full aspect-[21/16] md:aspect-[32/15] lg:aspect-[32/12] rounded-xl overflow-hidden bg-card border border-border shadow-sm flex flex-col items-center justify-center group mt-12">
                    <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/50 to-background opacity-90 transition-opacity duration-700" />
                    <div className="absolute inset-0 opacity-[0.03] text-foreground pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                    <div className="z-10 text-center px-4">
                        <h3 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-b from-foreground/80 to-foreground/10">
                            Coming Soon
                        </h3>
                        <p className="text-sm md:text-base text-muted-foreground mt-6 font-medium uppercase tracking-widest">
                            Stay tuned for the next season of India's Got Latent.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
