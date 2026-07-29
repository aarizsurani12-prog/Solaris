"use client";

import { useState, useEffect } from "react";
import { PLANETS, type PlanetData } from "@/data/planets";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

interface NavigationProps {
  activePlanet: string | null;
  scrollProgress: number;
  onPlanetClick: (id: string) => void;
}

export const Navigation = ({ activePlanet, scrollProgress, onPlanetClick }: NavigationProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setVisible(current < lastScroll || current < 100);
      setLastScroll(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  // Close mobile nav on planet click
  const handleClick = (id: string) => {
    onPlanetClick(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full h-[2px] z-50">
        <div
          className="h-full bg-gradient-to-r from-gold-500 to-orange-500 transition-all duration-150"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Main nav bar */}
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-transform duration-300",
          visible ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/60 to-transparent">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-sm font-semibold tracking-[3px] uppercase text-white/60 hover:text-white/80 transition-colors"
          >
            Sola<span className="text-gold-500">ris</span>
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {PLANETS.map((planet) => (
              <button
                key={planet.id}
                onClick={() => handleClick(planet.id)}
                className={cn(
                  "px-2.5 py-1 text-[10px] tracking-[1.5px] uppercase rounded-full transition-all duration-300",
                  activePlanet === planet.id
                    ? "text-white/80 bg-white/8"
                    : "text-white/25 hover:text-white/50"
                )}
              >
                {planet.name}
              </button>
            ))}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white/40 hover:text-white/70 transition-colors"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/80 backdrop-blur-lg md:hidden">
          <div className="flex flex-col items-center justify-center h-full gap-4">
            {PLANETS.map((planet) => (
              <button
                key={planet.id}
                onClick={() => handleClick(planet.id)}
                className={cn(
                  "text-sm tracking-[2px] uppercase transition-all",
                  activePlanet === planet.id
                    ? "text-white/80"
                    : "text-white/30 hover:text-white/60"
                )}
              >
                {planet.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
