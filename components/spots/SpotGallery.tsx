"use client";

import Image from "next/image";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { RiPlayFill, RiImageLine } from "react-icons/ri";
import type { Spot } from "@/lib/types";
import { useState } from "react";

interface SpotGalleryProps {
  spot: Spot;
}

export function SpotGallery({ spot }: SpotGalleryProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const allMedia = [
    ...(spot.videoUrl ? [{ type: 'video', url: spot.videoUrl }] : []),
    ...spot.images.map(img => ({ type: 'image', url: img }))
  ];

  if (allMedia.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Vibe Check
        </h2>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-primary">
          <RiImageLine className="h-3.5 w-3.5" />
          <span>{allMedia.length} Visuals</span>
        </div>
      </div>

      <div className="relative rounded-3xl overflow-hidden aspect-[4/5] md:aspect-video bg-muted group shadow-2xl">
        <Splide
          options={{
            type: "loop",
            perPage: 1,
            arrows: true,
            pagination: true,
            gap: "0rem",
            speed: 400,
            breakpoints: {
              768: {
                 arrows: false,
              }
            }
          }}
          className="h-full"
        >
          {allMedia.map((media, index) => (
            <SplideSlide key={index} className="h-full">
              {media.type === 'video' ? (
                <div className="relative w-full h-full">
                  {!isPlaying ? (
                    <>
                      <Image
                        src={spot.images[0]} // Use first image as thumbnail
                        alt={spot.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <button 
                          onClick={() => setIsPlaying(true)}
                          className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition-transform hover:scale-110 active:scale-95"
                        >
                          <RiPlayFill className="h-8 w-8 ml-1" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <video 
                      src={media.url} 
                      className="w-full h-full object-cover" 
                      controls 
                      autoPlay
                      onEnded={() => setIsPlaying(false)}
                    />
                  )}
                  <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    Video
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    src={media.url}
                    alt={`${spot.name} - image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </SplideSlide>
          ))}
        </Splide>
      </div>

      <p className="text-xs text-center text-muted-foreground italic">
        Swipe to see more of {spot.name}
      </p>
    </div>
  );
}
