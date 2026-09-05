import { episodes } from "@/lib/data";
import { EpisodeCard } from "@/components/ui/episode-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play } from "lucide-react";
import { Metadata } from "next";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Season 1",
  description: "Watch all main episodes and exclusive deleted footage from Season 1 of India's Got Latent.",
  openGraph: {
    title: `Season 1 | ${siteConfig.name}`,
    description: "Watch all main episodes and exclusive deleted footage from Season 1 of India's Got Latent.",
    url: `${siteConfig.url}/season-1`,
  }
};

export default function Season1Page() {
    const season1Episodes = episodes.filter((ep) => ep.season === 1);
    // Main episodes newest-first (EP 12 -> EP 1).
    const mainEpisodes = season1Episodes
        .filter(ep => typeof ep.eps_no === 'number')
        .sort((a, b) => (b.eps_no as number) - (a.eps_no as number));
    // Bonus / exclusive / deleted in okcdn.json listing order (bonus-1..6,
    // Deepak Kalal exclusive, Raghu Ram exclusive, discarded, deleted).
    const bonusOrder = [
        "indias-got-latent-bonus-ep-1-ft--arpit-bala",
        "indias-got-latent-bonus-ep-2-ft--badshah-siddhant-ch",
        "indias-got-latent-bonus-ep-3-ft--avika-gor",
        "indias-got-latent-bonus-ep-4-ft--seedhemaut-madhurv",
        "indias-got-latent-bonus-ep-5-ft--rohanjoshi8016",
        "indias-got-latent-bonus-ep-6-ft--ranveer",
        "indias-got-latent-deepak-kalal-episode-bonus-moments",
        "indias-got-latent-raghu-ram-episode-bonus-moments",
        "indias-got-latent-discarded-ep-1-ft--aakashgupta-anubh",
        "indias-got-latent-deleted-footage",
    ];
    const bonusEpisodes = season1Episodes
        .filter(ep => typeof ep.eps_no !== 'number')
        .sort((a, b) => bonusOrder.indexOf(a.id) - bonusOrder.indexOf(b.id));

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 animate-in fade-in duration-500">
            <div className="relative mb-12 rounded-lg overflow-hidden bg-card border border-border/50 shadow-sm">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute -top-[50%] -left-[10%] w-[70%] h-[150%] rounded-full bg-primary/5 blur-[120px]" />
                    <div className="absolute top-[20%] -right-[20%] w-[60%] h-[120%] rounded-full bg-primary/5 blur-[100px]" />
                </div>

                <div className="relative z-10 px-6 py-12 md:px-12 md:py-16 flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
                        <Play className="w-3.5 h-3.5 fill-primary" /> The Beginning
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-foreground mb-6 uppercase">
                        Season <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-primary/50">One</span>
                    </h1>

                    <p className="text-muted-foreground text-sm md:text-base lg:text-lg max-w-2xl font-medium leading-relaxed">
                        The origin of the chaos. Watch all main episodes, discover exclusive deleted footage, and witness where the latent talents first emerged.
                    </p>
                </div>
            </div>

            <Tabs defaultValue="main" className="w-full flex flex-col items-start">
                <TabsList className="bg-muted/60 p-1.5 rounded-lg h-auto inline-flex shadow-sm border border-border/40 mb-10 w-full max-w-md">
                    <TabsTrigger
                        value="main"
                        className="flex-1 rounded-lg text-sm md:text-base font-bold px-6 py-3 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-300"
                    >
                        Main Episodes
                    </TabsTrigger>
                    <TabsTrigger
                        value="bonus"
                        className="flex-1 rounded-lg text-sm md:text-base font-bold px-6 py-3 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-300"
                    >
                        Bonus & Exclusive
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="main" className="w-full mt-0 focus-visible:outline-none focus-visible:ring-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                        {mainEpisodes.map((ep, i) => <EpisodeCard key={ep.id} episode={ep} index={i} />)}
                    </div>
                </TabsContent>

                <TabsContent value="bonus" className="w-full mt-0 focus-visible:outline-none focus-visible:ring-0">
                    {bonusEpisodes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                            {bonusEpisodes.map((ep, i) => <EpisodeCard key={ep.id} episode={ep} index={i} />)}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-muted-foreground text-sm font-medium bg-muted/20 rounded-lg border border-border border-dashed">
                            No bonus episodes available yet.
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
