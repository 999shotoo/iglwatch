#!/usr/bin/env node
/**
 * Local-only catalog dashboard.
 *
 * Run with `npm run dashboard` and open http://127.0.0.1:4317.
 *
 * This server edits `data/catalog.json`, which is imported at build time by the
 * Next.js app. It is intentionally not part of the Next.js build or static
 * export, and it only binds to the loopback interface.
 */
import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";

const root = process.cwd();
const catalogPath = path.join(root, "data", "catalog.json");
const uiPath = path.join(root, "scripts", "dashboard-ui.html");
const host = "127.0.0.1";
const port = Number(process.env.DASHBOARD_PORT || 4317);

const METADATA_API_BASE = "https://api.themoviedb.org/3";
const OKCDN_URL = "https://igl-8wky.freeforall.dev/okcdn.json";
const OKCDN_IMAGE_BASE = "https://igl-8wky.freeforall.dev/img";
const PENDING_SYNC_TTL = 15 * 60 * 1000;
const METADATA_API_KEY =
  process.env.TMDB_API_KEY ||
  process.env.METADATA_API_KEY ||
  "f1e46d83ecce5dc29c90d9d2ed41f2ed";
const IMAGE_BASE = {
  w1280: "https://image.tmdb.org/t/p/w1280",
  w780: "https://image.tmdb.org/t/p/w780",
  w500: "https://image.tmdb.org/t/p/w500",
  w185: "https://image.tmdb.org/t/p/w185",
};

if (process.env.NODE_ENV === "production" && !process.env.DASHBOARD_ALLOW_PRODUCTION) {
  console.error(
    "Refusing to start: the dashboard is for local development. " +
      "Set DASHBOARD_ALLOW_PRODUCTION=1 only if you really mean it.",
  );
  process.exit(1);
}

if (process.env.VERCEL || process.env.NETLIFY) {
  console.error("Refusing to start: the dashboard is local-only and must not run on a host.");
  process.exit(1);
}

let syncInProgress = false;
const pendingSyncs = new Map();

/* ------------------------------------------------------------------ storage */

async function readCatalog() {
  return JSON.parse(await readFile(catalogPath, "utf8"));
}

async function writeCatalog(catalog) {
  catalog.updatedAt = new Date().toISOString();
  await writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
}

