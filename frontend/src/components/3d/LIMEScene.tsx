import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Float, Environment, Ring } from '@react-three/drei';
import * as THREE from 'three';

function LIMECore() {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.x = Math.PI / 4; // Isometric tilt
      group.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={group}>
      {/* Target Prediction */}
      <Sphere args={[0.3, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#C26E60" />
      </Sphere>

      {/* Expansion Rings (Local neighborhood) */}
      {[1, 2, 3].map((r, i) => (
        <Ring key={i} args={[r, r + 0.05, 64]} position={[0, 0, 0]}>
          <meshBasicMaterial color="#D9A441" transparent opacity={0.3 - (i * 0.1)} side={THREE.DoubleSide} />
        </Ring>
      ))}

      {/* Neighborhood Samples */}
      {[
        [0.5, 0.8, 0], [-0.7, 0.7, 0], [1.2, -1.5, 0], 
        [-1.8, -0.5, 0], [2.2, 1.1, 0], [-2.5, 1.8, 0]
      ].map((pos, i) => (
        <Sphere key={`sample-${i}`} args={[0.1, 16, 16]} position={new THREE.Vector3(...pos)}>
          <meshStandardMaterial color={i % 2 === 0 ? "#4A6741" : "#F3EFE6"} />
        </Sphere>
      ))}
    </group>
  );
}

export function LIMEScene() {
  return (
    <div className="w-full h-[500px] rounded-[32px] overflow-hidden relative">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#F3EFE6" />
        <Environment preset="city" />
        <Float speed={1} floatIntensity={0.5}>
          <LIMECore />
        </Float>
      </Canvas>
    </div>
  );
}
