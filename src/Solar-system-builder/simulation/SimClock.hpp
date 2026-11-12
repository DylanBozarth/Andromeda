#pragma once
#include "math/Constants.hpp"
#include <chrono>

// Tracks simulation time relative to the J2000 epoch.
// 1 real second  = SIM_SPEED (24) sim seconds
// 1 real hour    = 1 sim day
// 1 real day     = 24 sim days
//
// Sim time is always in seconds since J2000 (Jan 1, 2000, 12:00 TT).
// Use simTime() wherever physics functions expect 't'.
class SimClock {
    using Clock    = std::chrono::steady_clock;
    using TimePoint = Clock::time_point;

    TimePoint m_start_real;
    double    m_start_sim;   // sim time at which the clock was (re)started

public:
    // Start clock at given sim time (seconds since J2000)
    explicit SimClock(double initial_sim_time = 0.0)
        : m_start_real(Clock::now())
        , m_start_sim(initial_sim_time)
    {}

    // Current simulation time (seconds since J2000)
    double simTime() const {
        auto elapsed_real = std::chrono::duration<double>(Clock::now() - m_start_real).count();
        return m_start_sim + elapsed_real * Constants::SIM_SPEED;
    }

    // Real seconds that have passed since clock creation
    double realElapsed() const {
        return std::chrono::duration<double>(Clock::now() - m_start_real).count();
    }

    // Convert a real-time duration to sim-time duration
    static constexpr double realToSim(double real_seconds) {
        return real_seconds * Constants::SIM_SPEED;
    }

    // Convert a sim-time duration to real-time duration
    static constexpr double simToReal(double sim_seconds) {
        return sim_seconds / Constants::SIM_SPEED;
    }

    // Light-travel time in REAL seconds between two sim-time-frame distances
    static constexpr double lightTravelReal(double distance_m) {
        return distance_m / Constants::C / Constants::SIM_SPEED;
    }
};
