#include "KeplerSolver.hpp"
#include "math/Constants.hpp"
#include <cmath>

// Newton-Raphson solution of Kepler's equation: M = E - e*sin(E)
// Converges in ~5 iterations for e < 0.9, ~15 for high eccentricity
static double solveKeplersEquation(double M, double e) {
    // Initial guess: good for low-to-moderate eccentricity
    double E = (e < 0.8) ? M : Constants::PI;
    for (int i = 0; i < 50; i++) {
        double dE = (M - E + e * std::sin(E)) / (1.0 - e * std::cos(E));
        E += dE;
        if (std::abs(dE) < 1e-12) break;
    }
    return E;
}

StateVector KeplerSolver::solve(const OrbitalElements& elem, double t) {
    // Mean motion (rad/s)
    double n = std::sqrt(elem.GM_parent / (elem.a * elem.a * elem.a));

    // Mean anomaly at time t
    double M = std::fmod(elem.M0 + n * t, Constants::TWO_PI);
    if (M < 0.0) M += Constants::TWO_PI;

    // Eccentric anomaly
    double E    = solveKeplersEquation(M, elem.e);
    double sinE = std::sin(E);
    double cosE = std::cos(E);

    // Distance from focus
    double r = elem.a * (1.0 - elem.e * cosE);

    // Position in orbital plane (perifocal frame)
    double x_orb = elem.a * (cosE - elem.e);
    double y_orb = elem.a * std::sqrt(1.0 - elem.e * elem.e) * sinE;

    // Velocity in orbital plane
    double vfac  = std::sqrt(elem.GM_parent * elem.a) / r;
    double vx_orb = -vfac * sinE;
    double vy_orb =  vfac * std::sqrt(1.0 - elem.e * elem.e) * cosE;

    // Rotation: Rz(Omega) * Rx(i) * Rz(omega) — perifocal → ecliptic
    double cO = std::cos(elem.Omega), sO = std::sin(elem.Omega);
    double ci = std::cos(elem.i),     si = std::sin(elem.i);
    double co = std::cos(elem.omega), so = std::sin(elem.omega);

    // Combined rotation matrix columns (z_orb = 0 so only 2 columns needed)
    double Pxx = cO*co - sO*so*ci;    double Pxy = -cO*so - sO*co*ci;
    double Pyx = sO*co + cO*so*ci;    double Pyy = -sO*so + cO*co*ci;
    double Pzx = so*si;               double Pzy =  co*si;

    StateVector sv;
    sv.position = {
        Pxx*x_orb + Pxy*y_orb,
        Pyx*x_orb + Pyy*y_orb,
        Pzx*x_orb + Pzy*y_orb
    };
    sv.velocity = {
        Pxx*vx_orb + Pxy*vy_orb,
        Pyx*vx_orb + Pyy*vy_orb,
        Pzx*vx_orb + Pzy*vy_orb
    };
    return sv;
}

Vec3 KeplerSolver::position(const OrbitalElements& elem, double t) {
    return solve(elem, t).position;
}
