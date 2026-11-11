#pragma once
#include "math/Vec3.hpp"
#include "math/Constants.hpp"
#include <string>
#include <vector>
#include <cstdint>
#include <algorithm>

// A signal (communication, sensor ping, etc.) travelling through space at c.
// The sender emits at t_sent from origin; any receiver at position P gets it
// when t_sent + |P - origin| / c <= t_now.
//
// For a moving receiver the arrival time is approximate (we assume the receiver
// doesn't move significantly during the light-travel time). This is accurate
// enough for game purposes; a ship moving at 30 km/s crossing a 1-AU baseline
// introduces ~100 km of error — negligible at solar-system scales.
struct Signal {
    uint64_t    id;
    std::string sender;
    Vec3        origin;        // solar frame, meters
    double      t_sent;        // sim time (seconds since J2000)
    std::string payload;       // game data: orders, sensor readings, comms, etc.
    bool        is_broadcast;  // true: anyone with line-of-sight can receive
    // For directed signals, target is the best-known receiver position at send time
    Vec3        target;

    // When does this signal arrive at a stationary receiver at pos?
    double arrivalTime(Vec3 pos) const {
        return t_sent + (pos - origin).length() / Constants::C;
    }

    // One-way light-travel time to pos (seconds of sim time)
    double lightDelay(Vec3 pos) const {
        return (pos - origin).length() / Constants::C;
    }

    // Round-trip delay if pos sends a reply immediately (radar / ping)
    double roundTripDelay(Vec3 pos) const {
        return 2.0 * lightDelay(pos);
    }
};

// In-memory buffer of all signals in flight.
// In a multiplayer server this would live server-side; each client
// receives only signals that have arrived at their position.
class SignalBuffer {
public:
    uint64_t send(Signal s) {
        s.id = m_next_id++;
        m_signals.push_back(std::move(s));
        return m_signals.back().id;
    }

    // Returns all signals that have arrived at pos by t_now
    std::vector<Signal> receive(Vec3 pos, double t_now) const {
        std::vector<Signal> received;
        for (const auto& sig : m_signals) {
            if (sig.arrivalTime(pos) <= t_now)
                received.push_back(sig);
        }
        return received;
    }

    // Discard signals whose latest possible arrival (at any point in the
    // solar system) is before before_t. Neptune is ~4.5e12 m from the Sun,
    // so max propagation ≈ 1.5e4 s — pruning anything older than that is safe.
    void prune(double before_t) {
        constexpr double MAX_SYSTEM_LIGHT_TIME = 1.6e4;  // ~4.5h, Neptune at max extent
        m_signals.erase(
            std::remove_if(m_signals.begin(), m_signals.end(),
                [&](const Signal& s) {
                    return (s.t_sent + MAX_SYSTEM_LIGHT_TIME) < before_t;
                }),
            m_signals.end());
    }

    std::size_t size() const { return m_signals.size(); }

private:
    std::vector<Signal> m_signals;
    uint64_t m_next_id = 1;
};
