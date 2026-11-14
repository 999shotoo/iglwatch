/**
 * Pure display helpers shared by server and client components.
 * Keep this module free of data imports so client bundles never pull in the
 * catalog file.
 */

/** Formats an ISO date (YYYY-MM-DD) as e.g. "14 Jun 2024". */
export function formatAirDate(date: string | null | undefined) {
  if (!date) return null;
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

/** Converts a human duration such as "1hr 15min" to ISO 8601 ("PT1H15M"). */
export function durationToIso(duration: string | undefined | null) {
  if (!duration) return undefined;
  const hours = /(\d+)\s*(?:hr|hour)/i.exec(duration);
  const minutes = /(\d+)\s*(?:min|minute)/i.exec(duration);
  if (!hours && !minutes) return undefined;
  return `PT${hours ? `${hours[1]}H` : ""}${minutes ? `${minutes[1]}M` : ""}`;
}

export function yearOf(date: string | null | undefined) {
  return date ? date.slice(0, 4) : null;
}
