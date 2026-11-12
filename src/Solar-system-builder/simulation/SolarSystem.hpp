#pragma once
#include "math/Vec3.hpp"
#include "Solar-system-builder/physics/KeplerSolver.hpp"
#include <vector>
#include <string_view>

// A body's full kinematic state in the solar (J2000 ecliptic) frame
struct BodyState {
    const char* name;
    const char* parent;
    Vec3   position;    // m, from solar barycenter
    Vec3   velocity;    // m/s
    double GM;
    double radius;      // m
};

// Ground truth of the solar system at any simulation time t.
// Positions are always computable — Keplerian orbits never "stop".
// This is the physics layer; callers should apply LightCone before showing
// positions to any in-game observer.
class SolarSystem {
public:
    SolarSystem() = default;

    // Position in solar frame at sim time t (seconds since J2000)
    Vec3 getPosition(std::string_view name, double t) const;

    // Full state vector in solar frame (velocity includes parent's velocity for moons)
    StateVector getState(std::string_view name, double t) const;

    // All bodies (Sun + planets + moons + asteroids) at time t
    // Used for spacecraft gravity integration
    std::vector<BodyState> getAllStates(double t) const;

    // Only the Sun + 8 planets — faster query for distant-view maps
    std::vector<BodyState> getPlanetStates(double t) const;

    // All bodies belonging to one planetary system (planet + its moons)
    std::vector<BodyState> getSystemStates(std::string_view planet_name, double t) const;

    // Sun is always at origin in the J2000 ecliptic frame
    static constexpr Vec3 SUN_POSITION = Vec3{0.0, 0.0, 0.0};
};
