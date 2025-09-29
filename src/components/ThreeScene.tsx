import { OrbitControls, Text, Center } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useMemo } from "react";

function RotatingCube() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial 
        color="#00ffff" 
        emissive="#00ffff"
        emissiveIntensity={0.2}
        wireframe
      />
    </mesh>
  );
}

function FloatingText() {
  const textRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (textRef.current) {
      textRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
      textRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <group ref={textRef}>
      <Center>
        <Text
          fontSize={0.6}
          color="#ff0080"
          outlineWidth={0.02}
          outlineColor="#ff0080"
          anchorX="center"
          anchorY="middle"
        >
          SK
        </Text>
      </Center>
    </group>
  );
}

function PersonWithLaptop() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.4;
    }
  });

  // Simple materials reused
  const skin = useMemo(() => new THREE.MeshStandardMaterial({ color: "#ffd6b4" }), []);
  const cloth = useMemo(() => new THREE.MeshStandardMaterial({ color: "#4e5bff", metalness: 0.1, roughness: 0.8 }), []);
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: "#111318", metalness: 0.2, roughness: 0.7 }), []);
  const accent = useMemo(() => new THREE.MeshStandardMaterial({ color: "#7aa2ff", emissive: "#7aa2ff", emissiveIntensity: 0.15 }), []);

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Body */}
      <mesh material={cloth} position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.45, 0.5, 1.2, 16]} />
      </mesh>

      {/* Head */}
      <mesh material={skin} position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.28, 24, 24]} />
      </mesh>

      {/* Left arm (bent) */}
      <group position={[-0.55, 0.9, 0]}>
        <mesh material={cloth} position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.4, 12]} />
        </mesh>
        <group position={[0, -0.4, 0.1]} rotation={[Math.PI / 4, 0, 0]}>
          <mesh material={skin} position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.4, 12]} />
          </mesh>
        </group>
      </group>

      {/* Right arm (bent) */}
      <group position={[0.55, 0.9, 0]}>
        <mesh material={cloth} position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.4, 12]} />
        </mesh>
        <group position={[0, -0.4, 0.1]} rotation={[Math.PI / 4, 0, 0]}>
          <mesh material={skin} position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.4, 12]} />
          </mesh>
        </group>
      </group>

      {/* Legs */}
      <group position={[-0.18, -0.2, 0]}>
        <mesh material={dark} position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.8, 12]} />
        </mesh>
      </group>
      <group position={[0.18, -0.2, 0]}>
        <mesh material={dark} position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.8, 12]} />
        </mesh>
      </group>

      {/* Laptop */}
      <group position={[0, 0.8, 0.25]} rotation={[-0.2, 0, 0]}>
        {/* Base */}
        <mesh material={dark}>
          <boxGeometry args={[0.7, 0.04, 0.45]} />
        </mesh>
        {/* Screen */}
        <mesh position={[0, 0.28, -0.22]} rotation={[0.9, 0, 0]} material={accent}>
          <boxGeometry args={[0.7, 0.5, 0.04]} />
        </mesh>
      </group>
    </group>
  );
}

interface ThreeSceneProps {
  mode?: "cube" | "text" | "person";
}

export default function ThreeScene({ mode = "person" }: ThreeSceneProps) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#7aa2ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.6} color="#4e5bff" />

      {mode === "person" ? (
        <PersonWithLaptop />
      ) : mode === "text" ? (
        <FloatingText />
      ) : (
        <RotatingCube />
      )}

      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} />
    </Canvas>
  );
}