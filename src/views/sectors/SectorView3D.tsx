import { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree, invalidate } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Link } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { parseCoords } from '../../utils/system-generator/system-functions';
import type { System, NCO } from '../../utils/system-generator/generate-sector';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

// ── colours — match the seed script's temp_to_color() palette ────────────────
const STAR_COLORS: Record<string, string> = {
  'Yellow-Dwarf':   '#fff2cc',
  'Blue-Giant':     '#aac0ff',
  'White-Dwarf':    '#cce0ff',
  'Brown-Dwarf':    '#ff8833',
  'Red-Giant':      '#ff6622',
  'Red-Supergiant': '#ff2200',
  'Red-Dwarf':      '#ff6622',
};

// Sol's known scene-space position (R-23_23_23 → toVec3)
const SOL_SCENE_POS = new THREE.Vector3(23 * 0.55, 23 * 0.08, 23 * 0.55);

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
const SPHERE_GEO = new THREE.SphereGeometry(0.35, 7, 7);
const NCO_GEO    = new THREE.OctahedronGeometry(0.3, 0);

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
  position, color, scale: baseScale = 1, isSelected, isHovered,
  onClick, onPointerOver, onPointerOut,
}: {
  position: THREE.Vector3;
  color: string;
  scale?: number;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
}) {
  const meshRef   = useRef<THREE.Mesh>(null!);
  const targetScale = (isSelected ? 1.6 : isHovered ? 1.3 : 1) * baseScale;
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

// ── NCO mesh ─────────────────────────────────────────────────────────────────
function NCOMesh({
  position, isSelected, isHovered, onClick, onPointerOver, onPointerOut,
}: {
  position: THREE.Vector3;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const targetScale = isSelected ? 1.6 : isHovered ? 1.3 : 1;
  const needsAnim = useRef(false);

  useEffect(() => { needsAnim.current = true; invalidate(); }, [isSelected, isHovered]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.8;
    if (needsAnim.current) {
      const s = meshRef.current.scale.x;
      const next = THREE.MathUtils.lerp(s, targetScale, delta * 8);
      meshRef.current.scale.setScalar(next);
      if (Math.abs(next - targetScale) < 0.01) {
        meshRef.current.scale.setScalar(targetScale);
        needsAnim.current = false;
      }
    }
    invalidate();
  });

  return (
    <mesh
      ref={meshRef}
      geometry={NCO_GEO}
      position={position}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={(e) => { e.stopPropagation(); onPointerOver(); }}
      onPointerOut={onPointerOut}
    >
      <meshBasicMaterial color={isSelected ? '#ff6644' : isHovered ? '#ff9966' : '#cc3311'} />
    </mesh>
  );
}

// ── scene — no per-star lights, just one ambient + one directional ────────────
function Scene({
  systems, ncos, positions, ncoPositions, distancesMap,
  selectedName, hoveredName,
  onSelect, onHover, onHoverEnd,
  selectedNCO, hoveredNCO,
  onSelectNCO, onHoverNCO, onHoverNCOEnd,
  focusTarget, onFocusDone, controlsRef,
}: {
  systems: System[];
  ncos: NCO[];
  positions: Map<string, THREE.Vector3>;
  ncoPositions: Map<string, THREE.Vector3>;
  distancesMap: Record<string, Record<string, { distance: number }>>;
  selectedName: string | null;
  hoveredName: string | null;
  onSelect: (name: string) => void;
  onHover: (name: string) => void;
  onHoverEnd: () => void;
  selectedNCO: string | null;
  hoveredNCO: string | null;
  onSelectNCO: (name: string) => void;
  onHoverNCO: (name: string) => void;
  onHoverNCOEnd: () => void;
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
        const isSol = s.systemName === 'Sol';
        const color = isSol ? '#fff5cc' : (s.starColor ?? STAR_COLORS[s.systemStar] ?? '#AAAACC');
        const mag = s.starMagnitude ?? 9;
        const starScale = isSol ? 1.8 : Math.max(0.4, Math.min(1.4, 1.6 - mag * 0.1));
        return (
          <group key={s.systemName}>
            {isSol && (
              <mesh position={p} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.85, 1.05, 48]} />
                <meshBasicMaterial color='#fff5cc' transparent opacity={0.25} side={THREE.DoubleSide} />
              </mesh>
            )}
            <StarMesh
              position={p}
              color={color}
              scale={starScale}
              isSelected={selectedName === s.systemName}
              isHovered={hoveredName === s.systemName}
              onClick={() => onSelect(s.systemName)}
              onPointerOver={() => onHover(s.systemName)}
              onPointerOut={onHoverEnd}
            />
            <Text
              position={[p.x, p.y + 0.7, p.z]}
              fontSize={isSol ? 0.45 : 0.35}
              color={selectedName === s.systemName ? '#7CBDBD' : hoveredName === s.systemName ? '#ffffff' : isSol ? 'rgba(255,245,200,0.8)' : 'rgba(255,255,255,0.45)'}
              anchorX='center'
              anchorY='bottom'
              renderOrder={2}
            >
              {s.systemName}
            </Text>
          </group>
        );
      })}

      {ncos.map((n) => {
        const p = ncoPositions.get(n.name);
        if (!p) return null;
        return (
          <NCOMesh
            key={n.name}
            position={p}
            isSelected={selectedNCO === n.name}
            isHovered={hoveredNCO === n.name}
            onClick={() => onSelectNCO(n.name)}
            onPointerOver={() => onHoverNCO(n.name)}
            onPointerOut={onHoverNCOEnd}
          />
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
  const { sector, setActiveSystem, setActiveNCO } = useGame();
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [hoveredName,  setHoveredName]  = useState<string | null>(null);
  const [selectedNCO,  setSelectedNCO]  = useState<string | null>(null);
  const [hoveredNCO,   setHoveredNCO]   = useState<string | null>(null);
  const [focusTarget,  setFocusTarget]  = useState<THREE.Vector3 | null>(null);
  const controlsRef = useRef<OrbitControlsImpl>(null!);

  // Fly to Sol as soon as the sector data is ready
  const didInitFocus = useRef(false);
  useEffect(() => {
    if (sector && !didInitFocus.current) {
      didInitFocus.current = true;
      setFocusTarget(SOL_SCENE_POS.clone());
    }
  }, [sector]);

  const positions = useMemo(() => {
    const map = new Map<string, THREE.Vector3>();
    sector?.systems.forEach(s => map.set(s.systemName, toVec3(s.cords, s.systemName)));
    return map;
  }, [sector]);

  const ncoPositions = useMemo(() => {
    const map = new Map<string, THREE.Vector3>();
    sector?.NCO.forEach(n => map.set(n.name, toVec3(n.cords, n.name)));
    return map;
  }, [sector]);

  const handleSelect = useCallback((name: string) => {
    setSelectedNCO(null);
    setSelectedName(prev => {
      if (prev === name) { setFocusTarget(null); return null; }
      const p = positions.get(name);
      if (p) setFocusTarget(p.clone());
      return name;
    });
  }, [positions]);

  const handleSelectNCO = useCallback((name: string) => {
    setSelectedName(null);
    setSelectedNCO(prev => {
      if (prev === name) { setFocusTarget(null); return null; }
      const p = ncoPositions.get(name);
      if (p) setFocusTarget(p.clone());
      return name;
    });
  }, [ncoPositions]);

  const selectedSystem = sector?.systems.find(s => s.systemName === selectedName) ?? null;
  const selectedNCOData = sector?.NCO.find(n => n.name === selectedNCO) ?? null;

  if (!sector) return null;

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', position: 'relative' }}>
      <Canvas
        camera={{ position: [SOL_SCENE_POS.x + 8, SOL_SCENE_POS.y + 55, SOL_SCENE_POS.z + 8], fov: 60, near: 0.1, far: 1000 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        frameloop='demand'
        onPointerMissed={() => { setSelectedName(null); setFocusTarget(null); invalidate(); }}
      >
        <Scene
          systems={sector.systems}
          ncos={sector.NCO}
          positions={positions}
          ncoPositions={ncoPositions}
          distancesMap={sector.distancesMap}
          selectedName={selectedName}
          hoveredName={hoveredName}
          onSelect={handleSelect}
          onHover={setHoveredName}
          onHoverEnd={() => setHoveredName(null)}
          selectedNCO={selectedNCO}
          hoveredNCO={hoveredNCO}
          onSelectNCO={handleSelectNCO}
          onHoverNCO={setHoveredNCO}
          onHoverNCOEnd={() => setHoveredNCO(null)}
          focusTarget={focusTarget}
          onFocusDone={() => setFocusTarget(null)}
          controlsRef={controlsRef}
        />
      </Canvas>

      {selectedNCOData && (
        <div style={{
          position: 'fixed', top: '50%', right: '24px', transform: 'translateY(-50%)',
          background: 'rgba(0,0,0,0.82)', border: '1px solid rgba(204,51,17,0.5)',
          borderRadius: '8px', padding: '16px', minWidth: '160px',
          color: '#fff', fontSize: '13px', lineHeight: '1.7', zIndex: 10,
        }}>
          <div style={{ color: '#ff6644', fontWeight: 'bold', marginBottom: '2px' }}>
            {selectedNCOData.name}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>
            {selectedNCOData.type}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>
            Effect: {selectedNCOData.effect}
          </div>
          <Link
            to={`/${sector.sectorName}/${selectedNCOData.name}`}
            onClick={() => setActiveNCO(selectedNCOData)}
            style={{
              display: 'block', textAlign: 'center', color: '#ff6644',
              textDecoration: 'none', fontSize: '11px', letterSpacing: '1px',
              textTransform: 'uppercase', border: '1px solid rgba(204,51,17,0.5)',
              borderRadius: '4px', padding: '5px 0',
            }}
          >
            Enter →
          </Link>
        </div>
      )}

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
