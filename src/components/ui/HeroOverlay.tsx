"use client";

import { cn } from "@/lib/utils";

export const HeroOverlay = ({ progress = 0 }: { progress?: number }) => {
  const faded = progress > 0.05;

  return (
    <div
      className={cn(
        "fixed inset-0 z-10 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-1000",
        faded ? "opacity-0" : "opacity-100"
      )}
    >
      <h1 className="text-[clamp(48px,10vw,120px)] font-extralight tracking-[0.15em] uppercase text-gradient-gold">
        Solaris
      </h1>
      <p className="text-sm md:text-base tracking-[0.15em] uppercase text-white/25 mt-4 font-light">
        A Journey Through the Solar System
      </p>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 flex flex-col items-center gap-3">
        <span className="text-[10px] tracking-[0.2em] uppercase text-white/20">
          Scroll to explore
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
      </div>
    </div>
  );
};
