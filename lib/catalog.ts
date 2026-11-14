import catalog from "@/data/catalog.json";
import type { SeasonInfo, ShowInfo } from "./types";

export { durationToIso, formatAirDate, yearOf } from "./format";

export const show = catalog.show as ShowInfo;
export const seasons = catalog.seasons as SeasonInfo[];

export function getSeason(seasonNumber: number): SeasonInfo | null {
  return seasons.find((season) => season.seasonNumber === seasonNumber) ?? null;
}
