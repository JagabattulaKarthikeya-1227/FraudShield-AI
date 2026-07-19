import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, RoundedBox, Sphere, Stars, ContactShadows, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// --- Particle Field ---
function AmbientParticles() {
  const count = 500;
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 15;
      p[i * 3 + 1] = (Math.random() - 0.5) * 15;
      p[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return p;
  }, [count]);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
      ref.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#0F766E" size={0.03} sizeAttenuation={true} depthWrite={false} opacity={0.3} />
    </Points>
  );
}

// --- Premium Glass Credit Card ---
function PremiumCard() {
  const group = useRef<THREE.Group>(null);
  
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} floatingRange={[-0.1, 0.1]}>
      <group ref={group}>
        
        {/* Main Card Body (Frosted Glass) */}
        <RoundedBox args={[3.37, 2.12, 0.03]} radius={0.12} smoothness={4} castShadow receiveShadow>
          <meshPhysicalMaterial 
            color="#ffffff"
            transmission={0.8} 
            opacity={1}
            metalness={0.1}
            roughness={0.2} // Frosted look
            ior={1.4}
            thickness={0.5}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </RoundedBox>

        {/* Titanium Core / Backing layer for depth */}
        <RoundedBox args={[3.35, 2.10, 0.01]} radius={0.11} position={[0, 0, -0.015]}>
          <meshStandardMaterial color="#f8fafc" metalness={0.8} roughness={0.3} />
        </RoundedBox>

        {/* Metallic EMV Chip */}
        <RoundedBox args={[0.4, 0.32, 0.02]} radius={0.04} position={[-1.1, 0.4, 0.02]} castShadow>
          <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.2} />
        </RoundedBox>
        
        {/* Chip Lines (Decorative) */}
        <mesh position={[-1.1, 0.4, 0.03]}>
          <planeGeometry args={[0.3, 0.01]} />
          <meshStandardMaterial color="#b8860b" metalness={1} roughness={0.4} />
        </mesh>
        <mesh position={[-1.1, 0.45, 0.03]}>
          <planeGeometry args={[0.3, 0.01]} />
          <meshStandardMaterial color="#b8860b" metalness={1} roughness={0.4} />
        </mesh>
        <mesh position={[-1.1, 0.35, 0.03]}>
          <planeGeometry args={[0.3, 0.01]} />
          <meshStandardMaterial color="#b8860b" metalness={1} roughness={0.4} />
        </mesh>

        {/* Minimalist Logo placement placeholder (Top right) */}
        <mesh position={[1.1, 0.65, 0.02]}>
          <circleGeometry args={[0.15, 32]} />
          <meshStandardMaterial color="#0f766e" metalness={0.5} roughness={0.2} />
        </mesh>

        {/* Fake Magnetic Stripe on back */}
        <mesh position={[0, 0.4, -0.025]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[3.37, 0.3]} />
          <meshStandardMaterial color="#1e293b" metalness={0.3} roughness={0.6} />
        </mesh>

      </group>
    </Float>
  );
}

// --- Orbiting Spheres (Subtle Data Nodes) ---
function OrbitingNodes() {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.3;
      group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
    }
  });

  return (
    <group ref={group}>
      <Sphere args={[0.08, 32, 32]} position={[2.5, 0, 0]}>
        <meshStandardMaterial color="#0f766e" metalness={0.8} roughness={0.2} />
      </Sphere>
      <Sphere args={[0.05, 32, 32]} position={[-2.8, 1, 0.5]}>
        <meshStandardMaterial color="#14b8a6" metalness={0.8} roughness={0.2} />
      </Sphere>
      <Sphere args={[0.06, 32, 32]} position={[0, -2.2, -1]}>
        <meshStandardMaterial color="#10b981" metalness={0.8} roughness={0.2} />
      </Sphere>
    </group>
  );
}

// --- Mouse Parallax Rig ---
function CameraRig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      // Smooth lerp based on mouse position
      const targetX = (state.pointer.y * Math.PI) / 12;
      const targetY = (state.pointer.x * Math.PI) / 12;
      
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
        camera={{ position: [0, 0, 5], fov: 45 }} 
        dpr={[1, 2]} 
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.4} />
        
        {/* Soft Spotlight for premium reflections */}
        <spotLight 
          position={[5, 5, 5]} 
          intensity={1.5} 
          angle={0.3} 
          penumbra={1} 
          color="#ffffff" 
          castShadow 
        />
        
        <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#e5e7eb" />
        
        {/* Subtle environment for glass reflections */}
        <Environment preset="studio" />
        
        <CameraRig>
          <PremiumCard />
          <OrbitingNodes />
          <AmbientParticles />
        </CameraRig>
        
        {/* High quality soft shadow catcher */}
        <ContactShadows 
          position={[0, -1.8, 0]} 
          opacity={0.3} 
          scale={15} 
          blur={2.5} 
          far={4} 
          color="#0f172a" 
        />
      </Canvas>
    </div>
  );
}
