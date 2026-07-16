import { useRef, useState, useEffect, useMemo } from 'react';
import React from 'react';
import { Canvas, useFrame, invalidate } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { Planet } from '../../types/planet-interface';

const STAR_COLORS: Record<string, string> = {
  'Yellow-Dwarf':   '#FFD700',
  'Blue-Giant':     '#6699FF',
  'White-Dwarf':    '#EEEEFF',
  'Brown-Dwarf':    '#A0522D',
  'Red-Giant':      '#FF4422',
  'Red-Supergiant': '#FF2200',
  'Red-Dwarf':      '#FF5533',
};

const PLANET_COLORS = [
  '#4488cc', '#88aa44', '#cc8844', '#8844cc',
  '#44ccaa', '#cc4488', '#aacc44', '#44aacc',
];

const ORBIT_BASE   = 5;
const ORBIT_STEP   = 3.5;
const ORBIT_SPEED  = 0.04; // radians per second for innermost; outer are slower
const ABOVE_BELOW_Y = 3.5; // vertical offset for above/below rings
const OUTER_RADIUS_BUFFER = 6; // extra radius beyond last planet orbit for Oort sphere

// ── position dot ──────────────────────────────────────────────────────────────
const DOT_GEO = new THREE.SphereGeometry(0.12, 6, 6);
const DOT_MAT = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 1 });

// Distributes N points evenly on a sphere of given radius using the Fibonacci method.
// yMin/yMax (-1 to 1) clamp to a hemisphere: yMin=0 = upper half, yMax=0 = lower half.
function fibonacciSphere(
  n: number, radius: number,
  yMin = -1, yMax = 1,
): [number, number, number][] {
  const points: [number, number, number][] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = yMin + (i / (n - 1)) * (yMax - yMin);
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    points.push([Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius]);
  }
  return points;
}

function PositionDots({ planetCount }: { planetCount: number }) {
  const dots: React.ReactElement[] = [];
  const outerRadius = ORBIT_BASE + (planetCount - 1) * ORBIT_STEP + OUTER_RADIUS_BUFFER;
  // inner sphere radius for above/below — sits inside the Oort cloud
  const innerRadius = outerRadius * 0.65;

  for (let i = 0; i < planetCount; i++) {
    const radius = ORBIT_BASE + i * ORBIT_STEP;
    // 8 orbital positions — equidistant on the orbital ring, Y=0
    for (let j = 0; j < 8; j++) {
      const angle = (j / 8) * Math.PI * 2;
      dots.push(
        <mesh key={`orbit-${i}-${j}`} geometry={DOT_GEO} material={DOT_MAT}
          position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]} />
      );
    }
  }

  // 20 above — upper hemisphere of inner sphere
  for (const [x, y, z] of fibonacciSphere(20, innerRadius, 0.1, 1)) {
    dots.push(
      <mesh key={`above-${x.toFixed(2)}-${z.toFixed(2)}`} geometry={DOT_GEO} material={DOT_MAT}
        position={[x, y, z]} />
    );
  }

  // 20 below — lower hemisphere of inner sphere
  for (const [x, y, z] of fibonacciSphere(20, innerRadius, -1, -0.1)) {
    dots.push(
      <mesh key={`below-${x.toFixed(2)}-${z.toFixed(2)}`} geometry={DOT_GEO} material={DOT_MAT}
        position={[x, y, z]} />
    );
  }

  // 50 outer positions — Fibonacci sphere (Oort cloud) enclosing entire system
  for (const [x, y, z] of fibonacciSphere(50, outerRadius)) {
    dots.push(
      <mesh key={`outer-${x.toFixed(2)}-${y.toFixed(2)}`} geometry={DOT_GEO} material={DOT_MAT}
        position={[x, y, z]} />
    );
  }

  return <>{dots}</>;
}

// ── orbit ring ────────────────────────────────────────────────────────────────
function OrbitRing({ radius }: { radius: number }) {
  const geo = useMemo(() => new THREE.RingGeometry(radius - 0.02, radius + 0.02, 96), [radius]);
  return (
    <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]}>
      <meshBasicMaterial color='rgba(255,255,255,0.08)' side={THREE.DoubleSide} transparent opacity={0.18} />
    </mesh>
  );
}

// ── planet mesh ───────────────────────────────────────────────────────────────
function PlanetMesh({
  planet, radius, speed, color, phaseOffset,
  isHovered, onHover, onHoverEnd, onClick,
}: {
  planet: Planet;
  radius: number;
  speed: number;
  color: string;
  phaseOffset: number;
  isHovered: boolean;
  onHover: () => void;
  onHoverEnd: () => void;
  onClick: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const angleRef = useRef(phaseOffset);

  useFrame((_, delta) => {
    angleRef.current += speed * delta;
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(angleRef.current) * radius;
      groupRef.current.position.z = Math.sin(angleRef.current) * radius;
    }
    invalidate();
  });

  const scale = isHovered ? 1.4 : 1;

  return (
    <group ref={groupRef}>
      <mesh
        scale={scale}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); onHover(); }}
        onPointerOut={onHoverEnd}
      >
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color={isHovered ? '#ffffff' : color} />
      </mesh>
    </group>
  );
}

