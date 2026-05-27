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

  // Past the end of the plan: coast at the final velocity (which is zero for
  // an arrive-at-rest course, but nonzero for a set-direction maneuver).
  return {
    position: state.position.clone().addScaledVector(state.velocity, t),
    velocity: state.velocity.clone(),
    accel: new Vector3(),
  };
}

export function maneuverDuration(maneuver: Maneuver): number {
  return maneuver.segments.reduce((sum, s) => sum + s.duration, 0);
}
