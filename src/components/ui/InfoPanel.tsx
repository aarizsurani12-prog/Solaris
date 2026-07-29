"use client";

import type { PlanetData } from "@/data/planets";
import { cn } from "@/lib/utils";

interface InfoPanelProps {
  planet: PlanetData;
  visible: boolean;
}

export const InfoPanel = ({ planet, visible }: InfoPanelProps) => {
  // Content sits on the side opposite the one the planet frames on.
  const contentSide = planet.side === "left" ? "right" : "left";

  return (
    <div
      className={cn(
        "fixed inset-y-0 z-20 flex items-center transition-all duration-700 ease-out",
        // Extra right padding on the right-docked side clears the fixed
        // ScrollProgress rail (fixed right-6) so the two never overlap.
        contentSide === "left" ? "left-0 pl-6 md:pl-16" : "right-0 pr-14 md:pr-24",
        visible
          ? "translate-x-0 opacity-100"
          : cn(contentSide === "left" ? "-translate-x-4" : "translate-x-4", "opacity-0 pointer-events-none")
      )}
    >
      <div className="w-full max-w-md">
        <div
          className="glass-dark rounded-2xl p-6 md:p-8"
          style={{
            borderColor: `${planet.color}22`,
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2
                className="text-3xl md:text-4xl font-light tracking-[4px] uppercase"
                style={{ color: planet.color }}
              >
                {planet.name}
              </h2>
              <p className="text-xs tracking-[2px] uppercase text-white/25 mt-1">
                {planet.subtitle}
              </p>
            </div>
          </div>

          <p className="text-sm md:text-base text-white/40 leading-relaxed mb-6">
            {planet.description}
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            {planet.stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white/[0.02] rounded-xl p-3 border border-white/[0.03]"
              >
                <p className="text-[9px] tracking-[1.5px] uppercase text-white/20 mb-1">
                  {stat.label}
                </p>
                <p className="text-sm font-medium text-white/60">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
