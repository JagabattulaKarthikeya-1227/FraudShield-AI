import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Stars, Float } from '@react-three/drei';

const FloatingBrain = () => {
  const sphereRef = useRef<any>(null);

  useFrame(({ clock }) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = clock.getElapsedTime() * 0.2;
      sphereRef.current.rotation.y = clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={sphereRef} args={[1, 64, 64]} scale={1.5}>
        <MeshDistortMaterial 
          color="#3b82f6" 
          attach="material" 
          distort={0.4} 
          speed={2} 
          roughness={0.2}
          metalness={0.8}
          wireframe={true}
        />
      </Sphere>
      <Sphere args={[0.8, 32, 32]}>
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={2} />
      </Sphere>
    </Float>
  );
};

export const ExplainabilityNodes = () => {
  return (
    <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden bg-background/20 border border-border/50 relative">
      <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
        <h2 className="text-4xl font-bold tracking-tighter opacity-10 mix-blend-overlay">HYBRID ENSEMBLE</h2>
      </div>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <FloatingBrain />
      </Canvas>
    </div>
  );
};
