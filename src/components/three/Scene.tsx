"use client";

import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { Suspense, type ReactNode } from "react";
import * as THREE from "three";

interface SceneProps {
  children: ReactNode;
  camera?: { position: [number, number, number]; fov?: number };
  dpr?: [number, number];
  gl?: Record<string, unknown>;
}

export const Scene = ({
  children,
  camera = { position: [0, 0, 20], fov: 60 },
  dpr = [1, 2],
  gl = {
    antialias: true,
    // Was previously the string "ACESFilmic", which three.js silently
    // rejects (it needs the numeric THREE.ACESFilmicToneMapping constant) —
    // tone mapping was never actually applying, flattening contrast/color.
    toneMapping: THREE.ACESFilmicToneMapping,
    toneMappingExposure: 1.1,
  },
}: SceneProps) => {
  return (
    <Canvas
      camera={{ position: camera.position, fov: camera.fov ?? 60, near: 0.1, far: 1000 }}
      dpr={dpr}
      gl={gl}
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh" }}
    >
      <AdaptiveDpr />
      <AdaptiveEvents />
      <color attach="background" args={["#050508"]} />
      <fog attach="fog" args={["#050508", 80, 300]} />
      <Suspense fallback={null}>
        {children}
        <EffectComposer>
          <Bloom
            intensity={0.6}
            luminanceThreshold={0.5}
            luminanceSmoothing={0.3}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.15} darkness={0.6} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
};
