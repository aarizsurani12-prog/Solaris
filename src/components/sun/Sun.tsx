"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, useTexture } from "@react-three/drei";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);

    vec3 pos = position;
    float displacement = sin(pos.x * 8.0 + uTime * 0.8) * 0.02
                      + sin(pos.y * 12.0 + uTime * 1.2) * 0.015
                      + sin(pos.z * 6.0 + uTime * 0.6) * 0.02;
    pos += normal * displacement;

    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vPosition = worldPos.xyz;

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;

  void main() {
    float noise = sin(vPosition.x * 10.0 + uTime * 1.5)
                * cos(vPosition.y * 12.0 + uTime * 1.0)
                * sin(vPosition.z * 8.0 + uTime * 0.8);
    noise = noise * 0.5 + 0.5;

    vec3 color1 = vec3(1.0, 0.6, 0.0);
    vec3 color2 = vec3(1.0, 0.3, 0.05);
    vec3 color3 = vec3(0.8, 0.1, 0.0);

    vec3 color = mix(color1, color2, noise);

    float stripes = sin(vPosition.x * 15.0 + vPosition.y * 20.0 + uTime * 2.0) * 0.5 + 0.5;
    color = mix(color, color3, stripes * 0.3);

    float fresnel = pow(1.0 - abs(dot(vNormal, normalize(cameraPosition - vPosition))), 2.0);
    color += vec3(1.0, 0.8, 0.3) * fresnel * 0.3;

    color = pow(color, vec3(1.0 / 2.2));
    gl_FragColor = vec4(color, 1.0);
  }
`;

export const Sun = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y = clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <group>
      {/* Inner glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[5.5, 32, 32]} />
        <meshBasicMaterial
          color="#ff6b00"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Sun surface with shader */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[5, 128, 128]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </mesh>

      {/* Corona glow */}
      <mesh>
        <sphereGeometry args={[6, 32, 32]} />
        <meshBasicMaterial
          color="#ff4400"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[7, 32, 32]} />
        <meshBasicMaterial
          color="#ff2200"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Point light from sun */}
      <pointLight
        position={[0, 0, 0]}
        intensity={2.5}
        distance={250}
        decay={1}
        color="#ffaa44"
      />
    </group>
  );
};