function slug(value, fallback = "item") {
  const result = String(value || "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
  return result || fallback;
}

function uniqueId(base, used) {
  let id = base;
  let counter = 2;
  while (used.has(id)) {
    id = `${base}-${counter}`;
    counter += 1;
  }
  used.add(id);
  return id;
}

function asNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function asNullableNumber(value) {
  if (value === "" || value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function asString(value, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asList(value) {
  return Array.isArray(value)
    ? value.map((item) => String(item).trim()).filter(Boolean)
    : [];
}

function normalizeGuestStars(guests) {
  if (!Array.isArray(guests)) return [];
  return guests
    .map((guest) => ({
      externalId: asNumber(guest?.externalId),
      name: asString(guest?.name).trim(),
      character: guest?.character ? String(guest.character) : null,
      profilePath: guest?.profilePath ? String(guest.profilePath) : null,
      profileUrl: guest?.profileUrl ? String(guest.profileUrl) : null,
    }))
    .filter((guest) => guest.name);
}

function normalizeOverrides(value) {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(
      value
        .map((item) => asString(item).trim())
        .filter((item) => /^[a-zA-Z0-9_.]+$/.test(item)),
    ),
  );
}

function okcdnImageUrl(record) {
  const localImage = asString(record?.localImage).trim().replace(/^\/+/, "");
  if (localImage) return `${OKCDN_IMAGE_BASE}/${localImage}`;
  const thumbnail = asString(record?.thumbnail).trim();
  if (!thumbnail) return null;
  // The feed still ships some older host names for the same `/img` files.
  return thumbnail.replace(
    /^https?:\/\/(?:www\.)?indiassgottlatent\.freeforall\.dev\/img\//i,
    `${OKCDN_IMAGE_BASE}/`,
  );
}

function normalizeOkcdnRecord(record) {
  if (!record || typeof record !== "object") return undefined;
  const dataId = asString(record.dataId).trim();
  if (!dataId) return undefined;
  return {
    id: asString(record.id),
    dataId,
    title: asString(record.title).trim(),
    description: asString(record.description),
    season: asString(record.season),
    type: asString(record.type, "okcdn") || "okcdn",
    youtubeId: record.youtubeId ? String(record.youtubeId) : null,
    thumbnail: okcdnImageUrl(record),
    localImage: record.localImage ? String(record.localImage) : null,
    duration: record.duration ? String(record.duration) : null,
  };
}

function normalizeMeta(meta) {
  if (!meta || typeof meta !== "object") return undefined;
  return {
    externalId: asNumber(meta.externalId),
    seasonNumber: asNumber(meta.seasonNumber),
    episodeNumber: asNumber(meta.episodeNumber),
    name: asString(meta.name),
    overview: asString(meta.overview),
    airDate: meta.airDate ? String(meta.airDate) : null,
    runtimeMinutes: asNullableNumber(meta.runtimeMinutes),
    rating: asNumber(meta.rating),
    voteCount: asNumber(meta.voteCount),
    stillPath: meta.stillPath ? String(meta.stillPath) : null,
    stillUrl: meta.stillUrl ? String(meta.stillUrl) : null,
    guestStars: normalizeGuestStars(meta.guestStars),
  };
}

function normalizeEpisode(episode) {
  const normalized = {
    ...episode,
    id: asString(episode?.id).trim(),
    season:
      typeof episode?.season === "number"
        ? episode.season
        : /^\d+$/.test(String(episode?.season ?? ""))
          ? Number(episode.season)
          : asString(episode?.season, "Specials"),
    eps_no:
      typeof episode?.eps_no === "number"
        ? episode.eps_no
        : /^\d+$/.test(String(episode?.eps_no ?? ""))
          ? Number(episode.eps_no)
          : asString(episode?.eps_no),
    title: asString(episode?.title).trim(),
    description: asString(episode?.description),
    duration: asString(episode?.duration),
    guests: asList(episode?.guests),
    hosts: asList(episode?.hosts),
    thumbnail: asString(episode?.thumbnail),
    downloadLink: asString(episode?.downloadLink),
    metadata: {
      keywords: asList(episode?.metadata?.keywords),
      tags: asList(episode?.metadata?.tags),
      genre: asString(episode?.metadata?.genre),
    },
  };

  const servers = Array.isArray(episode?.servers) ? episode.servers : [];
  const usedServerIds = new Set();
  normalized.servers = servers
    .map((server) => {
      const link = asString(server?.link).trim();
      if (!link) return null;
      const name = asString(server?.name).trim() || "Server";
      const idBase = slug(server?.id || name, "server");
      return {
        id: uniqueId(idBase, usedServerIds),
        name,
        type: asString(server?.type, "iframe") || "iframe",
        link,
      };
    })
    .filter(Boolean);

  const meta = normalizeMeta(episode?.meta);
  if (meta) normalized.meta = meta;
  else delete normalized.meta;

  const overrides = normalizeOverrides(episode?.overrides);
  if (overrides.length) normalized.overrides = overrides;
  else delete normalized.overrides;

  const okcdn = normalizeOkcdnRecord(episode?.okcdn);
  if (okcdn) normalized.okcdn = okcdn;
  else delete normalized.okcdn;

  return normalized;
}

function validateCatalog(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw httpError(400, "Catalog must be a JSON object.");
  }
  if (!input.show || typeof input.show !== "object" || Array.isArray(input.show)) {
    throw httpError(400, "Catalog is missing a show object.");
  }
  if (!Array.isArray(input.seasons)) {
    throw httpError(400, "Catalog is missing a seasons array.");
  }
  if (!Array.isArray(input.episodes)) {
    throw httpError(400, "Catalog is missing an episodes array.");
  }
  if (!Array.isArray(input.spotlight)) {
    throw httpError(400, "Catalog is missing a spotlight array.");
  }

  const ids = new Set();
  input.episodes = input.episodes.map((episode, index) => {
    const normalized = normalizeEpisode(episode);
    if (!normalized.id) {
      throw httpError(400, `Episode ${index + 1} is missing an id.`);
    }
    if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(normalized.id)) {
      throw httpError(
        400,
        `Episode id "${normalized.id}" may only contain letters, numbers, dots, underscores, and hyphens.`,
      );
    }
    if (ids.has(normalized.id)) {
      throw httpError(400, `Duplicate episode id "${normalized.id}".`);
    }
    ids.add(normalized.id);
    if (!normalized.title) {
      throw httpError(400, `Episode "${normalized.id}" is missing a title.`);
    }
    return normalized;
  });

  input.version = asNumber(input.version, 1) || 1;
  return input;
}

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

/* ---------------------------------------------------------- metadata sync */

let preferRelay = false;
let lastTransport = "direct";

function parseJsonLoose(text) {
  const trimmed = String(text || "").trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const objectStart = trimmed.indexOf("{");
    const arrayStart = trimmed.indexOf("[");
    let start = -1;
    if (objectStart === -1) start = arrayStart;
    else if (arrayStart === -1) start = objectStart;
    else start = Math.min(objectStart, arrayStart);
    if (start === -1) throw new Error("Response did not contain JSON.");
    const end = trimmed[start] === "[" ? trimmed.lastIndexOf("]") : trimmed.lastIndexOf("}");
    if (end <= start) throw new Error("Response did not contain JSON.");
    return JSON.parse(trimmed.slice(start, end + 1));
  }
}

