"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Mesh, RepeatWrapping } from "three";
import { PLANETS, getOrbitAngle, type PlanetData } from "@/data/planets";
import { Earth } from "./Earth";
import { Saturn } from "./Saturn";
import { Atmosphere } from "./Atmosphere";

interface PlanetProps {
  data: PlanetData;
}

const TexturedPlanet = ({ data }: { data: PlanetData }) => {
  const meshRef = useRef<Mesh>(null);
  const map = useTexture(data.texture as string);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = clock.getElapsedTime() * data.rotationSpeed;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[data.radius, 64, 64]} />
      <meshStandardMaterial map={map} roughness={0.85} metalness={0.05} />
    </mesh>
  );
};

// Gas/ice giants: the cloud bands drift at their own pace, independent of
// the body's rotation — real zonal winds move faster/slower than the planet
// itself, not locked to it like a photo glued to a ball.
const GasGiantPlanet = ({ data, driftSpeed }: { data: PlanetData; driftSpeed: number }) => {
  const meshRef = useRef<Mesh>(null);
  const map = useTexture(data.texture as string);

  useEffect(() => {
    map.wrapS = RepeatWrapping;
  }, [map]);

  useFrame(({ clock }, delta) => {
    if (meshRef.current) meshRef.current.rotation.y = clock.getElapsedTime() * data.rotationSpeed;
    map.offset.x += delta * driftSpeed;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[data.radius, 64, 64]} />
      <meshStandardMaterial map={map} roughness={1} metalness={0} />
    </mesh>
  );
};

// Rocky worlds get a bump map — real elevation (craters, canyons) that
// actually casts shadow under the sun, instead of a flat photo painted on a
// perfectly smooth sphere. Split out since useTexture's array form must stay
// stable per component instance (rules of hooks).
const BumpMappedPlanet = ({ data }: { data: PlanetData }) => {
  const meshRef = useRef<Mesh>(null);
  const [map, bumpMap] = useTexture([data.texture as string, data.bumpMap as string]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = clock.getElapsedTime() * data.rotationSpeed;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[data.radius, 64, 64]} />
      <meshStandardMaterial
        map={map}
        bumpMap={bumpMap}
        bumpScale={data.radius * 0.06}
        roughness={0.9}
        metalness={0.03}
      />
    </mesh>
  );
};

const FlatPlanet = ({ data }: { data: PlanetData }) => {
  const meshRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = clock.getElapsedTime() * data.rotationSpeed;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[data.radius, 64, 64]} />
      <meshStandardMaterial
        color={data.color}
        emissive={data.emissive ?? data.color}
        emissiveIntensity={0.05}
        roughness={0.85}
        metalness={0.05}
      />
    </mesh>
  );
};

// Gas/ice giants get their own cloud-drift speed and a tinted atmosphere —
// hand-picked per planet rather than added as more planets.ts data fields,
// since only these four planets need it.
const GAS_GIANT_CONFIG: Record<string, { driftSpeed: number; atmosphereColor: string }> = {
  jupiter: { driftSpeed: 0.006, atmosphereColor: "#d9b88a" },
  uranus: { driftSpeed: 0.0015, atmosphereColor: "#9fe8e0" },
  neptune: { driftSpeed: 0.003, atmosphereColor: "#5f8fd9" },
};

// Thin/no-atmosphere worlds (Mercury, Pluto) get nothing; Mars gets a
// whisper-thin dusty haze (it really does have a very thin CO2 atmosphere);
// Venus's thick toxic cloud layer gets real presence.
const ATMOSPHERE_CONFIG: Record<string, { color: string; intensity: number; power: number }> = {
  venus: { color: "#e8c88a", intensity: 1.6, power: 2.5 },
  mars: { color: "#d9a878", intensity: 0.35, power: 3.5 },
  saturn: { color: "#e8d9a8", intensity: 0.8, power: 3 },
};

const BasePlanet = ({ data }: { data: PlanetData }) => {
  const gasGiant = GAS_GIANT_CONFIG[data.id];
  if (gasGiant) return <GasGiantPlanet data={data} driftSpeed={gasGiant.driftSpeed} />;
  if (data.texture && data.bumpMap) return <BumpMappedPlanet data={data} />;
  if (data.texture) return <TexturedPlanet data={data} />;
  return <FlatPlanet data={data} />;
};

export const Planet = ({ data }: PlanetProps) => {
  const index = PLANETS.findIndex((p) => p.id === data.id);
  const angle = getOrbitAngle(index);
  const position: [number, number, number] = [
    Math.cos(angle) * data.orbitRadius,
    0,
    Math.sin(angle) * data.orbitRadius,
  ];

  const gasGiant = GAS_GIANT_CONFIG[data.id];
  const atmosphere = ATMOSPHERE_CONFIG[data.id];

  // Render special planets
  if (data.id === "earth") {
    return (
      <group position={position}>
        <Earth data={data} />
      </group>
    );
  }

  if (data.id === "saturn") {
    return (
      <group position={position}>
        <Saturn data={data} />
        <Atmosphere radius={data.radius * 1.08} {...ATMOSPHERE_CONFIG.saturn} />
      </group>
    );
  }

  return (
    <group position={position}>
      {gasGiant && <Atmosphere radius={data.radius * 1.06} color={gasGiant.atmosphereColor} intensity={0.9} power={2.8} />}
      {atmosphere && !gasGiant && <Atmosphere radius={data.radius * 1.1} {...atmosphere} />}
      <BasePlanet data={data} />
    </group>
  );
};
