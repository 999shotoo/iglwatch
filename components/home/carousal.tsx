"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Flag,
    Play,
    Sparkles,
    Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ReportDialog } from "@/components/report-dialog";
import { formatAirDate } from "@/lib/format";
import type { Episode, SpotlightSlide } from "@/lib/types";
import { cn } from "@/lib/utils";

type HomeCarouselProps = {
  episodes: Episode[];
  spotlight: SpotlightSlide[];
};

export default function HomeCarousel({ episodes, spotlight }: HomeCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);

    useEffect(() => {
        if (spotlight.length <= 1) return;
        const timer = setInterval(() => {
            setIsVideoLoaded(false);
            setCurrentIndex((prevIndex) =>
                prevIndex === spotlight.length - 1 ? 0 : prevIndex + 1
            );
        }, 12000);
        return () => clearInterval(timer);
    }, [spotlight.length]);

    if (spotlight.length === 0) {
        return null;
    }

    const currentItem = spotlight[currentIndex];
    const matchedEpisode = episodes.find((episode) => episode.id === currentItem.id);

    const goTo = (nextIndex: number) => {
        setIsVideoLoaded(false);
        setCurrentIndex(nextIndex);
    };

    const handlePrev = () => {
        setIsVideoLoaded(false);
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? spotlight.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setIsVideoLoaded(false);
        setCurrentIndex((prevIndex) =>
            prevIndex === spotlight.length - 1 ? 0 : prevIndex + 1
        );
    };

    const seasonLabel = matchedEpisode
        ? typeof matchedEpisode.season === "number"
            ? `Season ${matchedEpisode.season}`
            : matchedEpisode.season
        : "Featured";
    const airDate = formatAirDate(matchedEpisode?.meta?.airDate);

    return (
        <section
            aria-label="Featured episodes"
            className="relative h-[62vh] min-h-[440px] max-h-[720px] overflow-hidden rounded-xl border border-border bg-black sm:rounded-2xl"
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.55 }}
                    className="absolute inset-0"
                >
                    <Image
                        src={currentItem.image_url || ""}
                        alt={currentItem.title || ""}
                        fill
                        sizes="100vw"
                        className={cn(
                            "object-cover object-center transition-opacity duration-1000",
                            isVideoLoaded && currentItem.video_url ? "opacity-0" : "opacity-100"
                        )}
                        priority
                    />
                    {currentItem.video_url && (
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            src={currentItem.video_url}
                            className={cn(
                                "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000",
                                isVideoLoaded ? "opacity-100" : "opacity-0"
                            )}
                            onLoadedData={() => setIsVideoLoaded(true)}
                            onCanPlay={() => setIsVideoLoaded(true)}
                        />
                    )}

                    {/* Scrims */}
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-[#0a0a0a]/55 to-transparent" />
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-[#0a0a0a]/85 via-[#0a0a0a]/25 to-transparent" />
                </motion.div>
            </AnimatePresence>

            {/* Top labels */}
            <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-3 p-4 sm:p-6">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-white/20 bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                        <Sparkles className="size-3 text-white/80" />
                        Featured
                    </span>
                    {matchedEpisode && (
                        <span className="rounded-md border border-white/15 bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/85">
                            {seasonLabel}
                        </span>
                    )}
                </div>
                <span className="hidden rounded-md border border-white/15 bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/75 sm:inline-flex">
                    {currentIndex + 1} / {spotlight.length}
                </span>
            </div>

            {/* Content */}
            <div className="absolute inset-x-0 bottom-0 z-10 p-5 pb-16 sm:p-7 sm:pb-16 lg:p-10 lg:pb-20">
                <div className="max-w-3xl">
                    <motion.div
                        key={`meta-${currentIndex}`}
                        initial={{ y: 14, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.08 }}
                        className="mb-4 flex flex-wrap items-center gap-2"
                    >
                        {matchedEpisode && (
                            <>
                                <span className="rounded-full border border-white/15 bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white/85">
                                    {typeof matchedEpisode.eps_no === "number"
                                        ? `Episode ${String(matchedEpisode.eps_no).padStart(2, "0")}`
                                        : String(matchedEpisode.eps_no)
                                              .replace(/-/g, " ")
                                              .toUpperCase()}
                                </span>
                                {matchedEpisode.duration && (
                                    <span className="rounded-full border border-white/15 bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white/85">
                                        {matchedEpisode.duration}
                                    </span>
                                )}
                                {matchedEpisode.meta && matchedEpisode.meta.rating > 0 && (
                                    <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white/85">
                                        <Star className="size-3 fill-white/80 text-white/80" />
                                        {matchedEpisode.meta.rating.toFixed(1)}
                                    </span>
                                )}
                                {airDate && (
                                    <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white/85">
                                        <CalendarDays className="size-3 text-white/80" />
                                        {airDate}
                                    </span>
                                )}
                            </>
                        )}
                    </motion.div>

                    <motion.h1
                        key={`title-${currentIndex}`}
                        initial={{ y: 18, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.14 }}
                        className="mb-3 line-clamp-2 text-balance text-2xl font-bold leading-[1.08] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl"
                    >
                        {currentItem.title}
                    </motion.h1>

                    <motion.p
                        key={`desc-${currentIndex}`}
                        initial={{ y: 18, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-6 line-clamp-2 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base"
                    >
                        {currentItem.description}
                    </motion.p>

                    <motion.div
                        key={`cta-${currentIndex}`}
                        initial={{ y: 18, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.26 }}
                        className="flex flex-wrap items-center gap-2.5"
                    >
                        <Link href={`/w/${currentItem.id}`}>
                            <Button
                                size="lg"
                                className="rounded-lg bg-white px-6 text-black hover:bg-white/90"
                            >
                                <Play className="fill-current" /> Watch now
                            </Button>
                        </Link>
                        <ReportDialog
                            context={`Spotlight: ${currentItem.title} (${currentItem.id})`}
                            trigger={
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    className="rounded-lg border border-white/20 bg-black/60 text-white hover:bg-black/80"
                                >
                                    <Flag /> Report
                                </Button>
                            }
                        />
                    </motion.div>
                </div>
            </div>

            {/* Controls */}
            <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-3 px-5 pb-4 sm:px-7 lg:px-10">
                <div className="flex items-center gap-1.5" aria-label="Featured slides">
                    {spotlight.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => goTo(index)}
                            aria-label={`Go to spotlight ${index + 1}`}
                            aria-pressed={index === currentIndex}
                            className={cn(
                                "h-1.5 rounded-full transition-all duration-300",
                                index === currentIndex
                                    ? "w-7 bg-white"
                                    : "w-2 bg-white/30 hover:bg-white/60"
                            )}
                        />
                    ))}
                </div>

                <div className="flex items-center gap-1.5">
                    <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={handlePrev}
                        aria-label="Previous spotlight"
                        className="rounded-lg border border-white/15 bg-black/60 text-white hover:bg-black/80 hover:text-white"
                    >
                        <ChevronLeft />
                    </Button>
                    <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={handleNext}
                        aria-label="Next spotlight"
                        className="rounded-lg border border-white/15 bg-black/60 text-white hover:bg-black/80 hover:text-white"
                    >
                        <ChevronRight />
                    </Button>
                </div>
            </div>
        </section>
    );
}
