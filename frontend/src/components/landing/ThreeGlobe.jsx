'use client';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Particles({ count = 1500 }) {
  const mesh = useRef();
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.5 + Math.random() * 0.5;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  const colors = useMemo(() => {
    const col = new Float32Array(count * 3);
    const purple = new THREE.Color('#7c3aed');
    const violet = new THREE.Color('#a78bfa');
    const white = new THREE.Color('#ffffff');
    for (let i = 0; i < count; i++) {
      const t = Math.random();
      const c = t < 0.5 ? purple.clone().lerp(violet, t * 2) : violet.clone().lerp(white, (t - 0.5) * 2);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return col;
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.05;
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.1;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} vertexColors transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

function FloatingRings() {
  const ring1 = useRef();
  const ring2 = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ring1.current) {
      ring1.current.rotation.x = t * 0.2;
      ring1.current.rotation.z = t * 0.1;
    }
    if (ring2.current) {
      ring2.current.rotation.y = t * 0.15;
      ring2.current.rotation.x = Math.PI / 3 + t * 0.05;
    }
  });

  return (
    <>
      <mesh ref={ring1}>
        <torusGeometry args={[3, 0.01, 16, 100]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.3} />
      </mesh>
      <mesh ref={ring2}>
        <torusGeometry args={[3.3, 0.008, 16, 100]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.2} />
      </mesh>
    </>
  );
}

export default function ThreeGlobe() {
  return (
    <div className="absolute inset-0 z-0" style={{ opacity: 0.7 }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.3} />
        <Particles />
        <FloatingRings />
      </Canvas>
    </div>
  );
}
