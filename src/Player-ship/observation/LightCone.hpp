#pragma once
#include "math/Vec3.hpp"
#include "math/Constants.hpp"
#include "Solar-system-builder/simulation/SolarSystem.hpp"

// Observed state of a body — what an observer at a given position and time
// actually perceives, accounting for the finite speed of light.
struct ObservedState {
    const char* name;
    Vec3   position;       // where the body WAS when it emitted the light now arriving
    Vec3   velocity;       // body's velocity at emission — useful for lead-angle targeting
    double t_emitted;      // sim time when the light left the body
    double light_delay_s;  // seconds of sim time the light spent in transit
};

// Applies the light-cone filter to SolarSystem ground truth.
//
// Key principle: an observer never sees where something IS — only where it WAS.
// This is not an approximation; it is the physically correct description of
// observation at any finite speed-of-light.
//
// Algorithm (iterative, converges in <10 steps for any solar-system body):
//   1. Guess t_emit = t_now (zero delay)
//   2. Get body position at t_emit
//   3. Compute light travel time: Δt = |body_pos - observer_pos| / c
//   4. Revised estimate: t_emit = t_now - Δt
//   5. Repeat until |Δt_new - Δt_old| < 1 ms
//
// Convergence is guaranteed because body velocities << c, so each iteration
// shrinks the residual by a factor of (v_body / c) ≈ 1e-4.
class LightCone {
public:
    explicit LightCone(Vec3 observer_pos) : m_pos(observer_pos) {}

    void setPosition(Vec3 pos) { m_pos = pos; }
    Vec3 position() const { return m_pos; }

    // Returns the apparent (light-delayed) position of a named body
    Vec3 observePosition(std::string_view name, double t_now,
                         const SolarSystem& system) const;

    // Returns the full observed state including velocity at emission
    ObservedState observe(std::string_view name, double t_now,
                          const SolarSystem& system) const;

    // Returns all bodies' observed states — the observer's complete sky
    std::vector<ObservedState> observeAll(double t_now,
                                          const SolarSystem& system) const;

    // Light travel time (sim seconds) between two solar-frame positions
    static double lightDelay(Vec3 a, Vec3 b) {
        return (b - a).length() / Constants::C;
    }

    // When does a signal emitted at t_sent from origin arrive at the observer?
    double signalArrival(Vec3 origin, double t_sent) const {
        return t_sent + lightDelay(origin, m_pos);
    }

    // Active-sensor round-trip time (radar / ladar).
    // The ping leaves observer at t_now, reflects off target's light-delayed position,
    // returns. Total delay = 2 * distance_to_apparent_target / c.
    double radarReturnTime(std::string_view target, double t_now,
                           const SolarSystem& system) const;

private:
    Vec3 m_pos;

    // Core iterative solver: find t_emit such that
    //   t_emit + |body(t_emit) - observer| / c = t_now
    double solveEmitTime(std::string_view name, double t_now,
                         const SolarSystem& system) const;
};
