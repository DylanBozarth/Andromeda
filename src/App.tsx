import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Canvas,
  useFrame,
  useThree,
  type ThreeEvent,
} from "@react-three/fiber";
import { Edges, Line, OrbitControls, Stars } from "@react-three/drei";
import {
  ArrowHelper,
  BufferAttribute,
  LineSegments,
  Mesh,
  MOUSE,
  Quaternion,
  Vector3,
} from "three";
import {
  maneuverDuration,
  planDirection,
  planManeuver,
  stateAt,
  type Maneuver,
} from "./sim";

const MAX_ACCEL = 1; // units / s²
const CRUISE_SPEED = 5; // coast speed for a "set direction" maneuver (units / s)
const COAST_PREVIEW_TIME = 8; // seconds of coasting drawn in a direction preview
const ALT_PER_PIXEL = 0.25; // altitude units gained per pixel of vertical mouse movement
const FORWARD = new Vector3(0, 0, 1); // ship's nose in local space (engines at -Z)
const TURN_RATE = 4; // how fast the ship slews to face its thrust direction

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
  // Extend coasting maneuvers a bit so the ongoing direction is visible.
  const total =
    maneuverDuration(maneuver) + (isCoasting(maneuver) ? COAST_PREVIEW_TIME : 0);
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
      if (speed > 1e-4) {
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

// Line segments for a 3D grid box (grid lines on all six faces of a cube).
function buildGridBox(half: number, divisions: number): Float32Array {
  const ticks: number[] = [];
  for (let i = 0; i <= divisions; i++)
    ticks.push(-half + (2 * half * i) / divisions);
  const pts: number[] = [];
  const push = (a: number[], b: number[]) =>
    pts.push(a[0], a[1], a[2], b[0], b[1], b[2]);
  for (const c of [-half, half]) {
    for (const t of ticks) {
      push([-half, c, t], [half, c, t]); // y-faces: lines along X
      push([t, c, -half], [t, c, half]); // y-faces: lines along Z
      push([-half, t, c], [half, t, c]); // z-faces: lines along X
      push([t, -half, c], [t, half, c]); // z-faces: lines along Y
      push([c, -half, t], [c, half, t]); // x-faces: lines along Y
      push([c, t, -half], [c, t, half]); // x-faces: lines along Z
    }
  }
  return new Float32Array(pts);
}

function NavGrid() {
  const args = useMemo<[Float32Array, number]>(
    () => [buildGridBox(10, 10), 3],
    [],
  );
  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={args} />
      </bufferGeometry>
      <lineBasicMaterial color="#3a6ea5" transparent opacity={0.3} />
    </lineSegments>
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
    const thrusting = accel.lengthSq() > 1e-6;
    const dir = thrusting ? accel : velocity;
    if (dir.lengthSq() > 1e-6) {
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
      <color attach="background" args={[navMode ? "#0a1f4d" : "#000010"]} />
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

      <mesh ref={shipRef}>
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

      {/* Committed course (solid cyan) — navigation view only. */}
      {navMode && committedPath.length > 1 && (
        <>
          <Line points={committedPath} color="cyan" lineWidth={1.5} />
          {!committedCoasting && (
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
          {!previewCoasting && (
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
          <NavGrid />
          <NavMarkers maneuver={maneuver} readoutRef={readoutRef} />
        </>
      )}

      {!navMode && <Stars />}
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
  // hovered action's preview, otherwise the default "set course" trajectory.
  const preview = placing?.preview ?? hoveredPreview ?? menu?.course ?? null;
  const navMode = viewMode === "navigation";

  const planToTarget = useCallback(
    (target: Vector3, now: number): Maneuver => {
      const current = stateAt(maneuver, now);
      return planManeuver(
        { position: current.position, velocity: current.velocity },
        target,
        MAX_ACCEL,
        now,
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
    setMenu({
      x: clientX,
      y: clientY,
      course: planManeuver(from, target, MAX_ACCEL, now),
      direction: planDirection(from, target, MAX_ACCEL, now, CRUISE_SPEED),
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
      label: "Set course",
      enabled: !!menu,
      preview: menu?.course ?? null,
      onSelect: () => {
        if (menu) setManeuver(menu.course);
        closeMenu();
      },
    },
    {
      label: "Set direction",
      enabled: !!menu,
      preview: menu?.direction ?? null,
      onSelect: () => {
        if (menu) setManeuver(menu.direction);
        closeMenu();
      },
    },
  ];

  const committedTime = maneuverDuration(maneuver);
  const previewTime = preview ? maneuverDuration(preview) : null;

  return (
    <div
      style={{ width: "100vw", height: "100vh", position: "relative" }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Canvas camera={{ position: [0, 12, 16], fov: 60 }}>
        <Scene
          maneuver={maneuver}
          preview={preview}
          navMode={navMode}
          placing={placing !== null}
          follow={follow}
          centerSignal={centerSignal}
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
          ? `Altitude: ${placing.altitude.toFixed(1)}   ETA: ${previewTime?.toFixed(1)}s`
          : previewTime !== null
            ? `Course preview: ${previewTime.toFixed(1)}s`
            : `Planned travel time: ${committedTime.toFixed(1)}s`}
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
