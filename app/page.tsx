import HomeCarousel from "@/components/home/carousal";
import EpisodeList from "@/components/home/episode-list";
import { siteConfig } from "@/lib/config";
import { show } from "@/lib/catalog";
import { featuredSpotlight, playableEpisodes } from "@/lib/data";

export default function Home() {
  const poster = show.posterUrl || show.backdropUrl || undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    name: show.name,
    alternateName: siteConfig.name,
    description: show.overview,
    url: siteConfig.url,
    image: poster,
    genre: show.genres,
    inLanguage: show.languages,
    countryOfOrigin: show.originCountry,
    datePublished: show.firstAirDate,
    numberOfSeasons: show.numberOfSeasons,
    numberOfEpisodes: show.numberOfEpisodes,
    ...(show.rating > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: show.rating,
            bestRating: 10,
            ratingCount: show.voteCount || undefined,
          },
        }
      : {}),
    creator: show.creators.map((name) => ({
      "@type": "Person",
      name,
    })),
    actor: show.cast.map((name) => ({
      "@type": "Person",
      name,
    })),
    sameAs: [
      ...(show.imdbId ? [`https://www.imdb.com/title/${show.imdbId}`] : []),
      ...(show.instagramId
        ? [`https://www.instagram.com/${show.instagramId}`]
        : []),
    ],
  };

  return (
    <main className="flex flex-col gap-10 pb-4 pt-4 md:pt-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeCarousel episodes={playableEpisodes} spotlight={featuredSpotlight} />
      <EpisodeList episodes={playableEpisodes} />
    </main>
  );
}
