#pragma once
#include "math/Vec3.hpp"
#include "Solar-system-builder/simulation/SolarSystem.hpp"
#include <string>

// A spacecraft modelled as a point mass with thrust.
// Position and velocity are always in the solar (J2000 ecliptic) frame.
//
// Gravity is summed from all bodies returned by SolarSystem::getAllStates().
// Thrust is applied as a constant acceleration in a chosen direction.
//
// Time-step guidance:
//   In the void:              dt ≤ 3600 s (1 sim-hour) is fine
//   In a planetary zone:      dt ≤ 60 s
//   Near a small moon/planet: dt ≤ 1 s
// Adaptive stepping will be added later; for now callers choose dt.
class Spacecraft {
public:
    Spacecraft(
        std::string name,
        Vec3   initial_position,   // solar frame, meters
        Vec3   initial_velocity,   // m/s
        double dry_mass,           // kg (without propellant)
        double propellant_mass = 0.0  // kg
    );

    // Advance state by dt simulation seconds.
    // system is queried at mid-step time for body positions (Verlet approach).
    void update(double dt, double sim_time, const SolarSystem& system);

    // ── Thrust control ────────────────────────────────────────────────────
    // Set thrust direction (unit vector in solar frame) and magnitude (N).
    void setThrust(Vec3 direction, double force_newtons);
    void cutThrust();

    // ── Propellant ────────────────────────────────────────────────────────
    // Specific impulse (Isp) governs how efficiently thrust converts propellant.
    // Set Isp = 0 to disable propellant consumption (infinite fuel mode).
    void setIsp(double isp_seconds);

    // ── Accessors ─────────────────────────────────────────────────────────
    Vec3        position()       const { return m_pos; }
    Vec3        velocity()       const { return m_vel; }
    double      totalMass()      const { return m_dry_mass + m_prop_mass; }
    double      propellantMass() const { return m_prop_mass; }
    bool        isThrusting()    const { return m_thrusting; }
    std::string name()           const { return m_name; }

    // Speed relative to a reference body at sim_time t
    double speedRelativeTo(const std::string& body, double t,
                           const SolarSystem& system) const;

    // Instantly set position and velocity (travel cutscenes, debug, instant-travel).
    // Cuts any active thrust.
    void teleport(Vec3 pos, Vec3 vel);

private:
    std::string m_name;
    Vec3   m_pos;
    Vec3   m_vel;
    double m_dry_mass;
    double m_prop_mass;
    double m_isp      = 0.0;    // 0 = infinite fuel
    bool   m_thrusting = false;
    Vec3   m_thrust_dir;         // unit vector
    double m_thrust_N  = 0.0;   // Newtons

    Vec3 computeGravity(Vec3 pos, const std::vector<BodyState>& bodies) const;
    Vec3 computeAccel(Vec3 pos, Vec3 vel, const std::vector<BodyState>& bodies) const;
};
