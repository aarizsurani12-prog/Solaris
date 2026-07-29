"use client";

import * as THREE from "three";

const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform float uPower;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    // Fresnel term: near-zero facing the camera dead-on, rising toward the
    // silhouette edge — a real rim-light response, not a flat glow shell.
    // Clamp (not just max-with-0): interpolated normals can push the dot
    // product a hair above 1.0, and pow() of a negative base with a
    // non-integer exponent is NaN in GLSL — which can corrupt the whole
    // frame once it blends into the framebuffer, not just this pixel.
    float fresnel = pow(1.0 - clamp(dot(vNormal, vViewDir), 0.0, 1.0), uPower);
    gl_FragColor = vec4(uColor, fresnel * uIntensity);
  }
`;

interface AtmosphereProps {
  radius: number;
  color: string;
  intensity?: number;
  power?: number;
}

// Real atmospheric rim glow via fresnel — replaces the old stack of flat
// additive spheres, which glowed the same amount everywhere rather than
// brightening toward the limb the way a real atmosphere scatters light.
export const Atmosphere = ({ radius, color, intensity = 1.2, power = 2.5 }: AtmosphereProps) => {
  return (
    <mesh scale={1.0}>
      <sphereGeometry args={[radius, 32, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uColor: { value: new THREE.Color(color) },
          uIntensity: { value: intensity },
          uPower: { value: power },
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.FrontSide}
      />
    </mesh>
  );
};
