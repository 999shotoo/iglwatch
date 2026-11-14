import { episodeById, playableEpisodes } from "@/lib/data";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import WatchClient from "./watch-client";
import { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import { durationToIso, formatAirDate, show } from "@/lib/catalog";

export function generateStaticParams() {
  // Episodes without a source are never exported, so they can't be reached.
  return playableEpisodes.map((episode) => ({ id: episode.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const episode = episodeById(id);

  if (!episode) {
    return {
      title: "Episode Not Found",
    };
  }

  const meta = episode.meta;
  const airDate = formatAirDate(meta?.airDate);
  const rating = meta?.rating ?? 0;
  const seasonLabel =
    typeof episode.season === "number" ? `Season ${episode.season}` : episode.season;

  const keywords = [
    "India's Got Latent",
    "Samay Raina",
    ...(episode.guests || []),
    ...(episode.hosts || []),
    ...(episode.metadata?.keywords || []),
    ...(episode.metadata?.tags || []),
    seasonLabel,
    "Standup Comedy",
    "Full Episode"
  ];

  const description = [
    episode.description,
    airDate ? `Originally aired ${airDate}.` : null,
    rating > 0 ? `Rated ${rating.toFixed(1)}/10.` : null,
  ]
    .filter(Boolean)
    .join(" ");

  const images = [
    episode.thumbnail,
    meta?.stillUrl,
    show.backdropUrl,
    show.posterUrl,
  ]
    .filter((image): image is string => Boolean(image))
    .filter((image, index, all) => all.indexOf(image) === index);

  return {
    title: episode.title,
    description,
    keywords: Array.from(new Set(keywords)),
    alternates: {
      canonical: `/w/${episode.id}`,
    },
    openGraph: {
      title: episode.title,
      description,
      type: "video.episode",
      url: `${siteConfig.url}/w/${episode.id}`,
      releaseDate: meta?.airDate ?? undefined,
      tags: Array.from(new Set([seasonLabel, ...(episode.guests || [])])),
      images: images.map((url, index) => ({
        url,
        width: 1280,
        height: 720,
        alt: index === 0 ? episode.title : `${episode.title} still`,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title: episode.title,
      description,
      images: images.slice(0, 2),
    },
    other: {
      ...(airDate ? { "video:release_date": airDate } : {}),
      ...(rating > 0 ? { "episode:rating": `${rating.toFixed(1)}/10` } : {}),
    },
  };
}

export default async function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const episode = episodeById(id);

  if (!episode) {
    notFound();
  }

  const meta = episode.meta;
  const rating = meta?.rating ?? 0;
  const seasonLabel =
    typeof episode.season === "number" ? `Season ${episode.season}` : episode.season;

  const queue = playableEpisodes
    .filter((item) => item.season === episode.season)
    .sort((first, second) => {
      const firstNumber = Number(first.eps_no);
      const secondNumber = Number(second.eps_no);
      const firstIsNumber = Number.isFinite(firstNumber);
      const secondIsNumber = Number.isFinite(secondNumber);
      if (firstIsNumber && secondIsNumber) return firstNumber - secondNumber;
      if (firstIsNumber) return -1;
      if (secondIsNumber) return 1;
      return 0;
    });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TVEpisode",
    name: episode.title,
    description: episode.description,
    url: `${siteConfig.url}/w/${episode.id}`,
    image: episode.thumbnail,
    episodeNumber:
      typeof episode.eps_no === "number" ? episode.eps_no : meta?.episodeNumber,
    partOfSeason: {
      "@type": "TVSeason",
      name: seasonLabel,
      seasonNumber: typeof episode.season === "number" ? episode.season : undefined,
    },
    partOfSeries: {
      "@type": "TVSeries",
      name: show.name,
      url: `${siteConfig.url}/`,
    },
    ...(meta?.airDate ? { datePublished: meta.airDate } : {}),
    ...(durationToIso(episode.duration) ? { duration: durationToIso(episode.duration) } : {}),
    ...(rating > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: rating,
            bestRating: 10,
            ratingCount: meta?.voteCount || undefined,
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense>
        <WatchClient episode={episode} queue={queue} />
      </Suspense>
    </>
  );
}
