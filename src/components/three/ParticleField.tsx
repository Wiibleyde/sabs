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
		const pos = new Float32Array(count * 3);
		const col = new Float32Array(count * 3);
		const vel = new Float32Array(count * 3);

		for (let i = 0; i < count; i++) {
			pos[i * 3] = (Math.random() - 0.5) * 30;
			pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
			pos[i * 3 + 2] = (Math.random() - 0.5) * 10;

			vel[i * 3] = (Math.random() - 0.5) * 0.2;
			vel[i * 3 + 1] = Math.random() * 0.3 + 0.08;
			vel[i * 3 + 2] = (Math.random() - 0.5) * 0.15;

			const color =
				BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)];
			col[i * 3] = color.r;
			col[i * 3 + 1] = color.g;
			col[i * 3 + 2] = color.b;
		}

		velocities.current = vel;
		return { positions: pos, colors: col };
	}, [count]);

	useFrame((_state, delta) => {
		if (!pointsRef.current) return;
		const geo = pointsRef.current.geometry;
		const pos = geo.attributes.position.array as Float32Array;
		const vel = velocities.current;
		if (!vel.length) return;

		const dt = Math.min(delta, 0.05);

		for (let i = 0; i < count; i++) {
			pos[i * 3] += vel[i * 3] * dt;
			pos[i * 3 + 1] += vel[i * 3 + 1] * dt;
			pos[i * 3 + 2] += vel[i * 3 + 2] * dt;

			if (pos[i * 3 + 1] > 9) {
				pos[i * 3 + 1] = -9;
				pos[i * 3] = (Math.random() - 0.5) * 30;
			}
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
