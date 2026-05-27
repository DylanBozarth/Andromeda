import { Vector3 } from "three";
import type { Maneuver, Segment, ShipState } from "./types";

// Integrate one full segment of constant acceleration.
export function advance(state: ShipState, segment: Segment): ShipState {
  const dt = segment.duration;
  const position = state.position
    .clone()
    .addScaledVector(state.velocity, dt)
    .addScaledVector(segment.accel, 0.5 * dt * dt);
  const velocity = state.velocity.clone().addScaledVector(segment.accel, dt);
  return { position, velocity };
}

export interface SampledState extends ShipState {
  accel: Vector3; // acceleration active at the sampled time (zero when coasting/done)
}

// Closed-form ship state at any sim time. O(segments), no integration loop.
export function stateAt(maneuver: Maneuver, time: number): SampledState {
  // A collision halts the ship: freeze at the surface for all later times.
  if (maneuver.stopTime !== undefined && time > maneuver.stopTime) {
    time = maneuver.stopTime;
  }
  let t = time - maneuver.startTime;
  let state: ShipState = {
    position: maneuver.start.position.clone(),
    velocity: maneuver.start.velocity.clone(),
  };

  if (t <= 0) {
    return { ...state, accel: new Vector3() };
  }

  for (const seg of maneuver.segments) {
    if (t < seg.duration) {
      const partial = advance(state, { duration: t, accel: seg.accel });
      return { ...partial, accel: seg.accel.clone() };
    }
    state = advance(state, seg);
    t -= seg.duration;
  }

  // Past the segments: follow the orbit forever, if one was attached.
  if (maneuver.orbit) {
    const o = maneuver.orbit;
    const ang = o.angularSpeed * (time - o.startTime);
    const c = Math.cos(ang);
    const s = Math.sin(ang);
    const position = o.center
      .clone()
      .addScaledVector(o.u, o.radius * c)
      .addScaledVector(o.v, o.radius * s);
    const velocity = o.u
      .clone()
      .multiplyScalar(-o.radius * o.angularSpeed * s)
      .addScaledVector(o.v, o.radius * o.angularSpeed * c);
    // accel is centripetal, but report zero so the ship faces its travel
    // direction (coasting orbit) rather than pointing engines inward.
    return { position, velocity, accel: new Vector3() };
  }

  // Otherwise coast at the final velocity (zero for an arrive-at-rest course,
  // nonzero for a set-direction maneuver).
  return {
    position: state.position.clone().addScaledVector(state.velocity, t),
    velocity: state.velocity.clone(),
    accel: new Vector3(),
  };
}

export function maneuverDuration(maneuver: Maneuver): number {
  return maneuver.segments.reduce((sum, s) => sum + s.duration, 0);
}
