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
      // Slightly slower rotation for a clearer silhouette
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  // Reuse simple materials
  const skin = useMemo(() => new THREE.MeshStandardMaterial({ color: "#ffd6b4" }), []);
  const cloth = useMemo(() => new THREE.MeshStandardMaterial({ color: "#4e5bff", metalness: 0.1, roughness: 0.8 }), []);
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: "#111318", metalness: 0.2, roughness: 0.7 }), []);
  const accent = useMemo(() => new THREE.MeshStandardMaterial({ color: "#7aa2ff", emissive: "#7aa2ff", emissiveIntensity: 0.15 }), []);

  return (
    <group ref={groupRef} position={[0, -0.6, 0]}>
      {/* Torso (taller, slimmer) */}
      <mesh material={cloth} position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.35, 0.4, 1.3, 18]} />
      </mesh>

      {/* Neck */}
      <mesh material={skin} position={[0, 1.25, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.12, 12]} />
      </mesh>

      {/* Head (slightly smaller) */}
      <mesh material={skin} position={[0, 1.45, 0]}>
        <sphereGeometry args={[0.24, 24, 24]} />
      </mesh>

      {/* Shoulders bar */}
      <mesh material={cloth} position={[0, 1.05, 0]}>
        <boxGeometry args={[0.9, 0.12, 0.2]} />
      </mesh>

      {/* Left arm: upper + forearm bent forward to laptop */}
      <group position={[-0.45, 1.0, 0]}>
        {/* Upper arm */}
        <group rotation={[0, 0, 0.15]}>
          <mesh material={cloth} position={[0, -0.22, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.44, 12]} />
          </mesh>
        </group>
        {/* Forearm (toward front and slightly up) */}
        <group position={[0, -0.44, 0]} rotation={[0.9, 0.1, 0]}>
          <mesh material={skin} position={[0, -0.22, 0]}>
            <cylinderGeometry args={[0.085, 0.085, 0.44, 12]} />
          </mesh>
        </group>
        {/* Hand */}
        <mesh material={skin} position={[0.02, -0.7, 0.24]}>
          <sphereGeometry args={[0.08, 16, 16]} />
        </mesh>
      </group>

      {/* Right arm: upper + forearm bent forward to laptop */}
      <group position={[0.45, 1.0, 0]}>
        {/* Upper arm */}
        <group rotation={[0, 0, -0.15]}>
          <mesh material={cloth} position={[0, -0.22, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.44, 12]} />
          </mesh>
        </group>
        {/* Forearm (toward front and slightly up) */}
        <group position={[0, -0.44, 0]} rotation={[0.9, -0.1, 0]}>
          <mesh material={skin} position={[0, -0.22, 0]}>
            <cylinderGeometry args={[0.085, 0.085, 0.44, 12]} />
          </mesh>
        </group>
        {/* Hand */}
        <mesh material={skin} position={[-0.02, -0.7, 0.24]}>
          <sphereGeometry args={[0.08, 16, 16]} />
        </mesh>
      </group>

      {/* Legs (slightly wider stance) */}
      <group position={[-0.16, -0.1, 0]}>
        <mesh material={dark} position={[0, -0.45, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.9, 12]} />
        </mesh>
      </group>
      <group position={[0.16, -0.1, 0]}>
        <mesh material={dark} position={[0, -0.45, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.9, 12]} />
        </mesh>
      </group>

      {/* Laptop closer to chest with realistic angle */}
      <group position={[0, 0.98, 0.26]} rotation={[-0.3, 0, 0]}>
        {/* Base */}
        <mesh material={dark}>
          <boxGeometry args={[0.62, 0.04, 0.42]} />
        </mesh>
        {/* Screen */}
        <mesh position={[0, 0.28, -0.20]} rotation={[0.95, 0, 0]} material={accent}>
          <boxGeometry args={[0.62, 0.48, 0.04]} />
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