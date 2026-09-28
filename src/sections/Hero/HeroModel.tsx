import { useGLTF, Center } from '@react-three/drei';

export function HeroModel() {
  const { scene } = useGLTF('/media/models/soft-hour-hero-dessert.glb');

  return (
    <group position={[0, -0.05, 0]} rotation={[0.18, -0.32, 0.04]}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

useGLTF.preload('/media/models/soft-hour-hero-dessert.glb');
