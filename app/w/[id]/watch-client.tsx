"use client";

import { useState } from "react";
import { Play, Server, Clock, Calendar, Download, User, Users, MessageSquare } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { episodes } from "@/lib/data";
import { ReportDialog } from "@/components/report-dialog";

export default function WatchClient({ episode }: { episode: any }) {
  const pathname = usePathname();
  const hasServers = !!episode.servers && episode.servers.length > 0;
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedServerId = searchParams.get("server");
  const selectedServer = hasServers
    ? episode.servers.find((server: any) => server.id === requestedServerId) || episode.servers[0]
    : null;
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const getEpisodeLabel = (eps_no: string | number) => {
    if (typeof eps_no === 'number') {
      return `EPISODE ${String(eps_no).padStart(2, '0')}`;
    }
    return String(eps_no).replace(/-/g, ' ').toUpperCase();
  };

  // Show the newest episodes first, excluding the current episode.
  const suggestions = [...episodes]
    .sort((firstEpisode, secondEpisode) =>
      Number(secondEpisode.season) - Number(firstEpisode.season) ||
      Number(secondEpisode.eps_no) - Number(firstEpisode.eps_no)
    )
    .filter((ep) => ep.id !== episode.id)
    .slice(0, 4);

  return (
    <div className="w-full pb-12 animate-in fade-in duration-500">
      {/* Report Button & Episode Label */}
      <div className="flex items-center justify-between py-4 mb-2">
        <ReportDialog context={`Episode: ${episode.title} (${episode.id})`} />
        <div className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
          {getEpisodeLabel(episode.eps_no)}
        </div>
      </div>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* 1. Player & Servers (Col 1-2, Row 1) */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Player Container */}
          <div className="relative -mx-4 sm:mx-0 w-auto sm:w-full aspect-video rounded-none sm:rounded-lg md:rounded-lg overflow-hidden bg-black sm:border border-y border-border sm:shadow-lg group">
            {hasServers ? (
              <>
                {!isIframeLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-card z-10">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-8 h-8 border-2 border-muted border-t-primary rounded-full animate-spin" />
                      <span className="text-[10px] md:text-xs font-medium tracking-widest text-muted-foreground uppercase">Connecting...</span>
                    </div>
                  </div>
                )}
                <iframe
                  src={selectedServer!.link}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className={`absolute inset-0 w-full h-full border-0 transition-opacity duration-1000 ${isIframeLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setIsIframeLoaded(true)}
                />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-card z-10 text-center p-8">
                <div className="flex flex-col items-center gap-4">
                  <Server className="w-12 h-12 text-muted-foreground/50" />
                  <div>
                    <h3 className="text-base font-semibold text-foreground">No Sources Available</h3>
                    <p className="text-sm text-muted-foreground mt-1">Video link will be added soon</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Server Selection */}
          <div className="bg-card border border-border rounded-lg p-4 md:p-6 transition-colors shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Server className="w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground" />
              <h3 className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Select Source</h3>
            </div>
            {hasServers ? (
              <div className="flex flex-wrap gap-2.5 md:gap-3">
                {episode.servers.map((server: any) => (
                  <button
                    key={server.id}
                    onClick={() => {
                      if (selectedServer && selectedServer.id !== server.id) {
                        setIsIframeLoaded(false);
                        const nextParams = new URLSearchParams(searchParams.toString());
                        nextParams.set("server", server.id);
                        router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
                      }
                    }}
                    className={`px-3 py-2 md:px-4 md:py-2.5 rounded-lg text-[10px] md:text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center gap-2 ${selectedServer && selectedServer.id === server.id
                      ? "bg-primary text-primary-foreground shadow-md scale-[1.02]"
                      : "bg-muted/50 text-muted-foreground border border-border hover:border-primary/50 hover:text-foreground hover:bg-muted"
                      }`}
                  >
                    <Play className={`w-3 h-3 md:w-3.5 md:h-3.5 transition-colors ${selectedServer && selectedServer.id === server.id ? "fill-primary-foreground" : "fill-transparent"}`} />
                    {server.name}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No sources available yet</p>
            )}
          </div>
        </div>

        {/* 2. Episode Details (Col 3, Row 1-2) */}
        <div className="flex flex-col gap-5 lg:gap-6 lg:row-span-2">
          <div>
            <div className="hidden lg:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted border border-border mb-4 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" />
              <span className="text-[9px] md:text-[10px] font-bold text-foreground uppercase tracking-widest">Now Playing</span>
            </div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-black text-foreground leading-[1.2] mb-1 tracking-tight">
              {episode.title}
            </h1>
          </div>

          {/* YT-like Expandable Description Box */}
          <div
            className="bg-card/50 hover:bg-card border border-border rounded-lg p-4 md:p-5 shadow-sm transition-colors"
          >
            <div className="flex items-center gap-4 mb-3 text-xs md:text-sm font-bold text-foreground">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                <span>{episode.duration}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Season {episode.season}</span>
              </div>
            </div>

            <p className={`text-muted-foreground text-xs md:text-sm leading-relaxed font-medium ${isExpanded ? '' : 'line-clamp-2'}`}>
              {episode.description}
            </p>

            {!isExpanded && (
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="mt-3 text-[10px] md:text-xs font-bold text-primary underline underline-offset-4 hover:text-foreground transition-colors"
              >
                Show more
              </button>
            )}

            {isExpanded && (
              <div className="mt-6 pt-6 border-t border-border space-y-6 animate-in fade-in duration-300" onClick={(e) => e.stopPropagation()}>

                {/* Hosts */}
                {episode.hosts && episode.hosts.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-2 md:mb-3">
                      <User className="w-3.5 h-3.5" />
                      <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em]">Hosts</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {episode.hosts.map((host: string) => (
                        <span key={host} className="px-2.5 py-1 md:px-3 md:py-1.5 bg-muted border border-border rounded-md text-[10px] md:text-xs font-semibold text-foreground">
                          {host}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Guests */}
                {episode.guests && episode.guests.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-2 md:mb-3">
                      <Users className="w-3.5 h-3.5" />
                      <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em]">Guests</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {episode.guests.map((guest: string) => (
                        <span key={guest} className="px-2.5 py-1 md:px-3 md:py-1.5 bg-muted border border-border rounded-md text-[10px] md:text-xs font-semibold text-foreground">
                          {guest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Download */}
                {episode.downloadLink && (
                  <a
                    href={episode.downloadLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 md:gap-3 py-3.5 md:py-4 mt-4 bg-primary text-primary-foreground rounded-lg font-bold text-xs md:text-sm tracking-widest uppercase transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02]"
                  >
                    <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    Download Episode
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="mt-4 text-[10px] md:text-xs font-bold text-primary underline underline-offset-4 hover:text-foreground transition-colors"
                >
                  Show less
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 3. Comments (Col 1-2, Row 2) */}
        <div className="lg:col-span-2 flex flex-col">
          {/* Comments Coming Soon */}
          <div className="bg-card/40 border border-border border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center shadow-sm min-h-[160px] h-full">
            <MessageSquare className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground/50 mb-3" />
            <h3 className="text-sm md:text-base font-bold text-foreground mb-1 tracking-tight">Discussion</h3>
            <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest font-semibold">Comments Coming Soon</p>
          </div>
        </div>

      </main>

      {/* Up Next / Suggestions Section */}
      {suggestions.length > 0 && (
        <section className="mt-16 md:mt-20 border-t border-border pt-8 md:pt-10">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl font-black text-foreground tracking-tight">Up Next</h2>
            <div className="h-px flex-1 bg-border/50" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2   lg:grid-cols-4 gap-6 md:gap-6">
            {suggestions.map((sug) => (
              <Link href={`/w/${sug.id}`} key={sug.id} className="group flex flex-col gap-3">
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black border border-border group-hover:border-primary/50 transition-colors shadow-sm">
                  <Image
                    src={sug.thumbnail}
                    alt={sug.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Play icon overlay on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-10 h-10 rounded-full bg-black/50 border border-white/20 flex items-center justify-center backdrop-blur-sm transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <Play className="w-4 h-4 text-white fill-white" />
                    </div>
                  </div>

                  {/* Top right duration badge */}
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] md:text-[9px] lg:text-[10px] font-bold text-white uppercase tracking-widest border border-white/10">
                    {sug.duration}
                  </div>
                </div>

                <div className="px-1">
                  <h4 className="text-sm md:text-xs lg:text-sm font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {sug.title}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-xs md:text-[10px] lg:text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      Season {sug.season}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
