"use client";

import { useRef, useEffect, useState } from "react";
import { PLANETS } from "@/data/planets";
import { cn } from "@/lib/utils";

interface ScrollProgressProps {
  progress: number;
  activePlanet: string | null;
}

export const ScrollProgress = ({ progress, activePlanet }: ScrollProgressProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="fixed right-6 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-center gap-1.5"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {PLANETS.map((planet, i) => {
        const isActive = activePlanet === planet.id;
        const segmentStart = (i / PLANETS.length);
        const isPast = progress > segmentStart;

        return (
          <div
            key={planet.id}
            className="flex items-center gap-2 group"
          >
            {/* Label (shown on hover or when active) */}
            {(hovered || isActive) && (
              <span
                className={cn(
                  "text-[9px] tracking-[1.5px] uppercase transition-all",
                  isActive ? "text-white/60" : "text-white/20"
                )}
              >
                {planet.name}
              </span>
            )}
            {/* Dot */}
            <div
              className={cn(
                "w-[3px] rounded-full transition-all duration-500",
                isActive
                  ? "h-6 bg-gold-500"
                  : isPast
                  ? "h-2 bg-white/30"
                  : "h-2 bg-white/8"
              )}
            />
          </div>
        );
      })}
    </div>
  );
};
