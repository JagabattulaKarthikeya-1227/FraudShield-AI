import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const ModelGalaxy: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate random clustered points to represent embedded transactions in latent space
  const [positions, colors] = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      // Create two distinct clusters (Normal vs Fraud)
      const isFraud = i < count * 0.1; 
      
      const r = isFraud ? 2 * Math.random() : 5 * Math.random();
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      // Shift fraud cluster slightly off-center
      const offsetX = isFraud ? 3 : 0;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta) + offsetX;
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Color coding: Blue/Purple for Normal, Red/Orange for Fraud
      if (isFraud) {
        color.setHSL(0.05 + Math.random() * 0.1, 0.8, 0.5); // Warm
      } else {
        color.setHSL(0.6 + Math.random() * 0.1, 0.8, 0.5); // Cool
      }
      
      color.toArray(colors, i * 3);
    }
    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      pointsRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.8} sizeAttenuation={true} />
    </points>
  );
};
