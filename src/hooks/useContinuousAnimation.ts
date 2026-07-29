"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useCallback } from "react";
import * as THREE from "three";

interface ContinuousAnimatable {
  rotation?: THREE.Euler | { x?: number; y?: number; z?: number };
  position?: THREE.Vector3 | { x?: number; y?: number; z?: number };
  userData?: Record<string, unknown>;
}

/**
 * Hook for continuous/idle animations that run regardless of scroll.
 * Use this for planet rotation, moon orbits, sun plasma, particles, etc.
 */
export const useContinuousAnimation = (
  ref: React.RefObject<ContinuousAnimatable | null>,
  config: {
    rotateY?: number;     // radians per second
    rotateX?: number;
    rotateZ?: number;
    bob?: number;         // bob amplitude
    bobSpeed?: number;
    pulse?: number;       // scale pulse amplitude
    pulseSpeed?: number;
  }
) => {
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    const obj = ref.current;
    if (!obj) return;

    // Rotation
    const rotation = obj.rotation;
    if (rotation) {
      if (config.rotateY) {
        rotation.y = (rotation.y ?? 0) + config.rotateY * delta;
      }
      if (config.rotateX) {
        rotation.x = (rotation.x ?? 0) + config.rotateX * delta;
      }
      if (config.rotateZ) {
        rotation.z = (rotation.z ?? 0) + config.rotateZ * delta;
      }
    }

    // Bobbing
    if (config.bob && obj.position) {
      (obj.position as THREE.Vector3).y =
        Math.sin(timeRef.current * (config.bobSpeed ?? 0.5)) * (config.bob ?? 0);
    }

    // Pulse
    if (config.pulse && config.pulseSpeed) {
      const scale =
        1 + Math.sin(timeRef.current * config.pulseSpeed) * config.pulse;
      (obj as unknown as { scale: THREE.Vector3 }).scale.setScalar(scale);
    }
  });
};

/** Helper for orbital motion around a parent */
export const useOrbitAnimation = (
  ref: React.RefObject<THREE.Object3D | null>,
  config: {
    speed: number;   // radians per second
    radius: number;
    parentCenter?: THREE.Vector3;
  }
) => {
  const angleRef = useRef(0);

  useFrame((_, delta) => {
    angleRef.current += config.speed * delta;
    const obj = ref.current;
    if (!obj) return;

    obj.position.x = Math.cos(angleRef.current) * config.radius;
    obj.position.z = Math.sin(angleRef.current) * config.radius;
  });
};
