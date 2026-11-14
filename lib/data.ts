import catalog from "@/data/catalog.json";
import type { Episode, SpotlightSlide } from "./types";

/**
 * Internal fields that must never be shipped to the browser. The dashboard
 * still reads them straight from `data/catalog.json`.
 */
function toPublicEpisode(episode: Episode): Episode {
  const clean = { ...episode };
  delete clean.downloadLink;
  delete clean.okcdn;
  delete clean.overrides;
  return clean;
}

/**
 * Episode catalog. The data lives in `data/catalog.json` and is managed from
 * the local dashboard (`npm run dashboard`). Everything is compiled into the
 * static export — there is no runtime data fetching.
 */
export const episodes = (catalog.episodes as Episode[]).map(toPublicEpisode);
export const spotlite = catalog.spotlight as SpotlightSlide[];

/** True when an episode has at least one usable iframe source. */
export function hasPlayableSource(episode: Episode): boolean {
  return (episode.servers ?? []).some((server) => Boolean(server.link?.trim()));
}

/**
 * Episodes that actually have something to stream. Anything without a source
 * is hidden from the public site until a link is added from the dashboard.
 */
export const playableEpisodes = episodes.filter(hasPlayableSource);

const playableIds = new Set(playableEpisodes.map((episode) => episode.id));

/** Spotlight slides whose episode can actually be played. */
export const featuredSpotlight = spotlite.filter((slide) =>
  playableIds.has(slide.id)
);

/** Look up a playable episode by route id. */
export function episodeById(id: string): Episode | undefined {
  return playableEpisodes.find((episode) => episode.id === id);
}

/** Sort by season then episode number, newest first. */
export function byNewest(first: Episode, second: Episode) {
  const seasonDiff = Number(second.season) - Number(first.season);
  if (seasonDiff !== 0) return seasonDiff;

  const firstNumber = Number(first.eps_no);
  const secondNumber = Number(second.eps_no);
  const firstIsNumber = Number.isFinite(firstNumber);
  const secondIsNumber = Number.isFinite(secondNumber);

  if (firstIsNumber && secondIsNumber) return secondNumber - firstNumber;
  if (firstIsNumber) return -1;
  if (secondIsNumber) return 1;
  return 0;
}
