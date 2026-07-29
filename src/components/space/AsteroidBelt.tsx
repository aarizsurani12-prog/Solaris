"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const makeDotTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 32;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);
  return new THREE.CanvasTexture(canvas);
};

export const AsteroidBelt = () => {
  const groupRef = useRef<THREE.Group>(null);
  const count = 4000;
  const dotTexture = useMemo(() => makeDotTexture(), []);

  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const siz = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 27.5 + Math.random() * 3;
      const height = (Math.random() - 0.5) * 1.5;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = height;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
      siz[i] = 0.05 + Math.random() * 0.2;
    }

    return { positions: pos, sizes: siz };
  }, []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    return g;
  }, [positions, sizes]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      <points geometry={geo}>
        <pointsMaterial
          size={0.1}
          map={dotTexture}
          alphaMap={dotTexture}
          color="#888888"
          transparent
          opacity={0.6}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
};
