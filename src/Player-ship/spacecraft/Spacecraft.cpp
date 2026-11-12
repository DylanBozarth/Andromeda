#include "Spacecraft.hpp"
#include "Integrator.hpp"
#include "math/Constants.hpp"
#include <cmath>
#include <stdexcept>

Spacecraft::Spacecraft(
    std::string name,
    Vec3   pos,
    Vec3   vel,
    double dry_mass,
    double propellant_mass)
    : m_name(std::move(name))
    , m_pos(pos)
    , m_vel(vel)
    , m_dry_mass(dry_mass)
    , m_prop_mass(propellant_mass)
{}

void Spacecraft::teleport(Vec3 pos, Vec3 vel) {
    m_pos = pos;
    m_vel = vel;
    cutThrust();
}

void Spacecraft::setThrust(Vec3 direction, double force_newtons) {
    m_thrust_dir = direction.normalized();
    m_thrust_N   = force_newtons;
    m_thrusting  = (force_newtons > 0.0);
}

void Spacecraft::cutThrust() {
    m_thrusting = false;
    m_thrust_N  = 0.0;
}

void Spacecraft::setIsp(double isp_seconds) {
    m_isp = isp_seconds;
}

Vec3 Spacecraft::computeGravity(Vec3 pos, const std::vector<BodyState>& bodies) const {
    Vec3 accel;
    for (const auto& body : bodies) {
        if (body.GM == 0.0) continue;
        Vec3   dr       = body.position - pos;
        double dist_sq  = dr.lengthSquared();
        double dist     = std::sqrt(dist_sq);
        // Don't apply gravity if inside the body (shouldn't happen in normal gameplay)
        if (dist < body.radius) continue;
        accel += (body.GM / (dist_sq * dist)) * dr;
    }
    return accel;
}

Vec3 Spacecraft::computeAccel(Vec3 pos, Vec3 /*vel*/, const std::vector<BodyState>& bodies) const {
    Vec3 accel = computeGravity(pos, bodies);
    if (m_thrusting && m_thrust_N > 0.0) {
        double mass = totalMass();
        if (mass > 0.0)
            accel += m_thrust_dir * (m_thrust_N / mass);
    }
    return accel;
}

void Spacecraft::update(double dt, double sim_time, const SolarSystem& system) {
    // Fetch body states once at mid-step time for accuracy
    // (Avoids a full double evaluation; planets barely move over dt)
    auto bodies = system.getAllStates(sim_time + dt * 0.5);

    auto deriv = [&](RK4State s, double /*t*/) -> RK4Derivative {
        return { s.velocity, computeAccel(s.position, s.velocity, bodies) };
    };

    RK4State state = rk4Step({ m_pos, m_vel }, sim_time, dt, deriv);
    m_pos = state.position;
    m_vel = state.velocity;

    // Propellant consumption: dm/dt = -F / (Isp * g0)
    if (m_thrusting && m_isp > 0.0 && m_prop_mass > 0.0) {
        constexpr double g0 = 9.80665;  // m/s² standard gravity
        double mdot = m_thrust_N / (m_isp * g0);
        m_prop_mass -= mdot * dt;
        if (m_prop_mass < 0.0) {
            m_prop_mass = 0.0;
            cutThrust();  // out of fuel
        }
    }
}

double Spacecraft::speedRelativeTo(
    const std::string& body_name,
    double t,
    const SolarSystem& system) const
{
    StateVector body_sv = system.getState(body_name, t);
    return (m_vel - body_sv.velocity).length();
}
