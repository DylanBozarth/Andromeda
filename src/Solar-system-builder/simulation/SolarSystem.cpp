#include "SolarSystem.hpp"
#include "Solar-system-builder/data/PlanetaryData.hpp"
#include "Solar-system-builder/data/MoonData.hpp"
#include "Solar-system-builder/data/AsteroidData.hpp"
#include "math/Constants.hpp"
#include <cstring>
#include <stdexcept>

// ── Internal helpers ──────────────────────────────────────────────────────────

static const CelestialBody* findPlanet(std::string_view name) {
    for (const auto& p : PLANETS)
        if (name == p.name) return &p;
    return nullptr;
}

static const CelestialBody* findMoon(std::string_view name) {
    for (const auto& m : MOONS)
        if (name == m.name) return &m;
    return nullptr;
}

// Returns planet position in solar frame
static Vec3 planetSolarPos(const CelestialBody& planet, double t) {
    return KeplerSolver::position(planet.elements, t);
}

// Returns moon position in solar frame (planet-centric + planet's solar pos)
static StateVector moonSolarState(const CelestialBody& moon, double t) {
    // Find parent planet
    const CelestialBody* parent = findPlanet(moon.parent);
    if (!parent) throw std::runtime_error(std::string("Unknown moon parent: ") + moon.parent);

    StateVector planet_sv = KeplerSolver::solve(parent->elements, t);
    StateVector moon_local = KeplerSolver::solve(moon.elements, t);

    return {
        planet_sv.position + moon_local.position,
        planet_sv.velocity + moon_local.velocity
    };
}

// ── SolarSystem public API ────────────────────────────────────────────────────

Vec3 SolarSystem::getPosition(std::string_view name, double t) const {
    if (name == "Sun") return SUN_POSITION;

    if (auto* p = findPlanet(name))
        return planetSolarPos(*p, t);

    if (auto* m = findMoon(name))
        return moonSolarState(*m, t).position;

    for (const auto& a : ASTEROIDS)
        if (name == a.name) return KeplerSolver::position(a.elements, t);

    throw std::runtime_error(std::string("Unknown body: ") + std::string(name));
}

StateVector SolarSystem::getState(std::string_view name, double t) const {
    if (name == "Sun") return { SUN_POSITION, Vec3{} };

    if (auto* p = findPlanet(name))
        return KeplerSolver::solve(p->elements, t);

    if (auto* m = findMoon(name))
        return moonSolarState(*m, t);

    for (const auto& a : ASTEROIDS)
        if (name == a.name) return KeplerSolver::solve(a.elements, t);

    throw std::runtime_error(std::string("Unknown body: ") + std::string(name));
}

std::vector<BodyState> SolarSystem::getAllStates(double t) const {
    std::vector<BodyState> states;
    states.reserve(1 + PLANETS.size() + MOONS.size() + ASTEROIDS.size());

    // Sun
    states.push_back({ "Sun", nullptr, SUN_POSITION, {}, Constants::GM_SUN, Constants::R_SUN });

    // Planets
    for (const auto& p : PLANETS) {
        auto sv = KeplerSolver::solve(p.elements, t);
        states.push_back({ p.name, "Sun", sv.position, sv.velocity, p.GM, p.radius });
    }

    // Moons (position in solar frame)
    for (const auto& m : MOONS) {
        auto sv = moonSolarState(m, t);
        states.push_back({ m.name, m.parent, sv.position, sv.velocity, m.GM, m.radius });
    }

    // Asteroids
    for (const auto& a : ASTEROIDS) {
        auto sv = KeplerSolver::solve(a.elements, t);
        states.push_back({ a.name, "Sun", sv.position, sv.velocity, 0.0, a.radius });
    }

    return states;
}

std::vector<BodyState> SolarSystem::getPlanetStates(double t) const {
    std::vector<BodyState> states;
    states.reserve(1 + PLANETS.size());
    states.push_back({ "Sun", nullptr, SUN_POSITION, {}, Constants::GM_SUN, Constants::R_SUN });
    for (const auto& p : PLANETS) {
        auto sv = KeplerSolver::solve(p.elements, t);
        states.push_back({ p.name, "Sun", sv.position, sv.velocity, p.GM, p.radius });
    }
    return states;
}

std::vector<BodyState> SolarSystem::getSystemStates(std::string_view planet_name, double t) const {
    std::vector<BodyState> states;

    // Always include the Sun (for gravity)
    states.push_back({ "Sun", nullptr, SUN_POSITION, {}, Constants::GM_SUN, Constants::R_SUN });

    // The planet itself
    if (auto* p = findPlanet(planet_name)) {
        auto sv = KeplerSolver::solve(p->elements, t);
        states.push_back({ p->name, "Sun", sv.position, sv.velocity, p->GM, p->radius });
    }

    // All moons of that planet
    for (const auto& m : MOONS) {
        if (planet_name == m.parent) {
            auto sv = moonSolarState(m, t);
            states.push_back({ m.name, m.parent, sv.position, sv.velocity, m.GM, m.radius });
        }
    }

    return states;
}
