import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Torus, Float } from '@react-three/drei';

const Rings = () => {
  const innerRef = useRef<any>(null);
  const outerRef = useRef<any>(null);

  useFrame(({ clock }) => {
    if (innerRef.current && outerRef.current) {
      innerRef.current.rotation.z = clock.getElapsedTime() * 0.8;
      outerRef.current.rotation.z = -clock.getElapsedTime() * 0.4;
      
      innerRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.5) * 0.2;
      outerRef.current.rotation.x = Math.cos(clock.getElapsedTime() * 0.3) * 0.3;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
      <Torus ref={outerRef} args={[2.5, 0.05, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} wireframe={true} />
      </Torus>
      <Torus ref={innerRef} args={[1.5, 0.1, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={1} />
      </Torus>
    </Float>
  );
};

export const AuditTimelineRing = () => {
  return (
    <div className="w-full h-[300px] rounded-xl overflow-hidden bg-background/20 relative">
      <Canvas camera={{ position: [0, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 10, 5]} intensity={1} color="#ffffff" />
        <Rings />
      </Canvas>
    </div>
  );
};
