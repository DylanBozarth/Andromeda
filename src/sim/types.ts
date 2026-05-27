import { Vector3 } from "three";

export interface ShipState {
  position: Vector3;
  velocity: Vector3;
}

// A phase of constant acceleration. position(dt) = p0 + v0·dt + ½·a·dt².
export interface Segment {
  duration: number; // seconds
  accel: Vector3; // units / s², constant over the segment
}

// A committed maneuver: where the ship was at startTime, and the burns that
// follow. position(t) / velocity(t) are pure functions of this + a timestamp.
export interface Maneuver {
  startTime: number; // sim seconds when the maneuver begins
  start: ShipState; // ship state at startTime
  segments: Segment[];
}
