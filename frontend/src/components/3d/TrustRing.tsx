import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const TrustRing: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Subtle rotation to represent ongoing privacy protection
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer Glow Ring */}
      <mesh>
        <torusGeometry args={[2, 0.05, 16, 100]} />
        <meshStandardMaterial color="#818cf8" transparent opacity={0.4} />
      </mesh>
      
      {/* Inner Solid Ring */}
      <mesh>
        <torusGeometry args={[1.8, 0.02, 16, 100]} />
        <meshStandardMaterial color="#c7d2fe" wireframe />
      </mesh>

      {/* Floating Particles to represent protected data */}
      {Array.from({ length: 40 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 40) * Math.PI * 2) * 2,
            Math.sin((i / 40) * Math.PI * 2) * 2,
            Math.sin(i) * 0.2
          ]}
        >
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
      
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#4f46e5" />
    </group>
  );
};
