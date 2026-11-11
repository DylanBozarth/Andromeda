#pragma once
#include <numbers>
#include <cmath>

namespace Constants {

    // Fundamental
    constexpr double G  = 6.674e-11;        // m³ kg⁻¹ s⁻²
    constexpr double C  = 299792458.0;       // m/s (exact)
    constexpr double AU = 1.495978707e11;    // m (exact IAU)

    // J2000 epoch in Unix time (Jan 1 2000, 12:00:00 TT ≈ UTC)
    constexpr double J2000_UNIX = 946728000.0;  // seconds

    // Simulation time scale: 1 real hour = 1 sim day
    // 1 real second = 24 sim seconds
    constexpr double SIM_SPEED = 24.0;

    // Math
    constexpr double PI      = std::numbers::pi;
    constexpr double TWO_PI  = 2.0 * PI;
    constexpr double DEG2RAD = PI / 180.0;
    constexpr double RAD2DEG = 180.0 / PI;

    // Standard gravitational parameters GM = G*M (m³/s²)
    // More accurate than computing G*M separately
    constexpr double GM_SUN     = 1.32712440018e20;
    constexpr double GM_MERCURY = 2.2032e13;
    constexpr double GM_VENUS   = 3.24859e14;
    constexpr double GM_EARTH   = 3.986004418e14;
    constexpr double GM_MOON    = 4.9048695e12;
    constexpr double GM_MARS    = 4.282837e13;
    constexpr double GM_PHOBOS  = 7.158e5;
    constexpr double GM_DEIMOS  = 9.615e4;
    constexpr double GM_JUPITER = 1.26686534e17;
    constexpr double GM_IO      = 5.959916e12;
    constexpr double GM_EUROPA  = 3.202739e12;
    constexpr double GM_GANYMEDE= 9.887834e12;
    constexpr double GM_CALLISTO= 7.179289e12;
    constexpr double GM_SATURN  = 3.7931187e16;
    constexpr double GM_TITAN   = 8.978138e12;
    constexpr double GM_URANUS  = 5.793951e15;
    constexpr double GM_NEPTUNE = 6.836529e15;
    constexpr double GM_TRITON  = 1.428495e12;
    constexpr double GM_PLUTO   = 8.71e11;

    // Masses (kg)
    constexpr double M_SUN     = 1.989e30;
    constexpr double M_MERCURY = 3.301e23;
    constexpr double M_VENUS   = 4.868e24;
    constexpr double M_EARTH   = 5.972e24;
    constexpr double M_MOON    = 7.342e22;
    constexpr double M_MARS    = 6.39e23;
    constexpr double M_JUPITER = 1.898e27;
    constexpr double M_SATURN  = 5.683e26;
    constexpr double M_URANUS  = 8.681e25;
    constexpr double M_NEPTUNE = 1.024e26;

    // Equatorial radii (m)
    constexpr double R_SUN     = 6.957e8;
    constexpr double R_MERCURY = 2.4397e6;
    constexpr double R_VENUS   = 6.0518e6;
    constexpr double R_EARTH   = 6.3781e6;
    constexpr double R_MOON    = 1.7374e6;
    constexpr double R_MARS    = 3.3895e6;
    constexpr double R_JUPITER = 7.1492e7;
    constexpr double R_SATURN  = 6.0268e7;
    constexpr double R_URANUS  = 2.5559e7;
    constexpr double R_NEPTUNE = 2.4764e7;

    // Hill sphere radii (m) - precomputed: a * cbrt(GM_planet / (3*GM_sun))
    // Defines the boundary of each planetary zone
    constexpr double HILL_MERCURY = 2.21e8;
    constexpr double HILL_VENUS   = 1.01e9;
    constexpr double HILL_EARTH   = 1.50e9;
    constexpr double HILL_MARS    = 1.08e9;
    constexpr double HILL_JUPITER = 5.32e10;
    constexpr double HILL_SATURN  = 6.52e10;
    constexpr double HILL_URANUS  = 6.99e10;
    constexpr double HILL_NEPTUNE = 1.16e11;

} // namespace Constants
