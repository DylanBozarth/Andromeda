import { maneuverDuration, stateAt } from "./evaluate";
import type { Maneuver } from "./types";
import { Vector3 } from "three";

export interface Body {
  center: Vector3;
  radius: number;
}

// Return a copy of the maneuver halted at the first time its path enters any
// body (so the ship stops at the surface instead of flying through). Returns
// the maneuver unchanged if the path stays clear.
export function clampToCollision(
  maneuver: Maneuver,
  bodies: Body[],
  shipRadius = 0,
): Maneuver {
  const t = firstCollision(maneuver, bodies, shipRadius);
  return t === null ? maneuver : { ...maneuver, stopTime: t };
}

function firstCollision(
  maneuver: Maneuver,
  bodies: Body[],
  shipRadius: number,
): number | null {
  const start = maneuver.startTime;
  const segDuration = maneuverDuration(maneuver);
  const r2 = bodies.map((b) => (b.radius + shipRadius) ** 2);

  // A body only counts once the ship is outside it — so a ship sitting on a
  // surface (from a prior collision) can still leave, and only re-entry trips.
  const startPos = stateAt(maneuver, start).position;
  const armed = bodies.map((b, i) => startPos.distanceToSquared(b.center) > r2[i]);

  const STEP = 0.5; // spatial step, smaller than the smallest body radius
  const MAX_DISTANCE = 2000;
  const MAX_ITERS = 6000;

  let t = start;
  let prevT = start;
  let traveled = 0;
  for (let i = 0; i < MAX_ITERS && traveled < MAX_DISTANCE; i++) {
    // The orbit phase is collision-free by construction; only scan the transit.
    if (maneuver.orbit && t > start + segDuration) break;

    const s = stateAt(maneuver, t);
    for (let b = 0; b < bodies.length; b++) {
      const d2 = s.position.distanceToSquared(bodies[b].center);
      if (!armed[b]) {
        if (d2 > r2[b]) armed[b] = true;
      } else if (d2 <= r2[b]) {
        // Bisect [prevT, t] for the moment the ship reaches the surface, so it
        // halts touching the body rather than a step inside it.
        let lo = prevT;
        let hi = t;
        for (let k = 0; k < 24; k++) {
          const mid = (lo + hi) / 2;
          const dm = stateAt(maneuver, mid).position.distanceToSquared(
            bodies[b].center,
          );
          if (dm <= r2[b]) hi = mid;
          else lo = mid;
        }
        return hi;
      }
    }

    const speed = s.velocity.length();
    // Once arrived and at rest (a course), there's nothing more to scan.
    if (t > start + segDuration && speed < 1e-4) break;
    const dt = speed > 1e-3 ? STEP / speed : 0.25;
    prevT = t;
    t += dt;
    traveled += speed * dt;
  }
  return null;
}
