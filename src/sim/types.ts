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

// A circular orbit that begins once the transit segments finish. position(t) is
// a closed-form function of the angle swept since startTime.
export interface Orbit {
  center: Vector3;
  radius: number;
  u: Vector3; // unit, center → insertion point (orbit angle 0)
  v: Vector3; // unit, orbital direction at angle 0 (perpendicular to u, in plane)
  angularSpeed: number; // rad / s
  startTime: number; // sim seconds when the orbit begins (after the segments)
}

// A committed maneuver: where the ship was at startTime, and the burns that
// follow. position(t) / velocity(t) are pure functions of this + a timestamp.
// An optional orbit takes over once the segments complete (and continues forever).
export interface Maneuver {
  startTime: number; // sim seconds when the maneuver begins
  start: ShipState; // ship state at startTime
  segments: Segment[];
  orbit?: Orbit;
  stopTime?: number; // sim time the ship is halted at (e.g. a collision surface)
}
