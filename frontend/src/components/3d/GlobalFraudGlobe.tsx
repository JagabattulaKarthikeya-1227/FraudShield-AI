import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Stars, Float } from '@react-three/drei';

const EarthGlobe = () => {
  const meshRef = useRef<any>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.1; // Slow constant rotation
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      {/* Outer Atmosphere */}
      <Sphere ref={meshRef} args={[2, 64, 64]} scale={1.1}>
        <MeshDistortMaterial 
          color="#1e293b" 
          attach="material" 
          distort={0.1} 
          speed={1} 
          roughness={0.8}
          metalness={0.2}
          wireframe={true}
          opacity={0.3}
          transparent={true}
        />
      </Sphere>
      {/* Core Planet */}
      <Sphere args={[1.9, 64, 64]}>
        <meshStandardMaterial 
          color="#0f172a" 
          emissive="#3b82f6" 
          emissiveIntensity={0.2} 
          roughness={1}
        />
      </Sphere>
    </Float>
  );
};

export const GlobalFraudGlobe = () => {
  return (
    <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden bg-background/40 border border-border/50 relative">
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-end p-8">
        <h3 className="text-2xl font-bold tracking-tight text-white mix-blend-overlay">Global Threat Matrix</h3>
        <p className="text-sm opacity-50">Real-time planetary monitoring</p>
      </div>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#3b82f6" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#ef4444" />
        <Stars radius={100} depth={50} count={5000} factor={2} saturation={0.5} fade speed={1} />
        <EarthGlobe />
      </Canvas>
    </div>
  );
};
