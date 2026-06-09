"use client";

/* React Three Fiber is imperative by design: useFrame/effects mutate Three.js
   objects (camera, meshes) directly each frame. That is the correct R3F pattern,
   so the React Compiler immutability rule does not apply to this file. */
/* eslint-disable react-hooks/immutability */

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Icosahedron, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { getScrollProgress, getPointer } from "./scrollProgress";

/* ----------------------------- math helpers ------------------------------ */

/** Piecewise linear interpolation across [progress, value] keyframes. */
function keyframe(p: number, frames: [number, number][]) {
  if (p <= frames[0][0]) return frames[0][1];
  const last = frames[frames.length - 1];
  if (p >= last[0]) return last[1];
  for (let i = 0; i < frames.length - 1; i++) {
    const [p0, v0] = frames[i];
    const [p1, v1] = frames[i + 1];
    if (p >= p0 && p <= p1) {
      const t = (p - p0) / (p1 - p0);
      return THREE.MathUtils.lerp(v0, v1, t * t * (3 - 2 * t)); // smoothstep
    }
  }
  return last[1];
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/* ------------------------------ materials -------------------------------- */

function MatteMaterial() {
  return (
    <meshPhysicalMaterial
      color="#e8edef"
      roughness={0.62}
      metalness={0.05}
      clearcoat={0.18}
      clearcoatRoughness={0.6}
      envMapIntensity={0.4}
    />
  );
}

/* -------------------------------- scene ---------------------------------- */

function SceneContent({ simplified }: { simplified: boolean }) {
  const group = useRef<THREE.Group>(null);
  const formA = useRef<THREE.Mesh>(null);
  const formB = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const camera = useThree((s) => s.camera);
  const setSize = useThree((s) => s.setSize);
  const parallax = useRef({ x: 0, y: 0 });

  // Size the renderer to the viewport explicitly (robust on a fixed full-screen
  // canvas, independent of ResizeObserver timing).
  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setSize(w, h);
      if ((camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
        const cam = camera as THREE.PerspectiveCamera;
        cam.aspect = w / h;
        cam.updateProjectionMatrix();
      }
    };
    onResize();
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [camera, setSize]);

  useFrame((state, delta) => {
    const p = getScrollProgress();
    const t = state.clock.elapsedTime;
    const g = group.current;
    if (!g) return;

    // Position — drift across the viewport, opposite the content column.
    const x = keyframe(p, [
      [0, 0],
      [0.25, 1.7],
      [0.55, -1.9],
      [0.85, 0],
      [1, 0],
    ]);
    const calm = 1 - smoothstep(0.82, 1, p); // settle near the end
    const floatY = Math.sin(t * 0.5) * 0.12 * calm;
    g.position.x = THREE.MathUtils.damp(g.position.x, x, 4, delta);
    g.position.y = THREE.MathUtils.damp(g.position.y, floatY, 4, delta);

    // Rotation — scroll-scrubbed plus a slow idle spin.
    g.rotation.y = p * Math.PI * 3 + t * 0.12 * calm;

    // Pointer parallax (±~3°), damped, fine-pointer only (0 on touch).
    if (!simplified) {
      const ptr = getPointer();
      parallax.current.x = THREE.MathUtils.damp(parallax.current.x, ptr.y * 0.05, 3, delta);
      parallax.current.y = THREE.MathUtils.damp(parallax.current.y, ptr.x * 0.05, 3, delta);
      g.rotation.x = parallax.current.x;
      g.position.x += parallax.current.y * 2;
    }

    // Overall scale.
    const scale = keyframe(p, [
      [0, 1],
      [0.25, 1.05],
      [0.55, 1.12],
      [0.85, 0.85],
      [1, 0.8],
    ]);
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, scale, 4, delta));

    // Crossfade form A → form B around the portfolio band.
    const b = smoothstep(0.42, 0.62, p);
    if (formA.current) formA.current.scale.setScalar(1 - b);
    if (formB.current) formB.current.scale.setScalar(b);

    // Slowly counter-rotate the cyan accent ring.
    if (ring.current) ring.current.rotation.z = -t * 0.15 - p * Math.PI;

    // Subtle camera dolly tied to scroll.
    const camZ = keyframe(p, [
      [0, 6],
      [0.5, 5.3],
      [1, 6.2],
    ]);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, camZ, 3, delta);
  });

  const segments = simplified ? 0 : 1;

  return (
    <>
      <ambientLight intensity={0.7} />
      <hemisphereLight args={["#ffffff", "#dfeaee", 0.5]} />
      <directionalLight position={[4, 6, 5]} intensity={1.2} />
      <directionalLight position={[-5, 2, -3]} intensity={0.35} />

      <group ref={group}>
        {/* Form A — soft rounded slab */}
        <RoundedBox ref={formA} args={[1.7, 1.7, 1.7]} radius={0.32} smoothness={simplified ? 2 : 4}>
          <MatteMaterial />
        </RoundedBox>

        {/* Form B — faceted abstract */}
        <Icosahedron ref={formB} args={[1.15, segments]} scale={0}>
          <MatteMaterial />
        </Icosahedron>

        {/* Subtle cyan accent ring (matte, no glow) */}
        <mesh ref={ring} rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[1.55, 0.035, 12, simplified ? 48 : 96]} />
          <meshStandardMaterial
            color="#25c9e2"
            roughness={0.45}
            metalness={0.15}
            emissive="#25c9e2"
            emissiveIntensity={0.45}
          />
        </mesh>
      </group>

      {!simplified && (
        <ContactShadows
          position={[0, -1.55, 0]}
          opacity={0.32}
          blur={2.6}
          far={4}
          scale={9}
          color="#15262b"
          resolution={512}
        />
      )}
    </>
  );
}

export default function Scene3D({
  paused = false,
  simplified = false,
}: {
  paused?: boolean;
  simplified?: boolean;
}) {
  return (
    <Canvas
      frameloop={paused ? "never" : "always"}
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 6], fov: 42 }}
      style={{ width: "100%", height: "100%" }}
    >
      <SceneContent simplified={simplified} />
    </Canvas>
  );
}
