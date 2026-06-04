"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const BRAND_COLORS = [
	new THREE.Color("#40c395"),
	new THREE.Color("#615388"),
	new THREE.Color("#b64457"),
	new THREE.Color("#dcb836"),
];

function Particles({ count = 280 }: { count?: number }) {
	const pointsRef = useRef<THREE.Points>(null);
	const velocities = useRef<Float32Array>(new Float32Array(0));

	const { positions, colors } = useMemo(() => {
		const positions = new Float32Array(count * 3);
		const colors = new Float32Array(count * 3);
		const vels = new Float32Array(count * 3);

		for (let i = 0; i < count; i++) {
			positions[i * 3] = (Math.random() - 0.5) * 30;
			positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
			positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

			vels[i * 3] = (Math.random() - 0.5) * 0.003;
			vels[i * 3 + 1] = Math.random() * 0.004 + 0.001;
			vels[i * 3 + 2] = (Math.random() - 0.5) * 0.002;

			const color =
				BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)];
			colors[i * 3] = color.r;
			colors[i * 3 + 1] = color.g;
			colors[i * 3 + 2] = color.b;
		}

		velocities.current = vels;
		return { positions, colors };
	}, [count]);

	useFrame(() => {
		if (!pointsRef.current) return;
		const geo = pointsRef.current.geometry;
		const pos = geo.attributes.position.array as Float32Array;
		const vel = velocities.current;
		if (!vel.length) return;

		for (let i = 0; i < count; i++) {
			pos[i * 3] += vel[i * 3];
			pos[i * 3 + 1] += vel[i * 3 + 1];
			pos[i * 3 + 2] += vel[i * 3 + 2];

			// Wrap Y: reset particle to bottom when it goes too high
			if (pos[i * 3 + 1] > 9) {
				pos[i * 3 + 1] = -9;
				pos[i * 3] = (Math.random() - 0.5) * 30;
			}
			// Wrap X
			if (pos[i * 3] > 15) pos[i * 3] = -15;
			if (pos[i * 3] < -15) pos[i * 3] = 15;
		}

		geo.attributes.position.needsUpdate = true;
	});

	return (
		<points ref={pointsRef}>
			<bufferGeometry>
				<bufferAttribute attach="attributes-position" args={[positions, 3]} />
				<bufferAttribute attach="attributes-color" args={[colors, 3]} />
			</bufferGeometry>
			<pointsMaterial
				size={0.06}
				vertexColors
				transparent
				opacity={0.75}
				sizeAttenuation
			/>
		</points>
	);
}

export function ParticleField() {
	return (
		<Canvas
			camera={{ position: [0, 0, 12], fov: 55 }}
			dpr={[1, 1.5]}
			gl={{ antialias: false, alpha: true }}
			style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
		>
			<Particles />
		</Canvas>
	);
}