// ── scene ─────────────────────────────────────────────────────────────────────
function Scene({
  planets, starColor, onPlanetClick, hoveredPlanet, onHover, onHoverEnd, showPositions,
}: {
  planets: Planet[];
  starColor: string;
  onPlanetClick: (planet: Planet) => void;
  hoveredPlanet: string | null;
  onHover: (name: string) => void;
  onHoverEnd: () => void;
  showPositions: boolean;
}) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={2} distance={80} />

      <OrbitControls enableDamping dampingFactor={0.08} minDistance={4} maxDistance={120} zoomSpeed={0.4} />

      {/* star */}
      <mesh>
        <sphereGeometry args={[1.8, 24, 24]} />
        <meshBasicMaterial color={starColor} />
      </mesh>

      {showPositions && <PositionDots planetCount={planets.length} />}

      {planets.map((planet, i) => {
        const radius = ORBIT_BASE + i * ORBIT_STEP;
        const speed  = ORBIT_SPEED / Math.sqrt(i + 1);
        const color  = PLANET_COLORS[i % PLANET_COLORS.length];
        const phase  = (i / planets.length) * Math.PI * 2;
        return (
          <group key={planet.name}>
            <OrbitRing radius={radius} />
            <PlanetMesh
              planet={planet}
              radius={radius}
              speed={speed}
              color={color}
              phaseOffset={phase}
              isHovered={hoveredPlanet === planet.name}
              onHover={() => onHover(planet.name)}
              onHoverEnd={onHoverEnd}
              onClick={() => onPlanetClick(planet)}
            />
          </group>
        );
      })}
    </>
  );
}

// ── tooltip ───────────────────────────────────────────────────────────────────
function Tooltip({ planet }: { planet: Planet | null }) {
  if (!planet) return null;
  const slots  = planet.populationSlots ?? [];
  const filled = slots.filter(s => s.occupant).length;
  return (
    <div style={{
      position: 'fixed', bottom: '90px', left: '50%', transform: 'translateX(-50%)',
      background: 'rgba(0,0,0,0.85)', border: '1px solid rgba(0,139,214,0.4)',
      borderRadius: '8px', padding: '10px 18px', color: '#fff',
      fontSize: '13px', lineHeight: '1.7', pointerEvents: 'none', zIndex: 10,
      textAlign: 'center',
    }}>
      <div style={{ color: '#7CBDBD', fontWeight: 'bold' }}>{planet.name}</div>
      <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '11px' }}>
        {planet.class.replace(/\d+$/, '')}
      </div>
      <div style={{ fontSize: '11px', marginTop: '2px' }}>
        {filled > 0 ? `${filled}/${slots.length} settlers` : 'Uninhabited'}
      </div>
      <div style={{ color: '#008bd6', fontSize: '11px', marginTop: '4px' }}>
        Click to land
      </div>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────
export const SystemView = () => {
  const { sector, activeSystem, setActivePlanet } = useGame();
  const navigate = useNavigate();
  const [hoveredPlanet,  setHoveredPlanet]  = useState<string | null>(null);
  const [showPositions,  setShowPositions]  = useState(true);

  useEffect(() => {
    document.body.style.cursor = hoveredPlanet ? 'pointer' : 'default';
    return () => { document.body.style.cursor = 'default'; };
  }, [hoveredPlanet]);

  if (!activeSystem || !sector) return null;

  const starColor = STAR_COLORS[activeSystem.systemStar] ?? '#FFDDAA';
  const hoveredPlanetData = activeSystem.systemPlanets.find(p => p.name === hoveredPlanet) ?? null;

  const handlePlanetClick = (planet: Planet) => {
    setActivePlanet(planet);
    navigate(`/${sector.sectorName}/system/${activeSystem.systemName}/planet/${planet.name}`);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 30, 40], fov: 55, near: 0.1, far: 1000 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        frameloop='always'
      >
        <Scene
          planets={activeSystem.systemPlanets}
          starColor={starColor}
          onPlanetClick={handlePlanetClick}
          hoveredPlanet={hoveredPlanet}
          onHover={setHoveredPlanet}
          onHoverEnd={() => setHoveredPlanet(null)}
          showPositions={showPositions}
        />
      </Canvas>

      <div style={{
        position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)',
        color: 'rgba(255,255,255,0.35)', fontSize: '11px', letterSpacing: '1px',
        pointerEvents: 'none', textTransform: 'uppercase',
      }}>
        {activeSystem.systemName} · {activeSystem.systemStar}
      </div>

      <button
        onClick={() => setShowPositions(p => !p)}
        style={{
          position: 'fixed', top: '80px', right: '24px',
          background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '6px', padding: '6px 12px', color: showPositions ? '#fff' : 'rgba(255,255,255,0.35)',
          fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer',
        }}
      >
        {showPositions ? 'Hide Positions' : 'Show Positions'}
      </button>

      <Tooltip planet={hoveredPlanetData} />

      <div style={{
        position: 'fixed', bottom: '64px', left: '50%', transform: 'translateX(-50%)',
        color: 'rgba(255,255,255,0.2)', fontSize: '10px', letterSpacing: '1px',
        pointerEvents: 'none', textTransform: 'uppercase',
      }}>
        scroll to zoom · drag to orbit · click a planet to land
      </div>
    </div>
  );
};
