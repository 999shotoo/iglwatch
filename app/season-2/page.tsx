import { playableEpisodes } from "@/lib/data";
import { EpisodeCard } from "@/components/ui/episode-card";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListVideo, Sparkles, Star, List } from "lucide-react";
import { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import { getSeason, yearOf } from "@/lib/catalog";

const seasonMeta = getSeason(2);

export const metadata: Metadata = {
  title: "Season 2",
  description:
    seasonMeta?.overview ??
    "Watch the latest episodes and exclusive unseen footage from Season 2 of India's Got Latent.",
  openGraph: {
    title: `Season 2 | ${siteConfig.name}`,
    description:
      seasonMeta?.overview ??
      "Watch the latest episodes and exclusive unseen footage from Season 2 of India's Got Latent.",
    url: `${siteConfig.url}/season-2`,
  }
};

export default function Season2Page() {
    const season2Episodes = playableEpisodes.filter((ep) => ep.season === 2);
    // Main episodes newest-first (EP 8 -> EP 1).
    const mainEpisodes = season2Episodes
        .filter(ep => typeof ep.eps_no === 'number')
        .sort((a, b) => (b.eps_no as number) - (a.eps_no as number));
    // BTS / bonus in okcdn.json listing order (newest first).
    const extrasOrder = [
        "indias-got-latent-s2-netflix-exclusive-ft--huma-qureshi-krushna-abhishek",
        "indias-got-latent-s2-bonus-ep-04-ft--ayushmann-khurrana-suhani-shah",
        "indias-got-latent-s2-bonus-ep-03-ft--deepak-kalal-ravi-gupta",
        "indias-got-latent-s2-ep-06-ft--varun-dhawan-samay-raina",
        "indias-got-latent-s2-bonus-ep-02-ft--badshah",
        "indias-got-latent-s2-bts-04-ft--karan-aujla",
        "indias-got-latent-s2-bonus-clip-01-ft--karan-aujla",
        "indias-got-latent-s2-bonus-ep-01-ft--raghav-juyal",
        "indias-got-latent-s2-bts-03-ft--raghu-ram",
        "indias-got-latent-s2-bts-02-ft--chandan-prabhakar",
        "indias-got-latent-bts-01-ft-alia-bhatt-sharvari-ashish-solanki",
    ];
    // Anything not listed above keeps a stable place at the end.
    const extrasRank = (id: string) => {
        const index = extrasOrder.indexOf(id);
        return index === -1 ? extrasOrder.length : index;
    };
    const extrasEpisodes = season2Episodes
        .filter(ep => typeof ep.eps_no !== 'number')
        .sort((a, b) => extrasRank(a.id) - extrasRank(b.id));

    // All episodes sorted by air date (newest first)
    const allEpisodes = [...season2Episodes].sort((a, b) => {
      const dateA = a.meta?.airDate ? new Date(a.meta.airDate).getTime() : 0;
      const dateB = b.meta?.airDate ? new Date(b.meta.airDate).getTime() : 0;
      return dateB - dateA;
    });

    return (
        <div className="animate-in fade-in duration-500 min-h-[60vh] py-5 md:py-7">
            <PageHeader
                eyebrow="The next chapter"
                icon={Sparkles}
                title="Season Two"
                description={seasonMeta?.overview ??
                    "New talents. New chaos. Same latent energy. Get ready for an entirely new wave of pointless performances."}
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

            {season2Episodes.length > 0 ? (
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
                            value="extras"
                            className="h-9 min-w-0 flex-1 rounded-lg px-2.5 text-sm font-semibold sm:px-3"
                        >
                            <Sparkles className="size-3.5" />
                            <span className="hidden sm:inline">Bonus</span>
                            <span className="sm:hidden">Ext</span>
                            <span className="shrink-0 rounded-full bg-background/60 px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                                {extrasEpisodes.length}
                            </span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="mt-0 w-full focus-visible:outline-none focus-visible:ring-0">
                        <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                            {allEpisodes.map((ep, i) => <EpisodeCard key={ep.id} episode={ep} index={i} />)}
                        </div>
                    </TabsContent>

                    <TabsContent value="main" className="mt-0 w-full focus-visible:outline-none focus-visible:ring-0">
                        <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                            {mainEpisodes.map((ep, i) => <EpisodeCard key={ep.id} episode={ep} index={i} />)}
                        </div>
                    </TabsContent>

                    <TabsContent value="extras" className="mt-0 w-full focus-visible:outline-none focus-visible:ring-0">
                        {extrasEpisodes.length > 0 ? (
                            <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                                {extrasEpisodes.map((ep, i) => <EpisodeCard key={ep.id} episode={ep} index={i} />)}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-dashed border-border bg-muted/20 py-20 text-center text-sm text-muted-foreground">
                                No BTS or bonus episodes available yet.
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            ) : (
                <div className="relative mt-4 flex aspect-[21/16] w-full cursor-not-allowed flex-col items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-card/40 group md:aspect-[32/15] lg:aspect-[32/12]">
                    <div className="pointer-events-none absolute inset-0 opacity-[0.04] text-foreground" style={{ backgroundImage: 'radial-gradient(circle at center, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                    <div className="z-10 px-4 text-center">
                        <h3 className="text-3xl font-bold uppercase tracking-[0.2em] text-foreground/80 md:text-5xl lg:text-6xl">
                            Coming Soon
                        </h3>
                        <p className="mt-5 text-xs font-medium uppercase tracking-widest text-muted-foreground md:text-sm">
                            Stay tuned for the next season of India&apos;s Got Latent.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}