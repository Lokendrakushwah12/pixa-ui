"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useEffect, useRef, useState } from "react";
import { Vector2 } from "three";
import { useThemeFromHtml } from "@/hooks/use-themeFromHtml";
import { AsciiEffect } from "./ascii-effect";
import { Logo3D } from "./Logo3D";

export function EffectScene() {
  const theme = useThemeFromHtml();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState(new Vector2(0, 0));
  const [resolution, setResolution] = useState(new Vector2(1920, 1080));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = rect.height - (e.clientY - rect.top);
        setMousePos(new Vector2(x, y));
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);

      const rect = container.getBoundingClientRect();
      setResolution(new Vector2(rect.width, rect.height));

      const handleResize = () => {
        const rect = container.getBoundingClientRect();
        setResolution(new Vector2(rect.width, rect.height));
      };
      window.addEventListener("resize", handleResize);

      return () => {
        container.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  return (
    <div
      className="md:-top-[15%] absolute top-[25%] right-0 w-full scale-75 sm:top-0 sm:scale-100 md:w-1/2"
      ref={containerRef}
      style={{ height: "100vh" }}
    >
      <Canvas
        camera={{ fov: 50, position: [0, 0, 5] }}
        className="bg-transparent"
      >
        {/* Lighting */}
        <ambientLight intensity={0.25} />
        <directionalLight castShadow intensity={2.5} position={[6, 6, 6]} />
        <hemisphereLight intensity={0.5} />
        <directionalLight intensity={1.2} position={[-5, 3, -5]} />

        {/* 3D Model */}
        {/* <mesh scale={1} rotation={[0, 0, 0]}>
          <torusKnotGeometry args={[10.8, 0.3, 100, 16]} />
          <meshStandardMaterial color="#b3a3ff" roughness={0.3} metalness={0.1} />
        </mesh> */}

        <Logo3D theme={theme} />

        <OrbitControls enableDamping enableZoom={false} />

        {/* ASCII Effect with PostFX */}
        <EffectComposer>
          <Bloom
            intensity={1.2}
            luminanceSmoothing={0.9}
            luminanceThreshold={0.2}
          />
          <AsciiEffect
            cellSize={6}
            color={false}
            invert={false}
            mousePos={mousePos}
            postfx={{
              aberrationStrength: 0,
              brightnessAdjust: 0,
              colorPalette: "original",
              contrastAdjust: 1,
              curvature: 0,
              glitchFrequency: 0,
              glitchIntensity: 0,
              jitterIntensity: 0,
              jitterSpeed: 1,
              mouseGlowEnabled: false,
              mouseGlowIntensity: 1.5,
              mouseGlowRadius: 200,
              noiseIntensity: 0,
              noiseScale: 1,
              noiseSpeed: 1,
              scanlineCount: 200,
              scanlineIntensity: 0,
              targetFPS: 0,
              vignetteIntensity: 0,
              vignetteRadius: 0.8,
              waveAmplitude: 0,
              waveFrequency: 10,
              waveSpeed: 1,
            }}
            resolution={resolution}
            style="standard"
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
