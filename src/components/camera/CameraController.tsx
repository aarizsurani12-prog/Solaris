"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import * as THREE from "three";
import {
  PLANETS,
  getOrbitAngle,
  getHoldStartWaypoint,
  SCROLL_BREAKPOINTS,
} from "@/data/planets";

interface CameraWaypoint {
  position: THREE.Vector3;
  target: THREE.Vector3;
}

const SMOOTHING = 0.04;
// Real-time beat (not scroll-distance) held at each planet's arrival before
// the camera is allowed to keep moving — gives scrolling past a planet a
// deliberate "we've arrived" pause instead of blowing straight through it.
const ARRIVAL_PAUSE = 0.5;
// Fraction of the camera-to-planet distance the look-at target shifts
// sideways, so the planet lands off-center on screen and the content panel
// has room on the opposite side. A fixed world-unit offset would work for
// one planet's viewing distance and wildly overshoot another's — this has
// to scale with distance to stay a consistent screen-space displacement.
const FRAMING_FRACTION = 0.45;

interface CameraControllerProps {
  onProgress?: (p: number) => void;
  onActivePlanet?: (id: string | null) => void;
}

const generateWaypoints = (): CameraWaypoint[] => {
  const wps: CameraWaypoint[] = [];

  // Hero shot: pulled back enough that the whole (compressed) system is
  // visible at once, still close enough to feel immersive.
  wps.push({ position: new THREE.Vector3(0, 26, 92), target: new THREE.Vector3(0, 0, 0) });
  wps.push({ position: new THREE.Vector3(0, 5, 32), target: new THREE.Vector3(0, 0, 0) });
  wps.push({ position: new THREE.Vector3(12, 3, 2), target: new THREE.Vector3(0, 0, 0) });

  PLANETS.forEach((planet, index) => {
    const angle = getOrbitAngle(index);
    const planetPos = new THREE.Vector3(
      Math.cos(angle) * planet.orbitRadius,
      0,
      Math.sin(angle) * planet.orbitRadius
    );

    // Close enough that the planet fills most of its half of the screen.
    // Purely proportional to radius (no flat offset) so small and large
    // planets fill the same amount of frame — a flat "+2.5" term used to
    // make Mercury look proportionally tiny next to Jupiter. Saturn's rings
    // extend well past its sphere, so its visual extent (and thus distance)
    // is measured to the outer ring instead of the planet body.
    const visualRadius = planet.id === "saturn" ? planet.radius * 2.6 : planet.radius;
    const dist = visualRadius * 1.7;

    // Position the camera to the SIDE of the planet (tangent to its orbit),
    // not further out along the same sun->planet line — a radial position
    // looks straight back at the sun every time (it's right behind the
    // planet from that angle). Two tangent directions are available (orbit
    // is a circle); build the full shot (including the left/right framing
    // offset below, which can itself swing the view back toward the sun for
    // about half the planets) for both and keep whichever ends up looking
    // furthest away from the sun.
    const sideSign = planet.side === "left" ? 1 : -1;
    const buildShot = (tangentDir: THREE.Vector3) => {
      const camPos = planetPos.clone().addScaledVector(tangentDir, dist).add(new THREE.Vector3(0, dist * 0.3, 0));
      const viewDistance = camPos.distanceTo(planetPos);
      const forward = new THREE.Vector3().subVectors(planetPos, camPos).normalize();
      const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
      const targetPoint = planetPos.clone().addScaledVector(right, sideSign * viewDistance * FRAMING_FRACTION);
      const toTarget = new THREE.Vector3().subVectors(targetPoint, camPos).normalize();
      const toSun = new THREE.Vector3().subVectors(new THREE.Vector3(0, 0, 0), camPos).normalize();
      return { camPos, targetPoint, sunAngleCos: toTarget.dot(toSun) };
    };

    const radialDir = planetPos.clone().normalize();
    const tangentBase = new THREE.Vector3(-radialDir.z, 0, radialDir.x);
    const shotA = buildShot(tangentBase);
    const shotB = buildShot(tangentBase.clone().negate());
    const { camPos: cameraPos, targetPoint: target } = shotA.sunAngleCos <= shotB.sunAngleCos ? shotA : shotB;

    // Pushed twice (holdStart, holdEnd) at the identical spot: lerping
    // between two equal points holds the camera still, so the planet stays
    // enlarged and steady — only spinning on its own axis — for the whole
    // scroll window its content is on screen, instead of just one instant.
    wps.push({ position: cameraPos.clone(), target: target.clone() });
    wps.push({ position: cameraPos.clone(), target: target.clone() });
  });

  wps.push({
    position: new THREE.Vector3(0, 32, 105),
    target: new THREE.Vector3(0, 0, 0),
  });

  return wps;
};

