import { Vector3 } from "three";
import type { Maneuver, Segment, ShipState } from "./types";

const EPS = 1e-6;

// A time-optimal "fly to a point and stop" maneuver under constant thrust
// magnitude is bang-bang with two arcs (the thrust direction is constant on
// each arc, the trajectory lies in the plane of the current velocity and the
// vector to the target). We solve for v1, the velocity at the flip point, such
// that the ship curves from its current velocity onto the new course and
// arrives at the target at rest — carrying momentum rather than stopping first.
//
// Given v1: arc 1 accelerates from v0 to v1 (a1 = (v1-v0)/|v1-v0|·A) over
// t1 = |v1-v0|/A; arc 2 decelerates v1 to rest over t2 = |v1|/A. Net
// displacement is r0 + ½(v0+v1)·t1 + ½·v1·t2, which must equal zero (target).
export function planManeuver(
  start: ShipState,
  target: Vector3,
  maxAccel: number,
  startTime: number,
): Maneuver {
  const A = maxAccel;
  const v0 = start.velocity.clone();
  const r0 = start.position.clone().sub(target); // position relative to target

  const startState: ShipState = {
    position: start.position.clone(),
    velocity: start.velocity.clone(),
  };

  // Degenerate: already at the target with no velocity → nothing to do.
  if (r0.length() < EPS && v0.length() < EPS) {
    return { startTime, start: startState, segments: [] };
  }

  // Build an orthonormal basis (e1, e2) for the plane the maneuver lives in.
  const e1 =
    r0.length() > EPS ? r0.clone().normalize() : v0.clone().normalize();
  let e2 = v0.clone().addScaledVector(e1, -v0.dot(e1));
  if (e2.lengthSq() < EPS * EPS) e2 = perpendicular(e1);
  e2.normalize();

  // Residual: net displacement (in plane) for a candidate flip velocity v1.
  const residual = (x: number, y: number): [number, number] => {
    const v1 = e1.clone().multiplyScalar(x).addScaledVector(e2, y);
    const t1 = v1.clone().sub(v0).length() / A;
    const t2 = v1.length() / A;
    const r2 = r0
      .clone()
      .addScaledVector(v0.clone().add(v1), 0.5 * t1)
      .addScaledVector(v1, 0.5 * t2);
    return [r2.dot(e1), r2.dot(e2)];
  };

  // Initial guess: straight-line flip-and-burn from rest (exact when v0 = 0).
  // Velocity at the midpoint points toward the target with speed √(A·|r0|).
  const dist = r0.length();
  let x = -Math.sqrt(A * Math.max(dist, EPS)); // toward target (-e1)
  let y = 0;

  const tol = 1e-9 * Math.max(1, dist);
  const h = Math.max(1e-5, 1e-4 * Math.sqrt(A * Math.max(dist, EPS)));

  for (let iter = 0; iter < 40; iter++) {
    const F = residual(x, y);
    const fNorm = Math.hypot(F[0], F[1]);
    if (fNorm < tol) break;

    // Numerical 2×2 Jacobian.
    const Fx = residual(x + h, y);
    const Fy = residual(x, y + h);
    const j00 = (Fx[0] - F[0]) / h;
    const j10 = (Fx[1] - F[1]) / h;
    const j01 = (Fy[0] - F[0]) / h;
    const j11 = (Fy[1] - F[1]) / h;
    const det = j00 * j11 - j01 * j10;
    if (Math.abs(det) < 1e-12) break;

    // Newton step: J·d = -F.
    const dx = (-F[0] * j11 + F[1] * j01) / det;
    const dy = (F[0] * j10 - F[1] * j00) / det;

    // Backtracking line search for robustness.
    let step = 1;
    let accepted = false;
    while (step > 1e-4) {
      const nx = x + step * dx;
      const ny = y + step * dy;
      const Fn = residual(nx, ny);
      if (Math.hypot(Fn[0], Fn[1]) < fNorm) {
        x = nx;
        y = ny;
        accepted = true;
        break;
      }
      step *= 0.5;
    }
    if (!accepted) break;
  }

  const v1 = e1.clone().multiplyScalar(x).addScaledVector(e2, y);
  const segments: Segment[] = [];

  const dv = v1.clone().sub(v0);
  const dvLen = dv.length();
  if (dvLen > EPS) {
    segments.push({
      duration: dvLen / A,
      accel: dv.multiplyScalar(A / dvLen),
    });
  }

  const v1Len = v1.length();
  if (v1Len > EPS) {
    segments.push({
      duration: v1Len / A,
      accel: v1.clone().multiplyScalar(-A / v1Len),
    });
  }

  return { startTime, start: startState, segments };
}

// Plan a maneuver that heads off toward `target` and coasts in that direction
// forever: a single burn that sets velocity to `cruiseSpeed` along the
// direction from the current position to the target. Past the burn, evaluation
// coasts at the final velocity (see stateAt), so the ship continues forever.
export function planDirection(
  start: ShipState,
  target: Vector3,
  maxAccel: number,
  startTime: number,
  cruiseSpeed: number,
): Maneuver {
  const startState: ShipState = {
    position: start.position.clone(),
    velocity: start.velocity.clone(),
  };

  const dir = target.clone().sub(start.position);
  if (dir.length() < EPS) {
    return { startTime, start: startState, segments: [] };
  }
  dir.normalize();

  const dv = dir.multiplyScalar(cruiseSpeed).sub(start.velocity);
  const dvLen = dv.length();
  const segments: Segment[] =
    dvLen > EPS
      ? [{ duration: dvLen / maxAccel, accel: dv.multiplyScalar(maxAccel / dvLen) }]
      : [];

  return { startTime, start: startState, segments };
}

// Any unit vector perpendicular to v.
function perpendicular(v: Vector3): Vector3 {
  const axis =
    Math.abs(v.x) < 0.9 ? new Vector3(1, 0, 0) : new Vector3(0, 1, 0);
  return axis.addScaledVector(v, -axis.dot(v)).normalize();
}
