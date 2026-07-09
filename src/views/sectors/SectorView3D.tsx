import { useRef, useState, useCallback, useMemo, useEffect, useContext } from 'react';
import { Canvas, useFrame, useThree, invalidate } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Link } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { AuthContext } from '../../non-game-pages/AuthProvider/context/AuthContext';
import { parseCoords } from '../../utils/system-generator/system-functions';
import type { System } from '../../utils/system-generator/generate-sector';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

// ── colours ──────────────────────────────────────────────────────────────────
const STAR_COLORS: Record<string, string> = {
  'Yellow-Dwarf':   '#FFD700',
  'Blue-Giant':     '#6699FF',
  'White-Dwarf':    '#EEEEFF',
  'Brown-Dwarf':    '#A0522D',
  'Red-Giant':      '#FF4422',
  'Red-Supergiant': '#FF2200',
  'Red-Dwarf':      '#FF5533',
};

const SCALE   = 0.55;
const Y_SCALE = 0.08;

function toVec3(cords: string, name = ''): THREE.Vector3 {
  const { x, y, z } = parseCoords(cords, name);
  // Guard against malformed coord strings producing NaN
  const fx = isFinite(x) ? x : 0;
  const fy = isFinite(y) ? y : 0;
  const fz = isFinite(z) ? z : 0;
  return new THREE.Vector3(fx * SCALE, fz * Y_SCALE, fy * SCALE);
}

// ── shared geometry (created once, never recreated) ───────────────────────────
const SPHERE_GEO  = new THREE.SphereGeometry(0.35, 7, 7);
const TORUS_GEO   = new THREE.TorusGeometry(0.65, 0.05, 6, 24);
const TORUS_MAT   = new THREE.MeshBasicMaterial({ color: '#7CBDBD' });

// ── line drawing using raw BufferGeometry — avoids LineSegmentsGeometry NaN bug
function DistanceLine({ from, to }: { from: THREE.Vector3; to: THREE.Vector3 }) {
  const geo = useMemo(() => {
    // Bail out if either endpoint is invalid
    if (!from.x && !from.y && !from.z) return null;
    if (!isFinite(from.x) || !isFinite(to.x)) return null;
    const g = new THREE.BufferGeometry().setFromPoints([from, to]);
    return g;
  }, [from, to]);

  if (!geo) return null;

  return (
    <line>
      <primitive object={geo} attach='geometry' />
      <lineBasicMaterial color='#008bd6' transparent opacity={0.25} />
    </line>
  );
}

function DistanceLines({
  from, positions, distancesMap, selectedName,
}: {
  from: THREE.Vector3;
  positions: Map<string, THREE.Vector3>;
  distancesMap: Record<string, Record<string, { distance: number }>>;
  selectedName: string;
}) {
  const neighbors = distancesMap[selectedName];
  if (!neighbors) return null;

  const nearest = Object.entries(neighbors)
    .sort((a, b) => a[1].distance - b[1].distance)
    .slice(0, 5);

  return (
    <>
      {nearest.map(([name]) => {
        const to = positions.get(name);
        if (!to) return null;
        return <DistanceLine key={name} from={from} to={to} />;
      })}
    </>
  );
}

// ── camera focus animation ────────────────────────────────────────────────────
function CameraFocuser({
  target, controlsRef, onDone,
}: {
  target: THREE.Vector3 | null;
  controlsRef: React.RefObject<OrbitControlsImpl>;
  onDone: () => void;
}) {
  const { camera } = useThree();
  const animating = useRef(false);
  const t         = useRef(0);
  const camStart  = useRef(new THREE.Vector3());
  const tgtStart  = useRef(new THREE.Vector3());
  const camEnd    = useRef(new THREE.Vector3());

  useEffect(() => {
    if (!target || !controlsRef.current) return;
    animating.current = true;
    t.current = 0;
    camStart.current.copy(camera.position);
    tgtStart.current.copy(controlsRef.current.target);
    camEnd.current.copy(target).add(new THREE.Vector3(8, 6, 8));
  }, [target]);

  useFrame((_, delta) => {
    if (!animating.current || !target || !controlsRef.current) return;
    t.current = Math.min(t.current + delta * 1.5, 1);
    const ease = 1 - Math.pow(1 - t.current, 3);
    camera.position.lerpVectors(camStart.current, camEnd.current, ease);
    controlsRef.current.target.lerpVectors(tgtStart.current, target, ease);
    controlsRef.current.update();
    if (t.current >= 1) { animating.current = false; onDone(); }
  });

  return null;
}