export const CameraController = ({ onProgress, onActivePlanet }: CameraControllerProps) => {
  const { camera } = useThree();
  const scroll = useScroll();

  const waypoints = useMemo(() => generateWaypoints(), []);
  const numSegments = waypoints.length - 1;
  const breakpoints = SCROLL_BREAKPOINTS;

  const smoothPos = useRef(waypoints[0].position.clone());
  const smoothTarget = useRef(waypoints[0].target.clone());
  const lastPlanetRef = useRef<string | null>(null);
  const lastProgressRef = useRef(0);
  const pausedAtIndexRef = useRef(-1);
  const pauseEndTimeRef = useRef<number | null>(null);
  const pausedProgressRef = useRef(0);

  useFrame(({ clock }) => {
    const rawProgress = scroll.range(0, 1 / 1);

    if (rawProgress <= 0) {
      smoothPos.current.copy(waypoints[0].position);
      smoothTarget.current.copy(waypoints[0].target);
      camera.position.copy(smoothPos.current);
      camera.lookAt(smoothTarget.current);
      return;
    }

    const now = clock.getElapsedTime();

    // Trigger a real-time pause the instant scroll reaches a new planet's
    // arrival point, so the camera holds there for a beat even if the user
    // keeps scrolling straight through it. Advances only one planet at a
    // time (not straight to whichever is furthest under the current scroll
    // position) so a dropped frame can never let the camera skip a planet's
    // pause entirely.
    const nextIndex = pausedAtIndexRef.current + 1;
    if (nextIndex < PLANETS.length && rawProgress >= breakpoints[getHoldStartWaypoint(nextIndex)]) {
      pausedAtIndexRef.current = nextIndex;
      pauseEndTimeRef.current = now + ARRIVAL_PAUSE;
      pausedProgressRef.current = breakpoints[getHoldStartWaypoint(nextIndex)];
    }

    let progress = rawProgress;
    if (pauseEndTimeRef.current !== null) {
      if (rawProgress < pausedProgressRef.current || now >= pauseEndTimeRef.current) {
        // User scrolled back past the pause point, or the beat elapsed.
        pauseEndTimeRef.current = null;
      } else {
        progress = pausedProgressRef.current;
      }
    }

    // Report progress
    if (onProgress && Math.abs(progress - lastProgressRef.current) > 0.01) {
      lastProgressRef.current = progress;
      onProgress(progress);
    }

    // Determine active planet — reads the same breakpoints (and the same
    // paused progress) the camera path uses, so the label can never point
    // at a planet the camera isn't actually holding on, and never shows
    // before the camera has truly arrived.
    let active: string | null = null;
    for (let i = 0; i < PLANETS.length; i++) {
      if (progress >= breakpoints[getHoldStartWaypoint(i)]) active = PLANETS[i].id;
    }
    if (active !== lastPlanetRef.current && onActivePlanet) {
      lastPlanetRef.current = active;
      onActivePlanet(active);
    }

    // Find current segment
    let segIdx = 0;
    for (let i = 0; i < numSegments; i++) {
      if (progress >= breakpoints[i] && progress < breakpoints[i + 1]) {
        segIdx = i;
        break;
      }
    }

    const start = waypoints[segIdx];
    const end = waypoints[Math.min(segIdx + 1, waypoints.length - 1)];
    const segStart = breakpoints[segIdx];
    const segEnd = breakpoints[segIdx + 1];
    const segProgress = segEnd > segStart
      ? (progress - segStart) / (segEnd - segStart)
      : 0;

    const t = segProgress * segProgress * (3 - 2 * segProgress);

    const targetPos = new THREE.Vector3().lerpVectors(start.position, end.position, t);
    const targetLook = new THREE.Vector3().lerpVectors(start.target, end.target, t);

    smoothPos.current.lerp(targetPos, SMOOTHING);
    smoothTarget.current.lerp(targetLook, SMOOTHING);

    camera.position.copy(smoothPos.current);
    camera.lookAt(smoothTarget.current);
  });

  return null;
};
