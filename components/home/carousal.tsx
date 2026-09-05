"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Info,
    Play,
    ChevronLeft,
    ChevronRight,
    MonitorPlay,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { spotlite } from "@/lib/data";
import { ReportDialog } from "@/components/report-dialog";

export default function HomeCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === spotlite.length - 1 ? 0 : prevIndex + 1
            );
        }, 100000);
        return () => clearInterval(timer);
    }, [currentIndex]);

    // Reset video loaded state when index changes
    useEffect(() => {
        setIsVideoLoaded(false);
    }, [currentIndex]);

    if (!spotlite || spotlite.length === 0) {
        return <div>No featured content available.</div>;
    }

    const currentItem = spotlite[currentIndex];

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? spotlite.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === spotlite.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <div className="mx-1 lg:mx-0">
            <section className="relative h-[50vh] md:h-[70vh] rounded-lg overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0"
                    >
                        <div className="absolute inset-0 bg-black">
                            <Image
                                src={currentItem.image_url || ""}
                                alt={currentItem.title || ""}
                                fill
                                className={`object-cover transition-opacity duration-1000 ${isVideoLoaded && currentItem.video_url ? "opacity-0" : "opacity-100"}`}
                                priority
                            />
                            {currentItem.video_url && (
                                <video
                                    ref={(el) => {
                                        if (el) {
                                            el.defaultMuted = true;
                                            el.muted = true;
                                            el.playsInline = true;
                                            if (el.readyState >= 3) {
                                                setIsVideoLoaded(true);
                                                el.play().catch(() => console.log("Autoplay blocked"));
                                            }
                                        }
                                    }}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    src={currentItem.video_url}
                                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isVideoLoaded ? "opacity-100" : "opacity-0"}`}
                                    onLoadedData={(e) => {
                                        setIsVideoLoaded(true);
                                        e.currentTarget.play().catch(() => console.log("Autoplay blocked"));
                                    }}
                                    onCanPlay={(e) => {
                                        setIsVideoLoaded(true);
                                        e.currentTarget.play().catch(() => console.log("Autoplay blocked"));
                                    }}
                                />
                            )}
                        </div>
                        <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8 bg-gradient-to-t from-black/90 via-black/20 to-transparent">
                            {/* Spotlight Stats */}
                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="self-end flex items-center gap-3 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white"
                            >
                                <div className="flex items-center gap-1.5">
                                    <MonitorPlay className="h-4 w-4" />
                                    <span>Featured Content</span>
                                </div>
                            </motion.div>

                            {/* Title and Description */}
                            <div>
                                <motion.h1
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold mb-2 text-white leading-tight max-w-3xl line-clamp-2 md:line-clamp-3"
                                >
                                    {currentItem.title}
                                </motion.h1>
                                <motion.p
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-xs sm:text-sm md:text-base mb-4 max-w-2xl line-clamp-2 text-gray-200"
                                >
                                    {currentItem.description}
                                </motion.p>
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="flex space-x-3 sm:space-x-4"
                                >
                                    <Link href={`/w/${currentItem.id}`}>
                                        <Button size="sm" className="px-6">
                                            <Play className="mr-2 h-4 w-4" /> Watch Now
                                        </Button>
                                    </Link>
                                    <ReportDialog
                                        context={`Spotlight: ${currentItem.title} (${currentItem.id})`}
                                        trigger={
                                            <Button size="sm" variant="outline" className="border-border bg-background/90 px-6 text-foreground hover:bg-background">
                                                <Info className="mr-2 h-4 w-4" /> Report
                                            </Button>
                                        }
                                    />
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="absolute bottom-8 right-8 space-x-3 hidden md:flex">
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={handlePrev}
                        className="h-8 w-8 bg-black/60 text-white backdrop-blur-sm border-white/20 hover:bg-white/20 z-10"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={handleNext}
                        className="h-8 w-8 bg-black/60 text-white backdrop-blur-sm border-white/20 hover:bg-white/20 z-10"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </section>
        </div>
    );
}