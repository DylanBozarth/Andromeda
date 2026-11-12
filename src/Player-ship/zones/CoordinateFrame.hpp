#pragma once
#include "math/Vec3.hpp"

// A local coordinate frame with a moving origin.
// Used to convert between solar (J2000 ecliptic) coordinates and
// zone-local coordinates. The physics engine always works in the
// solar frame; this transform exists for rendering precision.
//
// At solar-system scales, a ship near Titan is at ~1.4e12 m from
// the Sun. Doubles give ~1.4e12 * 1e-15 ≈ 1.4mm precision in the
// solar frame — acceptable. But for cm-scale maneuvering near a
// small moon you would switch to a local frame centered on that moon,
// recovering full double precision at short range.
struct LocalFrame {
    Vec3 origin;        // solar-frame position of this frame's center
    Vec3 origin_vel;    // velocity of the origin (for Coriolis if needed)

    // Solar → local
    Vec3 toLocal(Vec3 solar_pos) const {
        return solar_pos - origin;
    }

    // Local → solar
    Vec3 toSolar(Vec3 local_pos) const {
        return local_pos + origin;
    }

    // Velocity transform (non-inertial correction omitted for now;
    // at solar-system speeds the Coriolis acceleration is negligible
    // over typical game update intervals)
    Vec3 toLocalVel(Vec3 solar_vel) const {
        return solar_vel - origin_vel;
    }

    Vec3 toSolarVel(Vec3 local_vel) const {
        return local_vel + origin_vel;
    }
};

// Void frame: origin follows the spacecraft itself.
// Provides full precision regardless of solar distance.
// The 'origin' should be updated each physics tick to the ship's position.
struct FloatingOriginFrame {
    Vec3 origin;

    Vec3 toLocal(Vec3 solar_pos) const { return solar_pos - origin; }
    Vec3 toSolar(Vec3 local_pos) const { return local_pos + origin; }
};
