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

interface StarsProps {
  count?: number;
  radius?: number;
  twinkleSpeed?: number;
}

export const Stars = ({ count = 15000, radius = 250, twinkleSpeed = 0.5 }: StarsProps) => {
  const pointsRef = useRef<THREE.Points>(null);
  const sizeRef = useRef<number[]>([]);
  const dotTexture = useMemo(() => makeDotTexture(), []);

  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.3 + Math.random() * 0.7);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const brightness = 0.3 + Math.random() * 0.7;
      const tint = Math.random();
      if (tint < 0.1) {
        // Blue stars
        col[i * 3] = brightness * 0.7;
        col[i * 3 + 1] = brightness * 0.8;
        col[i * 3 + 2] = brightness;
      } else if (tint < 0.2) {
        // Red stars
        col[i * 3] = brightness;
        col[i * 3 + 1] = brightness * 0.4;
        col[i * 3 + 2] = brightness * 0.3;
      } else {
        // White/yellow stars
        col[i * 3] = brightness;
        col[i * 3 + 1] = brightness * (0.85 + Math.random() * 0.15);
        col[i * 3 + 2] = brightness * (0.7 + Math.random() * 0.3);
      }

      siz[i] = 0.5 + Math.random() * 2.0;
    }

    return { positions: pos, colors: col, sizes: siz };
  }, [count, radius]);

  // Store sizes for animation
  sizeRef.current = Array.from(sizes);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    g.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    return g;
  }, [positions, colors, sizes]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const sizeAttr = pointsRef.current.geometry.attributes.size;
    if (!sizeAttr) return;
    const array = sizeAttr.array as Float32Array;
    const t = clock.getElapsedTime() * twinkleSpeed;
    for (let i = 0; i < array.length; i++) {
      array[i] = sizeRef.current[i] * (0.5 + 0.5 * Math.sin(t + i * 0.01));
    }
    sizeAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geo}>
      <pointsMaterial
        size={0.15}
        map={dotTexture}
        alphaMap={dotTexture}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        fog={false}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
