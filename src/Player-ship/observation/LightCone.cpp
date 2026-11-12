#include "LightCone.hpp"
#include <cmath>

double LightCone::solveEmitTime(
    std::string_view name, double t_now, const SolarSystem& system) const
{
    // Initial guess: assume zero delay (fine for nearby bodies)
    double t_emit = t_now;

    for (int iter = 0; iter < 20; iter++) {
        Vec3   body_pos  = system.getPosition(name, t_emit);
        double dist      = (body_pos - m_pos).length();
        double t_emit_new = t_now - dist / Constants::C;

        if (std::abs(t_emit_new - t_emit) < 1e-3)   // <1 ms convergence
            return t_emit_new;

        t_emit = t_emit_new;
    }
    return t_emit;
}

Vec3 LightCone::observePosition(
    std::string_view name, double t_now, const SolarSystem& system) const
{
    double t_emit = solveEmitTime(name, t_now, system);
    return system.getPosition(name, t_emit);
}

ObservedState LightCone::observe(
    std::string_view name, double t_now, const SolarSystem& system) const
{
    double t_emit = solveEmitTime(name, t_now, system);
    StateVector sv = system.getState(name, t_emit);
    double delay = t_now - t_emit;

    return ObservedState{
        name.data(),
        sv.position,
        sv.velocity,
        t_emit,
        delay
    };
}

std::vector<ObservedState> LightCone::observeAll(
    double t_now, const SolarSystem& system) const
{
    // Build list of all named bodies we can observe
    static constexpr const char* BODY_NAMES[] = {
        "Mercury","Venus","Earth","Mars","Jupiter","Saturn","Uranus","Neptune",
        "Moon",
        "Phobos","Deimos",
        "Io","Europa","Ganymede","Callisto",
        "Titan","Enceladus","Mimas","Tethys","Dione","Rhea","Iapetus",
        "Triton"
    };

    std::vector<ObservedState> observations;
    observations.reserve(std::size(BODY_NAMES));

    for (const char* name : BODY_NAMES) {
        try {
            observations.push_back(observe(name, t_now, system));
        } catch (...) {
            // Body not found — skip gracefully
        }
    }
    return observations;
}

double LightCone::radarReturnTime(
    std::string_view target, double t_now, const SolarSystem& system) const
{
    // The radar ping travels from observer to where the target appears to be.
    // The target's apparent position is its light-delayed position.
    Vec3   apparent_pos = observePosition(target, t_now, system);
    double one_way      = lightDelay(m_pos, apparent_pos);
    return t_now + 2.0 * one_way;
}
