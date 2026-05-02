import { episodes } from "@/lib/data";
import { notFound } from "next/navigation";
import WatchClient from "./watch-client";
import { Metadata } from "next";
import { siteConfig } from "@/lib/config";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const episode = episodes.find((ep) => ep.id === id);

  if (!episode) {
    return {
      title: "Episode Not Found",
    };
  }

  const keywords = [
    "India's Got Latent",
    "Samay Raina",
    ...(episode.guests || []),
    ...(episode.hosts || []),
    ...(episode.metadata?.keywords || []),
    ...(episode.metadata?.tags || []),
    "Standup Comedy",
    "Full Episode"
  ];

  return {
    title: `${episode.title} | ${siteConfig.name}`,
    description: episode.description,
    keywords: Array.from(new Set(keywords)),
    openGraph: {
      title: episode.title,
      description: episode.description,
      type: "video.episode",
      url: `${siteConfig.url}/w/${episode.id}`,
      images: [
        {
          url: episode.thumbnail || siteConfig.ogImage,
          width: 1280,
          height: 720,
          alt: episode.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: episode.title,
      description: episode.description,
      images: [episode.thumbnail || siteConfig.ogImage],
    },
  };
}

export default async function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const episode = episodes.find((ep) => ep.id === id);

  if (!episode) {
    notFound();
  }

  return <WatchClient episode={episode} />;
}
