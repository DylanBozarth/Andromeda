import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Canvas,
  useFrame,
  useThree,
  type ThreeEvent,
} from "@react-three/fiber";
import { Edges, Line, OrbitControls, useTexture } from "@react-three/drei";
import {
  ArrowHelper,
  BufferAttribute,
  Group,
  LineSegments,
  Mesh,
  MOUSE,
  Quaternion,
  Vector3,
} from "three";
import {
  clampToCollision,
  maneuverDuration,
  planDirection,
  planManeuver,
  planOrbit,
  stateAt,
  type Body,
  type Maneuver,
} from "./sim";
import yellowStarUrl from "./assets/celestial-objects/yellow-star.jpg";
import barrenPlanetUrl from "./assets/celestial-objects/barren-planet.jpg";

const MAX_ACCEL = 1; // units / s² (fast — testing value)
const CRUISE_SPEED = 5; // coast speed for a "set direction" maneuver (units / s)
const COAST_PREVIEW_TIME = 8; // seconds of coasting drawn in a direction preview
const ALT_PER_PIXEL = 0.25; // altitude units gained per pixel of vertical mouse movement
const FORWARD = new Vector3(0, 0, 1); // ship's nose in local space (engines at -Z)
const TURN_RATE = 4; // how fast the ship slews to face its thrust direction

// Celestial bodies. Sizes use a realistic ~109:1 star-to-rocky-planet radius
// ratio; distances are compressed so both are visible (true AU would be ~46k units).
const SUN_RADIUS = 218;
const SUN_POSITION: [number, number, number] = [0, 0, -800];
const PLANET_RADIUS = 2;
const PLANET_POSITION: [number, number, number] = [30, 0, 0];

const ORBIT_RADIUS = PLANET_RADIUS * 4; // orbit altitude around the rocky planet
const ORBIT_PERIOD = 12; // seconds per orbit
const ORBIT_ANGULAR_SPEED = (2 * Math.PI) / ORBIT_PERIOD;
const ORBIT_SELECT_DISTANCE = ORBIT_RADIUS * 1.5; // click within this of the planet to orbit it

const SHIP_SCALE = 0.1; // ship rendered small, closer to true scale vs. planets
const SHIP_COLLISION_RADIUS = SHIP_SCALE * 1.5;

// Solid bodies the ship can't fly through.
const BODIES: Body[] = [
  { center: new Vector3(...PLANET_POSITION), radius: PLANET_RADIUS },
  { center: new Vector3(...SUN_POSITION), radius: SUN_RADIUS },
];

type ViewId = "system" | "navigation";
const VIEWS: { id: ViewId; label: string }[] = [
  { id: "system", label: "System" },
  { id: "navigation", label: "Navigation" },
];

interface MenuState {
  x: number; // screen position for the menu
  y: number;
  course: Maneuver; // arrive-at-rest at the placed point
  direction: Maneuver; // head off toward the placed point and coast forever
  orbitPlanet: Maneuver; // fly to the rocky planet and orbit it
  canOrbit: boolean; // whether the placed point is near enough to a planet
}

// In-progress placement of a 3D destination: right-click sets X/Z, then moving
// the mouse up/down sets altitude (no button held), and a click confirms.
interface PlacementState {
  anchorX: number;
  anchorZ: number;
  startClientY: number;
  altitude: number;
  preview: Maneuver;
}

function restManeuver(position: Vector3, time: number): Maneuver {
  return {
    startTime: time,
    start: { position: position.clone(), velocity: new Vector3() },
    segments: [],
  };
}

// A maneuver that ends with nonzero velocity coasts forever (set-direction).
function isCoasting(maneuver: Maneuver): boolean {
  const end = stateAt(maneuver, maneuver.startTime + maneuverDuration(maneuver));
  return end.velocity.length() > 1e-3;
}

