import { OrbitControls, Text3D, Center } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

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
        <Text3D
          font="https://unpkg.com/three@0.152.2/examples/fonts/helvetiker_regular.typeface.json"
          size={0.5}
          height={0.1}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          DEV
          <meshStandardMaterial 
            color="#ff0080" 
            emissive="#ff0080"
            emissiveIntensity={0.3}
          />
        </Text3D>
      </Center>
    </group>
  );
}

interface ThreeSceneProps {
  showText?: boolean;
}

export default function ThreeScene({ showText = false }: ThreeSceneProps) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff0080" />
      
      {showText ? <FloatingText /> : <RotatingCube />}
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        autoRotate
        autoRotateSpeed={1}
      />
    </Canvas>
  );
}