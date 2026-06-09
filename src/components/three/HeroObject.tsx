"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Icosahedron, Float } from "@react-three/drei";
import * as THREE from "three";

function TechObject() {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += delta * 0.18;
    g.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.14;
  });

  return (
    <group ref={group}>
      {/* Matte core */}
      <Icosahedron args={[1.25, 1]}>
        <meshPhysicalMaterial
          color="#e2e9ec"
          roughness={0.45}
          metalness={0.15}
          clearcoat={0.3}
          clearcoatRoughness={0.5}
        />
      </Icosahedron>
      {/* Glowing cyan wireframe overlay */}
      <Icosahedron args={[1.27, 1]}>
        <meshBasicMaterial color="#25c9e2" wireframe transparent opacity={0.22} />
      </Icosahedron>
      {/* Orbiting glowing ring */}
      <mesh rotation={[Math.PI / 2.3, 0.3, 0]}>
        <torusGeometry args={[1.75, 0.028, 16, 120]} />
        <meshStandardMaterial
          color="#25c9e2"
          emissive="#25c9e2"
          emissiveIntensity={0.7}
          roughness={0.35}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
}

export default function HeroObject({ paused = false }: { paused?: boolean }) {
  return (
    <Canvas
      frameloop={paused ? "never" : "always"}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 5, 4]} intensity={1.4} />
      <directionalLight position={[-5, -2, -3]} intensity={0.5} color="#25c9e2" />
      <Float speed={1.3} rotationIntensity={0.25} floatIntensity={0.7}>
        <TechObject />
      </Float>
    </Canvas>
  );
}