function samplePath(maneuver: Maneuver, segmentsCount = 64): Vector3[] {
  // Extend the sample window so the ongoing path is visible: one full loop for
  // an orbit, or a stretch of coast for a set-direction maneuver.
  let total = maneuverDuration(maneuver);
  if (maneuver.orbit) {
    total += (2 * Math.PI) / Math.abs(maneuver.orbit.angularSpeed);
  } else if (isCoasting(maneuver)) {
    total += COAST_PREVIEW_TIME;
  }
  if (maneuver.stopTime !== undefined) {
    total = Math.min(total, maneuver.stopTime - maneuver.startTime);
  }
  if (total <= 0) return [];
  const pts: Vector3[] = [];
  for (let i = 0; i <= segmentsCount; i++) {
    pts.push(
      stateAt(maneuver, maneuver.startTime + (total * i) / segmentsCount)
        .position,
    );
  }
  return pts;
}

const fmt = (v: Vector3) =>
  `(${v.x.toFixed(1)}, ${v.y.toFixed(1)}, ${v.z.toFixed(1)})`;

// Human-readable travel time in hours and minutes, e.g. "1h 3m", "15m".
function formatDuration(seconds: number): string {
  const totalMin = Math.round(Math.max(0, seconds) / 60);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

// A deep-space starfield as a CSS background of many radial-gradient points
// (computed once at load, since Math.random isn't allowed during render).
// Painted behind the transparent canvas.
function buildStarfield(): string {
  const w = typeof window !== "undefined" ? window.innerWidth : 1920;
  const h = typeof window !== "undefined" ? window.innerHeight : 1080;
  // Subtle stellar color variation: white, blue-white, warm.
  const palette = ["255,255,255", "200,216,255", "255,238,214"];
  const layers: string[] = [];

  for (let i = 0; i < 320; i++) {
    const x = Math.floor(Math.random() * w);
    const y = Math.floor(Math.random() * h);
    const r = Math.random();
    const bright = r > 0.9; // ~10% are prominent
    const size = (bright ? 1.8 + Math.random() * 1.4 : 0.8 + Math.random() * 1.0).toFixed(1);
    const alpha = (bright ? 0.95 : 0.45 + Math.random() * 0.45).toFixed(2);
    const col = palette[Math.floor(Math.random() * palette.length)];
    layers.push(
      `radial-gradient(${size}px ${size}px at ${x}px ${y}px, rgba(${col},${alpha}) 0%, rgba(${col},${alpha}) 45%, transparent 100%)`,
    );
    // Soft glow halo around the brightest stars.
    if (bright) {
      layers.push(
        `radial-gradient(${(Number(size) * 3).toFixed(1)}px ${(Number(size) * 3).toFixed(1)}px at ${x}px ${y}px, rgba(${col},0.18) 0%, transparent 70%)`,
      );
    }
  }
  return layers.join(", ");
}
const STARFIELD = buildStarfield();

// Navigation-mode markers: velocity arrow, altitude stem, ground projection,
// and a live position/velocity readout. Updated imperatively each frame so it
// never triggers React re-renders.
function NavMarkers({
  maneuver,
  readoutRef,
}: {
  maneuver: Maneuver;
  readoutRef: React.RefObject<HTMLDivElement | null>;
}) {
  const arrowRef = useRef<ArrowHelper>(null);
  const stemRef = useRef<LineSegments>(null);
  const markerRef = useRef<Mesh>(null);

  const arrowArgs = useMemo<
    [Vector3, Vector3, number, number, number, number]
  >(() => [FORWARD, new Vector3(), 1, 0x66ccff, 0.5, 0.3], []);
  const stemArgs = useMemo<[Float32Array, number]>(
    () => [new Float32Array(6), 3],
    [],
  );

  useFrame((state) => {
    const { position, velocity } = stateAt(maneuver, state.clock.elapsedTime);
    const speed = velocity.length();

    const arrow = arrowRef.current;
    if (arrow) {
      arrow.position.copy(position);
      if (speed > 1e-6) {
        arrow.setDirection(velocity.clone().normalize());
        arrow.setLength(speed * 1.5, 0.5, 0.3);
        arrow.visible = true;
      } else {
        arrow.visible = false;
      }
    }

    const stem = stemRef.current;
    if (stem) {
      const pos = stem.geometry.getAttribute("position") as BufferAttribute;
      pos.setXYZ(0, position.x, position.y, position.z);
      pos.setXYZ(1, position.x, 0, position.z);
      pos.needsUpdate = true;
    }

    if (markerRef.current)
      markerRef.current.position.set(position.x, 0, position.z);

    if (readoutRef.current) {
      readoutRef.current.textContent =
        `Ship\n  pos    ${fmt(position)}\n` +
        `  vel    ${fmt(velocity)}\n` +
        `  speed  ${speed.toFixed(2)} u/s`;
    }
  });

  return (
    <>
      <arrowHelper ref={arrowRef} args={arrowArgs} />
      <lineSegments ref={stemRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={stemArgs} />
        </bufferGeometry>
        <lineBasicMaterial color="#4488cc" />
      </lineSegments>
      <mesh ref={markerRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.35, 0.5, 24]} />
        <meshBasicMaterial color="#66ccff" />
      </mesh>
    </>
  );
}

// Sun and rocky planet. Textured in the system view; flat monocolor balls in
// the navigation view for a clean tactical look.
function CelestialBodies({ navMode }: { navMode: boolean }) {
  const [sunMap, planetMap] = useTexture([yellowStarUrl, barrenPlanetUrl]);
  return (
    <>
      <mesh position={SUN_POSITION}>
        <sphereGeometry args={[SUN_RADIUS, 64, 64]} />
        {navMode ? (
          <meshBasicMaterial color="#ffd24a" />
        ) : (
          <meshBasicMaterial map={sunMap} />
        )}
      </mesh>
      <pointLight
        position={SUN_POSITION}
        intensity={2.5}
        decay={0}
        color="#fff3d6"
      />

      <mesh position={PLANET_POSITION}>
        <sphereGeometry args={[PLANET_RADIUS, 48, 48]} />
        {navMode ? (
          <meshBasicMaterial color="#9b8f80" />
        ) : (
          <meshStandardMaterial map={planetMap} />
        )}
      </mesh>
    </>
  );
}

// A green triangle reticle around the ship that faces the camera and keeps a
// constant on-screen size (scaled by distance, so it doesn't shrink on zoom-out).
function ShipMarker({ shipRef }: { shipRef: React.RefObject<Mesh | null> }) {
  const groupRef = useRef<Group>(null);
  const camera = useThree((s) => s.camera);

  const points = useMemo(() => {
    const verts = [90, 210, 330].map((deg) => {
      const a = (deg * Math.PI) / 180;
      return new Vector3(Math.cos(a), Math.sin(a), 0);
    });
    return [...verts, verts[0]]; // closed loop
  }, []);

  useFrame(() => {
    const g = groupRef.current;
    const ship = shipRef.current;
    if (!g || !ship) return;
    g.position.copy(ship.position);
    g.quaternion.copy(camera.quaternion); // billboard toward the camera
    g.scale.setScalar(camera.position.distanceTo(ship.position) * 0.035);
  });

  return (
    <group ref={groupRef}>
      <Line points={points} color="#39ff7a" lineWidth={2} />
    </group>
  );
}

interface OrbitControlsHandle {
  target: Vector3;
  update: () => void;
}

function Scene({
  maneuver,
  preview,
  navMode,
  placing,
  follow,
  centerSignal,
  movementKeys,
  readoutRef,
  onPlaceStart,
  onConfirm,
  onBackgroundClick,
  timeRef,
}: {
  maneuver: Maneuver;
  preview: Maneuver | null;
  navMode: boolean;
  placing: boolean;
  follow: boolean;
  centerSignal: number;
  movementKeys: React.MutableRefObject<Set<string>>;
  readoutRef: React.RefObject<HTMLDivElement | null>;
  onPlaceStart: (anchorX: number, anchorZ: number, startClientY: number) => void;
  onConfirm: (clientX: number, clientY: number) => void;
  onBackgroundClick: () => void;
  timeRef: React.MutableRefObject<number>;
}) {
  const shipRef = useRef<Mesh>(null);
  const exhaustRef = useRef<Mesh>(null);
  const camera = useThree((s) => s.camera);
  const controls = useThree(
    (s) => s.controls,
  ) as unknown as OrbitControlsHandle | null;

  // Recenter the orbit pivot (and pan the camera) onto the ship's current
  // position, preserving the current viewing angle and distance.
  const centerOnShip = useCallback(() => {
    const ship = shipRef.current;
    if (!ship || !controls) return;
    const offset = camera.position.clone().sub(controls.target);
    controls.target.copy(ship.position);
    camera.position.copy(ship.position).add(offset);
    controls.update();
  }, [camera, controls]);

  useEffect(() => {
    if (centerSignal > 0) centerOnShip();
  }, [centerSignal, centerOnShip]);

  const committedPath = useMemo(() => samplePath(maneuver), [maneuver]);
  const committedEnd = useMemo(
    () =>
      stateAt(maneuver, maneuver.startTime + maneuverDuration(maneuver))
        .position,
    [maneuver],
  );

  const previewPath = useMemo(
    () => (preview ? samplePath(preview) : []),
    [preview],
  );
  const previewEnd = useMemo(
    () =>
      preview
        ? stateAt(preview, preview.startTime + maneuverDuration(preview))
            .position
        : null,
    [preview],
  );
  const previewBase = useMemo(
    () => (previewEnd ? new Vector3(previewEnd.x, 0, previewEnd.z) : null),
    [previewEnd],
  );
  const previewCoasting = useMemo(
    () => (preview ? isCoasting(preview) : false),
    [preview],
  );
  const committedCoasting = useMemo(() => isCoasting(maneuver), [maneuver]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    timeRef.current = t;
    const ship = shipRef.current;
    if (!ship) return;

    const { position, velocity, accel } = stateAt(maneuver, t);
    ship.position.copy(position);

    // Point the nose along thrust (engines face backward); fall back to the
    // travel direction when coasting. Slew gradually so the flip is visible.
    const thrusting = accel.lengthSq() > 1e-12;
    const dir = thrusting ? accel : velocity;
    if (dir.lengthSq() > 1e-12) {
      const target = new Quaternion().setFromUnitVectors(
        FORWARD,
        dir.clone().normalize(),
      );
      ship.quaternion.slerp(target, 1 - Math.exp(-TURN_RATE * delta));
    }

    if (exhaustRef.current) exhaustRef.current.visible = thrusting;

    // Lock-and-follow: keep the ship centered by shifting both the orbit pivot
    // and the camera by the same delta, preserving the user's angle and zoom.
    if (follow && controls) {
      const shift = position.clone().sub(controls.target);
      controls.target.add(shift);
      camera.position.add(shift);
      controls.update();
    }

    // WASD pans the camera across the horizontal plane, relative to its facing.
    const keys = movementKeys.current;
    if (controls && keys.size > 0) {
      const forward = new Vector3().subVectors(controls.target, camera.position);
      forward.y = 0;
      if (forward.lengthSq() > 1e-6) {
        forward.normalize();
        const right = new Vector3(-forward.z, 0, forward.x);
        const move = new Vector3();
        if (keys.has("KeyW")) move.add(forward);
        if (keys.has("KeyS")) move.sub(forward);
        if (keys.has("KeyD")) move.add(right);
        if (keys.has("KeyA")) move.sub(right);
        if (move.lengthSq() > 0) {
          const dist = camera.position.distanceTo(controls.target);
          move.normalize().multiplyScalar(dist * 1.2 * delta);
          controls.target.add(move);
          camera.position.add(move);
          controls.update();
        }
      }
    }
  });

  // Right-click reliably fires onContextMenu (unlike onPointerDown for the
  // right button), so we start placement here.
  const handleContextMenu = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    e.nativeEvent.preventDefault();
    onPlaceStart(e.point.x, e.point.z, e.nativeEvent.clientY);
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (placing) onConfirm(e.nativeEvent.clientX, e.nativeEvent.clientY);
    else onBackgroundClick();
  };

  return (
    <>
      <ambientLight intensity={navMode ? 0.7 : 0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      {/* Invisible reference plane (y=0): right-click to place, click to confirm/dismiss. */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        onContextMenu={handleContextMenu}
        onClick={handleClick}
      >
        <planeGeometry args={[400, 400]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <mesh ref={shipRef} scale={SHIP_SCALE}>
        <boxGeometry args={[1, 1, 3]} />
        <meshStandardMaterial
          color="orange"
          emissive={navMode ? "#ff8a1e" : "#000000"}
          emissiveIntensity={navMode ? 0.5 : 0}
        />
        {navMode && <Edges color="white" />}
        {/* Engine exhaust at the back (-Z), shown while thrusting. */}
        <mesh
          ref={exhaustRef}
          position={[0, 0, -2.1]}
          rotation={[-Math.PI / 2, 0, 0]}
          visible={false}
        >
          <coneGeometry args={[0.35, 1.3, 12]} />
          <meshBasicMaterial color="#66ccff" transparent opacity={0.85} />
        </mesh>
      </mesh>

      <Suspense fallback={null}>
        <CelestialBodies navMode={navMode} />
      </Suspense>

      {/* Committed course (solid cyan) — navigation view only. */}
      {navMode && committedPath.length > 1 && (
        <>
          <Line points={committedPath} color="cyan" lineWidth={1.5} />
          {!committedCoasting && !maneuver.orbit && (
            <mesh position={committedEnd}>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshBasicMaterial color="cyan" />
            </mesh>
          )}
        </>
      )}

      {/* Candidate course + vertical altitude guide (yellow). */}
      {previewPath.length > 1 && previewEnd && previewBase && (
        <>
          <Line points={previewPath} color="yellow" lineWidth={1} dashed />
          {!previewCoasting && !preview?.orbit && (
            <>
              <Line
                points={[previewBase, previewEnd]}
                color="#ffcc66"
                lineWidth={1}
              />
              <mesh position={previewEnd}>
                <sphereGeometry args={[0.25, 16, 16]} />
                <meshBasicMaterial color="yellow" transparent opacity={0.8} />
              </mesh>
              <mesh position={previewBase}>
                <sphereGeometry args={[0.12, 12, 12]} />
                <meshBasicMaterial color="#ffcc66" />
              </mesh>
            </>
          )}
        </>
      )}

      {navMode && (
        <>
          <NavMarkers maneuver={maneuver} readoutRef={readoutRef} />
          <ShipMarker shipRef={shipRef} />
        </>
      )}

      <OrbitControls
        makeDefault
        enabled={!placing}
        enablePan={false}
        mouseButtons={{ LEFT: MOUSE.ROTATE, MIDDLE: MOUSE.DOLLY }}
      />
    </>
  );
}

interface MenuAction {
  label: string;
  enabled: boolean;
  preview: Maneuver | null; // shown while hovering the action
  onSelect: () => void;
}

export default function App() {
  const timeRef = useRef(0);
  const placeRef = useRef<PlacementState | null>(null);
  const movementKeys = useRef(new Set<string>());
  const navReadoutRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<ViewId>("system");
  const [maneuver, setManeuver] = useState<Maneuver>(() =>
    restManeuver(new Vector3(0, 0, 0), 0),
  );
  const [menu, setMenu] = useState<MenuState | null>(null);
  const [placing, setPlacing] = useState<PlacementState | null>(null);
  const [hoveredPreview, setHoveredPreview] = useState<Maneuver | null>(null);
  const [centerSignal, setCenterSignal] = useState(0);
  const [follow, setFollow] = useState(true);
  const centerOnShip = () => setCenterSignal((s) => s + 1);

  const selectView = (id: ViewId) => {
    setViewMode(id);
    if (id === "system") centerOnShip(); // recenter when entering system view
  };
  // While placing, show the live placement preview; with the menu open, show the
  // hovered action's preview, otherwise the default enabled action (orbit when a
  // planet is selected, otherwise the course).
  const menuDefaultPreview = menu
    ? menu.canOrbit
      ? menu.orbitPlanet
      : menu.course
    : null;
  const preview = placing?.preview ?? hoveredPreview ?? menuDefaultPreview;
  const navMode = viewMode === "navigation";

  const planToTarget = useCallback(
    (target: Vector3, now: number): Maneuver => {
      const current = stateAt(maneuver, now);
      return clampToCollision(
        planManeuver(
          { position: current.position, velocity: current.velocity },
          target,
          MAX_ACCEL,
          now,
        ),
        BODIES,
        SHIP_COLLISION_RADIUS,
      );
    },
    [maneuver],
  );

  // Right-click on the reference plane: start placing a target at the X/Z point.
  const handlePlaceStart = (
    anchorX: number,
    anchorZ: number,
    startClientY: number,
  ) => {
    const now = timeRef.current;
    const preview = planToTarget(new Vector3(anchorX, 0, anchorZ), now);
    const p: PlacementState = {
      anchorX,
      anchorZ,
      startClientY,
      altitude: 0,
      preview,
    };
    placeRef.current = p;
    setPlacing(p);
    setMenu(null);
  };

  // Click during placement: lock in the target and open the menu at the cursor,
  // precomputing both the arrive-at-rest course and the coast-forever direction.
  const handleConfirm = (clientX: number, clientY: number) => {
    const p = placeRef.current;
    if (!p) return;
    const now = timeRef.current;
    const current = stateAt(maneuver, now);
    const from = {
      position: current.position,
      velocity: current.velocity,
    };
    const target = new Vector3(p.anchorX, p.altitude, p.anchorZ);
    const planetCenter = new Vector3(...PLANET_POSITION);
    setMenu({
      x: clientX,
      y: clientY,
      course: clampToCollision(
        planManeuver(from, target, MAX_ACCEL, now),
        BODIES,
        SHIP_COLLISION_RADIUS,
      ),
      direction: clampToCollision(
        planDirection(from, target, MAX_ACCEL, now, CRUISE_SPEED),
        BODIES,
        SHIP_COLLISION_RADIUS,
      ),
      orbitPlanet: planOrbit(
        from,
        planetCenter,
        ORBIT_RADIUS,
        ORBIT_ANGULAR_SPEED,
        MAX_ACCEL,
        now,
      ),
      canOrbit: target.distanceTo(planetCenter) < ORBIT_SELECT_DISTANCE,
    });
    placeRef.current = null;
    setPlacing(null);
  };

  // While placing, vertical mouse movement (no button held) sets the altitude.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const p = placeRef.current;
      if (!p) return;
      const altitude = (p.startClientY - e.clientY) * ALT_PER_PIXEL;
      const preview = planToTarget(
        new Vector3(p.anchorX, altitude, p.anchorZ),
        timeRef.current,
      );
      const next: PlacementState = { ...p, altitude, preview };
      placeRef.current = next;
      setPlacing(next);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [planToTarget]);

  // WASD pans the camera; pressing it disengages follow so it doesn't snap back.
  useEffect(() => {
    const codes = new Set(["KeyW", "KeyA", "KeyS", "KeyD"]);
    const onDown = (e: KeyboardEvent) => {
      if (codes.has(e.code)) {
        movementKeys.current.add(e.code);
        setFollow(false);
      }
    };
    const onUp = (e: KeyboardEvent) => movementKeys.current.delete(e.code);
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(null);
        setHoveredPreview(null);
        placeRef.current = null;
        setPlacing(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const closeMenu = () => {
    setMenu(null);
    setHoveredPreview(null);
  };

  // Right-click context-menu actions. Append here to add more options.
  const menuActions: MenuAction[] = [
    {
      label: menu
        ? `Set course  (${formatDuration(maneuverDuration(menu.course))})`
        : "Set course",
      enabled: !!menu && !menu.canOrbit,
      preview: menu?.course ?? null,
      onSelect: () => {
        if (menu) setManeuver(menu.course);
        closeMenu();
      },
    },
    {
      label: "Set direction",
      enabled: !!menu && !menu.canOrbit,
      preview: menu?.direction ?? null,
      onSelect: () => {
        if (menu) setManeuver(menu.direction);
        closeMenu();
      },
    },
    {
      label: "Orbit planet",
      enabled: !!menu && menu.canOrbit,
      preview: menu?.orbitPlanet ?? null,
      onSelect: () => {
        if (menu) setManeuver(menu.orbitPlanet);
        closeMenu();
      },
    },
  ];

  const committedTime = maneuverDuration(maneuver);
  const previewTime = preview ? maneuverDuration(preview) : null;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        backgroundColor: navMode ? "#0a1f4d" : "#000",
        backgroundImage: navMode ? "none" : STARFIELD,
        backgroundRepeat: "no-repeat",
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Canvas
        camera={{ position: [0, 12, 16], fov: 60, near: 0.1, far: 20000 }}
        gl={{ alpha: true, logarithmicDepthBuffer: true }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <Scene
          maneuver={maneuver}
          preview={preview}
          navMode={navMode}
          placing={placing !== null}
          follow={follow}
          centerSignal={centerSignal}
          movementKeys={movementKeys}
          readoutRef={navReadoutRef}
          onPlaceStart={handlePlaceStart}
          onConfirm={handleConfirm}
          onBackgroundClick={() => setMenu(null)}
          timeRef={timeRef}
        />
      </Canvas>

      {/* Top view bar — add more views here. */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 4,
          padding: 4,
          background: "rgba(0,0,0,0.55)",
          borderRadius: 8,
          font: "13px monospace",
        }}
      >
        {VIEWS.map((v) => {
          const active = v.id === viewMode;
          return (
            <button
              key={v.id}
              onClick={() => selectView(v.id)}
              style={{
                padding: "6px 14px",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                color: active ? "#04101f" : "#9fe",
                background: active ? "#66ccff" : "transparent",
                font: "inherit",
                fontWeight: active ? 700 : 400,
              }}
            >
              {v.label}
            </button>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          padding: "8px 12px",
          background: "rgba(0,0,0,0.6)",
          color: "#9fe",
          font: "13px monospace",
          borderRadius: 6,
          pointerEvents: "none",
        }}
      >
        {placing
          ? "Move mouse up/down for altitude, click to confirm."
          : "Right-click to plot a course."}
        <br />
        {placing
          ? `Altitude: ${placing.altitude.toFixed(1)}   ETA: ${previewTime !== null ? formatDuration(previewTime) : "--"}`
          : previewTime !== null
            ? `Course preview: ${formatDuration(previewTime)}`
            : `Planned travel time: ${formatDuration(committedTime)}`}
      </div>

      {navMode && (
        <button
          onClick={() => setFollow((f) => !f)}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            padding: "6px 14px",
            border: "1px solid #274b6e",
            borderRadius: 6,
            cursor: "pointer",
            color: follow ? "#04101f" : "#9fe",
            background: follow ? "#66ccff" : "rgba(6,16,32,0.7)",
            font: "13px monospace",
            fontWeight: follow ? 700 : 400,
          }}
        >
          {follow ? "Following ship" : "Lock on ship"}
        </button>
      )}

      {/* Navigation readout (positions + velocity), updated live. */}
      {navMode && (
        <div
          ref={navReadoutRef}
          style={{
            position: "absolute",
            bottom: 12,
            left: 12,
            padding: "8px 12px",
            background: "rgba(6,16,32,0.7)",
            color: "#9fd6ff",
            font: "12px monospace",
            whiteSpace: "pre",
            borderRadius: 6,
            border: "1px solid #274b6e",
            pointerEvents: "none",
          }}
        />
      )}

      {menu && (
        <div
          style={{
            position: "fixed",
            left: menu.x,
            top: menu.y,
            minWidth: 150,
            padding: 4,
            background: "rgba(12,16,22,0.96)",
            border: "1px solid #2a3a4a",
            borderRadius: 6,
            font: "13px monospace",
            color: "#cfe",
            zIndex: 10,
            userSelect: "none",
          }}
          onContextMenu={(e) => e.preventDefault()}
        >
          {menuActions.map((action) => (
            <div
              key={action.label}
              onClick={action.enabled ? action.onSelect : undefined}
              onMouseEnter={(e) => {
                if (action.enabled) {
                  e.currentTarget.style.background = "#1d2a3a";
                  setHoveredPreview(action.preview);
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                setHoveredPreview(null);
              }}
              style={{
                padding: "6px 10px",
                borderRadius: 4,
                cursor: action.enabled ? "pointer" : "default",
                opacity: action.enabled ? 1 : 0.4,
              }}
            >
              {action.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
