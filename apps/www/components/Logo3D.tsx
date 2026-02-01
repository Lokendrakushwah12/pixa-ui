"use client";

import { useFrame, useLoader } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { ExtrudeGeometry, type Mesh, Vector3 } from "three";
import { SVGLoader } from "three-stdlib";

type Logo3DProps = {
  theme: "dark" | "light";
};

export function Logo3D({ theme }: Logo3DProps) {
  const meshRef = useRef<Mesh>(null);
  const svg = useLoader(SVGLoader, "/logo.svg");

  const geometry = useMemo(() => {
    const shapes = svg.paths.flatMap((path) => path.toShapes(true));

    const geo = new ExtrudeGeometry(shapes, {
      bevelEnabled: false,
      depth: 2,
    });

    geo.computeBoundingBox();
    const center = new Vector3();
    geo.boundingBox?.getCenter(center);
    geo.translate(-center.x, -center.y, -center.z);

    return geo;
  }, [svg]);

  // 🔁 auto-rotate
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.6;
    meshRef.current.rotation.x += delta * 0.15;
  });

  const color = theme === "dark" ? "#b3a3ff" : "#ffffff";

  const emissiveIntensity = theme === "dark" ? 0.6 : 0.25;

  return (
    <mesh
      geometry={geometry}
      ref={meshRef}
      rotation={[Math.PI, 0, 0]}
      scale={0.08}
    >
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={emissiveIntensity}
        metalness={0.25}
        roughness={0.35}
      />
    </mesh>
  );
}
