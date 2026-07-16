import { useRef, useState, useEffect, useMemo } from 'react';
import React from 'react';
import { Canvas, useFrame, invalidate } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { Planet } from '../../types/planet-interface';

const STAR_COLORS: Record<string, string> = {
  'Yellow-Dwarf':   '#fff2cc',
  'Blue-Giant':     '#aac0ff',
  'White-Dwarf':    '#cce0ff',
  'Brown-Dwarf':    '#ff8833',
  'Red-Giant':      '#ff6622',
  'Red-Supergiant': '#ff2200',
  'Red-Dwarf':      '#ff6622',
};

// Per planet-class color fallback for non-Sol systems
const PLANET_CLASS_COLORS: Record<string, string> = {
  Rocky:       '#9a8f7a',
  Temperate:   '#4a90c4',
  Ocean:       '#2255aa',
  Frozen:      '#aaccee',
  Lava:        '#cc4422',
  Gas:         '#c8883a',
  Desert:      '#c8944a',
  Greenhouse:  '#d4aa66',
};

// Sol planet config: name → { color, size, ring? }
type PlanetConfig = { color: string; size: number; ring?: boolean };
const SOL_PLANET_CONFIG: Record<string, PlanetConfig> = {
  'Sol-1': { color: '#8a8a8a', size: 0.28 },              // Mercury — gray
  'Sol-2': { color: '#d4b483', size: 0.48 },              // Venus — pale tan
  'Sol-3': { color: '#2a6ea6', size: 0.50 },              // Earth — blue
  'Sol-4': { color: '#b84422', size: 0.35 },              // Mars — red-orange
  'Sol-5': { color: '#7a6a5a', size: 0.18 },              // Asteroid Belt — dusty gray
  'Sol-6': { color: '#c8883a', size: 1.10 },              // Jupiter — orange-brown
  'Sol-7': { color: '#e4d191', size: 0.95, ring: true },  // Saturn — pale gold + ring
  'Sol-8': { color: '#7de8e8', size: 0.65 },              // Uranus — teal
  'Sol-9': { color: '#3f54ba', size: 0.60 },              // Neptune — deep blue
};

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
  planet, radius, speed, color, size, ring, phaseOffset,
  isHovered, onHover, onHoverEnd, onClick,
}: {
  planet: Planet;
  radius: number;
  speed: number;
  color: string;
  size: number;
  ring?: boolean;
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

  const displayScale = isHovered ? 1.35 : 1;
  const ringInner = size * 1.4;
  const ringOuter = size * 2.3;

  return (
    <group ref={groupRef}>
      <mesh
        scale={displayScale}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); onHover(); }}
        onPointerOut={onHoverEnd}
      >
        <sphereGeometry args={[size, 20, 20]} />
        <meshBasicMaterial color={isHovered ? '#ffffff' : color} />
      </mesh>
      {ring && (
        <mesh rotation={[-Math.PI / 3.5, 0, 0.3]} scale={displayScale}>
          <ringGeometry args={[ringInner, ringOuter, 64]} />
          <meshBasicMaterial color='#d4c472' transparent opacity={0.55} side={THREE.DoubleSide} />
        </mesh>
      )}
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
        const phase  = (i / planets.length) * Math.PI * 2;
        const solCfg = SOL_PLANET_CONFIG[planet.name];
        const baseClass = planet.class.replace(/\d+$/, '');
        const color = solCfg?.color ?? PLANET_CLASS_COLORS[baseClass] ?? '#aaaaaa';
        const size  = solCfg?.size ?? 0.5;
        const ring  = solCfg?.ring;
        return (
          <group key={planet.name}>
            <OrbitRing radius={radius} />
            <PlanetMesh
              planet={planet}
              radius={radius}
              speed={speed}
              color={color}
              size={size}
              ring={ring}
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
