import { playableEpisodes } from "@/lib/data";
import { EpisodeCard } from "@/components/ui/episode-card";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListVideo, Play, Sparkles, Star, List } from "lucide-react";
import { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import { getSeason, yearOf } from "@/lib/catalog";

const seasonMeta = getSeason(1);

export const metadata: Metadata = {
  title: "Season 1",
  description:
    seasonMeta?.overview ??
    "Watch all main episodes and exclusive deleted footage from Season 1 of India's Got Latent.",
  openGraph: {
    title: `Season 1 | ${siteConfig.name}`,
    description:
      seasonMeta?.overview ??
      "Watch all main episodes and exclusive deleted footage from Season 1 of India's Got Latent.",
    url: `${siteConfig.url}/season-1`,
  }
};

export default function Season1Page() {
    const season1Episodes = playableEpisodes.filter((ep) => ep.season === 1);
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
    // Anything not listed above keeps a stable place at the end.
    const bonusRank = (id: string) => {
        const index = bonusOrder.indexOf(id);
        return index === -1 ? bonusOrder.length : index;
    };
    const bonusEpisodes = season1Episodes
        .filter(ep => typeof ep.eps_no !== 'number')
        .sort((a, b) => bonusRank(a.id) - bonusRank(b.id));

    // All episodes sorted by air date (newest first)
    const allEpisodes = [...season1Episodes].sort((a, b) => {
      const dateA = a.meta?.airDate ? new Date(a.meta.airDate).getTime() : 0;
      const dateB = b.meta?.airDate ? new Date(b.meta.airDate).getTime() : 0;
      return dateB - dateA;
    });

    return (
        <div className="animate-in fade-in duration-500 py-5 md:py-7">
            <PageHeader
                eyebrow="The beginning"
                icon={Play}
                title="Season One"
                description={seasonMeta?.overview ??
                    "The origin of the chaos. Watch all main episodes, discover exclusive deleted footage, and witness where the latent talents first emerged."}
                meta={
                    <>
                        {seasonMeta && seasonMeta.rating > 0 && (
                            <span className="inline-flex items-center gap-1.5">
                                <Star className="size-3.5 fill-primary text-primary" />
                                {seasonMeta.rating.toFixed(1)} rating
                            </span>
                        )}
                        <span className="size-1 rounded-full bg-border" />
                        <span>{mainEpisodes.length} main episodes</span>
                        {seasonMeta?.airDate && (
                            <>
                                <span className="size-1 rounded-full bg-border" />
                                <span>{yearOf(seasonMeta.airDate)}</span>
                            </>
                        )}
                    </>
                }
            />

            <Tabs defaultValue="all" className="flex w-full flex-col items-start">
                <TabsList className="mb-8 h-auto w-full max-w-md justify-start rounded-xl border border-border/60 bg-muted/50 p-1">
                    <TabsTrigger
                        value="all"
                        className="h-9 min-w-0 flex-1 rounded-lg px-2.5 text-sm font-semibold sm:px-3"
                    >
                        <List className="size-3.5" />
                        <span className="hidden sm:inline">All Eps</span>
                        <span className="sm:hidden">All</span>
                        <span className="shrink-0 rounded-full bg-background/60 px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                            {allEpisodes.length}
                        </span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="main"
                        className="h-9 min-w-0 flex-1 rounded-lg px-2.5 text-sm font-semibold sm:px-3"
                    >
                        <ListVideo className="size-3.5" />
                        <span className="hidden sm:inline">Main Eps</span>
                        <span className="sm:hidden">Main</span>
                        <span className="shrink-0 rounded-full bg-background/60 px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                            {mainEpisodes.length}
                        </span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="bonus"
                        className="h-9 min-w-0 flex-1 rounded-lg px-2.5 text-sm font-semibold sm:px-3"
                    >
                        <Sparkles className="size-3.5" />
                        <span className="hidden sm:inline">Bonus</span>
                        <span className="sm:hidden">Ext</span>
                        <span className="shrink-0 rounded-full bg-background/60 px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                            {bonusEpisodes.length}
                        </span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="main" className="mt-0 w-full focus-visible:outline-none focus-visible:ring-0">
                    <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                        {mainEpisodes.map((ep, i) => <EpisodeCard key={ep.id} episode={ep} index={i} />)}
                    </div>
                </TabsContent>

                <TabsContent value="bonus" className="mt-0 w-full focus-visible:outline-none focus-visible:ring-0">
                    {bonusEpisodes.length > 0 ? (
                        <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                            {bonusEpisodes.map((ep, i) => <EpisodeCard key={ep.id} episode={ep} index={i} />)}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-border bg-muted/20 py-20 text-center text-sm text-muted-foreground">
                            No bonus episodes available yet.
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="all" className="mt-0 w-full focus-visible:outline-none focus-visible:ring-0">
                    <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                        {allEpisodes.map((ep, i) => <EpisodeCard key={ep.id} episode={ep} index={i} />)}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}