async function requestJson(pathname, params = {}) {
  const url = new URL(`${METADATA_API_BASE}${pathname}`);
  url.searchParams.set("language", "en-US");
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }
  url.searchParams.set("api_key", METADATA_API_KEY);

  let directError = null;
  if (!preferRelay) {
    try {
      const response = await fetch(url, {
        headers: { accept: "application/json" },
        signal: AbortSignal.timeout(20000),
      });
      const text = await response.text();
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${text.slice(0, 200)}`);
      const data = parseJsonLoose(text);
      if (data && data.success === false) {
        throw new Error(data.status_message || "Metadata request was rejected.");
      }
      lastTransport = "direct";
      return data;
    } catch (error) {
      directError = error;
      preferRelay = true;
    }
  }

  try {
    const response = await fetch(`https://r.jina.ai/${url.toString()}`, {
      headers: { accept: "text/plain" },
      signal: AbortSignal.timeout(45000),
    });
    const text = await response.text();
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${text.slice(0, 200)}`);
    const data = parseJsonLoose(text);
    if (data && data.success === false) {
      throw new Error(data.status_message || "Metadata request was rejected.");
    }
    lastTransport = "relay";
    return data;
  } catch (relayError) {
    const parts = [];
    if (directError) parts.push(`direct: ${directError.message}`);
    parts.push(`relay: ${relayError.message}`);
    throw httpError(502, `Could not reach the metadata service (${parts.join("; ")}).`);
  }
}

function imageUrl(base, filePath) {
  return filePath ? `${base}${filePath}` : null;
}

async function requestOkcdn() {
  let directError = null;
  try {
    const response = await fetch(OKCDN_URL, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(15000),
    });
    const text = await response.text();
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${text.slice(0, 160)}`);
    const data = parseJsonLoose(text);
    if (!Array.isArray(data)) throw new Error("okcdn response was not an array.");
    return { items: data, transport: "direct", error: null };
  } catch (error) {
    directError = error;
  }

  try {
    const response = await fetch(`https://r.jina.ai/${OKCDN_URL}`, {
      headers: { accept: "text/plain" },
      signal: AbortSignal.timeout(30000),
    });
    const text = await response.text();
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${text.slice(0, 160)}`);
    const data = parseJsonLoose(text);
    if (!Array.isArray(data)) throw new Error("okcdn response was not an array.");
    return { items: data, transport: "relay", error: null };
  } catch (relayError) {
    return {
      items: [],
      transport: "unavailable",
      error: `direct: ${directError.message}; relay: ${relayError.message}`,
    };
  }
}

function recordFromEpisode(episode) {
  return {
    externalId: asNumber(episode.id),
    seasonNumber: asNumber(episode.season_number),
    episodeNumber: asNumber(episode.episode_number),
    name: asString(episode.name),
    overview: asString(episode.overview),
    airDate: episode.air_date || null,
    runtimeMinutes: asNullableNumber(episode.runtime),
    rating: asNumber(episode.vote_average),
    voteCount: asNumber(episode.vote_count),
    stillPath: episode.still_path || null,
    stillUrl: imageUrl(IMAGE_BASE.w780, episode.still_path),
    guestStars: (Array.isArray(episode.guest_stars) ? episode.guest_stars : [])
      .map((guest) => ({
        externalId: asNumber(guest.id),
        name: asString(guest.name),
        character: guest.character ? String(guest.character) : null,
        profilePath: guest.profile_path || null,
        profileUrl: imageUrl(IMAGE_BASE.w185, guest.profile_path),
      }))
      .filter((guest) => guest.name),
  };
}

function seasonLabelFor(seasonNumber) {
  return seasonNumber === 0 ? "Specials" : `Season ${seasonNumber}`;
}

function siteSeasonFor(record) {
  if (record.seasonNumber !== 0) return record.seasonNumber;
  const match = /\bs(\d+)\b/i.exec(record.name);
  return match ? Number(match[1]) : "Specials";
}

function episodeLabelFor(record) {
  if (record.seasonNumber !== 0) return record.episodeNumber;
  const bonus = /Bonus EP\s*(\d+)/i.exec(record.name);
  if (bonus) return `Bonus EP ${bonus[1]}`;
  if (/Bonus Clip/i.test(record.name)) return "Bonus Clip";
  if (/Netflix Exclusive/i.test(record.name)) return "Netflix Special";
  if (/Deleted/i.test(record.name)) return "Deleted Moments";
  return "Special";
}

function okcdnSiteSeason(record) {
  const title = asString(record?.title);
  if (/still alive|documentary|talk show|comedy special/i.test(title)) return "Specials";
  switch (asString(record?.season).toLowerCase()) {
    case "s1":
      return 1;
    case "s2":
      return 2;
    default:
      return "Specials";
  }
}

function okcdnEpisodeLabel(record) {
  const title = asString(record?.title);
  const dataId = asString(record?.dataId);

  const bonus = /Bonus EP\s*(\d+)/i.exec(title);
  if (bonus) return `Bonus EP ${Number(bonus[1])}`;

  const bts = /\bBTS\s*(\d+)/i.exec(title);
  if (bts) return `BTS ${String(bts[1]).padStart(2, "0")}`;

  const bonusClip = /Bonus Clip(?:\s*(\d+))?/i.exec(title);
  if (bonusClip) return bonusClip[1] ? `Bonus Clip ${Number(bonusClip[1])}` : "Bonus Clip";

  const bonusSegment = /Bonus Segment\s*(\d+)/i.exec(title);
  if (bonusSegment) return `Bonus Segment ${Number(bonusSegment[1])}`;

  const discarded = /Discarded(?:\s*(?:EP|Segment))?\s*(\d+)/i.exec(title);
  if (discarded) return `Discarded ${Number(discarded[1])}`;

  if (/Deleted Footage/i.test(title)) return "Deleted Footage";

  const talkShow = /Talk Show Segment\s*(\d+)/i.exec(title);
  if (talkShow) return `Talk Show ${Number(talkShow[1])}`;

  if (/Still Alive/i.test(title)) return "Documentary";
  if (/Netflix/i.test(title)) return "Netflix Special";

  const seasonEpisode = /Season\s*\d+\s*Episode\s*(\d+)/i.exec(title);
  if (seasonEpisode) return Number(seasonEpisode[1]);

  const ep = /\bEP\.?\s*(\d+)/i.exec(title);
  if (ep) return Number(ep[1]);

  const episode = /\bEpisode\s*(\d+)/i.exec(title);
  if (episode) return Number(episode[1]);

  const byDataId = /^(?:s\d+-|ep-|bonus-|extra-)(\d+)/i.exec(dataId);
  if (byDataId) return Number(byDataId[1]);

  return "Special";
}

function titleGuests(title) {
  const match = /\b(?:ft\.?|feat\.?)\s+(.+)$/i.exec(asString(title));
  if (!match) return [];
  return match[1]
    .split(/\s*,\s*|\s+and\s+/i)
    .map((name) => name.replace(/\|.*$/, "").trim())
    .filter(Boolean);
}

function formatDuration(value) {
  const text = asString(value).trim();
  if (!text) return "";
  if (/^\d+$/.test(text)) return `${text}min`;
  const hours = /(\d+)\s*h/i.exec(text);
  const minutes = /(\d+)\s*m/i.exec(text);
  if (hours || minutes) {
    const hourValue = hours ? Number(hours[1]) : 0;
    const minuteValue = minutes ? Number(minutes[1]) : 0;
    if (hourValue && minuteValue) return `${hourValue}hr ${minuteValue}min`;
    if (hourValue) return `${hourValue}hr`;
    if (minuteValue) return `${minuteValue}min`;
  }
  return text;
}

function contentKind(title, label = "") {
  const text = `${title} ${label}`;
  if (/bonus\s*clip/i.test(text)) return "clip";
  if (/\bbts\b|behind the scenes/i.test(text)) return "bts";
  if (/\bbonus\b/i.test(text)) return "bonus";
  if (/discarded/i.test(text)) return "discarded";
  if (/deleted/i.test(text)) return "deleted";
  if (/talk show/i.test(text)) return "talkshow";
  if (/documentary|still alive/i.test(text)) return "documentary";
  return "episode";
}

function normalizeSeason(value) {
  if (typeof value === "number") return value;
  const text = String(value ?? "").trim();
  return /^\d+$/.test(text) ? Number(text) : text;
}

function episodeNumberValue(value) {
  const match = /(\d+)/.exec(String(value ?? ""));
  return match ? Number(match[1]) : null;
}

function tokenMatches(left, right) {
  if (left === right) return true;
  return (
    left.length >= 4 && right.length >= 4 && (left.includes(right) || right.includes(left))
  );
}

function titleSimilarity(left, right) {
  const a = titleTokens(left);
  const b = titleTokens(right);
  if (!a.size || !b.size) return 0;
  const used = new Set();
  let matches = 0;
  for (const token of a) {
    for (const other of b) {
      if (!used.has(other) && tokenMatches(token, other)) {
        matches += 1;
        used.add(other);
        break;
      }
    }
  }
  return matches / Math.max(a.size, b.size);
}

function guestSimilarity(leftNames, rightNames) {
  const a = titleTokens((leftNames || []).join(" "));
  const b = titleTokens((rightNames || []).join(" "));
  if (!a.size || !b.size) return 0;
  const used = new Set();
  let matches = 0;
  for (const token of a) {
    for (const other of b) {
      if (!used.has(other) && tokenMatches(token, other)) {
        matches += 1;
        used.add(other);
        break;
      }
    }
  }
  return matches / Math.max(a.size, b.size);
}

function findOkcdnMatch(episodes, record, claimed) {
  for (const episode of episodes) {
    if (!claimed.has(episode.id) && episode.okcdn?.dataId === record.dataId) {
      return episode;
    }
  }

  const season = okcdnSiteSeason(record);
  const label = okcdnEpisodeLabel(record);
  const number = episodeNumberValue(label);
  const kind = contentKind(record.title, label);
  const itemGuests = titleGuests(record.title);
  let best = null;
  let bestScore = 0;

  for (const episode of episodes) {
    if (claimed.has(episode.id)) continue;
    if (String(normalizeSeason(episode.season)) !== String(season)) continue;
    const episodeKind = contentKind(episode.title, `${episode.eps_no} ${episode.meta?.name || ""}`);
    if (episodeKind !== kind) continue;

    const titleScore = titleSimilarity(record.title, `${episode.title} ${episode.meta?.name || ""}`);
    const guestScore = guestSimilarity(episode.guests, itemGuests);
    const episodeNumber = episodeNumberValue(episode.eps_no);
    const numberMatch = number !== null && episodeNumber !== null && number === episodeNumber;
    const confident =
      titleScore >= 0.5 ||
      guestScore >= 0.75 ||
      (numberMatch && (titleScore >= 0.18 || guestScore >= 0.4));
    if (!confident) continue;

    const score = titleScore * 2 + guestScore + (numberMatch ? 0.6 : 0);
    if (score > bestScore) {
      best = episode;
      bestScore = score;
    }
  }
  return best;
}

function applyOkcdnToEpisode(episode, record) {
  const fields = [];
  const overrides = new Set(episode.overrides || []);
  const guests = titleGuests(record.title);
  const hosts = new Set((episode.hosts || []).map((name) => name.toLowerCase()));

  if (record.thumbnail && !episode.thumbnail && !overrides.has("thumbnail")) {
    episode.thumbnail = record.thumbnail;
    fields.push("thumbnail");
  }
  if (record.description && !episode.description && !overrides.has("description")) {
    episode.description = record.description;
    fields.push("description");
  }
  if (record.duration && !episode.duration && !overrides.has("duration")) {
    const duration = formatDuration(record.duration);
    if (duration) {
      episode.duration = duration;
      fields.push("duration");
    }
  }
  if ((!episode.guests || episode.guests.length === 0) && guests.length && !overrides.has("guests")) {
    episode.guests = guests.filter((name) => !hosts.has(name.toLowerCase()));
    fields.push("guests");
  }

  episode.okcdn = record;
  return fields;
}

function createEpisodeFromOkcdn(record, show, usedIds) {
  const season = okcdnSiteSeason(record);
  const label = okcdnEpisodeLabel(record);
  const seasonText = typeof season === "number" ? `Season ${season}` : String(season);
  const hosts = ["Samay Raina"];
  const guests = titleGuests(record.title).filter(
    (name) => !hosts.some((host) => host.toLowerCase() === name.toLowerCase()),
  );
  const title = record.title || `${show?.name || "India's Got Latent"} ${label}`;
  const id = uniqueId(slug(`${show?.name || "india-got-latent"} ${title}`), usedIds);

  const tags = ["episode", "okcdn"];
  if (/\bbonus\b/i.test(title)) tags.push("bonus");
  if (/\bbts\b/i.test(title)) tags.push("bts");
  if (typeof season === "number") tags.push(`season-${season}`);

  return {
    id,
    season,
    eps_no: label,
    title,
    description: record.description,
    duration: formatDuration(record.duration),
    guests,
    hosts,
    thumbnail: record.thumbnail || "",
    downloadLink: "",
    servers: [],
    metadata: {
      keywords: Array.from(
        new Set([show?.name, seasonText, ...guests].filter(Boolean)),
      ),
      tags,
      genre: show?.genres?.[0] || "Comedy",
    },
    okcdn: record,
  };
}

function titleFor(record, showName) {
  const name = record.name.trim();
  if (record.seasonNumber > 0 && /^episode\s+\d+\b/i.test(name)) {
    const suffix = name.replace(/^episode\s+\d+\s*[:\-–—]?\s*/i, "").trim();
    return `${showName} S${record.seasonNumber} EP${record.episodeNumber}${suffix ? ` ${suffix}` : ""}`;
  }
  return name || `${showName} ${seasonLabelFor(record.seasonNumber)} EP${record.episodeNumber}`;
}

function createEpisodeFromRecord(record, show, usedIds) {
  const season = siteSeasonFor(record);
  const label = episodeLabelFor(record);
  const seasonText = typeof season === "number" ? `Season ${season}` : String(season);
  const hosts = ["Samay Raina"];
  const guestNames = record.guestStars
    .map((guest) => guest.name)
    .filter((name) => !hosts.includes(name));
  const title = titleFor(record, show.name || "India's Got Latent");
  const id = uniqueId(slug(`${show.name || "india-got-latent"} ${title}`), usedIds);

  const tags = ["episode"];
  if (record.seasonNumber === 0) tags.push("special");
  if (/bonus/i.test(record.name)) tags.push("bonus");
  if (/bts/i.test(record.name)) tags.push("bts");
  if (typeof season === "number") tags.push(`season-${season}`);

  return {
    id,
    season,
    eps_no: label,
    title,
    description: record.overview,
    duration: record.runtimeMinutes ? `${record.runtimeMinutes}min` : "",
    guests: guestNames,
    hosts,
    thumbnail: record.stillUrl || "",
    downloadLink: "",
    servers: [],
    metadata: {
      keywords: Array.from(new Set([show.name, seasonText, ...guestNames].filter(Boolean))),
      tags,
      genre: show.genres?.[0] || "Comedy",
    },
    meta: record,
  };
}

function titleTokens(value) {
  const stop = new Set([
    "the",
    "and",
    "with",
    "from",
    "india",
    "indias",
    "got",
    "latent",
    "episode",
    "season",
    "bonus",
    "special",
    "netflix",
    "exclusive",
    "ft",
    "feat",
    "full",
    "part",
    "segment",
  ]);
  return new Set(
    String(value || "")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .split(" ")
      .filter((token) => token.length > 2 && !stop.has(token)),
  );
}

function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let intersection = 0;
  for (const token of a) if (b.has(token)) intersection += 1;
  return intersection / (a.size + b.size - intersection);
}

function guestOverlap(a, b) {
  const left = new Set((a || []).map((name) => String(name).toLowerCase()));
  let count = 0;
  for (const name of b || []) if (left.has(String(name).toLowerCase())) count += 1;
  return count;
}

function findFuzzyMatch(episodes, record, claimed) {
  if (record.seasonNumber === 0) return null;
  const recordTokens = titleTokens(record.name);
  const recordGuests = record.guestStars.map((guest) => guest.name);
  let best = null;
  let bestScore = 0;

  for (const episode of episodes) {
    if (claimed.has(episode.id) || episode.meta) continue;
    if (typeof episode.season !== "number" || episode.season !== record.seasonNumber) continue;
    const score = jaccard(recordTokens, titleTokens(episode.title));
    const overlap = guestOverlap(episode.guests, recordGuests);
    const matchesNumber = episode.eps_no === record.episodeNumber;
    const confident =
      (score >= 0.6 && overlap >= 1) ||
      (matchesNumber && score >= 0.25) ||
      (overlap >= 3 && score >= 0.35);
    if (confident && score > bestScore) {
      best = episode;
      bestScore = score;
    }
  }
  return best;
}

function snapshotEpisode(episode) {
  return {
    title: episode.title,
    thumbnail: episode.thumbnail,
    description: episode.description,
    duration: episode.duration,
    guests: [...(episode.guests || [])],
    meta: episode.meta ? structuredClone(episode.meta) : null,
  };
}

function changedFields(before, after) {
  const fields = [];
  if (before.title !== after.title) fields.push("title");
  if (before.thumbnail !== after.thumbnail) fields.push("thumbnail");
  if (before.description !== after.description) fields.push("description");
  if (before.duration !== after.duration) fields.push("duration");
  if (JSON.stringify(before.guests) !== JSON.stringify(after.guests)) fields.push("guests");

  if (!before.meta && after.meta) {
    fields.push("meta");
  } else if (before.meta && after.meta) {
    const keys = new Set([...Object.keys(before.meta), ...Object.keys(after.meta)]);
    for (const key of keys) {
      if (JSON.stringify(before.meta[key]) !== JSON.stringify(after.meta[key])) {
        fields.push(`meta.${key}`);
      }
    }
  }
  return fields;
}

function episodeOrderValue(episode) {
  const season = normalizeSeason(episode.season);
  return {
    season: typeof season === "number" ? season : 99,
    number: episodeNumberValue(episode.eps_no) ?? 9999,
    title: String(episode.title || ""),
  };
}

function compareEpisodes(left, right) {
  const a = episodeOrderValue(left);
  const b = episodeOrderValue(right);
  if (a.season !== b.season) return a.season - b.season;
  if (a.number !== b.number) return a.number - b.number;
  return a.title.localeCompare(b.title);
}

async function syncCatalog(baseCatalog) {
  const catalog = structuredClone(baseCatalog);
  const showId = asNumber(catalog.show?.externalId) || 262838;
  const showRaw = await requestJson(`/tv/${showId}`, {
    append_to_response: "external_ids,credits",
  });
  const seasonNumbers = (Array.isArray(showRaw.seasons) ? showRaw.seasons : [])
    .map((season) => asNumber(season.season_number))
    .filter((number, index, all) => all.indexOf(number) === index)
    .sort((a, b) => a - b);

  const seasonDetails = [];
  for (const seasonNumber of seasonNumbers) {
    seasonDetails.push(await requestJson(`/tv/${showId}/season/${seasonNumber}`));
  }

  const records = [];
  for (const season of seasonDetails) {
    for (const episode of season.episodes || []) records.push(recordFromEpisode(episode));
  }

  const existingShow = catalog.show || {};
  const rawSeasons = seasonDetails.map((season) => ({
    seasonNumber: asNumber(season.season_number),
    name: asString(season.name) || seasonLabelFor(asNumber(season.season_number)),
    overview: asString(season.overview),
    airDate: season.air_date || null,
    rating: asNumber(season.vote_average),
    episodeCount: Array.isArray(season.episodes) ? season.episodes.length : 0,
    posterPath: season.poster_path || null,
    posterUrl: imageUrl(IMAGE_BASE.w500, season.poster_path),
  }));

  const bySeasonNumber = new Map(catalog.seasons.map((season) => [season.seasonNumber, season]));
  const mergedSeasons = [
    ...rawSeasons.map((season) => ({
      ...(bySeasonNumber.get(season.seasonNumber) || {}),
      ...season,
    })),
    ...catalog.seasons.filter(
      (season) => !rawSeasons.some((item) => item.seasonNumber === season.seasonNumber),
    ),
  ].sort((a, b) => asNumber(a.seasonNumber) - asNumber(b.seasonNumber));

  catalog.show = {
    ...existingShow,
    name: showRaw.name || existingShow.name,
    overview: showRaw.overview || existingShow.overview,
    tagline: showRaw.tagline ?? existingShow.tagline,
    firstAirDate: showRaw.first_air_date || existingShow.firstAirDate,
    lastAirDate: showRaw.last_air_date || existingShow.lastAirDate,
    status: showRaw.status || existingShow.status,
    inProduction:
      typeof showRaw.in_production === "boolean" ? showRaw.in_production : existingShow.inProduction,
    numberOfSeasons: asNumber(showRaw.number_of_seasons, existingShow.numberOfSeasons),
    numberOfEpisodes: asNumber(showRaw.number_of_episodes, existingShow.numberOfEpisodes),
    rating: asNumber(showRaw.vote_average, existingShow.rating),
    voteCount: asNumber(showRaw.vote_count, existingShow.voteCount),
    genres: Array.isArray(showRaw.genres)
      ? showRaw.genres.map((genre) => genre.name).filter(Boolean)
      : existingShow.genres,
    languages: Array.isArray(showRaw.languages) ? showRaw.languages : existingShow.languages,
    originCountry: Array.isArray(showRaw.origin_country)
      ? showRaw.origin_country
      : existingShow.originCountry,
    networks: Array.isArray(showRaw.networks)
      ? showRaw.networks.map((network) => network.name).filter(Boolean)
      : existingShow.networks,
    creators: Array.isArray(showRaw.created_by)
      ? showRaw.created_by.map((person) => person.name).filter(Boolean)
      : existingShow.creators,
    cast:
      Array.isArray(showRaw.credits?.cast) && showRaw.credits.cast.length
        ? showRaw.credits.cast.slice(0, 20).map((person) => person.name).filter(Boolean)
        : existingShow.cast,
    posterPath: showRaw.poster_path ?? existingShow.posterPath,
    posterUrl: imageUrl(IMAGE_BASE.w500, showRaw.poster_path) ?? existingShow.posterUrl,
    backdropPath: showRaw.backdrop_path ?? existingShow.backdropPath,
    backdropUrl: imageUrl(IMAGE_BASE.w1280, showRaw.backdrop_path) ?? existingShow.backdropUrl,
    imdbId: showRaw.external_ids?.imdb_id ?? existingShow.imdbId,
    instagramId: showRaw.external_ids?.instagram_id ?? existingShow.instagramId,
    externalId: asNumber(showRaw.id, existingShow.externalId),
  };
  catalog.seasons = mergedSeasons;

  const byExternalId = new Map();
  const byPair = new Map();
  for (const episode of catalog.episodes) {
    if (episode.meta?.externalId) byExternalId.set(asNumber(episode.meta.externalId), episode);
    if (episode.meta) {
      byPair.set(`${asNumber(episode.meta.seasonNumber)}:${asNumber(episode.meta.episodeNumber)}`, episode);
    }
  }

  const usedIds = new Set(catalog.episodes.map((episode) => episode.id));
  const claimed = new Set();
  const addedEpisodes = [];
  const addedById = new Map();
  const changeMap = new Map();

  const addEpisode = (episode, source) => {
    catalog.episodes.push(episode);
    const entry = {
      id: episode.id,
      title: episode.title,
      season: episode.season,
      eps_no: episode.eps_no,
      sources: [source],
    };
    addedEpisodes.push(entry);
    addedById.set(episode.id, entry);
  };

  const recordChange = (episode, fields, source) => {
    if (!fields.length || addedById.has(episode.id)) return;
    const existing = changeMap.get(episode.id);
    if (existing) {
      for (const field of fields) {
        if (!existing.fields.includes(field)) existing.fields.push(field);
      }
      if (!existing.sources.includes(source)) existing.sources.push(source);
      return;
    }
    changeMap.set(episode.id, {
      id: episode.id,
      title: episode.title,
      season: episode.season,
      eps_no: episode.eps_no,
      sources: [source],
      fields,
    });
  };

  for (const record of records) {
    let episode =
      byExternalId.get(record.externalId) ||
      byPair.get(`${record.seasonNumber}:${record.episodeNumber}`) ||
      null;

    if (episode && claimed.has(episode.id)) episode = null;
    if (!episode) episode = findFuzzyMatch(catalog.episodes, record, claimed);

    if (episode) {
      const before = snapshotEpisode(episode);
      const overrides = new Set(episode.overrides || []);
      const metaOverrides = new Set(
        [...overrides]
          .filter((path) => path.startsWith("meta."))
          .map((path) => path.slice("meta.".length)),
      );
      const mergedMeta = { ...record };
      if (episode.meta) {
        for (const field of metaOverrides) {
          if (field in episode.meta) mergedMeta[field] = episode.meta[field];
        }
      }
      episode.meta = mergedMeta;

      if (!episode.thumbnail && record.stillUrl && !overrides.has("thumbnail")) {
        episode.thumbnail = record.stillUrl;
      }
      if (!episode.duration && record.runtimeMinutes && !overrides.has("duration")) {
        episode.duration = `${record.runtimeMinutes}min`;
      }
      if (
        (!episode.guests || episode.guests.length === 0) &&
        record.guestStars.length &&
        !overrides.has("guests")
      ) {
        const hosts = new Set((episode.hosts || []).map((name) => name.toLowerCase()));
        episode.guests = record.guestStars
          .map((guest) => guest.name)
          .filter((name) => !hosts.has(name.toLowerCase()));
      }

      claimed.add(episode.id);
      recordChange(episode, changedFields(before, episode), "tmdb");
    } else {
      const newEpisode = createEpisodeFromRecord(record, catalog.show, usedIds);
      addEpisode(newEpisode, "tmdb");
    }
  }

  const okcdn = await requestOkcdn();
  const okcdnClaimed = new Set();
  let okcdnLinked = 0;
  let okcdnAdded = 0;

  for (const rawRecord of okcdn.items) {
    const record = normalizeOkcdnRecord(rawRecord);
    if (!record) continue;

    const episode = findOkcdnMatch(catalog.episodes, record, okcdnClaimed);
    if (episode) {
      okcdnClaimed.add(episode.id);
      const before = snapshotEpisode(episode);
      applyOkcdnToEpisode(episode, record);
      okcdnLinked += 1;
      const addedEntry = addedById.get(episode.id);
      if (addedEntry) {
        if (!addedEntry.sources.includes("okcdn")) addedEntry.sources.push("okcdn");
      } else {
        recordChange(episode, changedFields(before, episode), "okcdn");
      }
    } else {
      const newEpisode = createEpisodeFromOkcdn(record, catalog.show, usedIds);
      addEpisode(newEpisode, "okcdn");
      okcdnClaimed.add(newEpisode.id);
      okcdnLinked += 1;
      okcdnAdded += 1;
    }
  }

  const updatedEpisodes = [...changeMap.values()].sort(compareEpisodes);
  addedEpisodes.sort(compareEpisodes);

  return {
    catalog,
    summary: {
      added: addedEpisodes.length,
      updated: updatedEpisodes.length,
      unchanged: Math.max(0, catalog.episodes.length - addedEpisodes.length - updatedEpisodes.length),
      episodes: catalog.episodes.length,
      seasons: catalog.seasons.length,
      addedEpisodes,
      updatedEpisodes,
      overridesKept: catalog.episodes.reduce(
        (total, episode) =>
          total + (episode.overrides || []).filter((path) => path.startsWith("meta.")).length,
        0,
      ),
      transport: lastTransport,
      okcdn: {
        transport: okcdn.transport,
        error: okcdn.error,
        fetched: okcdn.items.length,
        linked: okcdnLinked,
        added: okcdnAdded,
      },
    },
  };
}

/* ------------------------------------------------------------------- http */

function sendJson(response, status, payload) {
  const body = JSON.stringify(payload);
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
  });
  response.end(body);
}

function sendText(response, status, body, contentType = "text/html; charset=utf-8") {
  response.writeHead(status, {
    "content-type": contentType,
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
  });
  response.end(body);
}

function readBody(request, limit = 50 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    request.on("data", (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(httpError(413, "Request body is too large."));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    request.on("error", reject);
  });
}

function assertLocalOrigin(request) {
  const origin = request.headers.origin;
  if (!origin) return;
  const allowed = new Set([`http://${host}:${port}`, `http://localhost:${port}`]);
  if (!allowed.has(origin)) {
    throw httpError(403, "Cross-origin requests are not allowed.");
  }
}

