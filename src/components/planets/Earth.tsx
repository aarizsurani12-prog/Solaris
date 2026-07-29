"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Mesh } from "three";
import type { PlanetData } from "@/data/planets";
import { Atmosphere } from "./Atmosphere";

export const Earth = ({ data }: { data: PlanetData }) => {
  const meshRef = useRef<Mesh>(null);
  const cloudRef = useRef<Mesh>(null);
  const [dayMap, cloudsMap, bumpMap, specularMap, nightMap] = useTexture([
    data.texture as string,
    "/textures/planets/8k_earth_clouds.jpg",
    data.bumpMap as string,
    "/textures/planets/earth-specular.jpg",
    "/textures/planets/8k_earth_nightmap.jpg",
  ]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (meshRef.current) {
      meshRef.current.rotation.y = t * data.rotationSpeed;
    }
    if (cloudRef.current) {
      // Independent of the surface's own rotation — a real cloud layer
      // drifts at its own pace, not locked to the ground beneath it.
      cloudRef.current.rotation.y = t * data.rotationSpeed * 1.35;
    }
  });

  return (
    <group>
      {/* Planet surface — bump map gives real coastline/mountain relief,
          specular map gives oceans a subtle shine land doesn't have, and
          the night map only reads on the unlit hemisphere (its emissive
          glow is negligible next to full daylight, city-light-bright once
          the surface itself goes dark) */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[data.radius, 64, 64]} />
        <meshStandardMaterial
          map={dayMap}
          bumpMap={bumpMap}
          bumpScale={data.radius * 0.04}
          metalnessMap={specularMap}
          roughness={0.75}
          metalness={0.4}
          emissiveMap={nightMap}
          emissive="#ffe9b3"
          emissiveIntensity={1.4}
        />
      </mesh>

      {/* Cloud layer */}
      <mesh ref={cloudRef}>
        <sphereGeometry args={[data.radius * 1.015, 48, 48]} />
        <meshStandardMaterial
          map={cloudsMap}
          alphaMap={cloudsMap}
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </mesh>

      <Atmosphere radius={data.radius * 1.1} color="#5fa8ff" intensity={1.4} power={2.2} />
      <Atmosphere radius={data.radius * 1.03} color="#bfe0ff" intensity={0.6} power={4} />
    </group>
  );
};
