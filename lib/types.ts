export type EpisodeServer = {
  id: string;
  name: string;
  type?: string;
  link: string;
};

export type MetaGuest = {
  externalId: number;
  name: string;
  character: string | null;
  profilePath: string | null;
  profileUrl: string | null;
};

/** Extra episode context from the public okcdn feed. */
export type OkcdnRecord = {
  id: string;
  dataId: string;
  title: string;
  description: string;
  season: string;
  type: string;
  youtubeId: string | null;
  thumbnail: string | null;
  localImage: string | null;
  duration: string | null;
};

/** Normalized episode metadata stored alongside the episode in the catalog. */
export type EpisodeMeta = {
  externalId: number;
  seasonNumber: number;
  episodeNumber: number;
  name: string;
  overview: string;
  airDate: string | null;
  runtimeMinutes: number | null;
  rating: number;
  voteCount: number;
  stillPath: string | null;
  stillUrl: string | null;
  guestStars: MetaGuest[];
};

export type Episode = {
  id: string;
  title: string;
  description: string;
  season: number | string;
  eps_no: number | string;
  duration?: string;
  guests?: string[];
  hosts?: string[];
  thumbnail: string;
  downloadLink?: string;
  servers?: EpisodeServer[];
  meta?: EpisodeMeta;
  /** Dot paths edited by hand; metadata sync leaves these values alone. */
  overrides?: string[];
  /** Context captured from the okcdn feed for debugging and future syncs. */
  okcdn?: OkcdnRecord;
  metadata?: {
    keywords?: string[];
    tags?: string[];
    genre?: string;
  };
};

export type SpotlightSlide = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  video_url: string;
};

export type ShowInfo = {
  name: string;
  alternateName: string;
  overview: string;
  tagline: string | null;
  firstAirDate: string;
  lastAirDate: string;
  status: string;
  inProduction: boolean;
  numberOfSeasons: number;
  numberOfEpisodes: number;
  rating: number;
  voteCount: number;
  genres: string[];
  languages: string[];
  originCountry: string[];
  networks: string[];
  creators: string[];
  cast: string[];
  posterPath: string | null;
  posterUrl: string | null;
  backdropPath: string | null;
  backdropUrl: string | null;
  logoPath: string | null;
  logoUrl: string | null;
  imdbId: string | null;
  instagramId: string | null;
  externalId: number;
};

export type SeasonInfo = {
  seasonNumber: number;
  name: string;
  overview: string;
  airDate: string | null;
  rating: number;
  episodeCount: number;
  posterPath: string | null;
  posterUrl: string | null;
};
