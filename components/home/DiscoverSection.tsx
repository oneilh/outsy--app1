"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { RiSunLine, RiCloudyLine, RiMoonLine, RiMapPinLine, RiArrowRightSLine, RiArrowLeftSLine } from "react-icons/ri";
import type { Spot } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DiscoverSectionProps {
  morning: Spot[];
  afternoon: Spot[];
  night: Spot[];
}

type TimeOfDay = "morning" | "afternoon" | "night";

const TABS: { id: TimeOfDay; label: string; icon: any }[] = [
  { id: "morning", label: "Morning", icon: RiSunLine },
  { id: "afternoon", label: "Afternoon", icon: RiCloudyLine },
  { id: "night", label: "Night", icon: RiMoonLine },
];

export function DiscoverSection({ morning, afternoon, night }: DiscoverSectionProps) {
  const [activeTab, setActiveTab] = useState<TimeOfDay>("morning");
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const spots = activeTab === "morning" ? morning : activeTab === "afternoon" ? afternoon : night;
  const currentSpot = spots[activeStoryIndex] || spots[0];

  // Auto-advance logic (like stories)
  useEffect(() => {
    if (isPaused) return;

    const timer = setTimeout(() => {
      handleNext();
    }, 5000); // 5 seconds per story

    return () => clearTimeout(timer);
  }, [activeStoryIndex, activeTab, isPaused]);

  const handleNext = () => {
    if (activeStoryIndex < spots.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
    } else {
      // Loop or go to next tab? Let's loop for now within the tab
      setActiveStoryIndex(0);
    }
  };

  const handlePrev = () => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
    } else {
      setActiveStoryIndex(spots.length - 1);
    }
  };

  const handleTabChange = (tabId: TimeOfDay) => {
    setActiveTab(tabId);
    setActiveStoryIndex(0);
  };

  // Touch handlers for swiping between tabs
  const touchStartX = useRef<number | null>(null);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) { // Threshold for swipe
      if (diff > 0) {
        // Swipe left -> Next tab
        const currentIndex = TABS.findIndex(t => t.id === activeTab);
        if (currentIndex < TABS.length - 1) {
          handleTabChange(TABS[currentIndex + 1].id);
        }
      } else {
        // Swipe right -> Prev tab
        const currentIndex = TABS.findIndex(t => t.id === activeTab);
        if (currentIndex > 0) {
          handleTabChange(TABS[currentIndex - 1].id);
        }
      }
    }
    touchStartX.current = null;
  };

  return (
    <section 
      className="flex flex-col gap-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Discover</h2>
        <div className="flex bg-muted/50 p-1 rounded-xl">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  isActive 
                    ? "bg-white text-primary shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("h-3.5 w-3.5", isActive ? "text-primary" : "text-muted-foreground")} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Story Card */}
      <div 
        className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden shadow-2xl group cursor-pointer select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Background Image */}
        <Image
          src={currentSpot.images[0]}
          alt={currentSpot.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60" />

        {/* Progress Bars */}
        <div className="absolute top-4 left-4 right-4 flex gap-1.5 z-20">
          {spots.map((_, idx) => (
            <div 
              key={idx} 
              className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden"
            >
              <div 
                className={cn(
                  "h-full bg-white transition-all duration-300",
                  idx < activeStoryIndex ? "w-full" : idx === activeStoryIndex ? "animate-progress" : "w-0"
                )}
                style={{ 
                  animationDuration: '5000ms',
                  animationPlayState: isPaused ? 'paused' : 'running'
                }}
              />
            </div>
          ))}
        </div>

        {/* Navigation Areas */}
        <div className="absolute inset-0 flex z-10">
          <div 
            className="w-1/3 h-full" 
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          />
          <div 
            className="w-2/3 h-full" 
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
          />
        </div>

        {/* Content */}
        <Link 
          href={`/spots/${currentSpot.slug}`}
          className="absolute bottom-6 left-6 right-6 z-20 flex flex-col gap-3"
        >
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/90">
              {activeTab} recommendations
            </span>
            <h3 className="text-2xl font-black text-white leading-tight drop-shadow-md">
              {currentSpot.name}
            </h3>
            <p className="text-sm text-white/80 line-clamp-2 mt-1 leading-relaxed">
              {currentSpot.description}
            </p>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                <RiMapPinLine className="h-3 w-3 text-white" />
                <span className="text-[10px] font-bold text-white uppercase">{currentSpot.area}</span>
              </div>
              <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                <span className="text-[10px] font-bold text-white uppercase">{currentSpot.priceRange.split(' ')[0]}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-primary font-bold text-xs bg-white px-4 py-2 rounded-full shadow-lg hover:bg-primary hover:text-white transition-all active:scale-95">
              Check it out
              <RiArrowRightSLine className="h-4 w-4" />
            </div>
          </div>
        </Link>

        {/* Floating arrows (visible only on hover on desktop) */}
        <div className="absolute top-1/2 left-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-20 hidden md:block">
           <button onClick={(e) => { e.preventDefault(); handlePrev(); }} className="p-2 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20">
              <RiArrowLeftSLine className="h-6 w-6" />
           </button>
        </div>
        <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-20 hidden md:block">
           <button onClick={(e) => { e.preventDefault(); handleNext(); }} className="p-2 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20">
              <RiArrowRightSLine className="h-6 w-6" />
           </button>
        </div>
      </div>
      
      <p className="text-[10px] text-muted-foreground text-center font-medium italic mt-1">
        Tap the sides to browse, swipe to change time of day
      </p>
    </section>
  );
}

