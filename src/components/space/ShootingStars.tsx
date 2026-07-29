"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 6;
const SPAWN_RADIUS = 140;
const TRAIL_LENGTH = 6;

interface Streak {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
}

const respawn = (streak: Streak) => {
  // Start somewhere on a big shell around the scene, aimed roughly inward
  // so it crosses through view rather than skimming the edge.
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  streak.position.set(
    SPAWN_RADIUS * Math.sin(phi) * Math.cos(theta),
    SPAWN_RADIUS * Math.cos(phi) * 0.6,
    SPAWN_RADIUS * Math.sin(phi) * Math.sin(theta)
  );
  const aimSpread = 40;
  const target = new THREE.Vector3(
    (Math.random() - 0.5) * aimSpread,
    (Math.random() - 0.5) * aimSpread * 0.4,
    (Math.random() - 0.5) * aimSpread
  );
  streak.velocity.subVectors(target, streak.position).normalize().multiplyScalar(60 + Math.random() * 50);
  streak.life = 0;
};

export const ShootingStars = () => {
  const groupRef = useRef<THREE.Group>(null);

  const streaks = useMemo<Streak[]>(() => {
    const arr = Array.from({ length: COUNT }, () => ({
      position: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      life: 0,
    }));
    arr.forEach((s, i) => {
      respawn(s);
      s.life = -Math.random() * 6 - i; // stagger first appearance
    });
    return arr;
  }, []);

  const geometries = useMemo(
    () =>
      streaks.map(() => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(TRAIL_LENGTH * 3), 3));
        // Fade the trail from bright (head) to black (tail) — LineBasicMaterial
        // has no per-vertex alpha, but a black tail under additive blending
        // contributes ~nothing, which reads as a fade to transparent.
        const colors = new Float32Array(TRAIL_LENGTH * 3);
        for (let t = 0; t < TRAIL_LENGTH; t++) {
          const brightness = 1 - t / (TRAIL_LENGTH - 1);
          colors[t * 3] = brightness;
          colors[t * 3 + 1] = brightness;
          colors[t * 3 + 2] = brightness;
        }
        geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        return geo;
      }),
    [streaks]
  );

  // <line> collides with the SVG intrinsic element in this project's JSX
  // types, so the THREE.Line objects are built directly and mounted via
  // <primitive> instead of the JSX tag.
  const lines = useMemo(
    () =>
      geometries.map(
        (geo) =>
          new THREE.Line(
            geo,
            new THREE.LineBasicMaterial({
              color: "#cfe8ff",
              vertexColors: true,
              transparent: true,
              opacity: 0.9,
              fog: false,
              blending: THREE.AdditiveBlending,
              depthWrite: false,
            })
          )
      ),
    [geometries]
  );

  useFrame((_, delta) => {
    streaks.forEach((s, i) => {
      s.life += delta;
      if (s.life < 0) return; // still waiting to spawn

      s.position.addScaledVector(s.velocity, delta);
      if (s.life > 2.5 || s.position.length() > SPAWN_RADIUS * 1.3) {
        respawn(s);
        s.life = Math.random() * 4; // gap before it reappears
        return;
      }

      const dir = s.velocity.clone().normalize();
      const posAttr = geometries[i].attributes.position as THREE.BufferAttribute;
      for (let t = 0; t < TRAIL_LENGTH; t++) {
        const p = s.position.clone().addScaledVector(dir, -t * 0.9);
        posAttr.setXYZ(t, p.x, p.y, p.z);
      }
      posAttr.needsUpdate = true;
    });
  });

  return (
    <group ref={groupRef}>
      {lines.map((line, i) => (
        <primitive key={i} object={line} />
      ))}
    </group>
  );
};
