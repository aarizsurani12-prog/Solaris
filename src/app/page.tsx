"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";

import { HeroOverlay } from "@/components/ui/HeroOverlay";
import { Navigation } from "@/components/ui/Navigation";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { InfoPanel } from "@/components/ui/InfoPanel";
import { PLANETS, FINAL_PULLBACK_START, type PlanetData } from "@/data/planets";

const LazyScene = dynamic(
  () => import("@/components/three/LazyScene").then((m) => ({ default: m.LazyScene })),
  { ssr: false }
);

const SolarSystem = dynamic(
  () => import("@/components/SolarSystem").then((m) => ({ default: m.SolarSystem })),
  { ssr: false }
);

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activePlanetId, setActivePlanetId] = useState<string | null>(null);

  const activePlanet: PlanetData | null = activePlanetId
    ? PLANETS.find((p) => p.id === activePlanetId) ?? null
    : null;

  const isNearEnd = scrollProgress > FINAL_PULLBACK_START;

  const handlePlanetClick = useCallback((id: string) => {
    const idx = PLANETS.findIndex((p) => p.id === id);
    if (idx >= 0) {
      const scrollTarget = (idx / PLANETS.length) * window.innerHeight * 4;
      window.scrollTo({ top: scrollTarget, behavior: "smooth" });
    }
  }, []);

  return (
    <main className="relative min-h-screen bg-cosmic-900">
      {/* Navigation */}
      <Navigation
        activePlanet={activePlanetId}
        scrollProgress={scrollProgress}
        onPlanetClick={handlePlanetClick}
      />

      {/* Hero overlay */}
      <HeroOverlay progress={scrollProgress} />

      {/* Scroll progress indicator */}
      <ScrollProgress progress={scrollProgress} activePlanet={activePlanetId} />

      {/* 3D Scene — fills viewport behind everything */}
      <div className="fixed inset-0 z-0">
        <Suspense fallback={null}>
          <LazyScene>
            <SolarSystem
              onProgress={setScrollProgress}
              onActivePlanet={setActivePlanetId}
            />
          </LazyScene>
        </Suspense>
      </div>

      {/* Info panel for current planet */}
      {activePlanet && !isNearEnd && (
        <InfoPanel
          key={activePlanet.id}
          planet={activePlanet}
          visible={true}
        />
      )}

      {/* Footer — shown when near end of journey */}
      {isNearEnd && (
        <footer className="fixed bottom-0 left-0 right-0 z-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="bg-cosmic-900/80 backdrop-blur-md border-t border-white/[0.03]">
            <div className="max-w-6xl mx-auto px-6 py-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-6">
                <div>
                  <h4 className="text-xs font-semibold tracking-[2px] uppercase text-white/30 mb-4">
                    Solaris
                  </h4>
                  <p className="text-xs text-white/15 leading-relaxed">
                    A cinematic interactive journey through our Solar System.
                    Built with Next.js, Three.js, and React Three Fiber.
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold tracking-[2px] uppercase text-white/30 mb-4">
                    Planets
                  </h4>
                  <div className="flex flex-col gap-1.5">
                    {PLANETS.slice(0, 5).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handlePlanetClick(p.id)}
                        className="text-xs text-white/15 hover:text-white/40 transition-colors text-left"
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold tracking-[2px] uppercase text-white/30 mb-4">
                    Outer Planets
                  </h4>
                  <div className="flex flex-col gap-1.5">
                    {PLANETS.slice(5).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handlePlanetClick(p.id)}
                        className="text-xs text-white/15 hover:text-white/40 transition-colors text-left"
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold tracking-[2px] uppercase text-white/30 mb-4">
                    Data
                  </h4>
                  <p className="text-xs text-white/15 leading-relaxed">
                    Planetary data sourced from NASA &amp; JPL.
                  </p>
                </div>
              </div>
              <div className="pt-6 border-t border-white/[0.03] flex flex-col md:flex-row justify-between gap-2 text-xs text-white/10">
                <span>&copy; {new Date().getFullYear()} Solaris. All rights reserved.</span>
                <span>Data sourced from NASA &amp; JPL</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </main>
  );
}
