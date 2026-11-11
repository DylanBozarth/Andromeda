#pragma once
#include "physics/OrbitalElements.hpp"
#include "math/Constants.hpp"
#include <array>

// JPL J2000 mean ecliptic orbital elements
// Source: https://ssd.jpl.nasa.gov/planets/approx_pos.html (Table 1)
//
// Element derivation:
//   omega (arg. of periapsis) = lp - Omega  (lp = longitude of periapsis)
//   M0    (mean anomaly)      = L  - lp     (L  = mean longitude at J2000)

namespace {
    constexpr double d2r(double deg) { return deg * Constants::DEG2RAD; }
}

// Sun — not in an orbit but included for gravity/rendering
inline constexpr CelestialBody SUN = {
    "Sun", nullptr,
    { 0, 0, 0, 0, 0, 0, 0 },
    Constants::GM_SUN,
    Constants::R_SUN
};

inline constexpr std::array<CelestialBody, 8> PLANETS = {{
    {
        "Mercury", "Sun",
        {
            0.38709927 * Constants::AU,  // a
            0.20563593,                   // e
            d2r(7.00497902),              // i
            d2r(48.33076593),             // Omega
            d2r(29.12703035),             // omega  = lp(77.457) - Omega(48.330)
            d2r(174.79252722),            // M0     = L(252.250) - lp(77.457)
            Constants::GM_SUN
        },
        Constants::GM_MERCURY, Constants::R_MERCURY
    },
    {
        "Venus", "Sun",
        {
            0.72333566 * Constants::AU,
            0.00677672,
            d2r(3.39467605),
            d2r(76.67984255),
            d2r(54.92262463),             // lp(131.602) - Omega(76.679)
            d2r(50.37663232),             // L(181.979) - lp(131.602)
            Constants::GM_SUN
        },
        Constants::GM_VENUS, Constants::R_VENUS
    },
    {
        "Earth", "Sun",
        {
            1.00000261 * Constants::AU,
            0.01671123,
            d2r(-0.00001531),
            d2r(0.0),
            d2r(102.93768193),            // lp = Omega + omega
            d2r(357.52688973),            // L(100.464) - lp(102.937) → normalised
            Constants::GM_SUN
        },
        Constants::GM_EARTH, Constants::R_EARTH
    },
    {
        "Mars", "Sun",
        {
            1.52371034 * Constants::AU,
            0.09339410,
            d2r(1.84969142),
            d2r(49.55953891),
            d2r(286.49683150),            // lp(-23.943) - Omega(49.559) → normalised
            d2r(19.39019754),             // L(-4.553) - lp(-23.943)
            Constants::GM_SUN
        },
        Constants::GM_MARS, Constants::R_MARS
    },
    {
        "Jupiter", "Sun",
        {
            5.20288700 * Constants::AU,
            0.04838624,
            d2r(1.30439695),
            d2r(100.47390909),
            d2r(274.25457074),            // lp(14.728) - Omega(100.473) → normalised
            d2r(19.66796068),             // L(34.396) - lp(14.728)
            Constants::GM_SUN
        },
        Constants::GM_JUPITER, Constants::R_JUPITER
    },
    {
        "Saturn", "Sun",
        {
            9.53667594 * Constants::AU,
            0.05386179,
            d2r(2.48599187),
            d2r(113.66242448),
            d2r(338.93645383),            // lp(92.598) - Omega(113.662) → normalised
            d2r(317.35536592),            // L(49.954) - lp(92.598) → normalised
            Constants::GM_SUN
        },
        Constants::GM_SATURN, Constants::R_SATURN
    },
    {
        "Uranus", "Sun",
        {
            19.18916464 * Constants::AU,
            0.04725744,
            d2r(0.77263783),
            d2r(74.01692503),
            d2r(96.93735127),             // lp(170.954) - Omega(74.016)
            d2r(142.28382821),            // L(313.238) - lp(170.954)
            Constants::GM_SUN
        },
        Constants::GM_URANUS, Constants::R_URANUS
    },
    {
        "Neptune", "Sun",
        {
            30.06992276 * Constants::AU,
            0.00859048,
            d2r(1.77004347),
            d2r(131.78422574),
            d2r(273.18053653),            // lp(44.964) - Omega(131.784) → normalised
            d2r(259.91520804),            // L(-55.120) - lp(44.964) → normalised
            Constants::GM_SUN
        },
        Constants::GM_NEPTUNE, Constants::R_NEPTUNE
    }
}};
