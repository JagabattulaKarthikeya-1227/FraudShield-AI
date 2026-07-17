import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, RoundedBox, Sphere, Stars, useTexture, ContactShadows, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// --- Particle Field ---
function ParticleField() {
  const count = 1000;
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 20;
      p[i * 3 + 1] = (Math.random() - 0.5) * 20;
      p[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return p;
  }, [count]);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
      ref.current.rotation.x = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#C7A66A" size={0.05} sizeAttenuation={true} depthWrite={false} opacity={0.4} />
    </Points>
  );
}

// --- Glass Credit Card ---
function GlassCard() {
  const group = useRef<THREE.Group>(null);
  
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1} floatingRange={[-0.2, 0.2]}>
      <group ref={group}>
        {/* Main Card Body */}
        <RoundedBox args={[3.37, 2.12, 0.05]} radius={0.1} smoothness={4} castShadow>
          <meshPhysicalMaterial 
            color="#ffffff"
            transmission={0.95} 
            opacity={1}
            metalness={0.2}
            roughness={0.05}
            ior={1.5}
            thickness={0.5}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </RoundedBox>

        {/* EMV Chip placeholder */}
        <RoundedBox args={[0.4, 0.3, 0.06]} radius={0.05} position={[-1.1, 0.4, 0.01]}>
          <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
        </RoundedBox>

        {/* Fake Magnetic Stripe / Accent Line */}
        <mesh position={[0, -0.4, 0.03]}>
          <planeGeometry args={[3.37, 0.2]} />
          <meshStandardMaterial color="#162A2B" opacity={0.8} transparent />
        </mesh>
      </group>
    </Float>
  );
}

// --- Network Nodes ---
function NetworkNodes() {
  const nodesRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (nodesRef.current) {
      nodesRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
      nodesRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.2) * 0.2;
    }
  });

  // Create a few floating spheres representing AI nodes
  return (
    <group ref={nodesRef}>
      {[
        [2, 1, -1], [-2, -1, 1], [1.5, -1.5, 0], [-1.5, 1.5, -2], [0, 2, -1.5]
      ].map((pos, i) => (
        <Float key={i} speed={2 + i*0.5} floatIntensity={2} rotationIntensity={2}>
          <mesh position={new THREE.Vector3(...pos)}>
            <sphereGeometry args={[0.15, 32, 32]} />
            <meshStandardMaterial 
              color={i % 2 === 0 ? "#4A6741" : "#D4AF37"} 
              emissive={i % 2 === 0 ? "#4A6741" : "#D4AF37"}
              emissiveIntensity={0.5}
              transparent
              opacity={0.8}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// --- Mouse Parallax Rig ---
function CameraRig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      // Lerp rotation based on mouse position
      const targetX = (state.pointer.y * Math.PI) / 10;
      const targetY = (state.pointer.x * Math.PI) / 10;
      
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.05);
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, 0.05);
    }
  });

  return <group ref={group}>{children}</group>;
}

export function Hero3DScene() {
  return (
    <div className="w-full h-full absolute inset-0 z-0 pointer-events-auto">
      <Canvas 
        camera={{ position: [0, 0, 6], fov: 45 }} 
        dpr={[1, 2]} 
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#F3EFE6" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#D4AF37" />
        
        <Environment preset="city" />
        
        <CameraRig>
          <GlassCard />
          <NetworkNodes />
          <ParticleField />
        </CameraRig>
        
        {/* Soft shadow catcher */}
        <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} color="#162A2B" />
      </Canvas>
    </div>
  );
}