// ── star mesh — MeshBasicMaterial (unlit), no per-star pointLight ─────────────
function StarMesh({
  position, color, isSelected, isHovered,
  onClick, onPointerOver, onPointerOut,
}: {
  position: THREE.Vector3;
  color: string;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
}) {
  const meshRef   = useRef<THREE.Mesh>(null!);
  const targetScale = isSelected ? 1.6 : isHovered ? 1.3 : 1;
  const needsAnim  = useRef(false);

  useEffect(() => { needsAnim.current = true; invalidate(); }, [isSelected, isHovered]);

  useFrame((_, delta) => {
    if (!needsAnim.current) return;
    const s    = meshRef.current.scale.x;
    const next = THREE.MathUtils.lerp(s, targetScale, delta * 8);
    meshRef.current.scale.setScalar(next);
    if (Math.abs(next - targetScale) < 0.01) {
      meshRef.current.scale.setScalar(targetScale);
      needsAnim.current = false;
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={SPHERE_GEO}
      position={position}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={(e) => { e.stopPropagation(); onPointerOver(); }}
      onPointerOut={onPointerOut}
    >
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

// ── owned-system marker ───────────────────────────────────────────────────────
function OwnedMarker({ position, count }: { position: THREE.Vector3; count: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.6; });
  return (
    <group position={position}>
      <mesh ref={ref} geometry={TORUS_GEO} material={TORUS_MAT} />
      <Text position={[0, 1.1, 0]} fontSize={0.4} color='#7CBDBD' anchorX='center' anchorY='bottom' renderOrder={1}>
        {count > 1 ? `▲ ${count} colonies` : '▲ Your colony'}
      </Text>
    </group>
  );
}

// ── scene — no per-star lights, just one ambient + one directional ────────────
function Scene({
  systems, positions, distancesMap,
  selectedName, hoveredName, ownedSystemCounts,
  onSelect, onHover, onHoverEnd,
  focusTarget, onFocusDone, controlsRef,
}: {
  systems: System[];
  positions: Map<string, THREE.Vector3>;
  distancesMap: Record<string, Record<string, { distance: number }>>;
  selectedName: string | null;
  hoveredName: string | null;
  ownedSystemCounts: Map<string, number>;
  onSelect: (name: string) => void;
  onHover: (name: string) => void;
  onHoverEnd: () => void;
  focusTarget: THREE.Vector3 | null;
  onFocusDone: () => void;
  controlsRef: React.RefObject<OrbitControlsImpl>;
}) {
  const selectedPos = selectedName ? positions.get(selectedName) ?? null : null;

  // One-shot: trigger a render on the first frame after mount
  const didInit = useRef(false);
  useFrame(() => {
    if (!didInit.current) { didInit.current = true; invalidate(); }
  });

  return (
    <>
      <ambientLight intensity={0.6} />

      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.08}
        minDistance={3}
        maxDistance={200}
        zoomSpeed={0.3}
      />

      <CameraFocuser target={focusTarget} controlsRef={controlsRef} onDone={onFocusDone} />

      {systems.map((s) => {
        const p = positions.get(s.systemName);
        if (!p) return null;
        const color       = STAR_COLORS[s.systemStar] ?? '#AAAACC';
        const colonyCount = ownedSystemCounts.get(s.systemName) ?? 0;
        return (
          <group key={s.systemName}>
            <StarMesh
              position={p}
              color={color}
              isSelected={selectedName === s.systemName}
              isHovered={hoveredName === s.systemName}
              onClick={() => onSelect(s.systemName)}
              onPointerOver={() => onHover(s.systemName)}
              onPointerOut={onHoverEnd}
            />
            {colonyCount > 0 && <OwnedMarker position={p} count={colonyCount} />}
          </group>
        );
      })}

      {selectedName && selectedPos && (
        <DistanceLines
          from={selectedPos}
          positions={positions}
          distancesMap={distancesMap}
          selectedName={selectedName}
        />
      )}
    </>
  );
}

// ── main component ────────────────────────────────────────────────────────────
export const SectorView3D = () => {
  const { sector, setActiveSystem } = useGame();
  const { user } = useContext(AuthContext);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [hoveredName,  setHoveredName]  = useState<string | null>(null);
  const [focusTarget,  setFocusTarget]  = useState<THREE.Vector3 | null>(null);
  const controlsRef = useRef<OrbitControlsImpl>(null!);

  const ownedSystemCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const slot of (user?.claimedSlots ?? []) as string[]) {
      const sys = slot.split('/')[1];
      if (sys) map.set(sys, (map.get(sys) ?? 0) + 1);
    }
    return map;
  }, [user?.claimedSlots]);

  const positions = useMemo(() => {
    const map = new Map<string, THREE.Vector3>();
    sector?.systems.forEach(s => map.set(s.systemName, toVec3(s.cords, s.systemName)));
    return map;
  }, [sector]);

  const handleSelect = useCallback((name: string) => {
    setSelectedName(prev => {
      if (prev === name) { setFocusTarget(null); return null; }
      const p = positions.get(name);
      if (p) setFocusTarget(p.clone());
      return name;
    });
  }, [positions]);

  const selectedSystem = sector?.systems.find(s => s.systemName === selectedName) ?? null;

  if (!sector) return null;

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', position: 'relative' }}>
      <Canvas
        camera={{ position: [28, 75, 28], fov: 60, near: 0.1, far: 1000 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        frameloop='demand'
        onPointerMissed={() => { setSelectedName(null); setFocusTarget(null); invalidate(); }}
      >
        <Scene
          systems={sector.systems}
          positions={positions}
          distancesMap={sector.distancesMap}
          selectedName={selectedName}
          hoveredName={hoveredName}
          ownedSystemCounts={ownedSystemCounts}
          onSelect={handleSelect}
          onHover={setHoveredName}
          onHoverEnd={() => setHoveredName(null)}
          focusTarget={focusTarget}
          onFocusDone={() => setFocusTarget(null)}
          controlsRef={controlsRef}
        />
      </Canvas>

      {selectedSystem && (
        <div style={{
          position: 'fixed', top: '50%', right: '24px', transform: 'translateY(-50%)',
          background: 'rgba(0,0,0,0.82)', border: '1px solid rgba(0,139,214,0.4)',
          borderRadius: '8px', padding: '16px', minWidth: '160px',
          color: '#fff', fontSize: '13px', lineHeight: '1.7', zIndex: 10,
        }}>
          <div style={{ color: '#7CBDBD', fontWeight: 'bold', marginBottom: '2px' }}>
            {selectedSystem.systemName}
          </div>
          {(ownedSystemCounts.get(selectedSystem.systemName) ?? 0) > 0 && (
            <div style={{ color: '#7CBDBD', fontSize: '10px', letterSpacing: '1px', marginBottom: '4px', opacity: 0.8 }}>
              ▲ {ownedSystemCounts.get(selectedSystem.systemName) === 1
                ? 'Your colony'
                : `${ownedSystemCounts.get(selectedSystem.systemName)} colonies`}
            </div>
          )}
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>
            {selectedSystem.systemStar}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>
            {selectedSystem.systemPlanets.length} planet{selectedSystem.systemPlanets.length !== 1 ? 's' : ''}
          </div>
          <Link
            to={`/${sector.sectorName}/system/${selectedSystem.systemName}`}
            onClick={() => setActiveSystem(selectedSystem)}
            style={{
              display: 'block', textAlign: 'center', color: '#008bd6',
              textDecoration: 'none', fontSize: '11px', letterSpacing: '1px',
              textTransform: 'uppercase', border: '1px solid rgba(0,139,214,0.4)',
              borderRadius: '4px', padding: '5px 0',
            }}
          >
            Enter system →
          </Link>
        </div>
      )}

      <div style={{
        position: 'fixed', bottom: '64px', left: '50%', transform: 'translateX(-50%)',
        color: 'rgba(255,255,255,0.2)', fontSize: '10px', letterSpacing: '1px',
        pointerEvents: 'none', textTransform: 'uppercase',
      }}>
        scroll to zoom · drag to orbit · click a star
      </div>
    </div>
  );
};
