#pragma once
#include "OrbitalElements.hpp"
#include "math/Vec3.hpp"

struct StateVector {
    Vec3 position;    // meters, relative to parent body at origin
    Vec3 velocity;    // m/s,    relative to parent body
};

namespace KeplerSolver {

    // Returns position + velocity in the parent body's reference frame
    // t = seconds since J2000 epoch
    StateVector solve(const OrbitalElements& elem, double t);

    // Convenience: position only
    Vec3 position(const OrbitalElements& elem, double t);

} // namespace KeplerSolver