function prunePendingSyncs() {
  const now = Date.now();
  for (const [token, pending] of pendingSyncs) {
    if (now - pending.createdAt > PENDING_SYNC_TTL) pendingSyncs.delete(token);
  }
}

async function readSyncToken(request) {
  const body = (await readBody(request)).trim();
  if (!body) throw httpError(400, "Request body is missing the sync token.");
  let parsed;
  try {
    parsed = JSON.parse(body);
  } catch {
    throw httpError(400, "Request body is not valid JSON.");
  }
  const token = asString(parsed?.token).trim();
  if (!token) throw httpError(400, "Request body is missing the sync token.");
  return token;
}

async function handleRequest(request, response) {
  const url = new URL(request.url || "/", `http://${host}:${port}`);

  if (request.method === "GET" && (url.pathname === "/" || url.pathname === "/index.html")) {
    const html = await readFile(uiPath, "utf8");
    sendText(response, 200, html);
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/catalog") {
    sendJson(response, 200, await readCatalog());
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/health") {
    sendJson(response, 200, { ok: true, local: true, bind: `${host}:${port}` });
    return;
  }

  if (request.method === "PUT" && url.pathname === "/api/catalog") {
    assertLocalOrigin(request);
    const body = await readBody(request);
    let parsed;
    try {
      parsed = JSON.parse(body);
    } catch {
      throw httpError(400, "Request body is not valid JSON.");
    }
    const catalog = validateCatalog(parsed);
    await writeCatalog(catalog);
    sendJson(response, 200, { catalog });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/sync/preview") {
    assertLocalOrigin(request);
    if (syncInProgress) throw httpError(409, "A sync is already running. Please wait.");
    syncInProgress = true;
    try {
      const body = (await readBody(request)).trim();
      let baseCatalog;
      if (body) {
        let parsed;
        try {
          parsed = JSON.parse(body);
        } catch {
          throw httpError(400, "Request body is not valid JSON.");
        }
        baseCatalog = validateCatalog(parsed.catalog || parsed);
      } else {
        baseCatalog = validateCatalog(await readCatalog());
      }
      const result = await syncCatalog(baseCatalog);
      prunePendingSyncs();
      const token = randomUUID();
      pendingSyncs.set(token, {
        catalog: result.catalog,
        summary: result.summary,
        createdAt: Date.now(),
      });
      sendJson(response, 200, { token, summary: result.summary });
    } finally {
      syncInProgress = false;
    }
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/sync/apply") {
    assertLocalOrigin(request);
    const token = await readSyncToken(request);
    prunePendingSyncs();
    const pending = pendingSyncs.get(token);
    if (!pending) {
      throw httpError(409, "This sync preview expired or was already applied. Run the sync again.");
    }
    pendingSyncs.delete(token);
    await writeCatalog(pending.catalog);
    sendJson(response, 200, { catalog: pending.catalog, summary: pending.summary });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/sync/discard") {
    assertLocalOrigin(request);
    const token = await readSyncToken(request);
    pendingSyncs.delete(token);
    sendJson(response, 200, { ok: true });
    return;
  }


  sendJson(response, 404, { error: "Not found." });
}

const server = createServer((request, response) => {
  handleRequest(request, response).catch((error) => {
    const status = error.status || 500;
    if (status >= 500) console.error(error);
    if (!response.headersSent) {
      sendJson(response, status, { error: error.message || "Unexpected error." });
    } else {
      response.end();
    }
  });
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `Port ${port} is already in use. Set DASHBOARD_PORT to another port and try again.`,
    );
  } else {
    console.error(error);
  }
  process.exit(1);
});

server.listen(port, host, () => {
  console.log("");
  console.log("  Catalog Studio — local dashboard");
  console.log(`  http://${host}:${port}`);
  console.log(`  editing ${path.relative(root, catalogPath)}`);
  console.log("  Press Ctrl+C to stop.");
  console.log("");
});
