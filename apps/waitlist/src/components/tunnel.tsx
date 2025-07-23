"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type * as THREE from "three";

export default function Tunnel() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 30 }}
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <color attach="background" args={["#0a0a0a"]} />
        <TunnelScene />
      </Canvas>
    </div>
  );
}

function TunnelScene() {
  return (
    <>
      <RectangularTunnel />
    </>
  );
}

function RectangularTunnel() {
  const groupRef = useRef<THREE.Group>(null);

  const numRects = 30;
  const rectDistance = 1.5;
  const speed = 1; // adjust for slower/faster tunnel

  useFrame((state) => {
    if (groupRef.current) {
      const offset =
        (state.clock.getElapsedTime() * speed) % (numRects * rectDistance);
      groupRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Group;
        mesh.position.z = -i * rectDistance + offset;
      });
    }
  });

  const rectangles = useMemo(() => {
    const rectArray = [];
    for (let i = 0; i < numRects; i++) {
      const scale = Math.max(0.1, 1 - i * 0.015);
      rectArray.push({
        scale: scale,
        opacity: Math.max(0.05, 1 - i * 0.02),
      });
    }
    return rectArray;
  }, []);

  return (
    <group ref={groupRef}>
      {rectangles.map((rect, index) => (
        <group
          key={index}
          position={[0, 0, -index * rectDistance]}
          scale={[rect.scale, rect.scale, rect.scale]}
        >
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[
                  new Float32Array([
                    -4,
                    -2.25,
                    0, // bottom left
                    4,
                    -2.25,
                    0, // bottom right
                    4,
                    2.25,
                    0, // top right
                    -4,
                    2.25,
                    0, // top left
                    -4,
                    -2.25,
                    0, // back to bottom left
                  ]),
                  3,
                ]}
                count={5}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color="#ffffff"
              transparent
              opacity={rect.opacity * 0.2}
            />
          </line>
        </group>
      ))}
    </group>
  );
}
