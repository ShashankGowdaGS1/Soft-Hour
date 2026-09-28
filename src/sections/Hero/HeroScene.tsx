import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { HeroModel } from './HeroModel';

interface HeroSceneProps {
  onLoaded?: () => void;
}

export default function HeroScene({ onLoaded }: HeroSceneProps) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.4, 3.2], fov: 31 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ pointerEvents: 'none', background: 'transparent' }}
      onCreated={() => {
        if (onLoaded) {
          onLoaded();
        }
      }}
    >
      {/* Soft warm patisserie lighting */}
      <ambientLight intensity={1.6} color="#FAF4EB" />
      <directionalLight position={[3.5, 6.5, 4]} intensity={1.8} color="#FFF8F0" />
      <directionalLight position={[-3.5, 2, -1.5]} intensity={0.55} color="#D6BCA4" />

      <Suspense fallback={null}>
        <HeroModel />
        <ContactShadows
          position={[0, -1.15, 0]}
          opacity={0.48}
          scale={4.6}
          blur={2.4}
          far={3}
          color="#24150F"
        />
      </Suspense>
    </Canvas>
  );
}
