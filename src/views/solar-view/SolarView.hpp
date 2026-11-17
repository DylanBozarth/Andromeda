#pragma once
#include <glm/glm.hpp>
#include "math/Vec3.hpp"
#include "Solar-system-builder/simulation/SolarSystem.hpp"
#include <array>

// Illustrative layout used by the solar map — angles are real,
// distances are compressed so all planets fit in a readable disc.
struct IllustData { const char* name; float dist; float radius; };

inline constexpr std::array<IllustData, 9> SOLAR_ILLUST = {{
    { "Sun",     0.0f,  2.00f },
    { "Mercury", 3.5f,  0.18f },
    { "Venus",   5.5f,  0.28f },
    { "Earth",   7.5f,  0.30f },
    { "Mars",   10.0f,  0.22f },
    { "Jupiter",14.0f,  0.90f },
    { "Saturn", 19.0f,  0.78f },
    { "Uranus", 25.0f,  0.55f },
    { "Neptune",31.0f,  0.52f },
}};

// Maps a body's true AU position to its illustrative solar-view scene position.
// Preserves the real ecliptic angle; compresses radial distance via SOLAR_ILLUST.
glm::vec3 solarBodyPos(const char* name, glm::vec3 au_pos);

// Maps the ship's real position to illustrative solar-view space by interpolating
// between planet breakpoints so the ship marker stays correctly relative to planets.
glm::vec3 shipSolarPos(Vec3 ship_pos, const SolarSystem& sys, double sim_t);
