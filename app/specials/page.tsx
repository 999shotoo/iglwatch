import { playableEpisodes } from "@/lib/data";
import { EpisodeCard } from "@/components/ui/episode-card";
import { PageHeader } from "@/components/page-header";
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
    const specialEpisodes = playableEpisodes.filter((ep) => ep.season === "Specials");

    return (
        <div className="animate-in fade-in duration-500 py-5 md:py-7">
            <PageHeader
                eyebrow="Exclusive content"
                icon={Star}
                title="The Specials"
                description="Full-length stand-up performances, live events, and exclusive behind-the-scenes chaos you won't find in the regular season episodes."
                meta={
                    <>
                        <span>{specialEpisodes.length} playable episodes</span>
                        <span className="size-1 rounded-full bg-border" />
                        <span>Bonus clips, BTS &amp; exclusives</span>
                    </>
                }
            />

            {specialEpisodes.length > 0 ? (
                <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                    {specialEpisodes.map((episode, index) => (
                        <EpisodeCard key={episode.id} episode={episode} index={index} />
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-border bg-muted/20 py-20 text-center text-sm text-muted-foreground">
                    No specials available yet.
                </div>
            )}
        </div>
    );
}
