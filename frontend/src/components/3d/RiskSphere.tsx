import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const RiskSphere: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Distort vertices slightly over time to represent shifting risk factors
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.x += 0.002;
      
      // Simulate pulsating scale
      const scale = 1 + Math.sin(state.clock.getElapsedTime() * 2) * 0.02;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ef4444" />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#fbbf24" />
      
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2, 3]} />
        <meshStandardMaterial 
          color="#1e293b" 
          wireframe={true} 
          transparent 
          opacity={0.6}
        />
      </mesh>
      
      {/* Core Solid Sphere */}
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
      </mesh>
    </>
  );
};
