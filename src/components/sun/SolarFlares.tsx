"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const FLARE_COUNT = 12;

export const SolarFlares = () => {
  const groupRef = useRef<THREE.Group>(null);

  const flares = useMemo(() => {
    return Array.from({ length: FLARE_COUNT }, (_, i) => {
      const theta = (i / FLARE_COUNT) * Math.PI * 2;
      const phi = (Math.random() - 0.5) * 0.5;
      const length = 1.5 + Math.random() * 3;
      const speed = 0.3 + Math.random() * 0.7;
      const phase = Math.random() * Math.PI * 2;
      const delay = Math.random() * 5;
      return { theta, phi, length, speed, phase, delay };
    });
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    flares.forEach((flare, i) => {
      const child = groupRef.current!.children[i] as THREE.Mesh;
      if (!child) return;
      const pulse = Math.max(0, Math.sin(t * flare.speed + flare.phase) * 0.5 + 0.5);
      const scale = pulse * flare.length;
      child.scale.set(1, 1, Math.max(0.1, scale));
      child.position.set(
        Math.cos(flare.theta) * Math.cos(flare.phi) * (5 + scale * 0.5),
        Math.sin(flare.phi) * (5 + scale * 0.5),
        Math.sin(flare.theta) * Math.cos(flare.phi) * (5 + scale * 0.5)
      );
      (child.material as THREE.Material).opacity = pulse * 0.3;
    });
  });

  return (
    <group ref={groupRef}>
      {flares.map((flare, i) => (
        <mesh key={i}>
          <coneGeometry args={[0.15, 1, 6]} />
          <meshBasicMaterial
            color="#ff8833"
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
};
