"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Mesh, RepeatWrapping } from "three";
import type { PlanetData } from "@/data/planets";

export const Saturn = ({ data }: { data: PlanetData }) => {
  const meshRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);
  const [planetMap, ringMap] = useTexture([
    data.texture as string,
    "/textures/planets/8k_saturn_ring_alpha.png",
  ]);

  // The ring texture is a radial strip (varies across its width, not height) —
  // rotate 90° so it maps along the ring's radius instead of its circumference.
  useMemo(() => {
    ringMap.center.set(0.5, 0.5);
    ringMap.rotation = Math.PI / 2;
  }, [ringMap]);

  useEffect(() => {
    planetMap.wrapS = RepeatWrapping;
  }, [planetMap]);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) meshRef.current.rotation.y = t * data.rotationSpeed;
    if (ringRef.current) ringRef.current.rotation.y = t * data.rotationSpeed * 0.9;
    planetMap.offset.x += delta * 0.004;
  });

  return (
    <group>
      {/* Planet */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[data.radius, 64, 64]} />
        <meshStandardMaterial map={planetMap} roughness={1} metalness={0} />
      </mesh>

      {/* Rings */}
      <mesh ref={ringRef} rotation-x={-0.5}>
        <ringGeometry args={[data.radius * 1.3, data.radius * 2.6, 128]} />
        <meshBasicMaterial
          map={ringMap}
          alphaMap={ringMap}
          transparent
          opacity={0.9}
          side={2}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};
