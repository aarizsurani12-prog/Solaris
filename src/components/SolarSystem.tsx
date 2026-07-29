"use client";

import { ScrollControls } from "@react-three/drei";

import { Stars } from "./space/Stars";
import { AsteroidBelt } from "./space/AsteroidBelt";
import { ShootingStars } from "./space/ShootingStars";
import { Sun } from "./sun/Sun";
import { SolarFlares } from "./sun/SolarFlares";
import { Planet } from "./planets/Planet";
import { CameraController } from "./camera/CameraController";
import { PLANETS } from "@/data/planets";

export const SolarSystem = ({
  onProgress,
  onActivePlanet,
}: {
  onProgress: (p: number) => void;
  onActivePlanet: (id: string | null) => void;
}) => {
  return (
    <ScrollControls
      pages={2.5}
      damping={0.2}
      maxSpeed={1}
    >
      {/* Camera driven by scroll */}
      <CameraController onProgress={onProgress} onActivePlanet={onActivePlanet} />

      {/* Space environment. A second parallax star layer and a nebula
          accent were tried but pushed sustained per-frame GPU load too high
          for stability on this hardware (repeated crashes under sustained
          play) — traded for one solid, denser star layer instead. Stability
          wins over an extra decorative layer. */}
      <Stars count={20000} radius={250} twinkleSpeed={0.5} />
      <AsteroidBelt />
      <ShootingStars />

      {/* Sun */}
      <Sun />
      <SolarFlares />

      {/* All planets */}
      {PLANETS.map((planet) => (
        <Planet key={planet.id} data={planet} />
      ))}

      {/* Minimal fill light — the Sun's own pointLight is the real key light */}
      <ambientLight intensity={0.1} />
    </ScrollControls>
  );
};
