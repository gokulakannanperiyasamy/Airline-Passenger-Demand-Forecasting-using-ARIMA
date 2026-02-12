import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function WaveParticles() {
    const pointsRef = useRef();
    const count = 50;
    const separation = 1.5;

    const positions = useMemo(() => {
        const pos = new Float32Array(count * count * 3);
        let i = 0;

        for (let ix = 0; ix < count; ix++) {
            for (let iy = 0; iy < count; iy++) {
                pos[i] = ix * separation - (count * separation) / 2;
                pos[i + 1] = 0;
                pos[i + 2] = iy * separation - (count * separation) / 2;
                i += 3;
            }
        }

        return pos;
    }, []);

    useFrame((state) => {
        if (pointsRef.current) {
            const positions = pointsRef.current.geometry.attributes.position.array;
            let i = 0;

            for (let ix = 0; ix < count; ix++) {
                for (let iy = 0; iy < count; iy++) {
                    const x = positions[i];
                    const z = positions[i + 2];

                    positions[i + 1] = Math.sin((x + state.clock.elapsedTime) * 0.3) * 2 +
                        Math.sin((z + state.clock.elapsedTime * 0.5) * 0.3) * 2;

                    i += 3;
                }
            }

            pointsRef.current.geometry.attributes.position.needsUpdate = true;
            pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.15}
                color="#6366f1"
                transparent
                opacity={0.6}
                sizeAttenuation={true}
            />
        </points>
    );
}

function FloatingOrbs() {
    const orbsRef = useRef();

    const orbs = useMemo(() => {
        const positions = [];
        for (let i = 0; i < 20; i++) {
            positions.push({
                position: [
                    (Math.random() - 0.5) * 30,
                    (Math.random() - 0.5) * 20,
                    (Math.random() - 0.5) * 30
                ],
                speed: 0.5 + Math.random() * 0.5,
                radius: 0.3 + Math.random() * 0.5
            });
        }
        return positions;
    }, []);

    useFrame((state) => {
        if (orbsRef.current) {
            orbsRef.current.children.forEach((orb, i) => {
                orb.position.y += Math.sin(state.clock.elapsedTime * orbs[i].speed) * 0.01;
                orb.position.x += Math.cos(state.clock.elapsedTime * orbs[i].speed * 0.5) * 0.01;
            });
        }
    });

    return (
        <group ref={orbsRef}>
            {orbs.map((orb, i) => (
                <mesh key={i} position={orb.position}>
                    <sphereGeometry args={[orb.radius, 16, 16]} />
                    <meshStandardMaterial
                        color="#818cf8"
                        transparent
                        opacity={0.3}
                        emissive="#6366f1"
                        emissiveIntensity={0.2}
                    />
                </mesh>
            ))}
        </group>
    );
}

export default function SpiralBackground() {
    return (
        <div className="fixed inset-0 -z-10">
            <Canvas camera={{ position: [0, 15, 30], fov: 75 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a78bfa" />
                <WaveParticles />
                <FloatingOrbs />
            </Canvas>
        </div>
    );
}
