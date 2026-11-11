#pragma once
#include "math/Vec3.hpp"
#include "math/Constants.hpp"
#include "simulation/SolarSystem.hpp"
#include <array>
#include <string_view>
#include <optional>

// A planetary zone is the region inside a planet's Hill sphere —
// the volume in which the planet's gravity dominates over the Sun's.
// When a spacecraft is inside a zone, it uses the planet as its
// coordinate frame origin, gaining floating-point precision for
// close-range maneuvering.
//
// Hill sphere radius: r_H = a * cbrt(GM_planet / (3 * GM_sun))

struct Zone {
    const char* planet_name;
    double      hill_radius;    // meters
};

// Precomputed Hill sphere radii (meters) for each planet
inline constexpr std::array<Zone, 8> ZONES = {{
    { "Mercury", Constants::HILL_MERCURY },
    { "Venus",   Constants::HILL_VENUS   },
    { "Earth",   Constants::HILL_EARTH   },
    { "Mars",    Constants::HILL_MARS    },
    { "Jupiter", Constants::HILL_JUPITER },
    { "Saturn",  Constants::HILL_SATURN  },
    { "Uranus",  Constants::HILL_URANUS  },
    { "Neptune", Constants::HILL_NEPTUNE },
}};

// Returns the zone a solar-frame position is currently inside,
// or nullopt if it is in the void between all planetary zones.
// planet_states must include at minimum the 8 planets (from getPlanetStates).
inline std::optional<const Zone*> findZone(
    Vec3 solar_pos,
    const std::vector<BodyState>& planet_states)
{
    for (const auto& zone : ZONES) {
        for (const auto& body : planet_states) {
            if (body.name == std::string_view(zone.planet_name)) {
                Vec3 dr = solar_pos - body.position;
                if (dr.lengthSquared() < zone.hill_radius * zone.hill_radius)
                    return &zone;
                break;
            }
        }
    }
    return std::nullopt;
}
