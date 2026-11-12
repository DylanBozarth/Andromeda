#pragma once
#include "math/Vec3.hpp"
#include <functional>

// Minimal state for the RK4 integrator:
// position + velocity fully describe a particle's kinematic state.
struct RK4State {
    Vec3 position;
    Vec3 velocity;
};

struct RK4Derivative {
    Vec3 dp;    // d(position)/dt = velocity
    Vec3 dv;    // d(velocity)/dt = acceleration
};

inline RK4State operator+(const RK4State& s, const RK4Derivative& d) {
    return { s.position + d.dp, s.velocity + d.dv };
}

// Classic 4th-order Runge-Kutta integration step.
// deriv(state, t) must return the derivative of the state at that instant.
// dt in seconds (simulation time).
inline RK4State rk4Step(
    const RK4State& state,
    double t,
    double dt,
    const std::function<RK4Derivative(RK4State, double)>& deriv)
{
    double h  = dt;
    double h2 = dt * 0.5;

    RK4Derivative k1 = deriv(state,       t);
    RK4Derivative k2 = deriv(state + RK4Derivative{k1.dp*h2, k1.dv*h2}, t + h2);
    RK4Derivative k3 = deriv(state + RK4Derivative{k2.dp*h2, k2.dv*h2}, t + h2);
    RK4Derivative k4 = deriv(state + RK4Derivative{k3.dp*h,  k3.dv*h},  t + h);

    Vec3 dp = (k1.dp + 2.0*k2.dp + 2.0*k3.dp + k4.dp) * (h / 6.0);
    Vec3 dv = (k1.dv + 2.0*k2.dv + 2.0*k3.dv + k4.dv) * (h / 6.0);

    return { state.position + dp, state.velocity + dv };
}
